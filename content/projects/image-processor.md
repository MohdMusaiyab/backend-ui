---
title: "Async Image Processor"
githubUrl: "https://github.com/MohdMusaiyab/backend/tree/main/image-processor-queue"
category: "Distributed Queues"
techStack: ["Node.js", "BullMQ", "Redis", "TypeScript"]
---

### Abstract
A production-grade background worker and queue system. Processing heavy tasks like image manipulation synchronously on the main thread will block Node.js and crash the server under load. This project decouples the heavy lifting by moving it to an asynchronous queue.

### Architecture
The system uses the Producer-Consumer pattern.

1. **API Server (Producer)**: Receives the image upload, saves it temporarily, and pushes a "job" to the Redis queue. It immediately responds to the user with a `202 Accepted` status.
2. **Redis & BullMQ**: Acts as the robust message broker. BullMQ handles job retries, delays, and failure states natively.
3. **Worker Pool (Consumer)**: A separate Node.js process listens to the queue, pulls jobs off, and performs the CPU-intensive image resizing/compression using libraries like Sharp.

### The Value of Decoupling
By splitting the API and the Workers, we can scale them independently. If we receive a huge influx of images, the API won't go down; the queue will just grow. We can then spin up more Worker instances to drain the queue faster.

```typescript
// Adding a job to the queue
import { Queue } from 'bullmq';

const imageQueue = new Queue('imageProcessing', { connection: redisConnection });

export async function processImageUpload(file: Express.Multer.File) {
  // Push the heavy work to the background
  await imageQueue.add('resize', {
    filePath: file.path,
    sizes: [800, 400, 200]
  });
  
  return { status: 'queued', message: 'Image is being processed' };
}
```
