
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../services/firebase';
import { Exam, Question } from '../../types';

const ExamWindow: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState<Exam | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [marked, setMarked] = useState<Set<number>>(new Set());
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchExam = async () => {
      const docRef = doc(db, 'exams', id!);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data() as Exam;
        setExam(data);
        setTimeLeft(data.duration * 60);
      }
    };
    fetchExam();
  }, [id]);

  const submitExam = useCallback(async () => {
    if (!exam || submitting) return;
    setSubmitting(true);
    
    // Calculate Score
    let score = 0;
    exam.questions.forEach((q) => {
      if (answers[q.id] !== undefined) {
        if (answers[q.id] === q.correctIndex) {
          score += 1;
        } else {
          score -= (1 / 3);
        }
      }
    });

    try {
      await setDoc(doc(db, 'attempts', `${auth.currentUser?.uid}_${exam.id}`), {
        userId: auth.currentUser?.uid,
        examId: exam.id,
        examTitle: exam.title,
        score,
        answers,
        completedAt: serverTimestamp()
      });
      alert(`Exam Submitted! Your score: ${score.toFixed(2)}`);
      navigate('/');
    } catch (e) {
      alert('Error submitting exam');
    } finally {
      setSubmitting(false);
    }
  }, [exam, answers, submitting, navigate]);

  useEffect(() => {
    if (timeLeft <= 0 && exam) {
      submitExam();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, exam, submitExam]);

  if (!exam) return <div className="p-10">Loading exam content...</div>;

  const q = exam.questions[currentQ];
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const toggleMark = (idx: number) => {
    const next = new Set(marked);
    if (next.has(idx)) next.delete(idx);
    else next.add(idx);
    setMarked(next);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div>
          <h2 className="text-xl font-bold">{exam.title}</h2>
          <p className="text-xs text-slate-500">Question {currentQ + 1} of {exam.qCount}</p>
        </div>
        <div className={`px-4 py-2 rounded-lg font-mono text-lg font-bold ${timeLeft < 300 ? 'text-red-600 animate-pulse' : 'text-emerald-700'}`}>
          {formatTime(timeLeft)}
        </div>
        <button 
          onClick={() => window.confirm('Are you sure you want to submit?') && submitExam()}
          className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-emerald-700"
        >
          Finish
        </button>
      </div>

      <div className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full p-4 gap-6">
        {/* Main Question Area */}
        <div className="flex-1 bg-white rounded-xl shadow-sm p-8 border">
          <div className="mb-6 flex justify-between items-start">
            <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded text-xs font-bold">
              Q{currentQ + 1}
            </span>
            <button 
              onClick={() => toggleMark(currentQ)}
              className={`text-xs font-medium px-3 py-1 rounded border transition ${marked.has(currentQ) ? 'bg-orange-100 border-orange-400 text-orange-700' : 'text-slate-400 border-slate-200'}`}
            >
              {marked.has(currentQ) ? 'Marked for Review' : 'Mark for Review'}
            </button>
          </div>

          <h3 className="text-xl text-slate-800 mb-10 leading-relaxed font-medium">
            {q.text}
          </h3>

          <div className="space-y-4">
            {q.options.map((option, idx) => (
              <label 
                key={idx}
                className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition ${answers[q.id] === idx ? 'border-emerald-500 bg-emerald-50 text-emerald-900' : 'border-slate-100 hover:border-slate-300 bg-slate-50'}`}
              >
                <input 
                  type="radio"
                  className="hidden"
                  name="option"
                  checked={answers[q.id] === idx}
                  onChange={() => setAnswers({...answers, [q.id]: idx})}
                />
                <span className={`w-8 h-8 flex items-center justify-center rounded-full border mr-4 font-bold ${answers[q.id] === idx ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white text-slate-400'}`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="font-medium">{option}</span>
              </label>
            ))}
          </div>

          <div className="mt-12 flex justify-between">
            <button 
              disabled={currentQ === 0}
              onClick={() => setCurrentQ(prev => prev - 1)}
              className="px-6 py-2 rounded-lg border border-slate-300 font-medium disabled:opacity-30"
            >
              Previous
            </button>
            <button 
              onClick={() => currentQ < exam.qCount - 1 ? setCurrentQ(prev => prev + 1) : null}
              className="px-6 py-2 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700"
            >
              {currentQ === exam.qCount - 1 ? 'End Section' : 'Next Question'}
            </button>
          </div>
        </div>

        {/* Sidebar / Palette */}
        <div className="w-full md:w-80 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h4 className="font-bold text-slate-700 mb-4">Question Palette</h4>
            <div className="grid grid-cols-5 gap-2">
              {exam.questions.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentQ(idx)}
                  className={`h-10 rounded text-sm font-bold border transition ${
                    currentQ === idx ? 'ring-2 ring-emerald-500' : ''
                  } ${
                    marked.has(idx) ? 'bg-orange-400 text-white border-orange-500' :
                    answers[exam.questions[idx].id] !== undefined ? 'bg-emerald-500 text-white border-emerald-600' :
                    'bg-slate-100 text-slate-500 border-slate-200'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
            
            <div className="mt-6 pt-6 border-t text-xs space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-emerald-500"></div> <span>Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-orange-400"></div> <span>Marked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-slate-100 border"></div> <span>Not Visited / No Answer</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamWindow;
