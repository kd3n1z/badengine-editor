import CenteredForm from "../components/forms/CenteredForm";
import FullscreenForm from "../components/forms/FullscreenForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './ProjectSelector.css';
import { useEffect, useState } from "react";
import { IRecentProject } from "../types";
import RecentProject from "../components/project-selector/RecentProject";

export default function ProjectSelector() {
    const [projects, setProjects] = useState<IRecentProject[]>([]);

    useEffect(() => {
        setProjects([{
            name: "test project bla bla bla",
            path: "~/Documents/Test/HelloWorld/BimBimBabBam"
        }]);
    }, []);

    return (
        <CenteredForm name="project_selector" title={<>
            <FontAwesomeIcon icon="bolt" />&nbsp;
            <span className="baseline">
                Badengine
                <span className="version">&nbsp;v1.0.0</span>
            </span>
        </>} >
            <div className="projects-list">
                {projects.map(e => <RecentProject key={e.path} project={e} />)}
            </div>
        </CenteredForm>
    );
}