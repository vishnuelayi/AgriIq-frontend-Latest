
import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { UserProfile } from '../../types';

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const snap = await getDocs(collection(db, 'users'));
    setUsers(snap.docs.map(d => d.data() as UserProfile));
    setLoading(false);
  };

  const toggleBlock = async (uid: string, currentStatus: boolean) => {
    await updateDoc(doc(db, 'users', uid), { blocked: !currentStatus });
    fetchUsers();
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Registered Users</h1>
      <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-bold text-slate-700">Name</th>
              <th className="px-6 py-4 font-bold text-slate-700">Phone</th>
              <th className="px-6 py-4 font-bold text-slate-700">Role</th>
              <th className="px-6 py-4 font-bold text-slate-700">Status</th>
              <th className="px-6 py-4 font-bold text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.uid} className="border-b last:border-0">
                <td className="px-6 py-4">{u.name}</td>
                <td className="px-6 py-4">{u.phone}</td>
                <td className="px-6 py-4 capitalize">{u.role}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${u.blocked ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {u.blocked ? 'BLOCKED' : 'ACTIVE'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => toggleBlock(u.uid, u.blocked)}
                    className={`text-sm font-bold ${u.blocked ? 'text-emerald-600' : 'text-red-600'}`}
                  >
                    {u.blocked ? 'Unblock' : 'Block User'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
