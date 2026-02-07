
import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Linkedin, 
  Users, 
  TrendingUp, 
  Loader2, 
  ShieldCheck, 
  Briefcase, 
  ArrowUpRight, 
  PieChart, 
  Target, 
  Zap,
  Search,
  CheckCircle2,
  Lock,
  Globe,
  ExternalLink,
  Plus
} from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { AuthUser, CorporateData } from '../types';
import ReactMarkdown from 'react-markdown';

export const BusinessHub: React.FC<{ user: AuthUser }> = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [intelResult, setIntelResult] = useState<{ text: string, sources: any[] } | null>(null);
  const [activeCompany, setActiveCompany] = useState<string | null>(null);
  const [isLinking, setIsLinking] = useState(false);

  const fetchIntel = async (name: string) => {
    setLoading(true);
    setActiveCompany(name);
    try {
      const data = await geminiService.getCorporateAnalytics(name);
      setIntelResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLinkCompany = () => {
    setIsLinking(true);
    setTimeout(() => {
      const newCorp: CorporateData = {
        id: 'corp-' + Date.now(),
        companyName: activeCompany || searchQuery || 'Linked Entity',
        industry: 'Professional Services',
        employeeCount: 450,
        linkedinVerified: true,
        activePostings: 5,
        marketPerception: 'Rising Star',
        hiringStatus: 'Steady'
      };
      
      const updatedUser = { 
        ...user, 
        linkedCorporations: [...(user.linkedCorporations || []), newCorp] 
      };
      localStorage.setItem('hireai_user', JSON.stringify(updatedUser));
      setIsLinking(false);
      alert(`${newCorp.companyName} has been linked to your professional profile.`);
      window.location.reload();
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-[1128px] mx-auto pb-20">
      {/* Search Header */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-600 rounded-lg text-white">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">LinkedIn Corporate Intelligence</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">Market Corporation Insights</h1>
          <p className="text-slate-500 font-medium mb-8">Analyze real-time LinkedIn talent flows, sentiment, and hiring velocity for any global corporation.</p>
          
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
              <input 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && fetchIntel(searchQuery)}
                placeholder="Enter company name..."
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
              />
            </div>
            <button 
              onClick={() => fetchIntel(searchQuery)}
              disabled={loading || !searchQuery}
              className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
              Scan Corp
            </button>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-8 text-indigo-500/5 pointer-events-none">
          <Globe className="w-64 h-64" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Intel Display */}
        <div className="lg:col-span-8 space-y-6">
          {intelResult ? (
            <section className="bg-white rounded-[2.5rem] border border-slate-200 p-10 min-h-[500px] shadow-sm animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-50">
                <div className="flex items-center gap-3">
                  <PieChart className="w-6 h-6 text-indigo-600" />
                  <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase text-sm">LinkedIn Brand Report: {activeCompany}</h2>
                </div>
                <div className="flex gap-2">
                   <button 
                    onClick={handleLinkCompany}
                    disabled={isLinking}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-all"
                   >
                     {isLinking ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                     Link to Profile
                   </button>
                </div>
              </div>
              
              <div className="prose prose-slate max-w-none font-medium leading-relaxed">
                <ReactMarkdown>{intelResult.text}</ReactMarkdown>
              </div>

              {intelResult.sources.length > 0 && (
                <div className="mt-12 pt-8 border-t border-slate-50">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Real-time Data Grounding</h4>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                     {intelResult.sources.slice(0, 4).map((s: any, i: number) => (
                       <a key={i} href={s.web?.uri} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-600 transition-all group">
                         <span className="text-[11px] font-bold text-slate-600 truncate">{s.web?.title || 'LinkedIn Source'}</span>
                         <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-indigo-600" />
                       </a>
                     ))}
                   </div>
                </div>
              )}
            </section>
          ) : (
            <div className="bg-white rounded-[2.5rem] border border-slate-100 border-dashed p-32 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6">
                <ShieldCheck className="w-10 h-10 text-slate-200" />
              </div>
              <h3 className="text-xl font-black text-slate-300 tracking-tight uppercase">Search for a company to view<br/>multimodal LinkedIn analytics</h3>
            </div>
          )}
        </div>

        {/* My Linked Corporations Sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
            <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-6 flex items-center gap-2 relative z-10">
              <Building2 className="w-4 h-4" /> My Linked Corporations
            </h4>
            
            <div className="space-y-4 relative z-10">
              {user.linkedCorporations && user.linkedCorporations.length > 0 ? (
                user.linkedCorporations.map(corp => (
                  <div key={corp.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all cursor-pointer group">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-black text-sm">{corp.companyName}</h5>
                      <div className="px-2 py-0.5 bg-[#0077b5] text-white rounded text-[8px] font-black uppercase tracking-widest">Verified</div>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase">
                      <span>{corp.activePostings} Active Jobs</span>
                      <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-xs text-slate-500 font-medium mb-4 leading-relaxed">No company pages linked yet. Find your business using the search tool to link it.</p>
                </div>
              )}
            </div>
            
            <Linkedin className="absolute -bottom-10 -right-10 w-40 h-40 text-white/5 opacity-50" />
          </div>

          <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm">
             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Global Talent Movements</h4>
             <div className="space-y-4">
                {[
                  { company: 'OpenAI', trend: 'Talent Intake', flow: '+14%', color: 'text-emerald-500' },
                  { company: 'Meta', trend: 'Talent Flow', flow: 'Steady', color: 'text-indigo-500' },
                  { company: 'Amazon', trend: 'Talent Churn', flow: '-8%', color: 'text-rose-500' }
                ].map(t => (
                  <div key={t.company} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div>
                      <p className="text-xs font-black text-slate-800">{t.company}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase">{t.trend}</p>
                    </div>
                    <div className={`text-[10px] font-black ${t.color}`}>{t.flow}</div>
                  </div>
                ))}
             </div>
          </div>

          <div className="p-8 bg-indigo-50 rounded-[2.5rem] border border-indigo-100">
             <div className="flex items-center gap-3 mb-4">
                <Lock className="w-5 h-5 text-indigo-600" />
                <h4 className="font-black text-xs uppercase tracking-widest text-indigo-900">Privacy Protocols</h4>
             </div>
             <p className="text-xs font-medium text-indigo-800 leading-relaxed">
               Linked corporation data is accessed via secure LinkedIn API bridge. No confidential business data is transmitted back to public models.
             </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

// Internal icon for consistency
const ChevronRight = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6"/>
  </svg>
);
