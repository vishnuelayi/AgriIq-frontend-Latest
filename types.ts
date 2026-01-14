
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

export enum ExamStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived'
}

export enum PaymentStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export interface Question {
  id: string;
  text: string;
  options: [string, string, string, string];
  correctIndex: number;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number; // in minutes
  qCount: number;
  startDate: string;
  expiryDate: string;
  status: ExamStatus;
  reattempts: number;
  questions: Question[];
}

export interface UserProfile {
  uid: string;
  phone: string;
  name: string;
  role: UserRole;
  blocked: boolean;
  createdAt: any;
}

export interface Purchase {
  id: string;
  userId: string;
  examId: string;
  transactionId: string;
  status: PaymentStatus;
  amount: number;
  createdAt: any;
}

export interface Attempt {
  id: string;
  userId: string;
  examId: string;
  score: number;
  answers: Record<string, number>; // questionId -> selectedIndex
  completedAt: any;
}
