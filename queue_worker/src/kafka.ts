import { Kafka } from 'kafkajs';
import { KAFKA_BROKERS } from './config';

const kafka = new Kafka({ clientId: 'queue-worker', brokers: KAFKA_BROKERS });
const admin = kafka.admin();

export async function ensureTopicExists(topic: string, partitions: number) {
  await admin.connect();
  const existingTopics = await admin.listTopics();

  if (!existingTopics.includes(topic)) {
    console.log(`Creating topic '${topic}' with ${partitions} partitions...`);
    await admin.createTopics({
      topics: [{ topic, numPartitions: partitions, replicationFactor: 1 }],
    });
  } else {
    console.log(`Topic '${topic}' already exists.`);
  }

  await admin.disconnect();
}