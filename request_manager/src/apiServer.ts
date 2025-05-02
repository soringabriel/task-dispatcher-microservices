// src/apiServer.ts

import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { sendJobToKafka } from './kafkaClient';
import { toJobRequest } from './types/jobRequest';
import { Job, JobStatus } from './types/job';
import { PORT_API } from './config';

const app = express();
app.use(express.json());

let jobs: Record<string, Job> = {}; // Holds status info

app.post('/job', async (req: Request, res: Response): Promise<void> => {
  const jobRequest = toJobRequest(req.body);

  if (!jobRequest) {
    res.status(400).json({
      status: 'error',
      message: 'Invalid job format. Expected: {"job":"string", "time":integer}'
    });
    return
  }

  const jobId = uuidv4();
  const job: Job = {
    id: jobId,
    status: JobStatus.Pending,
    ...jobRequest
  };

  try {
    await sendJobToKafka(job);
    jobs[jobId] = job;
    res.json({ status: 'success', job });
    console.log('Job sent to Kafka:', job);
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err instanceof Error ? err.message : String(err)
    });
    console.warn('Failed to send job to Kafka:', err);
  }
});

app.get('/job/:id', async (req: Request, res: Response): Promise<void> => {
  if (!req.params.id) {
    res.status(400).json({ status: 'error', message: 'Missing job_id' });
    return
  }
  const job = jobs[req.params.id];
  if (!job) {
    res.status(404).json({ status: 'error', message: 'Job not found' });
    return
  }
  res.json({ status: 'success', job });
});

export { app, jobs };
