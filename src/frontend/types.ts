export type JSXChildren = string | JSX.Element | JSX.Element[];

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

export type FormNameType = "project-selector" | "project-creator";

export type ProjectTemplate = {
    libPath: string
    projectJsonPath: string
    directories: string[]
    files: {
        fileName: string
        contents: string
    }[]
};