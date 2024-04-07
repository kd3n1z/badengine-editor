import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import * as path from 'path';
import isDev from 'electron-is-dev';
import * as util from "node:util";
import { exec } from "node:child_process";
import { existsSync, readFileSync, writeFileSync, cpSync, mkdirSync } from "fs";

const ENGINE_COMPATIBILITY_VERSION = 1;

const execPromise = util.promisify(exec);
// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    app.quit();
}

let mainWindow: BrowserWindow;

const createWindow = (): void => {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        height: 450,
        width: 800,
        minHeight: 400,
        minWidth: 600,
        webPreferences: {
            preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
        },
        autoHideMenuBar: true
    });

    // and load the index.html of the app.
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

    // Open the DevTools.
    mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
const extraResourcesPath: string = path.join(...(isDev ? [__dirname, '..', '..'] : [process.resourcesPath]), 'extraResources');
const commonExtraResourcesPath: string = path.join(extraResourcesPath, 'common');
const editorBackendPath: string = path.join(extraResourcesPath, 'backend', process.platform + '-' + process.arch + '.exe');

const appDataPath: string = app.getPath('userData');

//#region api

ipcMain.handle('backend-exec', async (_, args: string) => {
    try {
        const { stdout } = await execPromise(editorBackendPath + ' ' + args);

        return stdout;
    } catch {
        return null;
    }
});

ipcMain.handle('file-exists', (_, path: string) => {
    return existsSync(path);
});

ipcMain.handle('file-read', (_, path: string) => {
    return readFileSync(path, { encoding: "utf-8" });
});

ipcMain.handle('file-write', (_, path: string, contents: string) => {
    return writeFileSync(path, contents, { encoding: "utf-8" });
});

ipcMain.handle('path-join', (_, paths: string[]) => {
    return path.join(...paths);
});

ipcMain.handle('path-resolve', (_, paths: string[]) => {
    return path.resolve(...paths);
});

ipcMain.handle('get-app-data-path', () => {
    return appDataPath;
});

ipcMain.handle('show-confirmation-dialog', async (_, title: string, message: string, type: "none" | "info" | "error" | "question" | "warning") => {
    const result: Electron.MessageBoxReturnValue = await dialog.showMessageBox(mainWindow, {
        'type': type,
        'title': title,
        'message': message,
        'buttons': [
            'Yes',
            'No'
        ],
    });

    return result.response === 0;
});

ipcMain.handle('show-dialog', async (_, title: string, message: string, type: "none" | "info" | "error" | "question" | "warning") => {
    await dialog.showMessageBox(mainWindow, {
        'type': type,
        'title': title,
        'message': message
    });
});

ipcMain.handle('select-directory-dialog', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory']
    });

    if (result.filePaths.length <= 0) {
        return null;
    }

    return result.filePaths[0];
});

ipcMain.handle('get-engine-compatibility-version', () => {
    return ENGINE_COMPATIBILITY_VERSION;
});

ipcMain.handle('get-extra-resources-path', () => {
    return commonExtraResourcesPath;
});

ipcMain.handle('create-directory', (_, path: string) => {
    mkdirSync(path);
});

ipcMain.handle('copy-directory', (_, from: string, to: string) => {
    cpSync(from, to, { recursive: true });
});

//#endregion