import { createContext, useState } from 'react';
import ProjectSelector from './forms/ProjectSelector';

export function limitString(text: string, limit: number) {
    return text.length <= limit ? text : text.substring(0, limit - 3) + '...';
}

export const FormContext = createContext(null);

export default function App() {
    const [visibleFormName, setVisibleForm] = useState("editor");

    return (
        <FormContext.Provider value={{ visibleWindowName: visibleFormName, setVisibleWindowName: setVisibleForm }}>
            <ProjectSelector />
        </FormContext.Provider>
    );
}