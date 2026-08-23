---
title: "Booking System"
githubUrl: "https://github.com/MohdMusaiyab/backend/tree/main/booking-system"
category: "High Concurrency"
techStack: ["Go", "Goroutines", "PostgreSQL", "Redis"]
---

### Abstract
This project tackles one of the classic backend engineering problems: handling concurrent bookings. When multiple users attempt to book the exact same resource (like a seat or a time slot) at the exact same millisecond, the system must guarantee that only one succeeds.

### Architecture & Concurrency
Built in Go to leverage its powerful concurrency model, the system uses a combination of database-level locks and Go's internal primitives.

1. **Goroutines**: HTTP requests are handled concurrently using lightweight goroutines.
2. **PostgreSQL Transactions**: The core booking logic is wrapped in ACID-compliant transactions using `SELECT ... FOR UPDATE` to prevent double-booking at the database level.
3. **Redis Caching**: Frequently accessed data, like seat availability, is cached in Redis to reduce database load during high-traffic spikes.

### The Race Condition Challenge
The biggest hurdle was ensuring that race conditions didn't result in oversold inventory. 

```go
// Example of a transactional booking operation
func (r *BookingRepository) BookSeat(ctx context.Context, seatID string, userID string) error {
    tx, err := r.db.BeginTx(ctx, nil)
    if err != nil {
        return err
    }
    defer tx.Rollback()

    // Row-level lock to prevent concurrent modifications
    var status string
    err = tx.QueryRow("SELECT status FROM seats WHERE id = $1 FOR UPDATE", seatID).Scan(&status)
    if status != "available" {
        return errors.New("seat already booked")
    }

    // Proceed with booking
    _, err = tx.Exec("UPDATE seats SET status = 'booked', user_id = $2 WHERE id = $1", seatID, userID)
    
    return tx.Commit()
}
```
