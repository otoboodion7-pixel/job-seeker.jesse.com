
import React, { useState } from 'react';
import { BrainCircuit, Target, ArrowRight, Sparkles, Loader2, Play, HelpCircle, MessageCircle, Star, Briefcase, Share2, Award, Zap } from 'lucide-react';
import { geminiService, audioUtils } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

export const CareerStrategy = () => {
  const [goal, setGoal] = useState('');
  const [current, setCurrent] = useState('');
  const [loading, setLoading] = useState(false);
  const [strategy, setStrategy] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const generateStrategy = async () => {
    if (!goal || !current) return;
    setLoading(true);
    try {
      const result = await geminiService.getCareerStrategy(goal, current);
      setStrategy(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeech = async () => {
    if (!strategy || isSpeaking) return;
    setIsSpeaking(true);
    try {
      const base64Audio = await geminiService.speakText(strategy.substring(0, 500) + "...");
      if (base64Audio) {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const decoded = audioUtils.decode(base64Audio);
        const buffer = await audioUtils.decodeAudioData(decoded, audioCtx, 24000, 1);
        const source = audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(audioCtx.destination);
        source.onended = () => setIsSpeaking(false);
        source.start();
      }
    } catch (err) {
      console.error(err);
      setIsSpeaking(false);
    }
  };

  const questionBank = [
    {
      title: "Employer Success & Role",
      icon: Target,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      questions: [
        "What does success look like in this role?",
        "How will you measure performance?",
        "What’s the onboarding process like?",
        "What’s your favorite thing about working here?"
      ]
    },
    {
      title: "Culture & Networking",
      icon: MessageCircle,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      questions: [
        "How would you describe the company culture?",
        "How does the company approach work-life harmony?",
        "What’s the most interesting project you’ve worked on lately?",
        "What’s a lesson you’ve learned the hard way in your role?"
      ]
    },
    {
      title: "Growth & Challenges",
      icon: BrainCircuit,
      color: "text-amber-600",
      bg: "bg-amber-50",
      questions: [
        "What are the biggest challenges the team is facing right now?",
        "What opportunities are available for career development?",
        "What is your greatest achievement?",
        "What’s one piece of advice you’d give your younger self?"
      ]
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 text-indigo-500/10">
          <BrainCircuit className="w-32 h-32" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">AI Career Strategy</h1>
          <p className="text-slate-500 mb-8">Using Gemini 3 Pro's deep reasoning capabilities to build your professional roadmap.</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Target Goal</label>
              <input 
                value={goal}
                onChange={e => setGoal(e.target.value)}
                placeholder="e.g. CTO at a Fintech startup, Principal AI Engineer"
                className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Current Status</label>
              <textarea 
                value={current}
                onChange={e => setCurrent(e.target.value)}
                placeholder="e.g. Mid-level web dev with 4 years experience in React and Node.js..."
                className="w-full h-32 bg-slate-50 border border-slate-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-sm font-medium"
              />
            </div>
            <button 
              onClick={generateStrategy}
              disabled={loading || !goal || !current}
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-lg shadow-indigo-100"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Target className="w-5 h-5" />}
              Generate 5-Year Strategy
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-2">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500" /> Question Bank for Interviews & Networking
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {questionBank.map((category, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 ${category.bg} ${category.color} rounded-xl flex items-center justify-center mb-4`}>
              <category.icon className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-800 mb-4">{category.title}</h3>
            <ul className="space-y-3">
              {category.questions.map((q, i) => (
                <li key={i} className="text-xs text-slate-500 leading-relaxed flex gap-2 group cursor-pointer hover:text-indigo-600 transition-colors">
                  <span className="text-indigo-400 font-bold group-hover:scale-125 transition-transform">•</span>
                  {q}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {strategy && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                <Sparkles className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Professional Roadmap</h2>
            </div>
            <button 
              onClick={handleSpeech}
              disabled={isSpeaking}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold hover:bg-indigo-100 transition-colors"
            >
              <Play className={`w-4 h-4 ${isSpeaking ? 'animate-pulse' : ''}`} />
              {isSpeaking ? 'Reading...' : 'Listen Overview'}
            </button>
          </div>
          <div className="prose prose-slate prose-sm max-w-none bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <ReactMarkdown>{strategy}</ReactMarkdown>
          </div>
          
          <div className="mt-8 flex items-center gap-4">
            <button className="flex-1 border border-slate-200 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors">Export Plan</button>
            <button className="flex-1 bg-indigo-600 py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
              Start Learning Path <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Star className="text-amber-400" /> Career Insights Toolkit
            </h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Use these prompts when reaching out to mentors or during the Q&A session of your interviews. These are curated based on industry success metrics.
            </p>
            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 group hover:bg-white/10 transition-all">
                <p className="text-xs font-bold text-indigo-400 mb-1 uppercase tracking-widest flex items-center gap-2">
                  <Share2 className="w-3 h-3" /> For Networking
                </p>
                <p className="text-sm">"What’s one piece of advice you’d give your younger self about navigating career pivots in this industry?"</p>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 group hover:bg-white/10 transition-all">
                <p className="text-xs font-bold text-rose-400 mb-1 uppercase tracking-widest flex items-center gap-2">
                  <Award className="w-3 h-3" /> For Interviews
                </p>
                <p className="text-sm">"What is your greatest achievement within this company so far, and how did the culture support that?"</p>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center justify-center">
            <div className="w-full max-w-[280px] aspect-square rounded-full border-2 border-dashed border-white/10 flex items-center justify-center relative">
              <div className="w-48 h-48 rounded-full bg-indigo-500/20 blur-3xl absolute animate-pulse"></div>
              <HelpCircle className="w-16 h-16 text-white/20 relative z-10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
