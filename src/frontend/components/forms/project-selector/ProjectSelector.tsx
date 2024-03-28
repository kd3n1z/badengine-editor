import CenteredForm from "../general/CenteredForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { IRecentProject } from "../../../types";
import RecentProject from "./components/RecentProject";
import './ProjectSelector.css';
import Separator from "../../general/Separator";

export default function ProjectSelector() {
    const [projects, setProjects] = useState<IRecentProject[]>([]);

    useEffect(() => {
        setProjects([{
            name: "test project bla bla bla",
            path: "~/Documents/Test/HelloWorld/BimBimBabBam"
        }]);
    }, []);

    return (
        <CenteredForm name="project-selector" title={<>
            <FontAwesomeIcon icon="bolt" />&nbsp;
            <span className="baseline">
                Badengine
                <span className="version">&nbsp;v1.0.0</span>
            </span>
        </>} cornerInfo={"backend v1.0.0"}>
            <div className="projects-list">
                {projects.map(e => <RecentProject key={e.path} project={e} />)}
            </div>
            <Separator />
            <div className="bottom-buttons">
                <button>New Project</button>
                <button>Open Project</button>
            </div>
        </CenteredForm>
    );
}