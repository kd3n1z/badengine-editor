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

async function getAppDataPath(): Promise<string> {
    return await ipcRenderer.invoke('get-app-data-path') as string;
}

async function showConfirmationDialog(message: string): Promise<boolean> {
    return await ipcRenderer.invoke('show-confirmation-dialog', 'badengine', message) as boolean;
}

async function showSelectDirectoryDialog(): Promise<string> {
    return await ipcRenderer.invoke('select-directory-dialog') as string;
}

const electronAPI = {
    getBackendInfo,
    getRecentProjects,
    fileExists,
    fileRead: readFile,
    pathJoin,
    getAppDataPath,
    backendExecute,
    showConfirmationDialog,
    setRecentProjects,
    writeFile,
    showSelectDirectoryDialog
};

declare global {
    interface Window {
        electronAPI: typeof electronAPI;
    }
}

process.once("loaded", () => {
    contextBridge.exposeInMainWorld('electronAPI', electronAPI);
});