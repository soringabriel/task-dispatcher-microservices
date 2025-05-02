# Task dispatcher microservices

This project demonstrates a simple task dispatching system built with a microservices architecture using Kafka and gRPC. It consists of two decoupled services that communicate asynchronously:

---

## Services

### 1. `request_manager`
- Exposes a **REST API** with 2 endpoints:
  - `POST /job` – Submits a job
  - `GET /job/{job_id}` – Retrieves job
- Stores job metadata locally in memory
- Sends new jobs to a Kafka topic named `"jobs"`
- Receives job completion acknowledgements from `queue_worker` via **gRPC**, and updates job statuses

### 2. `queue_worker`
- Spawns multiple worker threads to enable **parallel job processing**
- Subscribes to the Kafka `"jobs"` topic to receive jobs
- Each job simulates work for `time` milliseconds
- Once a job is completed, it sends a **gRPC message** back to `request_manager` with the result

---

## Example Usage

### 1. Run the project

```bash
docker-compose up --build
```

(and wait until the queue_workers are set up - can take up to 5 minutes)

### 2. Submit a job

```bash
curl -X POST http://localhost:8080/job   -H "Content-Type: application/json"   -d '{"job": "example-task", "time": 1000}'
```

### 3. Check job status

```bash
curl http://localhost:8080/job/{job_id}
```

---

## Architecture Decisions

- **Kafka decoupling** – Jobs are published to Kafka, allowing `request_manager` to remain responsive even for long-running tasks.
- **Thread-based concurrency** – `queue_worker` leverages `worker_threads` for true parallelism (overcoming Node.js's single-threaded nature).
- **gRPC completion callback** – Used for efficient, low-latency communication between `queue_worker` and `request_manager`.

---

## Important Notes

- Ensure `queue_worker` starts **before** the first job is submitted. This guarantees the Kafka topic is created with the correct number of **partitions** (matching the number of workers).

## Protocol Buffers (gRPC)

To generate TypeScript files from `.proto`, go into both **queue_worker** and **request_manager** folders and run:

```bash
npm install --save-dev ts-protoc-gen
npm run proto
```

If you encounter issues, make sure the following are installed:

```
npm install --save-dev grpc-tools ts-protoc-gen @grpc/proto-loader
```

---

## Running Tests

To run the tests for `request_manager`:

1. Ensure Jest and types are installed:

```bash
npm install --save-dev jest ts-jest @types/jest
npx ts-jest config:init
```

2. Run the test suite:

```bash
npm run test
```