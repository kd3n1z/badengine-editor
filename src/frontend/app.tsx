import { createRoot } from 'react-dom/client';
import './index.css';
import CenteredForm from './components/CenteredForm';
import FullscreenForm from './components/FullscreenForm';

const defaultState = {
    form: "editor"
};

export type Action = {
    type: "set_form",
    payload: "recent_projects" | "editor"
}

const reducer = (state = defaultState, action: Action) => {
    switch (action.type) {
        case "set_form":
            return { ...state, form: action.payload }
    }
}

const root = createRoot(document.getElementById("react-root"));
root.render(
    <>
        <CenteredForm visible={true}>Hello, world!</CenteredForm>
        <FullscreenForm>Hello, world!</FullscreenForm>
    </>
);