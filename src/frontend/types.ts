export type JSXChildren = string | JSX.Element | JSX.Element[];

export interface IRecentProject {
    path: string,
    lastOpenDate: number
}

export interface IProject {
    name: string,
    initialScene: string
}

export interface IListedProject {
    name: string,
    path: string,
    errored: boolean
}

export type FormNameType = "project-selector" | "project-creator";