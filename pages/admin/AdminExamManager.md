
# AdminExamManager.tsx Documentation

## Purpose
Primary interface for administrators to create and modify mock tests.

## Responsibilities
- Listing all existing exams.
- Providing a form for exam metadata (Price, Duration, Status).
- Managing a dynamic list of MCQ questions for each exam.
- Publishing and Archiving exams.

## MCQ Structure
- Question Text
- 4 Options (A, B, C, D)
- 1 Correct Answer selector

## UI Behavior
- Toggle between List view and Edit/Create view.
- Real-time updates to question count.
- Nested form management for questions.

## Firestore Collection
- **exams**: Creates and updates documents with an embedded array of `questions`.
