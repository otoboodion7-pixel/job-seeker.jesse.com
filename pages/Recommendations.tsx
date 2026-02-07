
import React, { useState, useEffect } from 'react';
import { Sparkles, BrainCircuit, ArrowRight, Loader2, Star, Zap } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

export const Recommendations = () => {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<string | null>(null);

  const fetchRecs = async () => {
    setLoading(true);
    try {
      // Mock user profile
      const profile = "Senior Frontend Developer with 6 years of experience in React, TypeScript, and AI integrations. Interested in Fintech and Healthtech.";
      const data = await geminiService.getRecommendations(profile);
      setRecommendations(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-600 to-violet-700 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-indigo-200" />
            <h1 className="text-3xl font-bold">AI Career Navigator</h1>
          </div>
          <p className="text-indigo-100 max-w-xl text-lg mb-6">
            Gemini is analyzing market trends and your unique profile to find the most high-impact opportunities for your next move.
          </p>
          <button 
            onClick={fetchRecs}
            disabled={loading}
            className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Zap className="w-5 h-5" />}
            Refresh Recommendations
          </button>
        </div>
        <div className="absolute top-0 right-0 p-8 text-white/5">
          <BrainCircuit className="w-64 h-64" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="bg-white rounded-3xl p-20 border border-slate-200 flex flex-col items-center text-center">
            <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mb-6" />
            <h2 className="text-2xl font-bold text-slate-800">Processing Your Profile</h2>
            <p className="text-slate-500">Comparing your skills with global job market demand...</p>
          </div>
        ) : recommendations ? (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm prose prose-indigo max-w-none">
            <ReactMarkdown>{recommendations}</ReactMarkdown>
          </div>
        ) : null}
      </div>

      <div className="bg-slate-900 rounded-3xl p-8 text-white">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Star className="text-amber-400" /> Skills to Master for 2024
        </h3>
        <div className="flex flex-wrap gap-3">
          {['LLM Integration', 'System Design', 'Serverless Arch', 'Vector DBs', 'Cybersecurity', 'Rust'].map(skill => (
            <span key={skill} className="px-4 py-2 bg-white/10 rounded-full text-sm font-bold border border-white/10">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
