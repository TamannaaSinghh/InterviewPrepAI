
import React from 'react';
import { Button } from './Button';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="relative overflow-hidden bg-[#FAF9F6] min-h-[calc(100vh-80px)]">
      {/* Decorative blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-orange-100 rounded-full blur-[100px] opacity-60"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-50 rounded-full blur-[100px] opacity-60"></div>

      <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-32 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 text-[#CB844E] rounded-full text-xs font-bold mb-6 border border-orange-100">
            <span className="w-2 h-2 bg-[#CB844E] rounded-full animate-pulse"></span>
            AI Powered
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-[1.1]">
            Ace Interviews with <br />
            <span className="text-[#CB844E]">AI-Powered</span> Learning
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-xl">
            Get role-specific questions, expand answers when you need them, dive into technical docs, and personalize everything your way. From Frontend to AI/ML, your ultimate interview toolkit is here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Button onClick={onGetStarted} size="lg">
              Get Started Free
            </Button>
          </div>

          <div className="mt-12 flex items-center gap-4 justify-center md:justify-start">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <img 
                  key={i} 
                  src={`https://picsum.photos/seed/${i}/40/40`} 
                  className="w-10 h-10 rounded-full border-2 border-white"
                  alt="user"
                />
              ))}
            </div>
            <p className="text-sm text-gray-500 font-medium">
              Join <span className="text-gray-900 font-bold">2,000+</span> engineers leveling up today
            </p>
          </div>
        </div>

        <div className="flex-1 relative">
          <div className="relative z-10 rounded-2xl border-8 border-gray-900 bg-white shadow-2xl overflow-hidden aspect-[4/3] max-w-xl mx-auto transform hover:-translate-y-2 transition-transform duration-500">
             <div className="absolute top-0 left-0 right-0 h-6 bg-gray-900 flex items-center px-4 gap-1.5">
                <div className="w-2 h-2 rounded-full bg-rose-400"></div>
                <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
             </div>
             <div className="pt-8 p-6 space-y-4">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center font-bold text-emerald-600">FD</div>
                  <div>
                    <h3 className="font-bold text-lg">Frontend Developer</h3>
                    <p className="text-xs text-gray-500">React.js, Tailwind, Next.js</p>
                  </div>
                </div>
                <div className="space-y-3">
                   {[1, 2, 3].map(i => (
                     <div key={i} className="p-3 border border-gray-100 rounded-lg flex items-center justify-between text-sm">
                        <span className="text-gray-700 font-medium">Interview Question #{i}...</span>
                        <div className="w-4 h-4 rounded bg-gray-100"></div>
                     </div>
                   ))}
                </div>
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <div className="h-4 w-3/4 bg-gray-100 rounded mb-2"></div>
                  <div className="h-4 w-1/2 bg-gray-50 rounded"></div>
                </div>
             </div>
          </div>
          {/* Floating cards */}
          <div className="absolute -top-6 -right-6 glass p-4 rounded-2xl shadow-xl z-20 border border-white hidden md:block">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                   <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path></svg>
                </div>
                <div>
                   <p className="text-xs text-gray-500">Candidate Match</p>
                   <p className="text-sm font-bold text-gray-900">98% Match Score</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
