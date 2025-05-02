import { Kafka } from 'kafkajs';
import { KAFKA_BROKERS, KAFKA_TOPIC } from './config';

const kafka = new Kafka({
  clientId: 'request-manager',
  brokers: KAFKA_BROKERS
});

export const producer = kafka.producer();

export async function initKafka() {
  await producer.connect();
}

export async function sendJobToKafka(payload: any) {
  await producer.send({
    topic: KAFKA_TOPIC,
    messages: [{ value: JSON.stringify(payload) }],
  });
}
