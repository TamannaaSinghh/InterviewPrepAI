
import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Topic, ChatMessage } from '../types';
import { Button } from './Button';
import { createPracticeChat, generateInterviewSummary } from '../geminiService';

interface PracticeViewProps {
  topic: Topic;
  onExit: () => void;
}

export const PracticeView: React.FC<PracticeViewProps> = ({ topic, onExit }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [summary, setSummary] = useState<any>(null);
  const [chat, setChat] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initChat = async () => {
      const chatInstance = createPracticeChat(topic);
      setChat(chatInstance);
      
      setIsTyping(true);
      const response = await chatInstance.sendMessage({ message: `I am ready for the ${topic.title} mock interview. My skills are ${topic.skills.join(', ')}.` });
      setMessages([{ 
        role: 'model', 
        text: response.text || '', 
        timestamp: Date.now() 
      }]);
      setIsTyping(false);
    };
    initChat();
  }, [topic]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isTyping || isEvaluating) return;

    const userMessage: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await chat.sendMessage({ message: input });
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: response.text || '', 
        timestamp: Date.now() 
      }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: "I encountered a minor glitch in the matrix. Could you repeat that?", 
        timestamp: Date.now() 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleEndSession = async () => {
    if (messages.length < 3) {
      onExit();
      return;
    }
    
    setIsEvaluating(true);
    const transcript = messages.map(m => `${m.role === 'user' ? 'Candidate' : 'Interviewer'}: ${m.text}`).join('\n\n');
    const result = await generateInterviewSummary(topic, transcript);
    setSummary(result);
    setIsEvaluating(false);
  };

  if (summary) {
    return (
      <div className="fixed inset-0 z-50 bg-[#FAF9F6] flex flex-col overflow-y-auto p-6 md:p-12">
        <div className="max-w-4xl mx-auto w-full space-y-8 animate-in zoom-in-95 duration-500">
           <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-orange-100/30">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle cx="48" cy="48" r="40" stroke="#f3f4f6" strokeWidth="8" fill="transparent" />
                    <circle cx="48" cy="48" r="40" stroke="#CB844E" strokeWidth="8" fill="transparent" 
                      strokeDasharray={251} 
                      strokeDashoffset={251 - (251 * summary.overallScore) / 100} 
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-gray-900 leading-none">{summary.overallScore}</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Score</span>
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Interview Evaluation</h1>
                  <p className="text-gray-500 font-medium">Topic: {topic.title}</p>
                </div>
              </div>
              <Button onClick={onExit} size="lg" className="rounded-full px-10">Return to Guide</Button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="w-2 h-6 bg-emerald-500 rounded-full"></span>
                  Top Strengths
                </h3>
                <ul className="space-y-4">
                  {summary.keyStrengths.map((s: string, i: number) => (
                    <li key={i} className="flex items-center gap-3 text-gray-600 font-medium bg-emerald-50/50 p-4 rounded-2xl border border-emerald-50">
                      <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="w-2 h-6 bg-rose-500 rounded-full"></span>
                  Areas to Focus
                </h3>
                <div className="space-y-4">
                  {summary.focusAreas.map((f: any, i: number) => (
                    <div key={i} className="p-4 bg-rose-50/50 rounded-2xl border border-rose-50 group transition-all hover:bg-rose-50">
                      <p className="text-gray-900 font-bold mb-1">{f.topic}</p>
                      <p className="text-xs text-rose-700/70 font-medium">{f.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
           </div>

           <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-2 h-6 bg-[#CB844E] rounded-full"></span>
                Personalized Study Plan
              </h3>
              <div className="space-y-4">
                {summary.studyPlan.map((step: string, i: number) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center font-bold text-orange-600 shrink-0 border border-orange-100 text-xs">
                      {i + 1}
                    </div>
                    <p className="text-gray-700 font-medium pt-1.5">{step}</p>
                  </div>
                ))}
              </div>
           </div>

           <div className="bg-[#CB844E] p-10 rounded-[2.5rem] text-center text-white shadow-2xl shadow-orange-200">
              <p className="text-xl font-bold mb-4">Coach's Final Word</p>
              <p className="text-orange-50 font-medium italic opacity-90">"{summary.summary}"</p>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#FAF9F6] flex flex-col">
      {/* Header */}
      <header className="glass h-20 px-6 md:px-8 flex items-center justify-between border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-lg bg-[#CB844E]`}>
            {topic.title[0]}
          </div>
          <div className="hidden xs:block">
            <h2 className="font-bold text-gray-900">{topic.title}</h2>
            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Mock Interview Mode</p>
          </div>
        </div>
        <button 
          onClick={handleEndSession}
          disabled={isEvaluating}
          className="px-6 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-gray-800 transition-all flex items-center gap-2"
        >
          {isEvaluating ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Evaluating...
            </>
          ) : 'End & Evaluate'}
        </button>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-10 space-y-8 max-w-4xl mx-auto w-full">
        {messages.map((m, idx) => (
          <div 
            key={idx} 
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-500`}
          >
            <div className={`max-w-[90%] md:max-w-[85%] flex items-start gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl flex-shrink-0 flex items-center justify-center font-bold text-[10px] ${m.role === 'user' ? 'bg-[#CB844E] text-white' : 'bg-white border border-gray-100 text-gray-400 shadow-sm'}`}>
                {m.role === 'user' ? 'YOU' : 'AI'}
              </div>
              <div className={`px-6 py-4 rounded-2xl md:rounded-[2rem] text-sm md:text-base leading-relaxed ${m.role === 'user' ? 'bg-[#CB844E] text-white shadow-xl shadow-orange-100' : 'bg-white text-gray-700 shadow-sm border border-gray-100 markdown-content'}`}>
                {m.role === 'model' ? (
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({node, ...props}) => <h1 className="text-xl font-bold mb-4 text-[#CB844E]" {...props} />,
                      h2: ({node, ...props}) => <h2 className="text-lg font-bold mb-3 border-l-4 border-[#CB844E] pl-3" {...props} />,
                      p: ({node, ...props}) => <p className="mb-4 last:mb-0" {...props} />,
                      // Fixed 'inline' property error by using className check for code blocks in react-markdown v9+
                      code: ({node, className, ...props}: any) => {
                        const match = /language-(\w+)/.exec(className || '');
                        return !match ? (
                          <code className="bg-gray-100 text-[#CB844E] px-1 rounded font-mono text-xs" {...props} />
                        ) : (
                          <pre className="bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto font-mono text-xs mb-4">
                            <code className={className} {...props} />
                          </pre>
                        );
                      }
                    }}
                  >
                    {m.text}
                  </ReactMarkdown>
                ) : m.text}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
             <div className="bg-white border border-gray-100 rounded-full px-6 py-3 flex gap-1 shadow-sm">
                <span className="w-1.5 h-1.5 bg-[#CB844E] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1.5 h-1.5 bg-[#CB844E] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-1.5 bg-[#CB844E] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 md:p-8 shrink-0 bg-gradient-to-t from-[#FAF9F6] via-[#FAF9F6] to-transparent">
        <form 
          onSubmit={handleSend}
          className="max-w-4xl mx-auto relative group"
        >
          <input 
            type="text" 
            placeholder={isEvaluating ? "Calculating your score..." : "Explain your thoughts..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping || isEvaluating}
            className="w-full h-16 md:h-20 pl-6 md:pl-8 pr-16 md:pr-24 rounded-full md:rounded-[2.5rem] bg-white border border-gray-100 shadow-xl outline-none focus:ring-4 focus:ring-orange-100 transition-all text-base md:text-lg font-medium disabled:opacity-50"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isTyping || isEvaluating}
            className="absolute right-2 md:right-3 top-2 md:top-3 bottom-2 md:bottom-3 w-12 md:w-14 bg-[#CB844E] rounded-full flex items-center justify-center text-white shadow-lg disabled:opacity-30 disabled:grayscale transition-all hover:scale-105 active:scale-95"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </button>
        </form>
        <p className="text-center text-[10px] font-bold text-gray-400 mt-4 uppercase tracking-widest">
          {isEvaluating ? 'Finalizing Performance Metrics...' : 'AI Mentor is analyzing your technical depth'}
        </p>
      </div>
    </div>
  );
};
