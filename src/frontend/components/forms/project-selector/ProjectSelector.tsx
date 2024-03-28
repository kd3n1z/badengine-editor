import CenteredForm from "../general/CenteredForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { IRecentProject } from "../../../types";
import RecentProject from "./components/RecentProject";
import './ProjectSelector.css';
import Separator from "../../general/Separator";
import { FormContext } from "../../../App";

export default function ProjectSelector() {
    const windowContext = useContext(FormContext);

    const [projects, setProjects] = useState<IRecentProject[]>([]);

    useEffect(() => {
        window.electronAPI.getBackendInfo().then((info) => {
            setBackendInfo(info);
        });
    }, []);

    const [backendInfo, setBackendInfo] = useState<string>("...");

    return (
        <CenteredForm name="project-selector" title="project selector" titleElement={<>
            <FontAwesomeIcon icon="bolt" />&nbsp;
            <span className="baseline">
                Badengine
                <span className="version">&nbsp;v1.0.0</span>
            </span>
        </>} cornerInfo={backendInfo}>
            <div className="projects-list">
                {
                    projects.length > 0 ?
                        projects.map(e => <RecentProject key={e.path} project={e} />) :
                        <span className="no-projects">There's nothing here yet.</span>
                }
            </div>
            <Separator />
            <div className="bottom-buttons">
                <button onClick={() => {
                    windowContext.showForm("project-creator");
                }}>New Project</button>
                <button>Open Project</button>
            </div>
        </CenteredForm>
    );
}