import { createContext, useState } from 'react';
import ProjectSelector from './components/forms/project-selector/ProjectSelector';

export function limitString(text: string, limit: number) {
    return text.length <= limit ? text : text.substring(0, limit - 3) + '...';
}

export const FormContext = createContext(null);

export default function App() {
    const [visibleFormName, setVisibleForm] = useState("project-selector");

    return (
        <FormContext.Provider value={{ visibleFormName, setVisibleForm }}>
            <ProjectSelector />
        </FormContext.Provider>
    );
}