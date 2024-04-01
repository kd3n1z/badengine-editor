import { useContext, useEffect, useState } from "react";
import CenteredForm from "../general/CenteredForm";
import Separator from "../../general/Separator";
import { FormContext } from "../../../App";
import "./ProjectCreator.css";

export default function ProjectCreator() {
    const windowContext = useContext(FormContext);

    const [projectName, setProjectName] = useState('');
    const [initialSceneName, setInitialSceneName] = useState('');


    useEffect(() => {
        if (windowContext.visibleFormName == "project-creator") {
            setProjectName("Hello World");
            setInitialSceneName("InitialScene");
        }
    }, [windowContext.visibleFormName]);

    return (
        <CenteredForm name="project-creator" title="new project" titleElement="New Project" showCloseButton={true}>
            <div className="list">
                <span>Project Name</span>
                <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
                <span>Initial Scene</span>
                <input type="text" value={initialSceneName} onChange={(e) => setInitialSceneName(e.target.value)} />
            </div>
            <Separator />
            <button>Create</button>
        </CenteredForm>
    );
}