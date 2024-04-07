import { contextBridge, ipcRenderer } from "electron";
import { IRecentProject } from "./frontend/types";

async function getBackendInfo(): Promise<string> {
    return (await backendExecute('getInfo')) ?? "backend failed to start";
}

async function backendExecute(args: string): Promise<string> {
    return await ipcRenderer.invoke('backend-exec', args) as string;
}

let recentProjects: IRecentProject[] = null;

async function getRecentProjects(): Promise<IRecentProject[]> {
    if (recentProjects === null) {
        const recentProjectsPath = await getRecentProjectsPath();

        if (await fileExists(recentProjectsPath)) {
            recentProjects = JSON.parse(await readFile(recentProjectsPath));
        } else {
            recentProjects = [];
        }
    }

    return recentProjects;
}

async function setRecentProjects(projects: IRecentProject[]) {
    recentProjects = projects;

    await writeFile(await getRecentProjectsPath(), JSON.stringify(recentProjects));
}

async function getRecentProjectsPath(): Promise<string> {
    return await pathJoin(await getAppDataPath(), "recent-projects.json");
}

async function fileExists(path: string): Promise<boolean> {
    return await ipcRenderer.invoke('file-exists', path) as boolean;
}

async function readFile(path: string): Promise<string> {
    return await ipcRenderer.invoke('file-read', path) as string;
}

async function writeFile(path: string, contents: string): Promise<void> {
    return await ipcRenderer.invoke('file-write', path, contents);
}

async function pathJoin(...paths: string[]): Promise<string> {
    return await ipcRenderer.invoke('path-join', paths) as string;
}

async function pathResolve(...paths: string[]): Promise<string> {
    return await ipcRenderer.invoke('path-resolve', paths) as string;
}

async function getAppDataPath(): Promise<string> {
    return await ipcRenderer.invoke('get-app-data-path') as string;
}

async function showConfirmationDialog(message: string, type: "none" | "info" | "error" | "question" | "warning"): Promise<boolean> {
    return await ipcRenderer.invoke('show-confirmation-dialog', 'badengine', message, type) as boolean;
}

async function showSelectDirectoryDialog(): Promise<string> {
    return await ipcRenderer.invoke('select-directory-dialog') as string;
}

let engineCompatibilityVersion: number = null;

async function getEngineCompatibilityVersion(): Promise<number> {
    if (engineCompatibilityVersion === null) {
        engineCompatibilityVersion = await ipcRenderer.invoke('get-engine-compatibility-version') as number;
    }

    return engineCompatibilityVersion;
}

let extraResourcesPath: string = null;

async function getExtraResourcesPath(): Promise<string> {
    if (extraResourcesPath === null) {
        extraResourcesPath = await ipcRenderer.invoke('get-extra-resources-path') as string;
    }

    return extraResourcesPath;
}

async function directoryCreate(path: string): Promise<void> {
    await ipcRenderer.invoke('create-directory', path);
}

async function directoryCopy(from: string, to: string): Promise<void> {
    await ipcRenderer.invoke('copy-directory', from, to);
}

async function showMessageBox(message: string, type: "none" | "info" | "error" | "question" | "warning"): Promise<void> {
    await ipcRenderer.invoke('show-dialog', 'badengine', message, type) as boolean;
}

const electronAPI = {
    getBackendInfo,
    getRecentProjects,
    fileExists,
    fileRead: readFile,
    getAppDataPath,
    backendExecute,
    showConfirmationDialog,
    showMessageBox,
    setRecentProjects,
    writeFile,
    showSelectDirectoryDialog,
    getEngineCompatibilityVersion,
    getExtraResourcesPath,
    path: {
        join: pathJoin,
        resolve: pathResolve
    },
    directory: {
        copy: directoryCopy,
        create: directoryCreate
    }
};

declare global {
    interface Window {
        electronAPI: typeof electronAPI;
    }
}

process.once("loaded", () => {
    contextBridge.exposeInMainWorld('electronAPI', electronAPI);
});