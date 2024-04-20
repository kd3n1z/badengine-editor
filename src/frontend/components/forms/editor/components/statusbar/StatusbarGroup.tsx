import { JSXChildren } from "../../../../../types";

export default function StatusbarGroup(props: { children?: JSXChildren }) {
    return (
        <div className={"group"}>{props.children}</div>
    );
}