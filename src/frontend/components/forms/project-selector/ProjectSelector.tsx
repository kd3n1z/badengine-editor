import CenteredForm from "../general/CenteredForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { IListedProject, IProject, JSXChildren, ProjectStatus } from "../../../types";
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

                let projectJson: IProject = {
                    name: "Unknown Project",
                    initialScene: "_",
                    engineCompatibilityVersion: -1
                };
                let status: ProjectStatus = "errored";

                if (await window.electronAPI.fileExists(projectPath)) {
                    try {
                        projectJson = JSON.parse(await window.electronAPI.fileRead(projectPath)) as IProject;

                        status = projectJson.engineCompatibilityVersion == await window.electronAPI.getEngineCompatibilityVersion() ? "ok" : "incompatible"
                    } catch {
                        // project is already errored
                    }
                }

                listedProjects.push({
                    project: projectJson,
                    path: project.path,
                    status: status
                });
            }

            setProjects(listedProjects);
        });
    };

    useEffect(() => {
        if (windowContext.visibleFormName == "project-selector") {
            _updateProjects();
        }
    }, [windowContext.visibleFormName]);

    const setRecentProject = async (path: string) => {
        await window.electronAPI.setRecentProjects([
            ...((await window.electronAPI.getRecentProjects()).filter(e => e.path != path)),
            { path: path, lastOpenDate: Date.now() }
        ]);

        _updateProjects();
    }

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
                <button onClick={async () => {
                    const directory = await window.electronAPI.showSelectDirectoryDialog();

                    if (directory !== null) {
                        await setRecentProject(directory);
                    }
                }}>Open Project</button>
            </div>
        </CenteredForm>
    );
}