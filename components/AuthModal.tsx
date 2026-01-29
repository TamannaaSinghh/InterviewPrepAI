
import React, { useState } from 'react';
import { Button } from './Button';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (name: string, email: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess(name || 'Interview Candidate', email);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden p-8 md:p-12 animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {isLogin ? 'Welcome Back' : 'Join InterviewPrep'}
          </h2>
          <p className="text-gray-500 text-sm">
            {isLogin ? 'Please enter your details to log in' : 'Start your preparation journey today'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-2">Full Name</label>
              <input 
                required
                type="text" 
                placeholder="Jane Doe" 
                className="w-full h-14 px-6 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-100 transition-all"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-2">Email Address</label>
            <input 
              required
              type="email" 
              placeholder="mike@timetoprogram.com" 
              className="w-full h-14 px-6 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-100 transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="relative">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-2">Password</label>
            <input 
              required
              type="password" 
              placeholder="Min 8 Characters" 
              className="w-full h-14 px-6 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-100 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="button" className="absolute right-6 top-[48px] text-gray-400">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
            </button>
          </div>

          <Button type="submit" variant="secondary" className="w-full h-14 mt-6 text-base font-bold uppercase tracking-wider">
            {isLogin ? 'Login' : 'Sign Up'}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm">
          <span className="text-gray-500">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </span>{' '}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-[#CB844E] font-bold hover:underline"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
};
