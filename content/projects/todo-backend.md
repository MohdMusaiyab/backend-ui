---
title: "Todo API"
githubUrl: "https://github.com/MohdMusaiyab/backend/tree/main/todo-backend"
category: "Fundamentals"
techStack: ["Node.js", "Express", "REST"]
---

### Abstract
A robust and well-structured Todo API that serves as a foundational sandbox. While "Todo apps" are common, this implementation focuses strictly on backend best practices, including proper RESTful routing, error handling, and structured data flow.

### Architecture
The API is built using Node.js and Express. It intentionally avoids over-engineering, focusing instead on writing clean, maintainable, and easily testable code.

1. **Routing Layer**: Handles HTTP requests and maps them to controllers.
2. **Controller Layer**: Contains the business logic and orchestrates data fetching.
3. **Data Access Layer**: Abstracts the database interactions to allow for easy swapping of underlying data stores.

### Key Takeaways
This project was an exercise in getting the fundamentals right before moving on to distributed systems and concurrency. 

```javascript
// Example of a clean, abstracted route controller
export const getTodos = async (req, res, next) => {
  try {
    const todos = await todoService.fetchAll();
    res.status(200).json({ success: true, data: todos });
  } catch (error) {
    next(error); // Passes to global error handler
  }
}
```
