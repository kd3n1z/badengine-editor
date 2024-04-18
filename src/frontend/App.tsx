import { createContext, useEffect, useState } from 'react';
import ProjectSelector from './components/forms/project-selector/ProjectSelector';
import ProjectCreator from './components/forms/project-creator/ProjectCreator';
import { FormNameType } from './types';
import Editor from './components/forms/editor/Editor';

export function limitString(text: string, limit: number) {
    return text.length <= limit ? text : text.substring(0, limit - 3) + '...';
}

type FormContextType = {
    visibleFormName: FormNameType,
    formStack: FormNameType[],
    showForm: (formName: FormNameType) => void,
    closeLastForm: () => void,
    openedProjectPath: string,
    openProject: (path: string) => void
};

export const FormContext = createContext<FormContextType>(null);

export default function App() {
    const [formStack, setFormStack] = useState<FormNameType[]>(["project-selector"]);
    const [visibleFormName, setVisibleForm] = useState<FormNameType>(null);
    const [openedProjectPath, setOpenedProjectPath] = useState<string>(null);

    useEffect(() => {
        setVisibleForm(formStack[formStack.length - 1]);
    }, [formStack]);

    const showForm = (formName: FormNameType) => {
        setFormStack([...formStack, formName]);
    }

    const closeLastForm = () => {
        setFormStack(formStack.slice(0, formStack.length - 1));
    }

    const openProject = (path: string) => {
        setOpenedProjectPath(path);
        showForm("editor");
    };

    return (
        <FormContext.Provider value={{ visibleFormName, showForm, formStack, closeLastForm, openedProjectPath, openProject }}>
            <ProjectSelector />
            <ProjectCreator />
            <Editor />
        </FormContext.Provider>
    );
}
