import { createContext, useContext, useEffect, useState } from "react";
import FullscreenForm from "../general/FullscreenForm";
import { FormContext, limitString } from '../../../App';
import "./Editor.scss";
import { BackendMessage, IProject } from "../../../types";
import Statusbar from "./components/statusbar/Statusbar";
import StatusbarButton from "./components/statusbar/StatusbarButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import StatusbarGroup from "./components/statusbar/StatusbarGroup";
import BackendInfo from "./components/backend-info/BackendInfo";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { AnalyseAssemblyInfo, AnalyseResult } from "./AnalyserTypes";

type EditorContextType = {
    projectPath: string,
    projectName: string,
    assemblyInfo: AnalyseAssemblyInfo
};

export const EditorContext = createContext<EditorContextType>(null);

export type BackendInstanceInfo = {
    id: number
    name: string,
    lastMessage: string,
    lastMessageTime: number,
};

type BackendStatus = {
    icon: IconProp,
    message: string
}

export default function Editor() {
    const windowContext = useContext(FormContext);

    const [projectName, setProjectName] = useState<string>("loading...");
    const [backendStatus, setBackendStatus] = useState<BackendStatus>({ icon: "bolt", message: "starting watcher..." });
    const [backendInstancesInfo, setBackendInstancesInfo] = useState<BackendInstanceInfo[]>([]);
    const [backendInfoVisible, setBackendInfoVisibility] = useState<boolean>(false);
    const [assemblyInfo, setAssemblyInfo] = useState<AnalyseAssemblyInfo>({ Components: [] });

    interface IBackendHandler {
        dataHandler?: (data: BackendMessage) => void,
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

                const message = JSON.parse(data) as BackendMessage;

                let icon: IconProp = "bolt";

                switch (message.Type) {
                    case "buildStatus":
                        icon = message.Data == "done" ? "circle-check" : "hammer";
                        break;
                    case "watchStatus":
                        icon = "glasses";
                        break;
                    case "analyseStatus":
                        icon = "magnifying-glass";
                        break;
                    case "analyseResult":
                        icon = (JSON.parse(message.Data) as AnalyseResult).Status == "ok" ? "square-check" : "circle-exclamation";
                        break;
                    default:
                        icon = "info-circle";
                        break;
                }

                setBackendStatus({ icon, message: "[" + args[0] + "] " + limitString(message.Data, 30) });

                if (handlers.dataHandler != null) {
                    handlers.dataHandler(message);
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

        setBackendInstancesInfo(prevInstances => {
            return [...prevInstances, {
                id,
                name: args[0],
                lastMessage: "...",
                lastMessageTime: Date.now()
            }];
        });
    };

    let analyseRequested = false;
    let analysing = false;

    const analyse = async () => {
        if (analysing) {
            analyseRequested = true;
            return;
        }

        analysing = true;
        analyseRequested = false;

        spawnBackend(["analyse", windowContext.openedProjectPath], {
            dataHandler: (data: BackendMessage) => {
                if (data.Type == "analyseResult") {
                    const result = JSON.parse(data.Data) as AnalyseResult;

                    if (result.Status == "ok") {
                        setAssemblyInfo(JSON.parse(result.Data));
                    }
                }
            },
            closeHandler: () => {
                analysing = false;

                if (analyseRequested) {
                    analyse();
                }
            }
        });
    };

    const loadProject = async (directoryPath: string) => {
        const projectFilePath = await window.electronAPI.path.join(directoryPath, "project.json");

        const projectJson = JSON.parse(await window.electronAPI.fileRead(projectFilePath)) as IProject;

        setProjectName(projectJson.name);

        // todo: read watcher data

        spawnBackend(["watch", directoryPath], {});

        analyse();
    };

    useEffect(() => {
        if (windowContext.openedProjectPath != null) {
            loadProject(windowContext.openedProjectPath);
        }
    }, [windowContext.openedProjectPath]);

    return (
        <EditorContext.Provider value={{ projectName, projectPath: windowContext.openedProjectPath, assemblyInfo }}>
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
                        }}>
                            <FontAwesomeIcon icon="gear" />
                        </StatusbarButton>
                        <StatusbarButton onClick={() => {
                            window.electronAPI.openInShell(windowContext.openedProjectPath);
                        }}>
                            <FontAwesomeIcon icon="folder-open" />
                        </StatusbarButton>
                    </StatusbarGroup>
                    <StatusbarGroup>
                        <StatusbarButton onClick={() => {
                            setBackendInfoVisibility(!backendInfoVisible);
                        }}>
                            <FontAwesomeIcon icon={backendStatus.icon} /> {backendStatus.message}
                        </StatusbarButton>
                    </StatusbarGroup>
                </Statusbar>
            </FullscreenForm>
        </EditorContext.Provider>
    );
}