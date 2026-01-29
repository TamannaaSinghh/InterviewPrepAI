
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { TopicDetail } from './components/TopicDetail';
import { PracticeView } from './components/PracticeView';
import { AuthModal } from './components/AuthModal';
import { CreateTopicModal } from './components/CreateTopicModal';
import { User, Topic, View } from './types';
import { INITIAL_TOPICS } from './constants';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<View>(View.LANDING);
  const [topics, setTopics] = useState<Topic[]>(INITIAL_TOPICS);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCreateTopic, setShowCreateTopic] = useState(false);

  // Persistence check
  useEffect(() => {
    const savedUser = localStorage.getItem('interview-ai-user');
    const savedTopics = localStorage.getItem('interview-ai-topics');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setView(View.DASHBOARD);
    }
    if (savedTopics) {
      setTopics(JSON.parse(savedTopics));
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('interview-ai-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('interview-ai-user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('interview-ai-topics', JSON.stringify(topics));
  }, [topics]);

  const handleLoginSuccess = (name: string, email: string) => {
    const newUser = {
      name,
      email,
      avatar: `https://picsum.photos/seed/${email}/100/100`
    };
    setUser(newUser);
    setShowAuthModal(false);
    setView(View.DASHBOARD);
  };

  const handleLogout = () => {
    setUser(null);
    setView(View.LANDING);
    setSelectedTopic(null);
  };

  const handleGetStarted = () => {
    if (user) {
      setView(View.DASHBOARD);
    } else {
      setShowAuthModal(true);
    }
  };

  const handleSelectTopic = (topic: Topic) => {
    setSelectedTopic(topic);
    setView(View.TOPIC_DETAIL);
  };

  const handleDeleteTopic = (id: string) => {
    setTopics(topics.filter(t => t.id !== id));
  };

  const handleAddTopic = (newTopic: Topic) => {
    setTopics([newTopic, ...topics]);
  };

  const handleUpdateTopic = (updatedTopic: Topic) => {
    setTopics(topics.map(t => t.id === updatedTopic.id ? updatedTopic : t));
    setSelectedTopic(updatedTopic);
  };

  const renderView = () => {
    switch (view) {
      case View.LANDING:
        return <LandingPage onGetStarted={handleGetStarted} />;
      case View.DASHBOARD:
        return (
          <Dashboard 
            topics={topics} 
            onSelectTopic={handleSelectTopic} 
            onDeleteTopic={handleDeleteTopic}
            onAddTopic={() => setShowCreateTopic(true)}
          />
        );
      case View.TOPIC_DETAIL:
        return selectedTopic ? (
          <TopicDetail 
            topic={selectedTopic} 
            onBack={() => setView(View.DASHBOARD)} 
            onUpdateTopic={handleUpdateTopic}
            onPractice={() => setView(View.PRACTICE)}
          />
        ) : (
          <div className="flex items-center justify-center h-screen">Loading...</div>
        );
      case View.PRACTICE:
        return selectedTopic ? (
          <PracticeView 
            topic={selectedTopic} 
            onExit={() => setView(View.TOPIC_DETAIL)} 
          />
        ) : null;
      default:
        return <LandingPage onGetStarted={handleGetStarted} />;
    }
  };

  return (
    <div className="min-h-screen">
      {view !== View.PRACTICE && (
        <Navbar 
          user={user} 
          currentView={view} 
          onNavigate={(v) => {
            if (!user && v !== View.LANDING) {
              setShowAuthModal(true);
            } else {
              setView(v);
            }
          }} 
          onLogin={() => setShowAuthModal(true)}
          onLogout={handleLogout}
        />
      )}
      
      <main>
        {renderView()}
      </main>

      {showAuthModal && (
        <AuthModal 
          onClose={() => setShowAuthModal(false)} 
          onSuccess={handleLoginSuccess}
        />
      )}

      {showCreateTopic && (
        <CreateTopicModal 
          onClose={() => setShowCreateTopic(false)}
          onCreated={handleAddTopic}
        />
      )}
    </div>
  );
};

export default App;
