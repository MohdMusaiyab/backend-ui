---
title: "Concurrent Booking System"
githubUrl: "https://github.com/MohdMusaiyab/backend/tree/main/booking-system"
category: "High Concurrency"
techStack: ["Go", "Goroutines", "PostgreSQL", "Docker", "GORM"]
---

### Abstract
This project tackles one of the classic distributed engineering problems: handling concurrent bookings. When multiple users attempt to book the exact same resource (like a cinema seat) at the exact same millisecond, the system must guarantee absolute consistency. This API is built in **Go** and utilizes **Pessimistic Locking** to ensure zero double-bookings under extreme load.

### System Architecture & Database
The entire application is fully Dockerized, running a Go API server alongside PostgreSQL. 
- **Data Initialization**: The system includes a custom seeder that instantly generates Theaters, Halls, Movies, Showtimes, and over **25,000 physical Seats** across relational tables.
- **ORM & Auto-Migration**: Utilizes **GORM** to handle automatic table migrations and complex relational queries.

### The Race Condition Challenge (Extreme Load Testing)
The highlight of this architecture is its absolute resilience to concurrent requests. To prove this, I built an internal `Extreme Load Tester`.

When executed, the test script dynamically queries a random *available* seat from the database. It then spins up **100 parallel Goroutines** and fires them at the `/book` endpoint at the exact same millisecond.

**The Result:** 
- `1 Success (200 OK)`
- `99 Rejections (409 Conflict)`

The PostgreSQL lock handles the queue seamlessly without a single double-booking.

### Implementation Details: Pessimistic Locking
To prevent race conditions, the core booking logic wraps the read-and-update flow in a strict, ACID-compliant database transaction using the `FOR UPDATE` clause.

```go
func BookSeat(c *gin.Context) {
	var req BookSeatRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	tx := database.DB.Begin()
	var seat models.ShowtimeSeat

	// 1. Pessimistic Lock: Blocks other transactions attempting to read/write this row
	if err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).First(&seat, req.ShowtimeSeatID).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error while acquiring lock"})
		return
	}

	// 2. State Validation
	if seat.Status != "AVAILABLE" {
		tx.Rollback()
		c.JSON(http.StatusConflict, gin.H{"error": "Sorry, this seat is already taken!"})
		return
	}

	// 3. Artificial Delay: Widens the race condition window to strictly prove the lock works
	time.Sleep(100 * time.Millisecond)

	// 4. Mutation & Commit
	seat.Status = "BOOKED"
	if err := tx.Save(&seat).Error; err != nil {
		tx.Rollback()
		return
	}

	booking := models.Booking{
		ShowtimeSeatID: seat.ID,
		UserEmail:      req.UserEmail,
		Status:         "CONFIRMED",
	}
	
	tx.Create(&booking)
	tx.Commit()

	c.JSON(http.StatusOK, gin.H{"message": "Booking successful!"})
}
```
