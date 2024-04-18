import { createContext, useContext, useEffect, useState } from "react";
import FullscreenForm from "../general/FullscreenForm";
import { FormContext } from '../../../App';
import "./Editor.scss";
import { IProject } from "../../../types";
import Statusbar from "./components/Statusbar";
import StatusbarButton from "./components/StatusbarButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import StatusbarGroup from "./components/StatusbarGroup";

type EditorContextType = {
    projectPath: string,
    projectName: string
};

export const EditorContext = createContext<EditorContextType>(null);

export default function Editor() {
    const windowContext = useContext(FormContext);

    const [projectName, setProjectName] = useState<string>("loading...");

    const [backendStatus, setBackendStatus] = useState<string>("starting watcher...");

    const loadProject = async (directoryPath: string) => {
        const projectFilePath = await window.electronAPI.path.join(directoryPath, "project.json");

        const projectJson = JSON.parse(await window.electronAPI.fileRead(projectFilePath)) as IProject;

        setProjectName(projectJson.name);

        // todo: start watcher

        window.electronAPI.spawnBackend(["version"], {
            dataHandler: (data: string) => {
                setBackendStatus(data);
            }
        })
    };

    useEffect(() => {
        if (windowContext.openedProjectPath != null) {
            loadProject(windowContext.openedProjectPath);
        }
    }, [windowContext.openedProjectPath]);

    const [backendInfoVisible, setBackendInfoVisibility] = useState<boolean>(false);

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
                    <div className={"backend-info " + (backendInfoVisible ? "" : "hidden")}>
                        <span className="title">Backend Instances</span>
                        <div className="content">
                            <div className="instance">
                                <div className="title-and-time">
                                    <span className="title">
                                        <FontAwesomeIcon icon="glasses" /> watch
                                    </span>
                                    <span className="time">
                                        02:37:41
                                    </span>
                                </div>
                                <div className="last-message">
                                    {`{"type":"event","data":"changed"}`}
                                </div>
                            </div>
                            <div className="instance">
                                <div className="title-and-time">
                                    <span className="title">
                                        <FontAwesomeIcon icon="magnifying-glass" /> analyse
                                    </span>
                                    <span className="time">
                                        02:37:42
                                    </span>
                                </div>
                                <div className="last-message">
                                    {`{"type":"status","data":"running dotnet build..."}`}
                                </div>
                            </div>
                            <div className="instance">
                                <div className="title-and-time">
                                    <span className="title">
                                        <FontAwesomeIcon icon="play" /> play
                                    </span>
                                    <span className="time">
                                        02:37:45
                                    </span>
                                </div>
                                <div className="last-message">
                                    {`{"type":"status","data":"building scene SampleScene..."}`}
                                </div>
                            </div>
                        </div>
                    </div>
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