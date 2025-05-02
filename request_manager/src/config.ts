import dotenv from 'dotenv';
dotenv.config();

export const PORT_API = parseInt(process.env.PORT_API || '8080');
export const PORT_GRPC = parseInt(process.env.PORT_GRPC || '50051');

export const KAFKA_BROKERS = process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'];
export const KAFKA_TOPIC = process.env.KAFKA_TOPIC || 'jobs';
