import CenteredForm from "../general/CenteredForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { IListedProject, IProject, JSXChildren } from "../../../types";
import RecentProject from "./components/RecentProject";
import './ProjectSelector.scss';
import Separator from "../../general/Separator";
import { FormContext } from "../../../App";
import Loader from "../../general/Loader";

let _updateProjects: () => void;

export const updateProjects = async () => {
    await _updateProjects();
}

export default function ProjectSelector() {
    const windowContext = useContext(FormContext);

    const [projects, setProjects] = useState<IListedProject[]>(null);

    useEffect(() => {
        window.electronAPI.getBackendInfo().then((info) => {
            setBackendInfo(info);
        });
    }, []);

    _updateProjects = async () => {
        const listedProjects: IListedProject[] = [];

        window.electronAPI.getRecentProjects().then(async (recentProjects) => {
            const sortedRecentProjects = recentProjects.sort((a, b) => b.lastOpenDate - a.lastOpenDate);

            for (const project of sortedRecentProjects) {
                const projectPath = await window.electronAPI.pathJoin(project.path, "project.json");

                let name = "Unknown Project";
                let errored = true;

                if (await window.electronAPI.fileExists(projectPath)) {
                    name = (JSON.parse(await window.electronAPI.fileRead(projectPath)) as IProject).name;
                    errored = false;
                }

                listedProjects.push({
                    name: name,
                    path: project.path,
                    errored: errored
                })
            }

            setProjects(listedProjects);
        });
    };

    useEffect(() => {
        if (windowContext.visibleFormName == "project-selector") {
            _updateProjects();
        }
    }, [windowContext.visibleFormName]);

    const [backendInfo, setBackendInfo] = useState<JSXChildren>(<Loader />);

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
                    projects == null ?
                        <span className="no-projects"><Loader /> Loading...</span> :
                        (
                            projects.length > 0 ?
                                projects.map(e => <RecentProject key={e.path} project={e} />) :
                                <span className="no-projects">There's nothing here yet.</span>
                        )
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