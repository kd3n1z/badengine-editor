import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { limitString } from "../../../../App";
import { IListedProject } from "../../../../types";
import { updateProjects } from "../ProjectSelector";

const logoSeparatorsRegEx = /[\s-_]/g;

export default function RecentProject(props: { project: IListedProject }) {
    const statusesClassesPairs = {
        "ok": "ok",
        "incompatible": "warned",
        "errored": "errored"
    };

    const openProject = () => {
        // todo
    };

    const handleClick = async () => {
        switch (props.project.status) {
            case "errored":
                if (await window.electronAPI.showConfirmationDialog('Error opening project at ' + props.project.path + '. Do you want to remove it from the list?', 'error')) {
                    await window.electronAPI.setRecentProjects((await window.electronAPI.getRecentProjects()).filter((e => e.path != props.project.path)));
                    await updateProjects();
                }
                break;
            case "incompatible":
                if (await window.electronAPI.showConfirmationDialog('Project "' + props.project.project.name + '" is incompatible with the current engine (engine=' +
                    await window.electronAPI.getEngineCompatibilityVersion() + ', project=' + props.project.project.engineCompatibilityVersion +
                    '). Do you still want to open it?', 'warning')) {
                    openProject();
                }
                break;
            case "ok":
                openProject();
                break;
        }
    };

    return (
        <div className={"recent-project " + statusesClassesPairs[props.project.status]} onClick={handleClick}>
            <div style={{ "--colorH": Math.abs(Math.sin(simpleHash(props.project.project.name)) * 1000 % 1) * 360 } as React.CSSProperties} className="icon">
                {props.project.status == "ok" ? props.project.project.name.split(logoSeparatorsRegEx).slice(0, 2).map(e => e[0].toUpperCase()).join('') : <FontAwesomeIcon icon='triangle-exclamation' />}
            </div>
            <div className="name-and-path">
                <div className="name">{limitString(props.project.project.name, 30)}</div>
                <div className="path">{limitString(props.project.path, 70)}</div>
            </div>
        </div>
    );
}

function simpleHash(str: string): number {
    let hash = 0;

    if (str.length === 0) {
        return hash;
    }

    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
    }

    return hash;
}