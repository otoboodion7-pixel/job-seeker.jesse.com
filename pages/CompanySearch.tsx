
import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Building2, 
  Navigation, 
  Loader2, 
  Search as SearchIcon, 
  ExternalLink, 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  Briefcase,
  Info,
  ChevronRight,
  Globe,
  DollarSign,
  Heart
} from 'lucide-react';
import { geminiService } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

type SearchMode = 'nearby' | 'intel';

export const CompanySearch = () => {
  const [mode, setMode] = useState<SearchMode>('intel');
  const [loading, setLoading] = useState(false);
  
  // Nearby State
  const [industry, setIndustry] = useState('Tech');
  const [locationData, setLocationData] = useState<{lat: number, lng: number} | null>(null);
  const [nearbyResults, setNearbyResults] = useState<{text: string, sources: any[]} | null>(null);

  // Intel State
  const [companyName, setCompanyName] = useState('');
  const [intelResult, setIntelResult] = useState<{text: string, sources: any[]} | null>(null);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocationData({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => {
          console.error(err);
          setLocationData({ lat: 37.7749, lng: -122.4194 }); // Fallback to SF
        }
      );
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const searchNearby = async () => {
    if (!locationData) return;
    setLoading(true);
    setNearbyResults(null);
    try {
      const data = await geminiService.findNearbyCompanies(locationData.lat, locationData.lng, industry);
      setNearbyResults(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getIntel = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!companyName.trim()) return;
    setLoading(true);
    setIntelResult(null);
    try {
      const data = await geminiService.getCompanyInsights(companyName);
      setIntelResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (locationData && mode === 'nearby') searchNearby();
  }, [locationData, mode]);

  return (
    <div className="space-y-6 max-w-[1128px] mx-auto">
      {/* Header Controls */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-100">
          <button 
            onClick={() => setMode('intel')}
            className={`flex-1 py-5 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${mode === 'intel' ? 'text-slate-900 bg-white' : 'text-slate-400 bg-slate-50/50 hover:bg-slate-50'}`}
          >
            <Info className="w-4 h-4" /> Company Intel
          </button>
          <button 
            onClick={() => setMode('nearby')}
            className={`flex-1 py-5 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${mode === 'nearby' ? 'text-slate-900 bg-white' : 'text-slate-400 bg-slate-50/50 hover:bg-slate-50'}`}
          >
            <Navigation className="w-4 h-4" /> Nearby Hubs
          </button>
        </div>

        <div className="p-8">
          {mode === 'intel' ? (
            <form onSubmit={getIntel} className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input 
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  placeholder="Enter company name (e.g. NVIDIA, Stripe, Tesla)"
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-800 outline-none focus:ring-2 focus:ring-slate-900 transition-all"
                />
              </div>
              <button 
                type="submit"
                disabled={loading || !companyName.trim()}
                className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all disabled:opacity-50 shadow-xl"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Generate AI Report'}
              </button>
            </form>
          ) : (
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 flex items-center gap-3 px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100">
                <Briefcase className="w-5 h-5 text-slate-400" />
                <select 
                  value={industry}
                  onChange={e => setIndustry(e.target.value)}
                  className="bg-transparent border-none outline-none font-bold text-sm w-full appearance-none"
                >
                  <option>Tech & Engineering</option>
                  <option>Finance & Fintech</option>
                  <option>Healthcare</option>
                  <option>Energy</option>
                </select>
              </div>
              <button 
                onClick={searchNearby}
                disabled={loading}
                className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Scan Location'}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {loading ? (
            <div className="bg-white rounded-[2.5rem] border border-slate-200 p-20 flex flex-col items-center text-center animate-pulse">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                <Globe className="w-10 h-10 text-slate-300 animate-spin" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">AI Deep Dive</h2>
              <p className="text-slate-400 text-xs font-bold uppercase mt-2 tracking-widest">Aggregating reviews, culture, and market data...</p>
            </div>
          ) : mode === 'intel' && intelResult ? (
            <div className="space-y-6">
              <div className="bg-indigo-600 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4 text-indigo-200">
                    <TrendingUp className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Verified Market Intel</span>
                  </div>
                  <h2 className="text-4xl font-black tracking-tighter mb-4">{companyName} Strategy Profile</h2>
                  <div className="flex gap-4 mb-8">
                     <span className="flex items-center gap-2 text-xs font-bold bg-white/10 px-4 py-2 rounded-full border border-white/10"><Heart className="w-3 h-3 text-rose-400" /> Culture Check</span>
                     <span className="flex items-center gap-2 text-xs font-bold bg-white/10 px-4 py-2 rounded-full border border-white/10"><DollarSign className="w-3 h-3 text-emerald-400" /> Salary Benchmarks</span>
                  </div>
                  <div className="prose prose-invert prose-sm max-w-none text-indigo-50 font-medium leading-relaxed">
                    <ReactMarkdown>{intelResult.text}</ReactMarkdown>
                  </div>
                </div>
                <Building2 className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5 opacity-50 rotate-12" />
              </div>

              {intelResult.sources.length > 0 && (
                <div className="bg-white p-8 rounded-[2rem] border border-slate-200">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Verified Grounding Points</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {intelResult.sources.map((s: any, i: number) => (
                      <a 
                        key={i} 
                        href={s.web?.uri} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-900 group transition-all"
                      >
                        <span className="text-xs font-bold text-slate-700 truncate">{s.web?.title || 'Data Source'}</span>
                        <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-slate-900" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : mode === 'nearby' && nearbyResults ? (
            <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-2 mb-8 text-slate-400">
                <MapPin className="w-5 h-5 text-rose-500" />
                <h2 className="font-black text-xs uppercase tracking-widest">Office Locations in your region</h2>
              </div>
              <div className="prose prose-slate max-w-none font-medium leading-relaxed">
                <ReactMarkdown>{nearbyResults.text}</ReactMarkdown>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-[2.5rem] border border-slate-100 border-dashed p-20 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mb-6">
                <SearchIcon className="w-8 h-8 text-slate-200" />
              </div>
              <h3 className="text-xl font-black text-slate-300 tracking-tight uppercase">Enter a query to start AI research</h3>
            </div>
          )}
        </div>

        <aside className="lg:col-span-4 space-y-8">
          {mode === 'intel' && intelResult && (
             <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-xl">
               <h4 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                 <ShieldCheck className="w-4 h-4" /> Recruiters Guide
               </h4>
               <p className="text-sm font-medium text-slate-300 leading-relaxed mb-6">
                 Based on these insights, our AI suggests highlighting your <b>{companyName.includes('NVIDIA') ? 'Parallel Computing' : 'System Design'}</b> skills when reaching out.
               </p>
               <button className="w-full py-4 bg-white/10 border border-white/10 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white/20 transition-all">
                 Generate Outreach Email
               </button>
             </div>
          )}

          <div className="bg-white p-8 rounded-[2rem] border border-slate-200">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Trending Searches</h4>
            <div className="space-y-3">
              {['NVIDIA', 'Stripe', 'Anthropic', 'OpenAI', 'Linear'].map(co => (
                <button 
                  key={co} 
                  onClick={() => { setCompanyName(co); getIntel(); }}
                  className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center font-black text-slate-400 text-[10px]">{co[0]}</div>
                    <span className="text-xs font-bold text-slate-700">{co}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </div>

          <div className="p-8 bg-indigo-50 rounded-[2rem] border border-indigo-100">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-5 h-5 text-indigo-600" />
              <h4 className="font-black text-xs uppercase tracking-widest text-indigo-900">Expert Insights</h4>
            </div>
            <p className="text-xs font-medium text-indigo-800 leading-relaxed">
              Always cross-reference employee reviews with recent financial news. AI reports aggregate large amounts of data to find the "middle ground" of truth.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};
