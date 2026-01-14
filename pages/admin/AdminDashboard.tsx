
import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, count } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    users: 0,
    exams: 0,
    revenue: 0,
    attempts: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      const usersSnap = await getDocs(collection(db, 'users'));
      const examsSnap = await getDocs(collection(db, 'exams'));
      const purchasesSnap = await getDocs(query(collection(db, 'purchases'), where('status', '==', 'approved')));
      const attemptsSnap = await getDocs(collection(db, 'attempts'));

      let totalRevenue = 0;
      purchasesSnap.forEach(doc => totalRevenue += doc.data().amount || 0);

      setStats({
        users: usersSnap.size,
        exams: examsSnap.size,
        revenue: totalRevenue,
        attempts: attemptsSnap.size
      });
    };
    fetchStats();
  }, []);

  const data = [
    { name: 'Users', count: stats.users },
    { name: 'Exams', count: stats.exams },
    { name: 'Attempts', count: stats.attempts },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Students" value={stats.users} color="blue" />
        <StatCard title="Total Revenue" value={`₹${stats.revenue}`} color="emerald" />
        <StatCard title="Live Exams" value={stats.exams} color="purple" />
        <StatCard title="Total Attempts" value={stats.attempts} color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <h3 className="text-lg font-bold mb-6">Platform Activity</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <h3 className="text-lg font-bold mb-4">Quick Links</h3>
          <div className="space-y-3">
            <QuickLink href="/#/admin/exams" label="Create New Mock Test" icon="📝" />
            <QuickLink href="/#/admin/payments" label="Review Pending Payments" icon="💰" />
            <QuickLink href="/#/admin/users" label="Manage User Access" icon="👥" />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color }: { title: string, value: string | number, color: string }) => {
  const colors: any = {
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600'
  };
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
      <h4 className="text-2xl font-bold text-slate-800">{value}</h4>
      <div className={`mt-4 w-12 h-1 rounded-full ${colors[color].split(' ')[1].replace('text', 'bg')}`}></div>
    </div>
  );
};

const QuickLink = ({ href, label, icon }: { href: string, label: string, icon: string }) => (
  <a href={href} className="flex items-center p-3 rounded-lg border hover:bg-slate-50 transition gap-3 text-slate-700">
    <span className="text-xl">{icon}</span>
    <span className="font-medium">{label}</span>
  </a>
);

export default AdminDashboard;
