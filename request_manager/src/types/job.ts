import { JobRequest } from "./jobRequest";

export enum JobStatus {
    Pending = "Pending",
    Completed = "Completed"
}

export interface Job extends JobRequest {
    id: string;
    status: JobStatus;
}