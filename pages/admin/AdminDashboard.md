
# AdminDashboard.tsx Documentation

## Purpose
Main landing page for administrators to view platform health and navigate management tools.

## Responsibilities
- Aggregating total counts for users, exams, revenue, and attempts.
- Visualizing platform data using Recharts.
- Providing quick navigation to sub-management pages.

## UI Behavior
- Large stat cards for primary KPIs.
- Bar chart for comparative data.
- List of call-to-action buttons for common tasks.

## Firestore Access
- Reads multiple collections (`users`, `exams`, `purchases`, `attempts`) to calculate totals.
