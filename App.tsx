
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { TopicDetail } from './components/TopicDetail';
import { PracticeView } from './components/PracticeView';
import { AuthModal } from './components/AuthModal';
import { CreateTopicModal } from './components/CreateTopicModal';
import { useAuth } from './AuthContext';
import { Topic, View } from './types';
import { INITIAL_TOPICS } from './constants';

const App: React.FC = () => {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const [view, setView] = useState<View>(View.LANDING);
  const [topics, setTopics] = useState<Topic[]>(INITIAL_TOPICS);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCreateTopic, setShowCreateTopic] = useState(false);

  // Persistence check for topics
  useEffect(() => {
    const savedTopics = localStorage.getItem('interview-ai-topics');
    if (savedTopics) {
      setTopics(JSON.parse(savedTopics));
    }
    // If user is authenticated, show dashboard
    if (isAuthenticated && !loading) {
      setView(View.DASHBOARD);
    }
  }, [isAuthenticated, loading]);

  useEffect(() => {
    localStorage.setItem('interview-ai-topics', JSON.stringify(topics));
  }, [topics]);

  // Close auth modal when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated && showAuthModal) {
      setShowAuthModal(false);
      setView(View.DASHBOARD);
    }
  }, [isAuthenticated, showAuthModal]);

  const handleLogout = () => {
    logout();
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

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

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
