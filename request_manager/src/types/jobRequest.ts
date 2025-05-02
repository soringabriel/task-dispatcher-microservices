export interface JobRequest {
  job: string;
  time: number;
}

export function isValidJobRequest(obj: any): obj is JobRequest {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    Object.keys(obj).length === 2 &&
    typeof obj.job === 'string' &&
    Number.isInteger(obj.time)
  );
}

export function toJobRequest(obj: any): JobRequest | null {
  if (isValidJobRequest(obj)) {
    return {
      job: obj.job,
      time: obj.time,
    };
  }
  return null;
}