import React from 'react';
import { Question } from '../types';
import { Icon } from './Icon';

interface QuizCardProps {
  question: Question;
  selectedOptionIndex: number | null;
  onSelectOption: (index: number) => void;
  onSubmitQuiz: () => void;
  questionNumber: number;
  totalQuestions: number;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  question,
  selectedOptionIndex,
  onSelectOption,
  onSubmitQuiz,
  questionNumber,
  totalQuestions,
}) => {
  const OPTION_E_INDEX = 4;
  const displayOptions = [...question.options, "अनुत्तरित प्रश्न (Question Not Attempted)"];

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 flex flex-col min-h-[500px]">
      {/* Header */}
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
        <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-slate-700 uppercase tracking-wider bg-white px-3 py-1 rounded-md border border-slate-200">
            प्रश्न {questionNumber} / {totalQuestions}
            </span>
            <div className="text-xs font-medium text-slate-400 hidden sm:block">
                (+2 Marks, -0.66 Negative)
            </div>
        </div>
        
        {/* Top Submit Button - triggers external handler which now shows modal */}
        <button 
            onClick={onSubmitQuiz}
            className="text-sm font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
        >
            <Icon name="CheckCircle2" size={16} /> समाप्त करें
        </button>
      </div>

      {/* Progress Bar */}
      <div className="h-1 w-full bg-slate-100">
        <div 
            className="h-full bg-primary-500 transition-all duration-500 ease-out"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
        ></div>
      </div>

      {/* Content */}
      <div className="p-6 md:p-8 flex-1">
        <h3 className="text-xl md:text-2xl font-medium text-slate-800 mb-8 leading-relaxed font-serif">
          {question.text}
        </h3>

        <div className="space-y-3">
          {displayOptions.map((option, index) => {
            const isOptionE = index === OPTION_E_INDEX;
            const isSelected = selectedOptionIndex === index;
            
            return (
                <button
                key={index}
                onClick={() => onSelectOption(index)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 group relative flex items-center
                    ${
                    isSelected
                        ? isOptionE 
                            ? 'border-slate-500 bg-slate-50 text-slate-900 shadow-md ring-1 ring-slate-500' // Styling for Option E selected
                            : 'border-primary-500 bg-primary-50 text-primary-900 shadow-md ring-1 ring-primary-500' // Styling for A-D selected
                        : 'border-slate-200 hover:border-primary-300 hover:bg-slate-50 text-slate-700'
                    }
                `}
                >
                <span 
                    className={`
                    w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold mr-4 transition-colors border
                    ${isSelected 
                        ? isOptionE
                            ? 'bg-slate-600 text-white border-slate-600'
                            : 'bg-primary-500 text-white border-primary-500'
                        : 'bg-white text-slate-500 border-slate-200 group-hover:border-primary-400 group-hover:text-primary-600'
                    }
                    `}
                >
                    {isOptionE ? 'E' : String.fromCharCode(65 + index)}
                </span>
                <span className={`flex-1 font-medium ${isOptionE ? 'italic text-slate-500' : ''}`}>
                    {option}
                </span>
                
                {isSelected && (
                    <div className={`absolute right-4 w-3 h-3 rounded-full shadow-sm ${isOptionE ? 'bg-slate-500' : 'bg-primary-500'}`}></div>
                )}
                </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};