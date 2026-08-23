---
title: "Notification Engine"
githubUrl: "https://github.com/MohdMusaiyab/backend/tree/main/notification-system"
category: "Real-time Systems"
techStack: ["Go", "Redis Pub/Sub", "SSE"]
---

### Abstract
This project implements a highly scalable, asynchronous notification engine designed for real-time delivery across multiple client applications. Built natively in Go, it leverages concurrency patterns and a robust Redis backbone.

### Architecture
The architecture is decoupled into a publisher-subscriber model to ensure the core API is never blocked by slow delivery mechanisms.

1. **API Layer**: Receives notification requests and pushes them to Redis.
2. **Redis Pub/Sub**: Acts as the message broker, ensuring fast, distributed message passing.
3. **Worker Pools**: Go routines pick up messages from Redis and process them (e.g., parsing templates, checking user preferences).
4. **Server-Sent Events (SSE)**: Delivers the final payload to the client in real-time, maintaining an open connection for instant pushes.

### Key Engineering Decisions
- **Why SSE over WebSockets?**: Notifications are primarily a one-way street (Server -> Client). SSE is lighter, operates over standard HTTP, and has built-in reconnection logic, making it far simpler to scale than bi-directional WebSockets.
- **Go Routines**: Worker pools are managed using Go routines, allowing thousands of concurrent notification processing tasks with minimal memory footprint.

```go
// Example of how the worker picks up messages
func (w *Worker) StartProcessing(ctx context.Context) {
    pubsub := w.redisClient.Subscribe(ctx, "notifications_channel")
    defer pubsub.Close()
    
    for msg := range pubsub.Channel() {
        go w.processMessage(msg.Payload)
    }
}
```
