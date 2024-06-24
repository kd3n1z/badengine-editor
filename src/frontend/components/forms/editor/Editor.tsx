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
    const [playing, setPlaying] = useState<boolean>(false);
    const [gameStarted, setGameStarted] = useState<boolean>(false);

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
                    case "playStatus":
                        if (message.Data.startsWith("game started")) {
                            setGameStarted(true);
                        } else if (message.Data.startsWith("game exited")) {
                            setGameStarted(false);
                        }
                        icon = "play";
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

    const analyse = () => {
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

    const play = () => {
        if (playing) {
            return;
        }

        setPlaying(true);

        spawnBackend(["play", windowContext.openedProjectPath], {
            closeHandler: () => {
                setPlaying(false);
            }
        });
    };

    const loadProject = async (directoryPath: string) => {
        const projectFilePath = await window.electronAPI.path.join(directoryPath, "project.json");

        const projectJson = JSON.parse(await window.electronAPI.fileRead(projectFilePath)) as IProject;

        setProjectName(projectJson.name);

        // bootstrap
        spawnBackend(["generateCsProj", directoryPath, await window.electronAPI.path.join(await window.electronAPI.getExtraResourcesPath(), 'badengine-lib')], {
            dataHandler: (data: BackendMessage) => {
                if (data.Data == "done") {
                    spawnBackend(["watch", directoryPath], {
                        dataHandler: (data: BackendMessage) => {
                            if (data.Data == "changed") {
                                analyse();
                            }
                        }
                    });

                    analyse();
                }
            }
        })
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
                        <StatusbarButton onClick={play} enabled={!playing}><FontAwesomeIcon icon="play" /></StatusbarButton>
                    </StatusbarGroup>
                </Statusbar>
                <div className="editor-main">
                    <BackendInfo instances={backendInstancesInfo} visible={backendInfoVisible} />
                </div>
                <Statusbar className={"bottom " + (gameStarted ? "game-started" : "")}>
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