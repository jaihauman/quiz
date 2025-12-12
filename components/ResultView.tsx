import React from 'react';
import { QuizResult } from '../types';
import { Icon } from './Icon';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface ExtendedQuizResult extends QuizResult {
    correctCount: number;
    wrongCount: number;
    skipCount: number;
    negativeMarks: number;
}

interface ResultViewProps {
  result: QuizResult; // We cast this inside component
  onRetry: () => void;
  onHome: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({ result, onRetry, onHome }) => {
  const extendedResult = result as ExtendedQuizResult;
  const percentage = Math.round((extendedResult.score / extendedResult.total) * 100);
  
  const chartData = [
    { name: 'सही (Correct)', value: extendedResult.correctCount, color: '#22c55e' },
    { name: 'गलत (Wrong)', value: extendedResult.wrongCount, color: '#ef4444' },
    { name: 'अनुत्तरित (Skipped)', value: extendedResult.skipCount, color: '#94a3b8' },
  ];

  const getGrade = (pct: number) => {
    if (pct >= 80) return { label: 'उत्कृष्ट (Excellent)', color: 'text-emerald-600' };
    if (pct >= 60) return { label: 'अच्छा (Good)', color: 'text-blue-600' };
    if (pct >= 40) return { label: 'औसत (Average)', color: 'text-yellow-600' };
    return { label: 'असफल (Failed)', color: 'text-red-600' };
  };

  const grade = getGrade(percentage);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up pb-12">
      
      {/* Header Card */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="p-8 md:p-12 flex flex-col md:flex-row items-center gap-12">
          
          {/* Chart */}
          <div className="relative w-64 h-64 flex-shrink-0 mx-auto md:mx-0">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-slate-800">{percentage}%</span>
              <span className={`text-xs font-bold uppercase tracking-wider mt-1 ${grade.color}`}>
                {grade.label}
              </span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="flex-1 w-full">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                 {/* Score Block */}
                 <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                    <div className="text-slate-500 text-xs font-bold uppercase mb-1">कुल अंक</div>
                    <div className="text-2xl font-bold text-slate-800">{extendedResult.score} <span className="text-xs text-slate-400">/ {extendedResult.total}</span></div>
                 </div>
                 {/* Correct Block */}
                 <div className="bg-green-50 p-4 rounded-xl border border-green-100 text-center">
                    <div className="text-green-600 text-xs font-bold uppercase mb-1">सही</div>
                    <div className="text-2xl font-bold text-green-700">{extendedResult.correctCount}</div>
                 </div>
                 {/* Wrong Block */}
                 <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-center">
                    <div className="text-red-600 text-xs font-bold uppercase mb-1">गलत</div>
                    <div className="text-2xl font-bold text-red-700">{extendedResult.wrongCount}</div>
                 </div>
                 {/* Negative Marks Block */}
                 <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 text-center">
                    <div className="text-orange-600 text-xs font-bold uppercase mb-1">नेगेटिव मार्किंग</div>
                    <div className="text-2xl font-bold text-orange-700">-{extendedResult.negativeMarks}</div>
                 </div>
            </div>

             <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={onRetry}
                  className="flex-1 bg-white border-2 border-slate-200 text-slate-700 hover:border-primary-500 hover:text-primary-600 font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Icon name="RotateCcw" size={18} /> फिर से करें (Retry)
                </button>
                <button 
                  onClick={onHome}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-primary-200 transition-all flex items-center justify-center gap-2"
                >
                   नई परीक्षा (New Quiz) <Icon name="ArrowRight" size={18} />
                </button>
             </div>
          </div>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-slate-800 px-2">पेपर विश्लेषण (Detailed Analysis)</h3>

      {/* Questions Review List */}
      <div className="space-y-6">
        {result.questions.map((q, idx) => {
          const userAnswer = result.answers.find(a => a.questionId === q.id);
          const isAttempted = userAnswer && userAnswer.selectedOptionIndex !== 4; // Not Option E
          const isCorrect = isAttempted && userAnswer?.selectedOptionIndex === q.correctAnswerIndex;
          const isSkipped = !userAnswer || userAnswer.selectedOptionIndex === 4;
          
          let statusColor = isSkipped ? 'bg-slate-100 text-slate-500' : (isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600');
          let statusIcon = isSkipped ? 'AlertCircle' : (isCorrect ? 'CheckCircle2' : 'XCircle');

          return (
            <div key={q.id} className="bg-white rounded-2xl p-6 shadow-md border border-slate-100">
               <div className="flex items-start gap-4">
                 <div className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${statusColor}`}>
                   <Icon name={statusIcon} size={20} />
                 </div>
                 <div className="flex-1">
                   <div className="flex justify-between items-start mb-4">
                        <p className="text-lg font-medium text-slate-800">
                            <span className="text-slate-400 mr-2">{idx + 1}.</span>
                            {q.text}
                        </p>
                        <span className={`text-xs font-bold px-2 py-1 rounded ml-2 whitespace-nowrap ${isCorrect ? 'bg-green-100 text-green-700' : (isSkipped ? 'bg-slate-100 text-slate-600' : 'bg-red-100 text-red-700')}`}>
                            {isCorrect ? '+2.0' : (isSkipped ? '0.0' : '-0.66')}
                        </span>
                   </div>

                   <div className="grid grid-cols-1 gap-3 mb-4">
                      {[...q.options, "Option E (Skipped)"].map((opt, optIdx) => {
                        const isOptionE = optIdx === 4;
                        if (isOptionE && !isSkipped) return null; // Don't show option E in review unless selected

                        let styleClass = "border-slate-200 text-slate-600 bg-white";
                        const isSelected = userAnswer?.selectedOptionIndex === optIdx;
                        const isActualCorrect = q.correctAnswerIndex === optIdx;

                        if (isActualCorrect) {
                          styleClass = "border-green-500 bg-green-50 text-green-800 ring-1 ring-green-500 font-medium";
                        } else if (isSelected && !isCorrect) {
                           styleClass = "border-red-400 bg-red-50 text-red-800 opacity-80";
                        } else if (isSelected && isOptionE) {
                            styleClass = "border-slate-400 bg-slate-100 text-slate-600 italic";
                        } else if (!isSelected) {
                           styleClass = "opacity-60";
                        }

                        return (
                          <div key={optIdx} className={`p-3 rounded-lg border text-sm flex items-center gap-3 ${styleClass}`}>
                             <span className="font-bold w-6">{isOptionE ? 'E' : String.fromCharCode(65 + optIdx)}</span> {opt}
                             {isActualCorrect && <Icon name="CheckCircle2" size={16} className="text-green-600 ml-auto" />}
                             {isSelected && !isCorrect && !isOptionE && <Icon name="XCircle" size={16} className="text-red-600 ml-auto" />}
                          </div>
                        )
                      })}
                   </div>

                   <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-900 flex gap-3 items-start">
                     <Icon name="BookOpen" size={18} className="mt-0.5 text-blue-500 shrink-0"/>
                     <div>
                       <span className="font-semibold block mb-1 text-blue-700">व्याख्या (Explanation)</span>
                       {q.explanation}
                     </div>
                   </div>
                 </div>
               </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};