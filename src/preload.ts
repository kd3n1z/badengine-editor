import { contextBridge, ipcRenderer } from "electron";
import { IRecentProject } from "./frontend/types";

async function getBackendInfo(): Promise<string> {
    return await ipcRenderer.invoke('get-backend-info') as string;
}

async function getRecentProjects(): Promise<IRecentProject[]> {
    const recentProjectsPath = await pathJoin(await getAppDataPath(), "recent-projects.json");

    if (await fileExists(recentProjectsPath)) {
        return JSON.parse(await readFile(recentProjectsPath));
    }

    return [];
}

async function fileExists(path: string): Promise<boolean> {
    return await ipcRenderer.invoke('file-exists', path) as boolean;
}

async function readFile(path: string): Promise<string> {
    return await ipcRenderer.invoke('file-read', path) as string;
}

async function pathJoin(...paths: string[]): Promise<string> {
    return await ipcRenderer.invoke('path-join', paths) as string;
}

async function getAppDataPath(): Promise<string> {
    return await ipcRenderer.invoke('get-app-data-path') as string;
}

const electronAPI = {
    getBackendInfo,
    getRecentProjects,
    fileExists,
    fileRead: readFile,
    pathJoin,
    getAppDataPath
};

declare global {
    interface Window {
        electronAPI: typeof electronAPI;
    }
}

process.once("loaded", () => {
    contextBridge.exposeInMainWorld('electronAPI', electronAPI);
});