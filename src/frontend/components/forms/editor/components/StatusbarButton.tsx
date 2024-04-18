import { MouseEventHandler } from "react";
import { JSXChildren } from "../../../../types";

export default function StatusbarButton(props: { children?: JSXChildren, enabled?: boolean, onClick?: MouseEventHandler<HTMLDivElement> }) {
    return (
        <div className={"clickable " + ((props.enabled == null || props.enabled == true) ? "" : "disabled")} onClick={props.onClick}>
            {props.children}
        </div>
    );
}