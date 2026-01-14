
# AdminLogin.tsx Documentation

## Purpose
Secure portal for administrators to access the management panel.

## Responsibilities
- Email and Password authentication.
- Handling auth errors.

## UI Behavior
- Dark-themed background to differentiate from student portal.
- Clean, focused form.

## Firebase Logic
- **Auth**: `signInWithEmailAndPassword`.

## Security Expectations
- Firestore rules must verify that the authenticated UID has the `role: 'admin'` field set in their user document before allowing access to admin-only collections.
