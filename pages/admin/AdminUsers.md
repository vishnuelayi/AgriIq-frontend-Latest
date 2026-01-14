
# AdminUsers.tsx Documentation

## Purpose
Enables administrators to monitor registered students and manage their access.

## Responsibilities
- Fetching and listing all users from the `users` collection.
- Toggling the `blocked` status for specific users.

## Business Rule
- Blocked users should be denied access to protected routes or API interactions via security rules.

## Firestore Collection
- **users**: Reads all profiles and updates the `blocked` attribute.
