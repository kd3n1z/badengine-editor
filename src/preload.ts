import { contextBridge, ipcRenderer } from "electron";

async function getBackendInfo(): Promise<string> {
    return await ipcRenderer.invoke('get-backend-info') as string;
}

const electronAPI = {
    getBackendInfo
};

declare global {
    interface Window {
        electronAPI: typeof electronAPI;
    }
}

process.once("loaded", () => {
    contextBridge.exposeInMainWorld('electronAPI', electronAPI);
});