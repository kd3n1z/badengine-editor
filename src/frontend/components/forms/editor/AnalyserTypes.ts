export type AnalyseResult = {
    Status: "ok" | "failed";

    // Status == "ok" => Data is AnalyseAssemblyInfo
    // Status == "failed" => Data is string
    Data: string;
};

export type AnalyseAssemblyInfo = {
    Components: AnalyseComponentInfo[];
};

export type AnalyseComponentInfo = {
    Name: string;
    AlwaysActive: boolean;
    NonRegistrable: boolean;
    Fields: AnalyseFieldInfo[];
};

export type AnalyseFieldInfo = {
    Type: string;
    Name: string;
    DefaultValue: string | null;
};