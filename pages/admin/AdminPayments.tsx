
import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { Purchase, PaymentStatus } from '../../types';

const AdminPayments: React.FC = () => {
  const [pending, setPending] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    const q = query(collection(db, 'purchases'), where('status', '==', PaymentStatus.PENDING));
    const snap = await getDocs(q);
    setPending(snap.docs.map(d => ({ id: d.id, ...d.data() } as Purchase)));
    setLoading(false);
  };

  const handleAction = async (id: string, status: PaymentStatus) => {
    try {
      await updateDoc(doc(db, 'purchases', id), {
        status,
        updatedAt: serverTimestamp()
      });
      alert(`Payment ${status}`);
      fetchPayments();
    } catch (e) {
      alert('Action failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Payment Requests</h1>
      
      {loading ? (
        <p>Loading...</p>
      ) : pending.length === 0 ? (
        <div className="bg-white p-10 text-center rounded-xl border border-dashed text-slate-400">
          No pending payment requests at the moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pending.map(p => (
            <div key={p.id} className="bg-white rounded-xl border p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">₹{p.amount}</h3>
                  <p className="text-xs text-slate-500">Exam ID: {p.examId}</p>
                </div>
                <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded">PENDING</span>
              </div>
              
              <div className="bg-slate-50 p-3 rounded mb-6">
                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Transaction ID</p>
                <code className="text-slate-700 block text-sm font-mono break-all">{p.transactionId}</code>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => handleAction(p.id, PaymentStatus.APPROVED)}
                  className="flex-1 bg-emerald-600 text-white py-2 rounded font-bold hover:bg-emerald-700"
                >
                  Approve
                </button>
                <button 
                  onClick={() => handleAction(p.id, PaymentStatus.REJECTED)}
                  className="flex-1 border-2 border-red-600 text-red-600 py-2 rounded font-bold hover:bg-red-50"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPayments;
