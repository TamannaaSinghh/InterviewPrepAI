
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Topic, Question } from '../types';
import { Button } from './Button';
import { generateDeepDive, generateConfusedExplanation, generateMoreQuestions } from '../geminiService';

interface TopicDetailProps {
  topic: Topic;
  onBack: () => void;
  onUpdateTopic: (topic: Topic) => void;
  onPractice: () => void;
}

export const TopicDetail: React.FC<TopicDetailProps> = ({ topic, onBack, onUpdateTopic, onPractice }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deepDiveData, setDeepDiveData] = useState<Record<string, string>>({});
  const [confusedData, setConfusedData] = useState<Record<string, string>>({});
  const [loadingDeepDive, setLoadingDeepDive] = useState<string | null>(null);
  const [loadingConfused, setLoadingConfused] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showLearnMore, setShowLearnMore] = useState<string | null>(null);
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);

  const masteredCount = topic.questions.filter(q => q.isMastered).length;
  const progressPercent = topic.questions.length > 0 ? Math.round((masteredCount / topic.questions.length) * 100) : 0;

  const handleLearnMore = async (q: Question) => {
    if (deepDiveData[q.id]) {
      setShowLearnMore(q.id);
      return;
    }
    setLoadingDeepDive(q.id);
    const result = await generateDeepDive(topic.title, q.question);
    setDeepDiveData(prev => ({ ...prev, [q.id]: result }));
    setLoadingDeepDive(null);
    setShowLearnMore(q.id);
  };

  const handleLoadMore = async () => {
    setLoadingMore(true);
    const existingQTexts = topic.questions.map(q => q.question);
    const moreQs = await generateMoreQuestions(topic, existingQTexts);
    
    const updatedTopic = {
      ...topic,
      questions: [...topic.questions, ...moreQs],
      qaCount: topic.questions.length + moreQs.length
    };
    
    onUpdateTopic(updatedTopic);
    setLoadingMore(false);
  };

  const handleStillConfused = async (qId: string) => {
    const question = topic.questions.find(q => q.id === qId);
    if (!question) return;

    setLoadingConfused(qId);
    const result = await generateConfusedExplanation(topic.title, question.question, deepDiveData[qId] || '');
    setConfusedData(prev => ({ ...prev, [qId]: result }));
    setLoadingConfused(null);
    
    setTimeout(() => {
      const el = document.getElementById('confused-section');
      el?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleFeedback = (qId: string) => {
    setFeedbackSuccess(qId);
    setTimeout(() => {
      setShowLearnMore(null);
      setFeedbackSuccess(null);
    }, 1500);
  };

  const toggleMastered = (qId: string) => {
    const updatedQuestions = topic.questions.map(q => 
      q.id === qId ? { ...q, isMastered: !q.isMastered } : q
    );
    onUpdateTopic({ ...topic, questions: updatedQuestions });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12">
      {/* Sidebar Info */}
      <div className="lg:w-1/3">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold text-sm mb-10 group"
        >
          <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          DASHBOARD
        </button>
        
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm sticky top-32 space-y-10">
          <div className="flex items-center gap-5">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-xl border-2 bg-orange-50 text-orange-700 border-orange-100`}>
              {topic.title.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 leading-tight">{topic.title}</h2>
              <p className="text-sm font-medium text-gray-400 mt-1 uppercase tracking-widest">{topic.experience} EXP</p>
            </div>
          </div>

          <div className="space-y-6">
             <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Mastery Progress</h4>
                  <span className="text-xs font-bold text-gray-900">{progressPercent}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                   <div 
                    className="h-full bg-orange-500 transition-all duration-700" 
                    style={{ width: `${progressPercent}%` }}
                   ></div>
                </div>
                <p className="text-[10px] text-gray-400 mt-3 font-medium">{masteredCount} of {topic.questions.length} concepts mastered</p>
             </div>

             <div>
               <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">Top Skills</h4>
               <div className="flex flex-wrap gap-2">
                 {topic.skills.map(skill => (
                   <span key={skill} className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-700">{skill}</span>
                 ))}
               </div>
             </div>

             <Button onClick={onPractice} className="w-full py-5 rounded-3xl shadow-xl shadow-orange-100/50">
                Start Mock Interview
             </Button>
          </div>
        </div>
      </div>

      {/* Questions Content */}
      <div className="lg:w-2/3 space-y-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-gray-900">Curated Interview Guide</h3>
          <div className="flex gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-500 animate-pulse"></span>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">AI Generated</span>
          </div>
        </div>

        <div className="space-y-4">
          {topic.questions.map((q, idx) => (
            <div key={q.id} className={`group bg-white rounded-3xl border ${q.isMastered ? 'border-emerald-100' : 'border-gray-100'} shadow-sm overflow-hidden transition-all duration-300`}>
              <div 
                className="p-8 cursor-pointer flex items-start gap-6 hover:bg-gray-50/50 transition-colors"
                onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}
              >
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMastered(q.id);
                  }}
                  className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${q.isMastered ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-200 text-gray-200 hover:border-orange-200'}`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                </div>
                <div className="flex-1 pr-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Question {idx + 1}</span>
                    {q.isMastered && <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 rounded-md">MASTERED</span>}
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 leading-tight">{q.question}</h4>
                </div>
                <svg 
                  className={`w-6 h-6 text-gray-300 transform transition-transform ${expandedId === q.id ? 'rotate-180' : ''}`} 
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>

              {expandedId === q.id && (
                <div className="px-8 pb-8 pt-0 border-t border-gray-50 bg-[#FCFCFB] animate-in slide-in-from-top-2 duration-300">
                  <div className="pt-8 space-y-6">
                    <div className="flex items-start gap-5">
                      <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#CB844E] font-bold text-xs flex-shrink-0 border border-gray-100">
                        ANS
                      </div>
                      <p className="text-gray-700 leading-relaxed text-base font-medium">{q.answer}</p>
                    </div>
                    
                    <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="rounded-xl gap-2 text-xs font-bold"
                        onClick={() => handleLearnMore(q)}
                        isLoading={loadingDeepDive === q.id}
                      >
                        <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                        DEEP DIVE
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="pt-10 flex justify-center">
          <Button 
            variant="outline" 
            isLoading={loadingMore}
            onClick={handleLoadMore}
            className="rounded-2xl px-10 border-dashed border-2 py-4 hover:border-orange-500 transition-all text-sm font-bold tracking-wide flex items-center gap-3"
          >
            {!loadingMore && <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>}
            {loadingMore ? 'GENERATING MORE QUESTIONS...' : 'LOAD MORE QUESTIONS'}
          </Button>
        </div>
      </div>

      {/* Deep Dive Reader (Slide Over) */}
      {showLearnMore && (
        <div className="fixed inset-0 z-[60] flex items-center justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={() => setShowLearnMore(null)}></div>
          <div className="relative w-full max-w-4xl h-full bg-white shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-500 p-8 md:p-12 lg:p-16">
            <div className="flex items-center justify-between mb-12 sticky top-0 bg-white/90 backdrop-blur-sm z-10 py-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-[#CB844E]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Technical Deep Dive</h2>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Master Class • Personalized Learning</p>
                </div>
              </div>
              <button 
                onClick={() => setShowLearnMore(null)}
                className="p-3 bg-gray-50 rounded-full hover:bg-gray-100 transition-all hover:scale-110"
              >
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <div className="markdown-content">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({node, ...props}) => <h1 className="text-4xl font-bold text-gray-900 mb-8 mt-12 border-b-2 border-orange-100 pb-4" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-10 flex items-center gap-2" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-xl font-bold text-gray-800 mb-4 mt-8" {...props} />,
                  p: ({node, ...props}) => <p className="text-gray-600 leading-[1.8] mb-6 text-lg" {...props} />,
                  ul: ({node, ...props}) => <ul className="space-y-4 mb-8 list-none pl-4" {...props} />,
                  li: ({node, ...props}) => (
                    <li className="flex items-start gap-3 text-gray-600 text-lg">
                      <span className="w-2 h-2 rounded-full bg-[#CB844E] mt-[0.7rem] shrink-0"></span>
                      <span {...props} />
                    </li>
                  ),
                  strong: ({node, ...props}) => <strong className="text-gray-900 font-bold bg-orange-50 px-1 rounded" {...props} />,
                  // Fixed 'italic' property error by using 'em' component for react-markdown v9+
                  em: ({node, ...props}) => <i className="text-gray-500 font-medium" {...props} />,
                  // Fixed 'inline' property error by using className detection for react-markdown v9+
                  code: ({node, className, ...props}: any) => {
                    const match = /language-(\w+)/.exec(className || '');
                    return !match ? (
                      <code className="bg-gray-100 text-[#CB844E] px-1.5 py-0.5 rounded font-mono text-sm" {...props} />
                    ) : (
                      <div className="relative group my-8">
                          <div className="absolute -top-3 left-4 px-2 bg-[#CB844E] text-white text-[10px] font-bold rounded uppercase tracking-widest z-10">Code Example</div>
                          <pre className="bg-gray-900 text-gray-100 p-8 rounded-3xl overflow-x-auto font-mono text-sm leading-relaxed shadow-2xl border border-gray-800">
                            <code className={className} {...props} />
                          </pre>
                        </div>
                    );
                  },
                  blockquote: ({node, ...props}) => (
                    <blockquote className="border-l-4 border-[#CB844E] pl-6 py-2 italic text-gray-500 bg-orange-50/30 rounded-r-2xl my-8" {...props} />
                  ),
                }}
              >
                {deepDiveData[showLearnMore]}
              </ReactMarkdown>

              {/* Confusion Re-explanation Section */}
              {confusedData[showLearnMore] && (
                <div id="confused-section" className="mt-16 pt-16 border-t-4 border-dashed border-orange-100 animate-in fade-in slide-in-from-bottom-8 duration-700">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold mb-8">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13.536 14.243a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM16.243 16.243a1 1 0 01-1.414 0l-.707-.707a1 1 0 111.414-1.414l.707.707a1 1 0 010 1.414z"></path></svg>
                    SIMPLIFIED BREAKDOWN
                  </div>
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({node, ...props}) => <h1 className="text-3xl font-bold text-gray-900 mb-6" {...props} />,
                      h2: ({node, ...props}) => <h2 className="text-xl font-bold text-indigo-600 mb-4" {...props} />,
                      p: ({node, ...props}) => <p className="text-gray-600 leading-relaxed mb-6 text-lg" {...props} />,
                      strong: ({node, ...props}) => <strong className="text-indigo-900 font-bold bg-indigo-50 px-1 rounded" {...props} />,
                    }}
                  >
                    {confusedData[showLearnMore]}
                  </ReactMarkdown>
                </div>
              )}
            </div>

            <div className="mt-20 pt-12 border-t border-gray-100 flex flex-col md:flex-row gap-8 pb-12">
               {feedbackSuccess === showLearnMore ? (
                 <div className="flex-1 p-8 bg-emerald-50 rounded-[2.5rem] flex flex-col items-center text-center border border-emerald-100 animate-in zoom-in-95 duration-300">
                    <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg mb-4 text-white">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <p className="text-emerald-900 font-bold text-lg">Awesome! Glad it helped.</p>
                 </div>
               ) : (
                 <div className="flex-1 p-8 bg-emerald-50 rounded-[2.5rem] flex flex-col items-center text-center border border-emerald-100">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                      <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <p className="text-emerald-900 font-bold text-lg mb-2">Did this clarify the concept?</p>
                    <p className="text-emerald-600/70 text-sm mb-6 max-w-xs">Your feedback helps our AI mentor improve its teaching style!</p>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => handleFeedback(showLearnMore!)}
                        className="px-8 py-3 bg-emerald-500 text-white rounded-full font-bold text-sm shadow-lg shadow-emerald-200 transition-all hover:scale-105 active:scale-95"
                      >
                        Yes, definitely!
                      </button>
                      <button 
                        disabled={loadingConfused === showLearnMore}
                        onClick={() => handleStillConfused(showLearnMore!)}
                        className="px-8 py-3 bg-white text-emerald-700 border border-emerald-100 rounded-full font-bold text-sm transition-all hover:bg-emerald-100/50 flex items-center gap-2 disabled:opacity-50"
                      >
                        {loadingConfused === showLearnMore && (
                          <svg className="animate-spin h-4 w-4 text-emerald-500" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        )}
                        Still confused
                      </button>
                    </div>
                 </div>
               )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
