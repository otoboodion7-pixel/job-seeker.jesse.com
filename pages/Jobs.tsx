
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  ExternalLink, 
  Loader2, 
  Globe, 
  Briefcase, 
  CheckCircle2, 
  X, 
  ShieldCheck, 
  Building2, 
  Lock,
  ArrowRight,
  FileText,
  AlertCircle,
  TrendingUp,
  DollarSign,
  BarChart3,
  ArrowUpRight,
  Info
} from 'lucide-react';
import { geminiService } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import { AuthUser, Application } from '../types';

export const Jobs = () => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ text: string, sources: any[] } | null>(null);
  const [salaryInsights, setSalaryInsights] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<{ title: string, company: string, requirements: string[], url: string } | null>(null);
  const [applying, setApplying] = useState(false);
  
  // Screening answers
  const [screeningAnswers, setScreeningAnswers] = useState<string[]>(['', '', '']);
  const [showQuestions, setShowQuestions] = useState(false);

  const user: AuthUser = JSON.parse(localStorage.getItem('hireai_user') || '{}');

  const fetchJobs = async (q: string, l: string) => {
    setLoading(true);
    setSalaryInsights(null);
    try {
      const [jobData, salaryData] = await Promise.all([
        geminiService.searchJobs(`${q} in ${l}`),
        geminiService.getSalaryInsights(q, l)
      ]);
      setResults(jobData);
      setSalaryInsights(salaryData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(user.profileData?.preferredCategory || 'Software', user.profileData?.address || 'Global');
  }, []);

  const handleApplyClick = (title: string, company: string) => {
    setSelectedJob({
      title,
      company,
      requirements: [
        `Required verified skills in ${user.profileData?.preferredCategory}`,
        "Minimum 5 years professional track record",
        "Excellent written and verbal communication",
        `Legally authorized to work in ${location || 'Global'}`
      ],
      url: 'https://company-careers.example.com/portal/apply'
    });
    setScreeningAnswers(['', '', '']);
    setShowQuestions(false);
  };

  const startScreening = () => {
    setShowQuestions(true);
  };

  const finalizeApplication = () => {
    if (screeningAnswers.some(a => a.trim() === '')) {
      alert("Please answer all screening questions required by " + selectedJob?.company);
      return;
    }

    setApplying(true);
    setTimeout(() => {
      const saved = JSON.parse(localStorage.getItem('hireai_applications') || '[]');
      const newApp: Application = {
        id: Math.random().toString(36).substr(2, 9),
        jobTitle: selectedJob!.title,
        company: selectedJob!.company,
        location: location || 'Remote',
        status: 'Applied',
        appliedDate: new Date().toISOString(),
        url: selectedJob!.url
      };
      localStorage.setItem('hireai_applications', JSON.stringify([newApp, ...saved]));
      
      // Update user strength locally
      const updatedUser = { ...user, applicationsCount: (user.applicationsCount || 0) + 1 };
      localStorage.setItem('hireai_user', JSON.stringify(updatedUser));

      window.open(selectedJob!.url, '_blank');
      setApplying(false);
      setSelectedJob(null);
      alert(`Data Transmitted. Your profile has been sent exclusively to ${selectedJob!.company}.`);
    }, 1500);
  };

  const mockQuestions = [
    "Tell us about a time you solved a complex architectural problem.",
    "What is your expected notice period?",
    "Why are you specifically interested in our mission?"
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
            <Search className="w-5 h-5 text-slate-400" />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Title" className="bg-transparent border-none outline-none font-bold text-sm flex-1" />
          </div>
          <div className="flex-1 flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
            <MapPin className="w-5 h-5 text-slate-400" />
            <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Location" className="bg-transparent border-none outline-none font-bold text-sm flex-1" />
          </div>
          <button onClick={() => fetchJobs(query, location)} className="px-8 py-3 bg-slate-900 text-white rounded-xl font-black text-xs uppercase hover:bg-slate-800 transition-all">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center"><Loader2 className="w-12 h-12 text-slate-900 animate-spin" /></div>
      ) : (results || salaryInsights) ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {salaryInsights && (
              <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
                <div className="bg-indigo-600 p-8 text-white md:w-1/3 flex flex-col justify-between relative overflow-hidden">
                   <div className="relative z-10">
                     <div className="flex items-center gap-2 mb-4 text-indigo-200">
                       <DollarSign className="w-5 h-5" />
                       <span className="text-[10px] font-black uppercase tracking-widest">Market Valuation</span>
                     </div>
                     <h2 className="text-2xl font-black tracking-tighter leading-tight mb-2">
                       {query || user.profileData?.preferredCategory}
                     </h2>
                     <p className="text-xs text-indigo-100 font-bold opacity-80 uppercase tracking-widest">Global Benchmarks</p>
                   </div>
                   <div className="mt-8 relative z-10">
                      <div className="flex items-end gap-1">
                        <span className="text-3xl font-black">$145k</span>
                        <span className="text-xs font-bold mb-1 opacity-60">AVG/YR</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-black text-emerald-400 uppercase mt-2">
                        <ArrowUpRight className="w-3 h-3" /> 8.4% YoY Growth
                      </div>
                   </div>
                   <BarChart3 className="absolute -bottom-6 -right-6 w-32 h-32 text-white/5 opacity-50" />
                </div>
                <div className="p-8 md:w-2/3 space-y-6">
                   <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <TrendingUp className="w-3.5 h-3.5" /> Salary Range Comparison
                      </h3>
                      <button className="text-[10px] font-black text-indigo-600 uppercase flex items-center gap-1">
                        <Info className="w-3 h-3" /> Detailed Intel
                      </button>
                   </div>
                   
                   <div className="space-y-6">
                     <div className="relative pt-6 pb-2">
                        <div className="h-2 w-full bg-slate-100 rounded-full relative">
                           <div className="absolute left-[20%] right-[30%] h-full bg-indigo-500 rounded-full"></div>
                           {/* Marker for average */}
                           <div className="absolute left-[45%] -top-2 w-1 h-6 bg-slate-900 rounded-full"></div>
                        </div>
                        <div className="flex justify-between mt-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                           <span>$90k (Low)</span>
                           <span className="text-slate-900">$145k (Median)</span>
                           <span>$210k+ (High)</span>
                        </div>
                     </div>

                     <div className="prose prose-slate prose-sm max-w-none text-slate-600 font-medium leading-relaxed border-t border-slate-50 pt-4">
                        <ReactMarkdown>{salaryInsights}</ReactMarkdown>
                     </div>
                   </div>
                </div>
              </div>
            )}

            {results && (
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200">
                <div className="flex items-center gap-2 mb-6">
                   <Globe className="w-5 h-5 text-slate-400" />
                   <h3 className="font-bold text-slate-900 uppercase text-xs tracking-widest">Active Market Listings</h3>
                </div>
                <div className="prose prose-slate max-w-none font-medium leading-relaxed">
                  <ReactMarkdown>{results.text}</ReactMarkdown>
                </div>
                <div className="mt-8 pt-8 border-t flex justify-center">
                  <button onClick={() => handleApplyClick(query || "Target Role", "Market Identified Employer")} className="px-12 py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl flex items-center gap-3">
                    <Briefcase className="w-5 h-5" /> Secure Application Flow
                  </button>
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white h-fit shadow-2xl relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="font-black flex items-center gap-2 mb-4 text-emerald-400 uppercase text-xs tracking-widest">
                  <ShieldCheck className="w-4 h-4" /> Company Privacy Shield
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-bold">When you apply, Job Seekers AI bundles your Dossier and transmits it directly to the employer's HR system. Your details are never indexed or sold.</p>
                <div className="mt-6 pt-6 border-t border-white/10">
                   <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Dossier Encryption</p>
                   <p className="text-xs font-bold text-slate-300">AES-256 Military Grade</p>
                </div>
              </div>
              <Lock className="absolute -bottom-6 -right-6 w-32 h-32 text-white/5 opacity-50 group-hover:rotate-12 transition-transform duration-700" />
            </div>
            
            {results?.sources && results.sources.length > 0 && (
              <div className="bg-white p-8 rounded-[2rem] border border-slate-200">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Market Intel Sources</h4>
                <div className="space-y-3">
                   {results.sources.map((source: any, i: number) => (
                     <div key={i} className="flex items-center justify-between text-[11px] font-bold text-slate-500 hover:text-slate-900 cursor-pointer group">
                        <span className="truncate max-w-[150px]">{source.web?.title || 'Job Portal'}</span>
                        <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                     </div>
                   ))}
                </div>
              </div>
            )}

            <div className="p-8 bg-indigo-50 rounded-[2rem] border border-indigo-100">
               <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                 <ArrowRight className="w-3.5 h-3.5" /> Market Sentiment
               </h4>
               <p className="text-xs font-bold text-indigo-900 leading-relaxed">
                 Roles for "{query || user.profileData?.preferredCategory}" are currently seeing a 12% increase in remote-only availability this quarter.
               </p>
            </div>
          </aside>
        </div>
      ) : null}

      {selectedJob && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedJob(null)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh] animate-in fade-in zoom-in duration-300">
            <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Building2 className="w-6 h-6 text-indigo-400" />
                <div><h3 className="font-black leading-none">{selectedJob.title}</h3><p className="text-xs text-slate-400 uppercase tracking-widest mt-1">{selectedJob.company}</p></div>
              </div>
              <button onClick={() => setSelectedJob(null)} className="p-2 hover:bg-white/10 rounded-xl transition-all"><X className="w-6 h-6" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {!showQuestions ? (
                <>
                  <section>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Job Requirements</h4>
                    <div className="space-y-2">
                      {selectedJob.requirements.map((r, i) => (
                        <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3 text-xs font-bold text-slate-700">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" /> {r}
                        </div>
                      ))}
                    </div>
                  </section>
                  <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
                    <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2 flex items-center gap-2"><Lock className="w-3 h-3" /> Encrypted Data Package</h4>
                    <p className="text-xs text-indigo-900 font-medium leading-relaxed">The following will be sent to {selectedJob.company}: <br/><b>Name, Contact, Education, {user.profileData?.yearsExperience} years experience, Preferred Salary, and your screening answers.</b></p>
                  </div>
                </>
              ) : (
                <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><FileText className="w-3 h-3" /> Employer Questionnaire</h4>
                  {mockQuestions.map((q, i) => (
                    <div key={i} className="space-y-2">
                      <label className="text-xs font-bold text-slate-600">{q}</label>
                      <textarea 
                        value={screeningAnswers[i]} 
                        onChange={e => {
                          const newAns = [...screeningAnswers];
                          newAns[i] = e.target.value;
                          setScreeningAnswers(newAns);
                        }} 
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium h-24 focus:ring-2 focus:ring-indigo-600 outline-none transition-all" 
                        placeholder="Type your response..." 
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-200 flex gap-4">
              {!showQuestions ? (
                <button onClick={startScreening} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl hover:bg-slate-800 transition-all">Answer Questions <ArrowRight className="w-4 h-4" /></button>
              ) : (
                <button onClick={finalizeApplication} disabled={applying} className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl hover:bg-emerald-700 transition-all">
                  {applying ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                  {applying ? 'Submitting...' : 'Apply & Hand-off'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
