import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { limitString } from "../../../../App";
import { IListedProject } from "../../../../types";
import { updateProjects } from "../ProjectSelector";

const logoSeparatorsRegEx = /[\s-_]/g;

export default function RecentProject(props: { project: IListedProject }) {
    const handleClick = async () => {
        if (props.project.errored) {
            if (await window.electronAPI.showConfirmationDialog('Error loading project ' + props.project.path + '. Do you want to remove it from the list?')) {
                await window.electronAPI.setRecentProjects((await window.electronAPI.getRecentProjects()).filter((e => e.path != props.project.path)));
                await updateProjects();
            }
        }
    };

    return (
        <div className={"recent-project " + (props.project.errored ? "errored" : "")} onClick={handleClick}>
            <div style={{ "--colorH": Math.abs(Math.sin(simpleHash(props.project.name)) * 1000 % 1) * 360 } as React.CSSProperties} className="icon">
                {props.project.errored ? <FontAwesomeIcon icon='triangle-exclamation' className='error-icon'/> : props.project.name.split(logoSeparatorsRegEx).slice(0, 2).map(e => e[0].toUpperCase()).join('')}
            </div>
            <div className="name-and-path">
                <div className="name">{limitString(props.project.name, 30)}</div>
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