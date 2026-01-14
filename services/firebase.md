
# firebase.ts Documentation

## Purpose
Initializes the Firebase SDK for Auth, Firestore, and Storage.

## Responsibilities
- Export single instances of `auth`, `db`, and `storage` for use across the app.
- Centralize Firebase configuration.

## Firestore Collections Schema
1. **users**: `{ uid, phone, email, name, role: 'user'|'admin', blocked: boolean, createdAt }`
2. **exams**: `{ id, title, description, price, duration, qCount, startDate, expiryDate, status: 'active'|'archived', questions: [] }`
3. **purchases**: `{ id, userId, examId, transactionId, status: 'pending'|'approved'|'rejected', createdAt }`
4. **attempts**: `{ id, userId, examId, score, answers: {}, completedAt }`

## Security Rules Logic
- Users: Read/Write own profile.
- Admin: Read/Write everything.
- Exams: Read-only for active users; Read/Write for admin.
