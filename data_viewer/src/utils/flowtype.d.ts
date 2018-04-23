export declare type Dispatch = (action: any) => null;
export declare type AnalysisInput = {
    id: string;
    name: string;
    description: string;
    required: boolean;
    advanced: boolean;
    multiple: boolean;
    type: string;
};
export declare type AnalysisOutput = {
    name: string;
    type: string;
    description: string;
};
export declare type AnalysisParameter = {
    id: string;
    name: string;
    description: string;
    required: boolean;
    advanced: boolean;
    multiple: boolean;
    type: string;
};
export declare type Analysis = {
    id: string;
    description: string;
    name: string;
    category: string;
    helpContext: string;
    tag: string;
    datasets: AnalysisInput[];
    outputs: AnalysisOutput[];
    parameter: AnalysisParameter[];
};
export declare type Analyses = Analysis[];
export declare type AnalysisMetadata = {
    id: string;
    description: string;
    name: string;
    category: string;
    helpContext: string;
};
export declare type AnalysesMetadata = AnalysisMetadata[];
export declare type AnalysesState = {
    analysisMetadata: AnalysesMetadata;
};
export declare type FileDescriptor = {
    id: string;
    deleted: boolean;
    filename: string;
    mimeType: string;
    size: number;
    dataURL: string;
    md5sum: string;
};
export declare type Dataset = {
    id: string;
    deleted: boolean;
    title: string;
    description: string;
    date: Date;
    fileDescriptors: FileDescriptor[];
    contributors: string[];
    creator: string;
    dataType: string;
    storedUrl: string;
    format: string;
    sourceDataset: string;
    spaces: string[];
};
export declare type Datasets = Dataset[];
export declare type DatasetState = {
    datasets: Dataset[];
};
export declare type ExecutionState = {
    executionId: string;
};
export declare type GetState = () => Object;
export declare type UserState = {
    username: string;
    auth_token: string;
};
