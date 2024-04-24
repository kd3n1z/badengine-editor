import { JSXChildren } from "../../../../../types";
import "./Statusbar.scss";

export default function Statusbar(props: { children?: JSXChildren, className: string }) {
    return (
        <div className={"statusbar " + props.className}>{props.children}</div>
    );
}