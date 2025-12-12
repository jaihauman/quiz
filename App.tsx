import React, { useState, useEffect, useCallback } from 'react';
import { AppState, QuizConfig, Question, UserAnswer, QuizResult } from './types';
import { TOPICS, DIFFICULTIES, QUESTION_COUNTS } from './constants';
import { generateQuizQuestions } from './services/geminiService';
import { LoadingScreen } from './components/LoadingScreen';
import { QuizCard } from './components/QuizCard';
import { ResultView } from './components/ResultView';
import { Icon } from './components/Icon';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [config, setConfig] = useState<QuizConfig>({
    topic: TOPICS[0].name,
    difficulty: DIFFICULTIES[1], // Default to Medium
    questionCount: 20, 
  });
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  
  // New state for custom confirmation modal
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval: number;
    if (appState === AppState.QUIZ && !showSubmitConfirm) {
      interval = window.setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [appState, showSubmitConfirm]);

  const startQuiz = async () => {
    setAppState(AppState.LOADING);
    setError(null);
    try {
      const generatedQuestions = await generateQuizQuestions(config);
      setQuestions(generatedQuestions);
      setCurrentQuestionIndex(0);
      setUserAnswers([]);
      setTimer(0);
      setShowSubmitConfirm(false);
      setAppState(AppState.QUIZ);
    } catch (err) {
      console.error(err);
      setError("क्विज बनाने में विफल। कृपया अपना कनेक्शन जांचें या कोई अन्य विषय आज़माएं।");
      setAppState(AppState.ERROR);
    }
  };

  const handleOptionSelect = (index: number) => {
    const currentQ = questions[currentQuestionIndex];
    const answer: UserAnswer = {
      questionId: currentQ.id,
      selectedOptionIndex: index,
      timeTaken: 0, 
    };

    setUserAnswers(prev => {
        const existing = prev.findIndex(a => a.questionId === currentQ.id);
        if (existing !== -1) {
            const copy = [...prev];
            copy[existing] = answer;
            return copy;
        }
        return [...prev, answer];
    });

    // Auto-advance
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      }
    }, 300); 
  };
  
  // Function to finish quiz
  const finishQuiz = () => {
      setShowSubmitConfirm(false);
      setAppState(AppState.RESULTS);
  };
  
  // Trigger the confirmation modal
  const requestSubmit = () => {
      setShowSubmitConfirm(true);
  };

  const calculateResults = (): QuizResult & { correctCount: number, wrongCount: number, skipCount: number, negativeMarks: number } => {
    let correctCount = 0;
    let wrongCount = 0;
    let skipCount = 0;
    
    const MARKS_PER_QUESTION = 2;
    const NEGATIVE_MARKING_FACTOR = 1/3;
    const NEGATIVE_MARK = MARKS_PER_QUESTION * NEGATIVE_MARKING_FACTOR; 

    questions.forEach(q => {
        const ans = userAnswers.find(a => a.questionId === q.id);
        
        if (!ans) {
            skipCount++;
        } else if (ans.selectedOptionIndex === 4) {
            skipCount++;
        } else if (ans.selectedOptionIndex === q.correctAnswerIndex) {
            correctCount++;
        } else {
            wrongCount++;
        }
    });

    const totalPositive = correctCount * MARKS_PER_QUESTION;
    const totalNegative = wrongCount * NEGATIVE_MARK;
    
    const realScore = parseFloat((totalPositive - totalNegative).toFixed(2));

    return {
        score: realScore,
        total: questions.length * MARKS_PER_QUESTION,
        accuracy: correctCount > 0 ? Math.round((correctCount / (correctCount + wrongCount)) * 100) : 0,
        answers: userAnswers,
        questions: questions,
        correctCount,
        wrongCount,
        skipCount,
        negativeMarks: parseFloat(totalNegative.toFixed(2))
    };
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderIdle = () => (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      <header className="mb-12 text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          REET<span className="text-primary-600">Mains</span> Prep
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          राजस्थान तृतीय श्रेणी शिक्षक भर्ती (Level 1 & Level 2) के लिए विशेष मॉक टेस्ट सीरीज।
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 sticky top-6">
             <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
               <Icon name="BarChart3" className="text-primary-500" /> सेटिंग्स (Settings)
             </h2>
             
             <div className="space-y-6">
                <div>
                   <label className="block text-sm font-semibold text-slate-700 mb-2">कठिनाई स्तर (Difficulty)</label>
                   <div className="grid grid-cols-2 gap-2">
                     {DIFFICULTIES.map(diff => (
                       <button
                         key={diff}
                         onClick={() => setConfig({...config, difficulty: diff})}
                         className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                           config.difficulty === diff 
                           ? 'bg-primary-600 text-white shadow-md' 
                           : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                         }`}
                       >
                         {diff}
                       </button>
                     ))}
                   </div>
                </div>

                <div>
                   <label className="block text-sm font-semibold text-slate-700 mb-2">प्रश्नों की संख्या (Count)</label>
                   <div className="flex justify-between bg-slate-100 p-1 rounded-xl">
                      {QUESTION_COUNTS.map(count => (
                         <button
                           key={count}
                           onClick={() => setConfig({...config, questionCount: count})}
                           className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                             config.questionCount === count
                             ? 'bg-white text-primary-600 shadow-sm'
                             : 'text-slate-500 hover:text-slate-700'
                           }`}
                         >
                           {count}
                         </button>
                      ))}
                   </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <div className="flex justify-between text-sm text-slate-500 mb-4">
                    <span>चयनित विषय:</span>
                    <span className="font-semibold text-slate-800 text-right text-xs max-w-[50%]">{config.topic}</span>
                  </div>
                   <button
                    onClick={startQuiz}
                    disabled={!config.topic}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white text-lg font-bold py-4 px-6 rounded-xl shadow-lg shadow-primary-200 transition-transform active:scale-95 flex items-center justify-center gap-2 group"
                   >
                     टेस्ट शुरू करें <Icon name="ArrowRight" className="group-hover:translate-x-1 transition-transform" />
                   </button>
                </div>
             </div>
          </div>
        </div>

        <div className="lg:col-span-2">
           <h2 className="text-xl font-bold text-slate-800 mb-6">विषय चुनें (Select Subject)</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {TOPICS.map(topic => (
               <button
                 key={topic.id}
                 onClick={() => setConfig({...config, topic: topic.name})}
                 className={`relative p-6 rounded-2xl border-2 text-left transition-all duration-300 group overflow-hidden ${
                   config.topic === topic.name
                   ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200 ring-offset-2'
                   : 'border-white bg-white hover:border-primary-200 hover:shadow-lg'
                 }`}
               >
                 <div className="flex items-start justify-between mb-4 relative z-10">
                    <div className={`p-3 rounded-xl ${config.topic === topic.name ? 'bg-primary-500 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-primary-100 group-hover:text-primary-600'} transition-colors`}>
                      <Icon name={topic.icon} size={24} />
                    </div>
                    {config.topic === topic.name && (
                      <div className="text-primary-600 animate-fade-in">
                        <Icon name="CheckCircle2" size={24} />
                      </div>
                    )}
                 </div>
                 <h3 className="text-lg font-bold text-slate-800 mb-1 relative z-10">{topic.name}</h3>
                 <p className="text-sm text-slate-500 leading-relaxed relative z-10">{topic.description}</p>
                 <div className={`absolute -bottom-4 -right-4 w-24 h-24 rounded-full opacity-10 transition-transform group-hover:scale-150 ${config.topic === topic.name ? 'bg-primary-500' : 'bg-slate-400'}`}></div>
               </button>
             ))}
           </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-primary-200 selection:text-primary-900">
      
      {/* Navbar */}
      {appState !== AppState.IDLE && (
        <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => {
              if (window.confirm("क्या आप वर्तमान क्विज़ छोड़ना चाहते हैं?")) setAppState(AppState.IDLE);
          }}>
             <span className="font-extrabold text-xl text-slate-900">REET<span className="text-primary-600">Mains</span></span>
          </div>
          
          {appState === AppState.QUIZ && (
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full text-sm font-medium text-slate-600">
                 <Icon name="Clock" size={16} />
                 <span className="tabular-nums">{formatTime(timer)}</span>
              </div>
              <div className="hidden md:block text-sm font-medium text-slate-500">
                 {config.difficulty} • {config.topic.substring(0, 15)}...
              </div>
            </div>
          )}
        </nav>
      )}

      {/* Main Content */}
      <main className={`transition-all duration-300 ${appState === AppState.IDLE ? '' : 'container mx-auto px-4 py-8'}`}>
        
        {appState === AppState.IDLE && renderIdle()}
        
        {appState === AppState.LOADING && <LoadingScreen topic={config.topic} />}
        
        {appState === AppState.QUIZ && questions.length > 0 && (
          <div className="max-w-4xl mx-auto animate-fade-in-up pb-24 md:pb-8">
            <QuizCard 
              question={questions[currentQuestionIndex]}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
              selectedOptionIndex={userAnswers.find(a => a.questionId === questions[currentQuestionIndex].id)?.selectedOptionIndex ?? null}
              onSelectOption={handleOptionSelect}
              onSubmitQuiz={requestSubmit} 
            />
            
            {/* Footer Controls */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-[60] md:static md:bg-transparent md:border-0 md:mt-6">
                <div className="max-w-4xl mx-auto flex justify-between items-center gap-2">
                    <button 
                    onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                    disabled={currentQuestionIndex === 0}
                    className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed py-2 px-4 rounded-lg flex items-center gap-2 font-medium shadow-sm flex-1 md:flex-none justify-center"
                    >
                    <Icon name="ChevronLeft" size={20} /> पिछला
                    </button>

                    <button 
                        onClick={requestSubmit}
                        className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 font-medium py-2 px-4 rounded-lg flex items-center gap-2 shadow-sm flex-1 md:flex-none justify-center"
                    >
                         <Icon name="CheckCircle2" size={20} /> समाप्त (Submit)
                    </button>

                    <button 
                    onClick={() => setCurrentQuestionIndex(Math.min(questions.length - 1, currentQuestionIndex + 1))}
                    disabled={currentQuestionIndex === questions.length - 1}
                    className="bg-primary-600 hover:bg-primary-700 text-white disabled:bg-slate-300 disabled:cursor-not-allowed py-2 px-6 rounded-lg flex items-center gap-2 font-medium shadow-md shadow-primary-200 flex-1 md:flex-none justify-center"
                    >
                    अगला <Icon name="ChevronRight" size={20} />
                    </button>
                </div>
            </div>
          </div>
        )}

        {appState === AppState.RESULTS && (
           <ResultView 
             result={calculateResults()}
             onRetry={startQuiz}
             onHome={() => setAppState(AppState.IDLE)}
           />
        )}

        {appState === AppState.ERROR && (
          <div className="max-w-md mx-auto text-center p-8 bg-white rounded-2xl shadow-xl border border-red-100 mt-20">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
               <Icon name="AlertCircle" size={32} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">ओह! कुछ गलत हो गया</h2>
            <p className="text-slate-600 mb-6">{error}</p>
            <button 
              onClick={() => setAppState(AppState.IDLE)}
              className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-xl w-full"
            >
              होम पर लौटें
            </button>
          </div>
        )}

        {/* Custom Confirmation Modal */}
        {showSubmitConfirm && (
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
                <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 transform transition-all scale-100">
                    <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                        <Icon name="AlertCircle" size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 text-center mb-2">टेस्ट समाप्त करें?</h3>
                    <p className="text-slate-600 text-center mb-6 text-sm">
                        क्या आप वाकई अपना टेस्ट जमा करना चाहते हैं? इसके बाद आप उत्तर नहीं बदल पाएंगे।
                    </p>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => setShowSubmitConfirm(false)}
                            className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-slate-50"
                        >
                            नहीं, रहने दें
                        </button>
                        <button 
                            onClick={finishQuiz}
                            className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 shadow-lg shadow-red-200"
                        >
                            हाँ, जमा करें
                        </button>
                    </div>
                </div>
            </div>
        )}

      </main>
    </div>
  );
};

export default App;