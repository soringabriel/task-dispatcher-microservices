import { Worker } from 'worker_threads';
import { KAFKA_TOPIC, WORKER_COUNT } from './config';
import { ensureTopicExists } from './kafka';

(async () => {
  console.log('Initializing Kafka topic');
  await ensureTopicExists(KAFKA_TOPIC, WORKER_COUNT);

  console.log(`Starting ${WORKER_COUNT} workers...`);
  for (let i = 0; i < WORKER_COUNT; i++) {
    const worker = new Worker('./src/worker.ts', {
      execArgv: ['-r', 'ts-node/register']
    }); // This slows us down but it's necessary for npm run dev to work without issues
    worker.on('exit', (code) => {
      console.log(`Worker ${i} exited with code ${code}`);
    });
  }
})();
