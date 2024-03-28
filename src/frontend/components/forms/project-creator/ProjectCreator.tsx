import { useEffect } from "react";
import CenteredForm from "../general/CenteredForm";
import Separator from "../../general/Separator";

export default function ProjectCreator() {

    return (
        <CenteredForm name="project-creator" title="new project" titleElement="New Project" showCloseButton={true}>
            <Separator />
            <button>Create</button>
        </CenteredForm>
    );
}