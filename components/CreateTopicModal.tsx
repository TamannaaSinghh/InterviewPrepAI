
import React, { useState } from 'react';
import { Button } from './Button';
import { generateQuestions } from '../geminiService';
import { Topic, Question } from '../types';

interface CreateTopicModalProps {
  onClose: () => void;
  onCreated: (topic: Topic) => void;
}

export const CreateTopicModal: React.FC<CreateTopicModalProps> = ({ onClose, onCreated }) => {
  const [role, setRole] = useState('');
  const [experience, setExperience] = useState('2 Years');
  const [skills, setSkills] = useState('');
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    const generatedQs: Question[] = await generateQuestions(role, experience, skills);
    
    const newTopic: Topic = {
      id: Date.now().toString(),
      title: role,
      description: description || `Targeting ${role} roles with focus on ${skills}`,
      skills: skills.split(',').map(s => s.trim()),
      experience,
      qaCount: generatedQs.length,
      lastUpdated: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      questions: generatedQs,
      color: ['emerald', 'amber', 'sky', 'rose', 'violet', 'indigo'][Math.floor(Math.random() * 6)]
    };

    onCreated(newTopic);
    setIsGenerating(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden p-8 md:p-12 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Create Topic</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Target Role</label>
            <input 
              required
              type="text" 
              placeholder="e.g. Senior Frontend Engineer" 
              className="w-full h-14 px-6 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-100 transition-all text-gray-900"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Experience</label>
              <select 
                className="w-full h-14 px-6 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-100 transition-all text-gray-900"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              >
                <option>Entry Level</option>
                <option>1-2 Years</option>
                <option>3-5 Years</option>
                <option>5-8 Years</option>
                <option>8+ Years</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Skills (Comma sep)</label>
              <input 
                required
                type="text" 
                placeholder="React, AWS, Node" 
                className="w-full h-14 px-6 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-100 transition-all text-gray-900"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Focus Area / Notes</label>
            <textarea 
              placeholder="What specifically do you want to learn?"
              rows={3}
              className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-100 transition-all text-gray-900 resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <Button 
            type="submit" 
            isLoading={isGenerating} 
            className="w-full h-16 text-lg font-bold"
          >
            {isGenerating ? 'Generating Q&As with AI...' : 'Generate Interview Prep'}
          </Button>
          
          <p className="text-center text-xs text-gray-400">
            Our AI will analyze your role and skills to create 8 custom interview questions.
          </p>
        </form>
      </div>
    </div>
  );
};
