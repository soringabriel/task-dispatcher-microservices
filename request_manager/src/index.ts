import { initKafka } from './kafkaClient';
import { PORT_API } from './config';
import { app } from './apiServer';
import './grpcServer';

app.listen(PORT_API, () => {
  console.log(`HTTP API server listening on http://localhost:${PORT_API}`);
});

(async () => {
  await initKafka();
})();
