import { useContext, useEffect, useState } from "react";
import CenteredForm from "../general/CenteredForm";
import Separator from "../../general/Separator";
import { FormContext } from "../../../App";
import "./ProjectCreator.scss";
import { IProject, ProjectTemplate } from "../../../types";

export default function ProjectCreator() {
    const windowContext = useContext(FormContext);

    const [projectName, setProjectName] = useState('');
    const [projectDirName, setProjectDirName] = useState('');
    const [initialSceneName, setInitialSceneName] = useState('');

    useEffect(() => {
        if (windowContext.visibleFormName == "project-creator") {
            setProjectName("Hello World");
            setInitialSceneName("InitialScene");
        }
    }, [windowContext.visibleFormName]);

    useEffect(() => {
        setProjectDirName(projectName.replace(/[^a-z0-9]/gi, '-').replace(/-+/g, '-').toLowerCase());
    }, [projectName]);

    const createProject = async () => {
        const rootPath = await window.electronAPI.showSelectDirectoryDialog();

        if (rootPath == null) {
            return;
        }

        const dirPath = await window.electronAPI.path.join(rootPath, projectDirName);

        if (await window.electronAPI.fileExists(dirPath)) {
            await window.electronAPI.showMessageBox("Error creating project: directory `" + dirPath + "` already exists.", "error");
            return;
        }

        await window.electronAPI.directory.create(dirPath);

        const extraResourcesPath = await window.electronAPI.getExtraResourcesPath();

        const projectTemplate: ProjectTemplate = JSON.parse(await window.electronAPI.fileRead(await window.electronAPI.path.join(extraResourcesPath, 'project-template.json')));

        for (const directory of projectTemplate.directories) {
            await window.electronAPI.directory.create(await window.electronAPI.path.resolve(dirPath, directory));
        }

        await window.electronAPI.directory.copy(
            await window.electronAPI.path.join(extraResourcesPath, 'badengine-lib'),
            await window.electronAPI.path.resolve(dirPath, projectTemplate.libPath)
        );

        for (const file of projectTemplate.files) {
            await window.electronAPI.writeFile(
                await window.electronAPI.path.resolve(dirPath, file.fileName),
                file.contents
            );
        }

        const project: IProject = {
            name: projectName,
            initialScene: initialSceneName,
            engineCompatibilityVersion: await window.electronAPI.getEngineCompatibilityVersion()
        };

        await window.electronAPI.writeFile(
            await window.electronAPI.path.resolve(dirPath, projectTemplate.projectJsonPath),
            JSON.stringify(project)
        );

        await window.electronAPI.setRecentProjects([...(await window.electronAPI.getRecentProjects()).filter(e => e.path != dirPath), {
            path: dirPath,
            lastOpenDate: Date.now()
        }]);

        windowContext.closeLastForm();
    };

    return (
        <CenteredForm name="project-creator" title="new project" titleElement="New Project" showCloseButton={true}>
            <div className="list">
                <span>Project Name</span>
                <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
                <span>Initial Scene</span>
                <input type="text" value={initialSceneName} onChange={(e) => setInitialSceneName(e.target.value)} />
            </div>
            <span className="project-dir-name">directory name is `{projectDirName}`</span>
            <Separator />
            <button onClick={createProject}>Create</button>
        </CenteredForm>
    );
}