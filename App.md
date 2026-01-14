
# App.tsx Documentation

## Purpose
Main entry point for the AgriIQ application handling routing and global authentication state.

## Responsibilities
- Monitoring Firebase Auth state changes.
- Fetching user roles from Firestore.
- Managing navigation between User Portal and Admin Panel.
- Protecting routes based on authentication and roles.

## UI Behavior
- Shows a loading spinner during initial auth check.
- Renders a global `Navbar` when a user is logged in.
- Redirects users based on their role (`admin` vs `user`).

## Firebase Details
- **Auth**: `onAuthStateChanged` listens for logins.
- **Firestore**: Accesses `users` collection to check the `role` field.
- **Rules**: Users can only read their own document in `/users/{uid}`.

## Related Files
- `services/firebase.ts`: Firebase configuration.
- `components/layout/Navbar.tsx`: Header navigation.
- All page components in `pages/`.
