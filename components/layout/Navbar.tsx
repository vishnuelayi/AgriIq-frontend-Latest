
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../services/firebase';

interface NavbarProps {
  role: 'user' | 'admin' | null;
}

const Navbar: React.FC<NavbarProps> = ({ role }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate(role === 'admin' ? '/admin/login' : '/login');
  };

  return (
    <nav className="bg-emerald-700 text-white px-4 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold tracking-tight">Agri<span className="text-emerald-300">IQ</span></Link>
        
        <div className="flex gap-4 items-center">
          {role === 'admin' ? (
            <div className="hidden md:flex gap-6">
              <Link to="/admin" className="hover:text-emerald-200 transition">Dashboard</Link>
              <Link to="/admin/exams" className="hover:text-emerald-200 transition">Manage Exams</Link>
              <Link to="/admin/users" className="hover:text-emerald-200 transition">Users</Link>
              <Link to="/admin/payments" className="hover:text-emerald-200 transition">Payments</Link>
            </div>
          ) : (
            <div className="hidden md:flex gap-6">
              <Link to="/" className="hover:text-emerald-200 transition">My Dashboard</Link>
            </div>
          )}
          
          <button 
            onClick={handleLogout}
            className="bg-white/10 hover:bg-white/20 px-4 py-1.5 rounded-lg text-sm font-medium transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
