
# types.ts Documentation

## Purpose
Standardizes data structures across the application.

## Responsibilities
- Defines Enums for Roles, Exam Status, and Payment Status.
- Defines Interfaces for core entities: Exam, Question, UserProfile, Purchase, and Attempt.

## Data Schema Expectations
- `duration`: Stored as integers representing minutes.
- `startDate`/`expiryDate`: ISO strings or Timestamps.
- `correctIndex`: 0 to 3 matching the options array.
