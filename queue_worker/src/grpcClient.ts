import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { REQUEST_MANAGER } from './config';

const PROTO_PATH = path.resolve(__dirname, 'proto/job.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const grpcObject = grpc.loadPackageDefinition(packageDefinition) as any;
const jobPackage = grpcObject.job;

export const grpcClient = new jobPackage.JobService(
  REQUEST_MANAGER,
  grpc.credentials.createInsecure()
);
