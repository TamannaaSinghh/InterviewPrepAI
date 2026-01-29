import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { User } from './types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('interview-ai-user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('interview-ai-user');
      }
    }
    setLoading(false);
  }, []);

  // Save user to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('interview-ai-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('interview-ai-user');
    }
  }, [user]);

  const fetchUserInfo = async (accessToken: string) => {
    try {
      // Use the v3 userinfo endpoint which is more reliable
      const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }

      const data = await response.json();
      
      // Ensure we get the actual Google profile picture
      const profilePicture = data.picture;
      
      if (!profilePicture) {
        console.warn('No profile picture found in Google response:', data);
      }
      
      return {
        name: data.name || 'User',
        email: data.email || '',
        avatar: profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || 'User')}&background=CB844E&color=fff&size=128`,
      };
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw error;
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await fetchUserInfo(tokenResponse.access_token);
        setUser(userInfo);
      } catch (error) {
        console.error('Login error:', error);
        alert('Failed to login. Please try again.');
      }
    },
    onError: () => {
      console.error('Login failed');
      alert('Login failed. Please try again.');
    },
    scope: 'openid profile email', // Explicitly request profile scope to get picture
  });

  const login = () => {
    googleLogin();
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

