
import React from 'react';
import { User, View } from '../types';
import { Button } from './Button';

interface NavbarProps {
  user: User | null;
  currentView: View;
  onNavigate: (view: View) => void;
  onLogin: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, currentView, onNavigate, onLogin, onLogout }) => {
  return (
    <nav className="sticky top-0 z-50 glass border-b border-gray-100 py-4 px-6 md:px-12 flex items-center justify-between">
      <div 
        className="flex items-center gap-2 cursor-pointer" 
        onClick={() => onNavigate(View.LANDING)}
      >
        <div className="w-10 h-10 bg-[#CB844E] rounded-xl flex items-center justify-center text-white font-bold text-xl">I</div>
        <span className="text-xl font-bold tracking-tight text-gray-900 hidden sm:inline-block">Interview Prep AI</span>
      </div>

      <div className="flex items-center gap-4 md:gap-8">
        {user ? (
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right">
              <p className="text-sm font-bold text-gray-900 leading-none">{user.name}</p>
              <button 
                onClick={onLogout}
                className="text-xs text-[#CB844E] font-medium hover:underline"
              >
                Logout
              </button>
            </div>
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-10 h-10 rounded-full border-2 border-gray-100 object-cover shadow-sm hover:shadow-md transition-shadow"
              onError={(e) => {
                // Fallback to a default avatar if image fails to load
                const target = e.target as HTMLImageElement;
                target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=CB844E&color=fff&size=128`;
              }}
            />
          </div>
        ) : (
          <Button onClick={onLogin} size="sm">
            Login / Sign Up
          </Button>
        )}
      </div>
    </nav>
  );
};
