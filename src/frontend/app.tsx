import CenteredForm from './components/CenteredForm';
import FullscreenForm from './components/FullscreenForm';
import { createContext, useState } from 'react';

export const WindowContext = createContext(null);

export default function App() {
    const [visibleWindowName, setVisibleWindowName] = useState("editor");

    return (
        <WindowContext.Provider value={{visibleWindowName, setVisibleWindowName}}>
            <CenteredForm name='project_selector'>Hello, world!</CenteredForm>
            <FullscreenForm name='editor'>Hello, world!</FullscreenForm>
        </WindowContext.Provider>
    );
}