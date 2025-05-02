import { Kafka } from 'kafkajs';
import { KAFKA_BROKERS, KAFKA_TOPIC } from './config';
import { grpcClient } from './grpcClient';
import { threadId } from 'worker_threads';

const kafka = new Kafka({ clientId: 'queue-worker', brokers: KAFKA_BROKERS });
const consumer = kafka.consumer({ groupId: 'worker-group' });

async function run() {
  await consumer.connect();
  await consumer.subscribe({ topic: KAFKA_TOPIC, fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const job = JSON.parse(message.value?.toString() || '{}');
      console.log(`[Worker ${threadId}] Processing job:`, job);

      // Simulate async work based on job.time
      await new Promise((res) => setTimeout(res, job.time || 1000));

      console.log(`[Worker ${threadId}] Done job: ${job.id}`);

      grpcClient.JobCompleted(job, (err: any, response: any) => {
        if (err) {
          console.error(`[Worker ${threadId}] gRPC error:`, err.message);
        } else {
          console.log(`[Worker ${threadId}] gRPC ack for id: ${response.id}`);
        }
      });
    }
  });
}

run().catch((err) => {
  console.error(`[Worker ${threadId}] Worker failed:`, err);
});
