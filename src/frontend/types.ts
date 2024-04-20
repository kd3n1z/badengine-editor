type JSXElement = string | JSX.Element | JSX.Element;

export type JSXChildren = JSXElement | JSXElement[];

export interface IRecentProject {
    path: string,
    lastOpenDate: number
}

export interface IProject {
    name: string,
    initialScene: string,
    engineCompatibilityVersion?: number
}

export type ProjectStatus = "ok" | "errored" | "incompatible";

export interface IListedProject {
    project: IProject,
    path: string,
    status: ProjectStatus
}

export type FormNameType = "project-selector" | "project-creator" | "editor";

export type ProjectTemplate = {
    libPath: string
    projectJsonPath: string
    directories: string[]
    files: {
        fileName: string
        contents: string
    }[]
};

export type BackendMessage = {
    Type: "watchStatus" | "buildStatus",
    Data: string
}