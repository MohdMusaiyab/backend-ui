---
title: "Async Image Processing Pipeline"
githubUrl: "https://github.com/MohdMusaiyab/backend/tree/main/image-processor-queue"
category: "Distributed Queues"
techStack: ["Node.js", "BullMQ", "Redis", "Prisma", "Sharp"]
---

### Abstract
This project demonstrates how to decouple heavy, CPU-intensive tasks from the main API thread. By utilizing a robust message queue architecture, the system guarantees high availability, incredibly fast API response times, and highly scalable background processing without ever blocking the Node.js event loop.

### Core Architecture (Producer-Consumer Pattern)
The backend is deliberately split into two completely separate processes communicating via an in-memory message broker.

1. **Producer (Express API)**: Receives image uploads via `multer`, saves the raw file locally, creates a pending job record in PostgreSQL, and pushes the job ID to the Redis queue. It immediately returns a `202 Accepted` status to the client to keep the event loop free.
2. **Message Broker (Redis + BullMQ)**: Acts as the highly reliable, in-memory queue. Incoming jobs wait here until a worker has the capacity to process them, handling retries and atomic operations natively.
3. **Consumer (Background Worker)**: A standalone Node.js process that listens exclusively to the queue. It performs the heavy image transformations (resizing, grayscale, blurring) using the high-performance `sharp` library.

### Single Source of Truth
While Redis manages the queue execution sequence, **PostgreSQL** (managed via **Prisma 7**) acts as the persistent "Single Source of Truth" for job states. The frontend interface actively polls the API to check the database status, seamlessly rendering the image once the background worker updates the database record to `completed`.

### Implementation Details: The Consumer Worker
Below is the core implementation of the background worker. Notice how it operates entirely independently of the API server, picking up jobs, executing the CPU-heavy `sharp` manipulation, and strictly managing the database state.

```typescript
// worker.ts: A standalone process handling heavy background jobs
import { Worker } from 'bullmq';
import sharp from 'sharp';
import path from 'path';
import prisma from '../prisma.js';
import { connection } from './config.js';

// 1. The worker binds to the 'image-jobs' Redis queue
const imageWorker = new Worker('image-jobs', async (job) => {
  const { jobId, filePath } = job.data;
  
  // 2. Mark job as processing in PostgreSQL
  await prisma.job.update({
    where: { id: jobId },
    data: { status: 'processing' }
  });

  // (Artificial delay to demonstrate background processing in UI)
  await new Promise(resolve => setTimeout(resolve, 3000));

  const outputFilename = `processed-${jobId}.jpg`;
  const outputPath = path.join(process.cwd(), 'processed', outputFilename);
  
  // 3. CPU-Intensive Image Manipulation via Sharp (libvips)
  await sharp(filePath)
    .resize(800)
    .grayscale()
    .blur(4)
    .toFile(outputPath);

  // 4. Mark completed and store the final URL
  await prisma.job.update({
    where: { id: jobId },
    data: { 
      status: 'completed',
      imageUrl: `/processed/${outputFilename}`
    }
  });

}, { connection: connection as any });

// 5. Graceful failure handling and state recovery
imageWorker.on('failed', async (job, err) => {
  await prisma.job.update({
    where: { id: job?.data.jobId },
    data: { status: 'failed' }
  });
});
```
