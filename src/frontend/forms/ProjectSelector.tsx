import CenteredForm from "../components/forms/CenteredForm";
import FullscreenForm from "../components/forms/FullscreenForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ProjectSelector() {
    return (
        <FullscreenForm name="project_selector">
            <CenteredForm title={<>
                <FontAwesomeIcon icon="bolt" />&nbsp;
                <span className="baseline">
                    Badengine&nbsp;
                    <span className="version">v1.0.0</span>
                </span>
            </>}>
                Hello, world!
            </CenteredForm>
        </FullscreenForm>
    );
}