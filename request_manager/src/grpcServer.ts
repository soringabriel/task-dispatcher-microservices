import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { PORT_GRPC } from './config';
import { Job, JobStatus } from './types/job';
import { jobs } from './apiServer';

const PROTO_PATH = path.resolve(__dirname, 'proto/job.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const grpcObject = grpc.loadPackageDefinition(packageDefinition) as any;
const jobPackage = grpcObject.job;

const server = new grpc.Server();

server.addService(jobPackage.JobService.service, {
  JobCompleted: (call: any, callback: any) => {
    let job = call.request as Job;
    job.status = JobStatus.Completed;
    jobs[job.id] = job;
    console.log("Updated", job);
    callback(null, job);
  }
});

server.bindAsync(`0.0.0.0:${PORT_GRPC}`, grpc.ServerCredentials.createInsecure(), () => {
  console.log(`gRPC server running at 0.0.0.0:${PORT_GRPC}`);
  server.start();
});
