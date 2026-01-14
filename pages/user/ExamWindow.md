
# ExamWindow.tsx Documentation

## Purpose
The core test-taking interface where students answer MCQ questions under a timer.

## Responsibilities
- Rendering a distraction-free exam UI.
- Managing the countdown timer.
- Tracking answers and "marked for review" flags.
- Auto-submitting the exam when time runs out.
- Calculating final scores using specific logic (+1 / -1/3).

## Scoring Logic
- Correct: +1
- Wrong: -1/3 (Negative Marking)
- Unanswered: 0

## UI Behavior
- Question Palette: Allows quick navigation between questions.
- Header: Displays title and persistent countdown.
- Marking: Highlighting questions for later review.

## Firestore Logic
- **exams**: Reads questions and duration.
- **attempts**: Writes the final result. Keyed by `userId_examId` to overwrite previous scores.

## Related Files
- `types.ts`: For data structures.
