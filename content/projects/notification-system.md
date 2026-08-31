---
title: "Distributed Notification Engine"
githubUrl: "https://github.com/MohdMusaiyab/backend/tree/main/notification-system"
category: "Distributed Systems"
techStack: ["Go", "Redis (Asynq)", "PostgreSQL", "Next.js", "Docker", "Prometheus"]
---

### Abstract
The Distributed Notification Engine is a highly scalable, production-grade microservices architecture designed to handle massive concurrent notification traffic without dropping events or crashing downstream providers. Moving far beyond a standard REST API, the system utilizes advanced asynchronous event-routing, strict resiliency patterns, and distributed rate limiting to guarantee high-throughput delivery across multiple channels (Email, SMS).

### Architectural Evolution (Stage-by-Stage Breakdown)

#### Stage 1: The Foundation (Clean Architecture)
The core API is built on strict Clean Architecture principles, ensuring complete decoupling between the Transport, Service, and Data Access layers. 
- All incoming HTTP requests are handled by a lightweight Gin router.
- PostgreSQL acts as the definitive source of truth, utilizing relational schemas to map User Profiles, Contact Preferences, and immutable HTML Templates.

#### Stage 2: Asynchronous Message Brokering
To prevent slow downstream APIs (like AWS SES or Twilio) from blocking incoming traffic, the system completely decouples producers from consumers.
- **The Producer:** The Go API acts solely as a producer. Upon receiving a request, it instantly serializes the payload and drops it into a Redis Message Broker, achieving sub-25ms response times.
- **The Consumers:** Horizontally scaled background workers autonomously pull tasks from the queue and execute the heavy network I/O operations asynchronously.

#### Stage 3: System Resilience & Dead Letter Queues (DLQ)
Distributed systems must expect network failures. The architecture implements robust defense mechanisms:
- **Exponential Backoff:** Failed network requests automatically retry using an exponential backoff algorithm with time-jitter to prevent "thundering herd" server crashes.
- **Dead Letter Queues:** If a task fails three consecutive times, it is stripped from the active queue and permanently parked in a DLQ for manual inspection, preventing infinite retry loops.

#### Stage 4: Network Deduplication & Idempotency
Because "exactly-once" delivery over a network is impossible, the system is engineered for "effectively-once" delivery.
- **API Edge Defense:** Network-level duplicates (e.g., a user double-clicking a submit button) are blocked by strict PostgreSQL `UNIQUE` constraints via an `Idempotency-Key` HTTP header. 

#### Stage 5: Event-Driven Fan-Out (The Router)
The architecture abandons rigid 1-to-1 processing in favor of a flexible Pub/Sub Router pattern.
- The API publishes a generic `event:notification_requested`.
- A dedicated **Router Worker** intercepts this event and "fans out" independent tasks to strictly isolated target queues (e.g., the `email` queue and `sms` queue). This isolates failures—if the SMS provider goes down, the Email queue remains completely unblocked.

#### Stage 6: Distributed Rate Limiting & Backpressure
To protect downstream providers from sudden traffic spikes, the system enforces multi-layered traffic control:
- **API Token Bucket:** The edge gateway rate-limits incoming HTTP requests by IP address.
- **Global Worker Throttling:** Background workers utilize a globally atomic, Redis-backed Fixed Window Counter. Even if 50 SMS worker nodes are spun up horizontally, they will mathematically never exceed the provider's allowed requests-per-second limit.
- **Load Shedding:** If Redis queues exceed critical thresholds, the API automatically triggers graceful degradation (`503 Service Unavailable`) to prevent complete out-of-memory crashes.

#### Stage 7: Dynamic Templating & User Preferences
The system dynamically resolves user state exactly at the time of processing, rather than at the time of the API request, ensuring data is never stale.
- **JSONB Preferences:** The Router queries PostgreSQL `JSONB` fields to enforce granular user opt-in/opt-out rules on the fly.
- **Version-Locked Rendering:** The exact version of an HTML template is frozen onto the job payload. This eliminates mid-flight crashes if a marketer updates a template while thousands of jobs are actively waiting in the queue.

#### Stage 8: Time-Travel Scheduling (Redis ZSETs)
The engine supports exact-time future scheduling natively at the broker level.
- Scheduled notifications bypass the active queue and are parked in a Redis Sorted Set (ZSET). The broker silently monitors this set in-memory, dropping the task into the active queue at the exact millisecond it is due, eliminating the need for inefficient database polling.

#### Stage 9 & 10: Microservices & Real-Time Observability
The monolith was physically shattered into independent Dockerized microservices (`api`, `router`, `worker-email`, `worker-sms`), allowing for asymmetric cloud scaling. 

To eliminate the "blind box" nature of distributed systems, a complete telemetry stack was integrated:
- **Prometheus & Grafana:** Workers emit absolute success/failure counters and latency histograms for real-time infrastructure scraping.
- **Distributed Tracing:** Every HTTP request generates an `X-Request-ID` which is propagated through Redis into the background workers, binding every single log line across the cluster to a specific user action.
- **Next.js Live Dashboard:** Worker nodes publish their structured JSON logs back to the API gateway via Redis Pub/Sub. The API pipes this telemetry through WebSockets into a custom Next.js UI, rendering a live architectural heatmap and isolating concurrent requests into dedicated terminal swimlanes.

### Architectural Decisions & Trade-Offs

Building a distributed system is entirely about managing trade-offs. Below are the core engineering decisions made during the architecture of this system and the reasoning behind them:

#### 1. Why Go over Node.js or Python?
- **The Decision:** The entire backend and worker pool is written natively in Go.
- **The Why:** Notification systems are highly I/O bound (making thousands of network calls to external APIs). Go's lightweight `goroutines` allow the system to spawn thousands of concurrent network requests using a fraction of the RAM required by Node.js or Python. 
- **The Trade-Off:** Go's strict static typing and error handling (`if err != nil`) require more boilerplate code than a dynamic language, but this trade-off was accepted to guarantee compile-time safety and eliminate runtime `undefined` panics in production.

#### 2. Why Redis (Asynq) instead of Kafka or RabbitMQ?
- **The Decision:** Redis (via the Asynq library) was chosen as the message broker.
- **The Why:** While Kafka is the industry standard for event streaming, it introduces massive operational overhead (JVM tuning, ZooKeeper/KRaft management). Redis is incredibly lightweight, offers sub-millisecond latency, and natively supports Sorted Sets (ZSETs)—which makes implementing "time-travel" future scheduling mathematically trivial compared to Kafka.
- **The Trade-Off:** Redis stores queues in RAM, whereas Kafka writes sequentially to disk. If the Redis server suffers a catastrophic hardware failure before saving to disk, in-flight messages could be lost. For a notification system, this slight risk of data loss was accepted in exchange for blistering speed and scheduling flexibility.

#### 3. Why the "Router / Fan-Out" Pattern?
- **The Decision:** The API Gateway does not push tasks directly to the `email` or `sms` queues. It pushes a generic event to a middleman `Router Worker`.
- **The Why:** Separation of Concerns. The API's only job is to ingest traffic as fast as possible. If the API had to query the database to check if a user wanted an SMS or an Email, API latency would spike. Offloading that business logic to a background Router keeps the API at <25ms response times.
- **The Trade-Off:** Introducing a middleman adds an extra "hop" (API -> Redis -> Router -> Redis -> Email Worker). This slightly increases the internal latency of processing a notification by a few milliseconds, but vastly improves the horizontal scalability of the API.

#### 4. Why JSONB for User Preferences?
- **The Decision:** User opt-in/opt-out preferences are stored in PostgreSQL using the `JSONB` data type rather than flat boolean columns (e.g., `is_email_enabled`).
- **The Why:** Schema flexibility. If the business decides to add `Push Notifications` or `Slack Alerts` in the future, the database schema does not need to be migrated or locked. The system simply pushes a new key into the JSON object.
- **The Trade-Off:** Querying deeply nested JSON inside PostgreSQL is slightly slower and harder to index than standard relational columns. 

#### 5. Why build a Custom UI if Grafana already exists?
- **The Decision:** Built a custom Next.js WebSocket dashboard in addition to Prometheus/Grafana.
- **The Why:** Grafana is exceptional at tracking long-term, aggregated statistical metrics (e.g., "We sent 5,000 emails in the last hour"). However, it is terrible at tracing the exact, real-time lifecycle of *one specific request*. The custom Next.js UI allows engineers to isolate concurrent requests into terminal swimlanes, providing a live x-ray of the system's exact physical state.
- **The Trade-Off:** Required engineering a complex Redis Pub/Sub logging bridge to route logs out of isolated Docker containers and back into the API Gateway to broadcast over WebSockets.

### Implementation Highlights

#### 1. The Distributed Telemetry Bridge (Microservices Networking)
When you split the architecture into separate Docker containers, the background workers lost the ability to print logs directly to your Next.js WebSocket. This piece of code solves that by engineering a custom `io.Writer` that intercepts standard logs and publishes them over the network via Redis Pub/Sub, bridging the isolated microservices back together.

```go
// 1. Custom Redis Pub/Sub Writer (Injected into Worker Containers)
type RedisPubSubWriter struct {
	client  *redis.Client
	channel string
}

// Write intercepts the standard log output (byte array) and publishes it to Redis instantly
func (w *RedisPubSubWriter) Write(p []byte) (n int, err error) {
	err = w.client.Publish(context.Background(), w.channel, string(p)).Err()
	if err != nil {
		return 0, err
	}
	return len(p), nil
}

// 2. The API Gateway Listener (Runs in the API Container)
// Subscribes to the global logging channel and pipes remote logs into WebSockets
func StartGlobalTelemetryBridge(redisClient *redis.Client, wsHub *telemetry.Hub) {
	pubsub := redisClient.Subscribe(context.Background(), "global_telemetry")
	
	go func() {
		defer pubsub.Close()
		for {
			msg, err := pubsub.ReceiveMessage(context.Background())
			if err != nil { continue }
			
			// Instantly broadcast the remote worker's log to connected Next.js clients
			wsHub.BroadcastMessage([]byte(msg.Payload))
		}
	}()
}
```

#### 2. The Event-Driven Fan-Out Router (Business Logic Isolation)
This snippet shows how the system prevents a "single point of failure." Instead of sending an Email and SMS sequentially, the Router reads the database, evaluates the user's JSONB opt-in preferences, and spawns independent tasks. If the SMS provider crashes, the Email task still succeeds instantly.

```go
// ProcessEventNotificationRequested grabs the generic event and fans it out intelligently
func (p *RouterProcessor) ProcessEventNotificationRequested(ctx context.Context, t *asynq.Task) error {
	var payload EventPayload
	json.Unmarshal(t.Payload(), &payload)

	// 1. Route Evaluation: Parse JSONB preferences directly into a Go struct
	user, _ := p.repo.GetUserByID(ctx, payload.UserID)
	var activeChannels []string
	
	if user.Preferences.Channels.Email { activeChannels = append(activeChannels, "email") }
	if user.Preferences.Channels.SMS { activeChannels = append(activeChannels, "sms") }
	
	if len(activeChannels) == 0 {
		p.repo.UpdateStatus(ctx, payload.NotificationID, "suppressed_by_preference")
		return nil
	}

	// 2. The Fan-Out: Construct independent tasks mapped to specific queues
	for _, channel := range activeChannels {
		var task *asynq.Task
		var queueName string
		
		// Marry the exact template version to the payload to prevent mid-flight crashes
		if channel == "email" {
			task, _ = NewSendEmailTask(payload.UserID, payload.TemplateVersion, payload.Data)
			queueName = "email"
		} else if channel == "sms" {
			task, _ = NewSendSMSTask(payload.UserID, payload.TemplateVersion, payload.Data)
			queueName = "sms"
		}
		
		// Enqueue the independent task into an isolated Redis queue
		p.queueClient.EnqueueContext(ctx, task, asynq.MaxRetry(3), asynq.Queue(queueName))
	}
	
	return p.repo.UpdateStatus(ctx, payload.NotificationID, "routed")
}
```
