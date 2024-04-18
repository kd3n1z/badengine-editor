import { createContext, useContext, useEffect, useState } from "react";
import FullscreenForm from "../general/FullscreenForm";
import { FormContext } from '../../../App';
import "./Editor.scss";
import { IProject } from "../../../types";
import Statusbar from "./components/statusbars/Statusbar";
import StatusbarButton from "./components/statusbars/StatusbarButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import StatusbarGroup from "./components/statusbars/StatusbarGroup";
import BackendInfo from "./components/backend-info/BackendInfo";

type EditorContextType = {
    projectPath: string,
    projectName: string
};

export const EditorContext = createContext<EditorContextType>(null);

export type BackendInstanceInfo = {
    id: number
    name: string,
    lastMessage: string,
    lastMessageTime: number
};

export default function Editor() {
    const windowContext = useContext(FormContext);

    const [projectName, setProjectName] = useState<string>("loading...");
    const [backendStatus, setBackendStatus] = useState<string>("starting watcher...");
    const [backendInstancesInfo, setBackendInstancesInfo] = useState<BackendInstanceInfo[]>([]);
    const [backendInfoVisible, setBackendInfoVisibility] = useState<boolean>(false);

    interface IBackendHandler {
        dataHandler?: (data: string) => void,
        errorHandler?: (data: string) => void,
        closeHandler?: (code: number) => void,
    }

    const spawnBackend = async (args: string[], handlers: IBackendHandler) => {
        const id = await window.electronAPI.spawnBackend(args, {
            dataHandler: (data: string) => {
                setBackendInstancesInfo(prevInstances => {
                    const updatedInstances = [...prevInstances.filter(e => e.id !== id), {
                        id,
                        name: args[0],
                        lastMessage: data,
                        lastMessageTime: Date.now()
                    }].sort((a, b) => a.id - b.id);

                    return updatedInstances;
                });

                if (handlers.dataHandler != null) {
                    handlers.dataHandler(data);
                }
            },
            errorHandler: handlers.errorHandler,
            closeHandler: (code: number) => {
                setBackendInstancesInfo(prevInstances => {
                    const updatedInstances = prevInstances.filter(e => e.id !== id);

                    return updatedInstances;
                });

                if (handlers.closeHandler != null) {
                    handlers.closeHandler(code);
                }
            }
        });

        setBackendInstancesInfo([...backendInstancesInfo, {
            id,
            name: args[0],
            lastMessage: "...",
            lastMessageTime: Date.now()
        }]);
    };

    const loadProject = async (directoryPath: string) => {
        const projectFilePath = await window.electronAPI.path.join(directoryPath, "project.json");

        const projectJson = JSON.parse(await window.electronAPI.fileRead(projectFilePath)) as IProject;

        setProjectName(projectJson.name);

        // todo: read watcher data

        spawnBackend(["watch", directoryPath], {});
    };

    useEffect(() => {
        if (windowContext.openedProjectPath != null) {
            loadProject(windowContext.openedProjectPath);
        }
    }, [windowContext.openedProjectPath]);

    return (
        <EditorContext.Provider value={{ projectName, projectPath: windowContext.openedProjectPath }}>
            <FullscreenForm name="editor" title={projectName}>
                <Statusbar className="top">
                    <StatusbarGroup>
                        <StatusbarButton onClick={() => {
                            // todo: play
                        }}><FontAwesomeIcon icon="play" /></StatusbarButton>
                    </StatusbarGroup>
                </Statusbar>
                <div className="editor-main">
                    <BackendInfo instances={backendInstancesInfo} visible={backendInfoVisible} />
                </div>
                <Statusbar className="bottom">
                    <StatusbarGroup>
                        <StatusbarButton onClick={() => {
                            // todo: project settings
                        }}><FontAwesomeIcon icon="gear" /></StatusbarButton>
                    </StatusbarGroup>
                    <StatusbarGroup>
                        <StatusbarButton onClick={() => {
                            setBackendInfoVisibility(!backendInfoVisible);
                        }}>
                            <FontAwesomeIcon icon="bolt" /> {backendStatus}
                        </StatusbarButton>
                    </StatusbarGroup>
                </Statusbar>
            </FullscreenForm>
        </EditorContext.Provider>
    );
}