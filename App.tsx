
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './services/firebase';

// Components & Pages (To be created)
import UserHome from './pages/user/UserHome';
import UserLogin from './pages/user/UserLogin';
import ExamWindow from './pages/user/ExamWindow';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLogin from './pages/admin/AdminLogin';
import AdminExamManager from './pages/admin/AdminExamManager';
import AdminUsers from './pages/admin/AdminUsers';
import AdminPayments from './pages/admin/AdminPayments';
import Navbar from './components/layout/Navbar';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<'user' | 'admin' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setRole(userDoc.data().role || 'user');
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {user && <Navbar role={role} />}
        <main className="flex-grow">
          <Routes>
            {/* Public/User Routes */}
            <Route path="/login" element={!user ? <UserLogin /> : <Navigate to="/" />} />
            <Route path="/" element={user ? (role === 'admin' ? <Navigate to="/admin" /> : <UserHome />) : <Navigate to="/login" />} />
            <Route path="/exam/:id" element={user && role === 'user' ? <ExamWindow /> : <Navigate to="/login" />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={!user ? <AdminLogin /> : <Navigate to="/admin" />} />
            <Route path="/admin" element={user && role === 'admin' ? <AdminDashboard /> : <Navigate to="/admin/login" />} />
            <Route path="/admin/exams" element={user && role === 'admin' ? <AdminExamManager /> : <Navigate to="/admin/login" />} />
            <Route path="/admin/users" element={user && role === 'admin' ? <AdminUsers /> : <Navigate to="/admin/login" />} />
            <Route path="/admin/payments" element={user && role === 'admin' ? <AdminPayments /> : <Navigate to="/admin/login" />} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
