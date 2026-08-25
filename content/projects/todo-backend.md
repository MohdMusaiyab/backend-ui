---
title: "Todo API Backend"
githubUrl: "https://github.com/MohdMusaiyab/backend/tree/main/todo-backend"
category: "API Architecture"
techStack: ["Node.js", "Express v5", "PostgreSQL", "Prisma", "Zod", "Swagger"]
---

### Abstract
While a "Todo API" is often a beginner's sandbox, this implementation was explicitly engineered to reflect a **production-grade** backend architecture. It moves past simple CRUD by focusing on end-to-end type safety, robust authentication, dynamic pagination, and centralized error management to provide a highly scalable RESTful foundation.

### Core Architecture & Validations
The API strictly separates concerns (Routers, Controllers, Services), relying on **Zod** as the single source of truth. 
Zod schemas dictate the shape of all incoming payloads, provide static TypeScript definitions, and are used to automatically generate live interactive **Swagger documentation**.

- **Global Error Handling**: Express v5 natively handles asynchronous errors, allowing the complete removal of noisy `try/catch` blocks in controllers. A centralized error middleware catches all exceptions and normalizes them into standard, predictable JSON responses.

### Security & Authentication
Security mechanisms were implemented with industry standards in mind:
- **JWT Authentication**: Utilizes short-lived access tokens paired with HttpOnly refresh cookies to prevent XSS attacks.
- **Password Recovery**: A complete OTP-based forgot and reset password flow, with `bcrypt` utilized for secure password hashing.

### Advanced Data Handling
Unlike standard APIs that return unfiltered tables, this system implements dynamic querying:
- **Pagination & Filtering**: Supports filtering by completion status, case-insensitive searches, and seamless offset pagination responses.
- **Database & ORM**: Backed by **PostgreSQL** and managed cleanly via **Prisma ORM** for type-safe database queries.

### Implementation Details

Below is an example of the Controller and Service layer, highlighting the strict separation of concerns, Zod validation, and Prisma implementation.

```typescript
// 1. Controller: Lightweight, handles req/res, delegates to service
export const getAllTodosController = catchAsync(async (
  req: AuthRequest,
  res: Response
) => {
  // Query is strictly typed via Zod
  const validatedData = getAllTodosQuerySchema.parse({ query: req.query });
  const userId = req.user!.userId;
  
  const result = await getAllTodosService(userId, validatedData.query);

  res.status(200).json({
    success: true,
    data: result.todos,
    meta: result.meta,
  });
});

// 2. Service Layer: Pure business logic & type-safe Prisma queries
export const getAllTodosService = async (userId: string, query: GetAllTodosQueryInput) => {
  const { page, limit, search, isCompleted } = query;
  
  const where: any = { userId };
  
  if (isCompleted !== undefined) {
    where.isCompleted = isCompleted;
  }
  
  if (search) {
    where.title = { contains: search, mode: "insensitive" };
  }

  const skip = (page - 1) * limit;

  // Concurrent database queries for optimization
  const [todos, total] = await Promise.all([
    prisma.todo.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.todo.count({ where }),
  ]);

  return {
    todos,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};
```
