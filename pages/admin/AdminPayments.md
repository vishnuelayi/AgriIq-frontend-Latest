
# AdminPayments.tsx Documentation

## Purpose
Manual verification interface for student payments.

## Responsibilities
- Listing all "Pending" purchases.
- Displaying Transaction IDs/UTR for manual check in admin's bank statement.
- Providing Approve/Reject actions.

## UI Behavior
- Card-based layout for quick scanning.
- Visual status indicators.
- One-click approval flow.

## Business Rule
- Approving a purchase record unlocks the corresponding exam for that student automatically (handled by UI logic in `UserHome.tsx`).

## Firestore Collection
- **purchases**: Updates the `status` field.
