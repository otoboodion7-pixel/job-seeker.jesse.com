
import React from 'react';
import { 
  TrendingUp, 
  Sparkles, 
  Briefcase, 
  Target, 
  ChevronRight, 
  Zap,
  Globe,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building2,
  PieChart,
  Lock,
  Trophy,
  ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthUser } from '../types';

export const Feed: React.FC<{ user: AuthUser }> = ({ user }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-200 pb-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Command Center</h1>
          <p className="text-slate-500 font-medium mt-1">Welcome back, {user.name.split(' ')[0]}. Here is your professional pulse.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/profile" className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">My Dossier</Link>
          <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Upgrade
          </button>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all"><Briefcase className="w-5 h-5" /></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Search</span>
          </div>
          <h3 className="text-3xl font-black text-slate-900 tracking-tight">{user.applicationsCount || 0}</h3>
          <p className="text-xs text-slate-500 font-bold uppercase mt-1">Live Applications</p>
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Briefcase className="w-24 h-24" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-all"><Trophy className="w-5 h-5" /></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Strength</span>
          </div>
          <h3 className="text-3xl font-black text-slate-900 tracking-tight">{user.profileData?.profileStrength || 0}%</h3>
          <p className="text-xs text-slate-500 font-bold uppercase mt-1">Dossier Visibility</p>
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Trophy className="w-24 h-24" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all"><Building2 className="w-5 h-5" /></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Linked Corps</span>
          </div>
          <h3 className="text-3xl font-black text-slate-900 tracking-tight">{user.linkedCorporations?.length || 0}</h3>
          <p className="text-xs text-slate-500 font-bold uppercase mt-1">Market Intel Nodes</p>
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Building2 className="w-24 h-24" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl group-hover:bg-amber-600 group-hover:text-white transition-all"><TrendingUp className="w-5 h-5" /></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Market</span>
          </div>
          <h3 className="text-3xl font-black text-slate-900 tracking-tight">Vibrant</h3>
          <p className="text-xs text-slate-500 font-bold uppercase mt-1">Hiring Velocity</p>
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <TrendingUp className="w-24 h-24" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Strategic Area */}
        <div className="lg:col-span-8 space-y-8">
          <section className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6 text-indigo-400">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-widest">AI Market Intelligence</span>
              </div>
              <h2 className="text-4xl font-black mb-6 tracking-tighter leading-[1.1]">The demand for <span className="text-indigo-400">{user.profileData?.preferredCategory || 'Software Architects'}</span> is surging in <span className="text-indigo-400">{user.profileData?.address || 'your region'}</span>.</h2>
              <p className="text-slate-400 text-sm max-w-xl mb-10 leading-relaxed font-medium">Job Seekers AI has indexed 14 new corporate headquarters moving into your area. Based on your LinkedIn connectivity, you are in the top 5% of candidates for these emerging roles.</p>
              
              <div className="flex flex-wrap gap-4">
                <Link to="/jobs" className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center gap-3">
                  Explore New Openings <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/business" className="px-8 py-4 bg-slate-800 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-700 transition-all border border-slate-700">
                  Scan Market Trends
                </Link>
              </div>
            </div>
            <div className="absolute -top-10 -right-10 opacity-10 pointer-events-none">
              <Globe className="w-96 h-96" />
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest flex items-center gap-2"><Building2 className="w-4 h-4 text-slate-400" /> Target Pipeline</h4>
                <Link to="/business" className="text-indigo-600 text-[10px] font-black uppercase">Analyze All</Link>
              </div>
              <div className="space-y-6">
                {['NVIDIA', 'Vercel', 'OpenAI', 'Linear'].map((co, i) => (
                  <div key={co} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 font-black text-sm group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                        {co[0]}
                      </div>
                      <div>
                        <span className="text-sm font-black text-slate-800 block">{co}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Hiring High</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest flex items-center gap-2"><PieChart className="w-4 h-4 text-slate-400" /> Competency Gap</h4>
                <button className="text-slate-400 text-[10px] font-black uppercase">Last Updated: 2h</button>
              </div>
              <div className="space-y-6">
                {[
                  { skill: 'AI Agents', status: 'Rising', val: 85, color: 'bg-indigo-600' },
                  { skill: 'Rust Lang', status: 'Niche', val: 40, color: 'bg-emerald-500' },
                  { skill: 'System Design', status: 'Standard', val: 95, color: 'bg-slate-900' }
                ].map(s => (
                  <div key={s.skill} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-700">{s.skill}</span>
                      <span className="text-[9px] font-black uppercase text-slate-400">{s.status}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                      <div className={`h-full ${s.color} transition-all duration-1000`} style={{ width: `${s.val}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/strategy" className="w-full mt-10 py-4 bg-slate-50 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all block text-center">Update Career Strategy</Link>
            </div>
          </div>
        </div>

        {/* Actionable Insights Sidebar */}
        <aside className="lg:col-span-4 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Priority Dossier Actions</h4>
            <div className="space-y-6">
              <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100 group cursor-pointer hover:shadow-lg transition-all relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-[10px] font-black text-indigo-600 uppercase mb-2">Preparation Phase</p>
                  <p className="text-sm font-black text-slate-800 leading-tight mb-4">You have a high-match interview possibility at NVIDIA. Practice your voice introduction.</p>
                  <Link to="/interview" className="inline-flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase">
                    Launch Simulator <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <Zap className="absolute -bottom-4 -right-4 w-20 h-20 text-indigo-600/5 group-hover:text-indigo-600/10 transition-colors" />
              </div>

              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 group cursor-pointer opacity-60 hover:opacity-100 transition-opacity">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Strategy Update</p>
                <p className="text-sm font-black text-slate-800 leading-tight">Your recent LinkedIn activity suggests a shift towards Product Management. Adjust target?</p>
                <div className="mt-4 flex items-center gap-2 text-[10px] font-black text-slate-900 uppercase">
                  Adjust Roadmap <Lock className="w-3 h-3" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-indigo-600 p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
            <div className="relative z-10">
              <Sparkles className="w-10 h-10 text-amber-400 mb-6" />
              <h4 className="text-2xl font-black mb-3 tracking-tight">Job Seekers AI Premium</h4>
              <p className="text-xs text-indigo-100 font-bold mb-8 leading-relaxed">Gain unlimited corporate intelligence, priority AI grounding, and 4K image generation for your personal professional brand.</p>
              <button className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl">Activate Intelligence</button>
            </div>
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-5 h-5 text-slate-400" />
              <h4 className="font-black text-[10px] uppercase tracking-widest text-slate-900">Market Feed</h4>
            </div>
            <div className="space-y-6">
              {[
                { time: '2h', msg: 'LinkedIn verified 5 new roles at Vercel' },
                { time: '4h', msg: 'Market trend: System Design demand +15%' },
                { time: '8h', msg: 'Your Dossier was viewed by 3 recruiters' }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <span className="text-[10px] font-black text-slate-300 uppercase shrink-0">{item.time}</span>
                  <p className="text-xs font-bold text-slate-600 leading-tight">{item.msg}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
