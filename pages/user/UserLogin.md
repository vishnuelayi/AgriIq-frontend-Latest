
# UserLogin.tsx Documentation

## Purpose
Entry point for students to log in using their mobile phone via Firebase Phone Authentication.

## Responsibilities
- Collect 10-digit Indian mobile number.
- Manage Firebase Recaptcha verification.
- Send and verify OTP.
- Create user profile in Firestore if it's the first time logging in.

## UI Behavior
- Step-based UI: First asks for phone, then for OTP.
- Uses Indian standard (+91) as default prefix.
- Shows error alerts for invalid inputs or Firebase errors.

## Firebase Logic
- **Auth**: `signInWithPhoneNumber`.
- **Firestore**: Creates a document in `users` collection with default `role: 'user'`.
- **Fields**: `uid`, `phone`, `name`, `role`, `blocked`, `createdAt`.

## Business Rules
- Blocked users should ideally be handled at the app level or via security rules to prevent login or access after login.
