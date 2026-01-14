
import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../services/firebase';
import { Exam, Purchase, PaymentStatus } from '../../types';

const UserHome: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [myPurchases, setMyPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState<Exam | null>(null);
  const [transactionId, setTransactionId] = useState('');

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const q = query(collection(db, 'exams'), where('status', '==', 'active'));
      const snap = await getDocs(q);
      const examData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Exam));
      setExams(examData);

      const pQ = query(collection(db, 'purchases'), where('userId', '==', auth.currentUser?.uid));
      const pSnap = await getDocs(pQ);
      setMyPurchases(pSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Purchase)));
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async () => {
    if (!showPaymentModal || !transactionId) return;
    try {
      await addDoc(collection(db, 'purchases'), {
        userId: auth.currentUser?.uid,
        examId: showPaymentModal.id,
        examTitle: showPaymentModal.title,
        transactionId,
        amount: showPaymentModal.price,
        status: PaymentStatus.PENDING,
        createdAt: serverTimestamp()
      });
      alert('Payment submitted for approval!');
      setShowPaymentModal(null);
      setTransactionId('');
      fetchExams();
    } catch (e) {
      alert('Error submitting payment');
    }
  };

  const isPurchased = (examId: string) => {
    return myPurchases.find(p => p.examId === examId && p.status === PaymentStatus.APPROVED);
  };

  const isPending = (examId: string) => {
    return myPurchases.find(p => p.examId === examId && p.status === PaymentStatus.PENDING);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-slate-800">Welcome Back</h1>
        <p className="text-slate-600">Browse and attempt mock tests for your success.</p>
      </header>

      {loading ? (
        <p>Loading exams...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map(exam => (
            <div key={exam.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-slate-900">{exam.title}</h3>
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded">
                    ₹{exam.price}
                  </span>
                </div>
                <p className="text-slate-600 text-sm mb-4 line-clamp-2">{exam.description}</p>
                
                <div className="flex flex-wrap gap-4 text-xs text-slate-500 mb-6">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {exam.duration} mins
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                    {exam.qCount} Questions
                  </div>
                </div>

                {isPurchased(exam.id) ? (
                  <button className="w-full bg-emerald-600 text-white py-2 rounded-lg font-medium hover:bg-emerald-700 transition">
                    Start Test
                  </button>
                ) : isPending(exam.id) ? (
                  <button disabled className="w-full bg-slate-200 text-slate-500 py-2 rounded-lg font-medium cursor-not-allowed">
                    Payment Pending Approval
                  </button>
                ) : (
                  <button 
                    onClick={() => setShowPaymentModal(exam)}
                    className="w-full border-2 border-emerald-600 text-emerald-600 py-2 rounded-lg font-medium hover:bg-emerald-50 transition"
                  >
                    Buy Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h2 className="text-2xl font-bold mb-4">Complete Payment</h2>
            <p className="text-slate-600 mb-6">Scan the UPI QR and send ₹{showPaymentModal.price}. Submit the Transaction ID below.</p>
            
            <div className="bg-slate-100 aspect-square rounded-lg mb-6 flex items-center justify-center border-2 border-dashed border-slate-300">
               <span className="text-slate-400 font-mono text-center px-4">UPI QR CODE PLACEHOLDER<br/>(student@upi)</span>
            </div>

            <div className="space-y-4">
              <input 
                type="text"
                placeholder="Transaction ID / UTR"
                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-emerald-500 focus:border-emerald-500"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
              />
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowPaymentModal(null)}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button 
                  onClick={handlePaymentSubmit}
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserHome;
