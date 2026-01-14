
import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { Exam, ExamStatus, Question } from '../../types';

const AdminExamManager: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Exam>>({
    title: '',
    description: '',
    price: 0,
    duration: 60,
    qCount: 0,
    status: ExamStatus.ACTIVE,
    questions: []
  });

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    const snap = await getDocs(collection(db, 'exams'));
    setExams(snap.docs.map(d => ({ id: d.id, ...d.data() } as Exam)));
  };

  const addQuestion = () => {
    const newQ: Question = {
      id: Math.random().toString(36).substr(2, 9),
      text: '',
      options: ['', '', '', ''],
      correctIndex: 0
    };
    setFormData({ ...formData, questions: [...(formData.questions || []), newQ], qCount: (formData.qCount || 0) + 1 });
  };

  const handleSave = async () => {
    if (!formData.title) return alert('Title required');
    try {
      if (formData.id) {
        await updateDoc(doc(db, 'exams', formData.id), { ...formData, updatedAt: serverTimestamp() });
      } else {
        await addDoc(collection(db, 'exams'), { ...formData, createdAt: serverTimestamp() });
      }
      setIsEditing(false);
      fetchExams();
    } catch (e) {
      alert('Error saving exam');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Exam Management</h1>
        {!isEditing && (
          <button 
            onClick={() => {
              setFormData({ title: '', questions: [], qCount: 0, price: 0, duration: 60, status: ExamStatus.ACTIVE });
              setIsEditing(true);
            }}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold"
          >
            Create Exam
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="bg-white rounded-xl border p-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-bold text-slate-700">Exam Title</span>
                <input 
                  type="text" 
                  className="mt-1 block w-full border border-slate-300 rounded-md px-4 py-2"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </label>
              <label className="block">
                <span className="text-sm font-bold text-slate-700">Price (INR)</span>
                <input 
                  type="number" 
                  className="mt-1 block w-full border border-slate-300 rounded-md px-4 py-2"
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                />
              </label>
            </div>
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-bold text-slate-700">Duration (Minutes)</span>
                <input 
                  type="number" 
                  className="mt-1 block w-full border border-slate-300 rounded-md px-4 py-2"
                  value={formData.duration}
                  onChange={e => setFormData({...formData, duration: Number(e.target.value)})}
                />
              </label>
              <label className="block">
                <span className="text-sm font-bold text-slate-700">Status</span>
                <select 
                  className="mt-1 block w-full border border-slate-300 rounded-md px-4 py-2"
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value as ExamStatus})}
                >
                  <option value={ExamStatus.ACTIVE}>Active</option>
                  <option value={ExamStatus.ARCHIVED}>Archived</option>
                </select>
              </label>
            </div>
          </div>

          <div className="border-t pt-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Questions ({formData.questions?.length})</h3>
              <button onClick={addQuestion} className="text-emerald-600 font-bold">+ Add Question</button>
            </div>

            <div className="space-y-8">
              {formData.questions?.map((q, qIdx) => (
                <div key={q.id} className="p-6 bg-slate-50 rounded-lg border">
                  <input 
                    type="text"
                    placeholder="Enter question text..."
                    className="w-full text-lg font-medium p-3 mb-4 rounded border border-slate-200"
                    value={q.text}
                    onChange={e => {
                      const qs = [...formData.questions!];
                      qs[qIdx].text = e.target.value;
                      setFormData({...formData, questions: qs});
                    }}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {q.options.map((opt, oIdx) => (
                      <div key={oIdx} className="flex items-center gap-2">
                        <input 
                          type="radio" 
                          name={`correct-${q.id}`} 
                          checked={q.correctIndex === oIdx}
                          onChange={() => {
                            const qs = [...formData.questions!];
                            qs[qIdx].correctIndex = oIdx;
                            setFormData({...formData, questions: qs});
                          }}
                        />
                        <input 
                          type="text" 
                          placeholder={`Option ${String.fromCharCode(65 + oIdx)}`}
                          className="flex-1 p-2 border border-slate-200 rounded text-sm"
                          value={opt}
                          onChange={e => {
                            const qs = [...formData.questions!];
                            qs[qIdx].options[oIdx] = e.target.value;
                            setFormData({...formData, questions: qs});
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 flex gap-4">
            <button onClick={handleSave} className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-bold">Save Exam</button>
            <button onClick={() => setIsEditing(false)} className="px-8 py-3 border rounded-lg font-bold">Cancel</button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-700">Exam Title</th>
                <th className="px-6 py-4 font-bold text-slate-700">Price</th>
                <th className="px-6 py-4 font-bold text-slate-700">Duration</th>
                <th className="px-6 py-4 font-bold text-slate-700">Questions</th>
                <th className="px-6 py-4 font-bold text-slate-700">Status</th>
                <th className="px-6 py-4 font-bold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {exams.map(exam => (
                <tr key={exam.id} className="border-b last:border-0 hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium">{exam.title}</td>
                  <td className="px-6 py-4">₹{exam.price}</td>
                  <td className="px-6 py-4">{exam.duration}m</td>
                  <td className="px-6 py-4">{exam.qCount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${exam.status === ExamStatus.ACTIVE ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {exam.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => { setFormData(exam); setIsEditing(true); }} className="text-blue-600 mr-4 font-medium">Edit</button>
                    <button onClick={async () => { if(confirm('Delete?')) { await deleteDoc(doc(db, 'exams', exam.id!)); fetchExams(); }}} className="text-red-600 font-medium">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminExamManager;
