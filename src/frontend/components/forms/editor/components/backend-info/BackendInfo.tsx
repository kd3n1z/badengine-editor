import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BackendInstanceInfo } from "../../Editor";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { limitString } from "../../../../../App";

export default function BackendInfo(props: { instances: BackendInstanceInfo[], visible: boolean }) {
    const getIcon = (name: string): IconProp => {
        switch (name) {
            case "watch":
                return "glasses";
            case "play":
                return "play";
            case "build":
                return "hammer";
            default:
                return "info-circle";
        }
    };

    const getTime = (time: number): string => {
        const date = new Date(time);

        return String(date.getHours()).padStart(2, '0') + ":" +
            String(date.getMinutes()).padStart(2, '0') + ":" +
            String(date.getSeconds()).padStart(2, '0');
    };

    return (
        <div className={"backend-info " + (props.visible ? "" : "hidden")}>
            <span className="title">Backend Instances</span>
            <div className="content">
                {props.instances.map(e => {
                    return (
                        <div className="instance" key={e.id}>
                            <div className="title-and-time">
                                <span className="title">
                                    <FontAwesomeIcon icon={getIcon(e.name)} /> {e.name}
                                    <span className="id">
                                        instance id {e.id}
                                    </span>
                                </span>
                                <span className="time">
                                    {getTime(e.lastMessageTime)}
                                </span>
                            </div>
                            <div className="last-message">
                                {limitString(e.lastMessage, 55)}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}