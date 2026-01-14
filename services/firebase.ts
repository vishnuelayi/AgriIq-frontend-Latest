
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// These values would normally come from your Firebase Console.
// For this mock, we assume environment setup is handled.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "agriiq-mock.firebaseapp.com",
  projectId: "agriiq-mock",
  storageBucket: "agriiq-mock.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
