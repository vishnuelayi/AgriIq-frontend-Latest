
# UserHome.tsx Documentation

## Purpose
The student dashboard to discover and access exams.

## Responsibilities
- Fetching active exams from Firestore.
- Fetching user's purchase history to toggle between "Buy", "Pending", and "Start" states.
- Handling the manual payment submission flow.

## UI Behavior
- Grid layout for exam cards.
- Modal overlay for UPI payment details.
- Feedback upon submitting payment.

## Business Rules
- Only 'active' exams are shown.
- Exams require manual admin approval after payment submission.
- Once approved, the button changes from "Buy Now" to "Start Test".

## Firestore Collections
- **exams**: To fetch available tests.
- **purchases**: To check status and record new transactions.
