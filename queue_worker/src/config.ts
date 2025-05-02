import dotenv from 'dotenv';
dotenv.config();

export const WORKER_COUNT = parseInt(process.env.WORKER_COUNT || '1');
export const REQUEST_MANAGER = process.env.REQUEST_MANAGER || 'localhost:50051';

export const KAFKA_BROKERS = process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'];
export const KAFKA_TOPIC = process.env.KAFKA_TOPIC || 'jobs';
