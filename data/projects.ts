export interface Project {
  id: string;
  title: string;
  description: string;
  directory: string;
  techStack: string[];
  category: string;
}

export const projects: Project[] = [
  {
    id: "todo-backend",
    title: "Todo Backend",
    description: "A simple todo API to practice CRUD, routes, and data handling.",
    directory: "todo-backend",
    techStack: ["Node.js", "Express", "REST"],
    category: "Fundamentals"
  },
  {
    id: "booking-system",
    title: "Booking System",
    description: "A concurrent booking API written in Go to simulate real-world booking scenarios — seats, slots, or resources — with race condition handling and goroutine-based concurrency.",
    directory: "booking-system",
    techStack: ["Go", "Goroutines", "Concurrency"],
    category: "Systems"
  },
  {
    id: "image-processor",
    title: "Async Image Processor",
    description: "A production-grade background worker and queue system using BullMQ, Redis, and Express to process images asynchronously without blocking the main event loop.",
    directory: "image-processor-queue",
    techStack: ["Node.js", "BullMQ", "Redis"],
    category: "Architecture"
  },
  {
    id: "notification-system",
    title: "Notification System",
    description: "A scalable, asynchronous notification engine built in Go using Redis Pub/Sub, distributed worker pools, and server-sent events for real-time delivery.",
    directory: "notification-system",
    techStack: ["Go", "Redis Pub/Sub", "SSE"],
    category: "Distributed Systems"
  }
];
