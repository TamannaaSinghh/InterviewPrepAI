
import React, { useState } from 'react';
import { Topic } from '../types';
import { Button } from './Button';

interface DashboardProps {
  topics: Topic[];
  onSelectTopic: (topic: Topic) => void;
  onDeleteTopic: (id: string) => void;
  onAddTopic: () => void;
}

const getTopicColorClasses = (color: string) => {
  const map: Record<string, string> = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
    sky: 'bg-sky-50 text-sky-700 border-sky-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    violet: 'bg-violet-50 text-violet-700 border-violet-100',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  };
  return map[color] || map.emerald;
};

export const Dashboard: React.FC<DashboardProps> = ({ topics, onSelectTopic, onDeleteTopic, onAddTopic }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'IN_PROGRESS'>('ALL');

  const filteredTopics = topics.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.skills.some(s => s.toLowerCase().includes(search.toLowerCase()));
    
    if (filter === 'IN_PROGRESS') {
      const masteredCount = t.questions.filter(q => q.isMastered).length;
      return matchesSearch && masteredCount > 0;
    }
    
    return matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 pb-32">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-md w-full">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">My Preparation</h2>
          <p className="text-gray-500 mb-6">Master your next interview with personalized AI tracks.</p>
          <div className="relative">
            <input 
              type="text"
              placeholder="Search roles or skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-14 pl-12 pr-6 rounded-2xl border border-gray-100 bg-white focus:ring-4 focus:ring-orange-100 outline-none transition-all shadow-sm"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
        </div>
        <div className="flex gap-2">
           <button 
            onClick={() => setFilter('ALL')}
            className={`px-4 py-2 border rounded-xl text-sm font-bold transition-all ${filter === 'ALL' ? 'bg-[#CB844E] text-white border-[#CB844E]' : 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50'}`}
           >
             All Topics
           </button>
           <button 
            onClick={() => setFilter('IN_PROGRESS')}
            className={`px-4 py-2 border rounded-xl text-sm font-bold transition-all ${filter === 'IN_PROGRESS' ? 'bg-[#CB844E] text-white border-[#CB844E]' : 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50'}`}
           >
             In Progress
           </button>
        </div>
      </div>

      {filteredTopics.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] p-20 text-center border border-dashed border-gray-200">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No topics found</h3>
          <p className="text-gray-500 mb-8">Try adjusting your search or create a new interview path.</p>
          <Button onClick={onAddTopic}>Create New Path</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTopics.map((topic) => {
             const masteredCount = topic.questions.filter(q => q.isMastered).length;
             const progressPercent = Math.round((masteredCount / (topic.questions.length || 1)) * 100);
             
             return (
              <div 
                key={topic.id}
                onClick={() => onSelectTopic(topic)}
                className="group relative bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden transform hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-8">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-xl border-2 ${getTopicColorClasses(topic.color)} transition-transform group-hover:scale-110 duration-300`}>
                    {topic.title.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteTopic(topic.id);
                    }}
                    className="p-2 text-gray-300 hover:text-rose-500 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </div>

                <div className="mb-4">
                  <span className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-gray-100">
                    {topic.experience} Experience
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-[#CB844E] transition-colors">{topic.title}</h3>
                <p className="text-sm text-gray-500 mb-6 line-clamp-2 leading-relaxed">{topic.description}</p>

                {progressPercent > 0 && (
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-1 text-[10px] font-bold text-gray-400">
                      <span>PROGRESS</span>
                      <span>{progressPercent}%</span>
                    </div>
                    <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#CB844E]" style={{ width: `${progressPercent}%` }}></div>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mb-8">
                  {topic.skills.slice(0, 3).map(skill => (
                    <span key={skill} className="px-3 py-1 bg-gray-50 rounded-lg text-[10px] font-bold text-gray-400 uppercase tracking-widest">{skill}</span>
                  ))}
                </div>

                <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                     <span className="text-xs font-bold text-gray-900">AI Guided Track</span>
                  </div>
                  <span className="text-xs text-gray-400 font-medium italic">{topic.lastUpdated}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="fixed bottom-12 right-12 z-40">
        <Button 
          onClick={onAddTopic}
          size="lg" 
          className="rounded-full shadow-2xl flex items-center gap-2 pr-8 h-16 transform hover:scale-105"
        >
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
          </div>
          New Topic
        </Button>
      </div>
    </div>
  );
};
