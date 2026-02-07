
import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Loader2, 
  Target, 
  ShieldCheck, 
  MapPin, 
  Trophy, 
  Settings, 
  Briefcase, 
  Lock,
  Linkedin,
  Clock,
  ExternalLink,
  Building2,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { geminiService } from '../services/geminiService';
import { AuthUser, UserProfileData } from '../types';

export const Profile: React.FC<{ user: AuthUser }> = ({ user }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [profileData, setProfileData] = useState<UserProfileData>(user.profileData || {
    address: '',
    preferredCategory: '',
    education: '',
    yearsExperience: '',
    noticePeriod: '',
    workAuthorization: true,
    salaryExpectation: '',
    willingToRelocate: false,
    requiresSponsorship: false,
    industryInterests: '',
    careerGoals: '',
    relevantSkills: '',
    recentProject: '',
    workingStyle: '',
    workEnvironment: 'Remote',
    portfolioUrl: '',
    linkedinUrl: '',
    githubUrl: '',
    profileStrength: 0,
  });

  useEffect(() => {
    const fields = Object.values(profileData).filter(v => v !== '' && v !== null && v !== undefined && v !== 0);
    const totalFields = Object.keys(profileData).length - 1; // Exclude strength itself
    const baseStrength = Math.round((fields.length / totalFields) * 100);
    // Add bonus for LinkedIn connection
    const strength = user.linkedinConnected ? Math.min(100, baseStrength + 15) : baseStrength;
    
    if (strength !== profileData.profileStrength) {
      setProfileData(prev => ({ ...prev, profileStrength: strength }));
    }
  }, [profileData, user.linkedinConnected]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAnalyzing(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      try {
        await geminiService.analyzeResume(base64);
        alert("Resume analysis added to dossier. Strength updated.");
      } catch (err) { console.error(err); }
      finally { setAnalyzing(false); }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-[1128px] mx-auto space-y-6 pb-20">
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="h-48 bg-slate-900 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900/20"></div>
        </div>
        <div className="px-10 pb-10 relative">
          <div className="flex justify-between items-end -mt-16 mb-8">
            <div className="w-40 h-40 rounded-3xl border-8 border-white overflow-hidden shadow-2xl bg-slate-100 relative group">
              <img src={user.picture} alt={user.name} className="w-full h-full object-cover" />
              {user.linkedinConnected && (
                <div className="absolute top-2 right-2 p-1.5 bg-[#0077b5] rounded-lg text-white shadow-lg">
                  <Linkedin className="w-4 h-4" />
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <button className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-slate-800">Update Dossier</button>
              <button className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-400"><Settings className="w-6 h-6" /></button>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
                  {user.name}
                </h1>
                <p className="text-xl text-slate-500 mt-2 font-medium">{user.headline || profileData.preferredCategory || 'Unassigned Role'}</p>
                <div className="flex items-center gap-6 mt-6 text-slate-400 font-bold text-xs uppercase tracking-widest">
                  <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {profileData.address || 'Location Unset'}</span>
                  <span className="flex items-center gap-2"><Briefcase className="w-4 h-4" /> {profileData.workEnvironment}</span>
                </div>
              </div>

              {/* Linked Corporations Section */}
              <section className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                   <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                     <Building2 className="w-4 h-4 text-indigo-600" /> Linked Corporations
                   </h3>
                   <Link to="/business" className="p-2 hover:bg-slate-50 rounded-xl transition-all">
                      <Plus className="w-4 h-4 text-slate-400" />
                   </Link>
                </div>
                {user.linkedCorporations && user.linkedCorporations.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {user.linkedCorporations.map(corp => (
                      <Link to="/business" key={corp.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-600 transition-all flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center font-black text-slate-400 text-xs shadow-sm">
                            {corp.companyName[0]}
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-800">{corp.companyName}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">{corp.activePostings} Live Jobs</p>
                          </div>
                        </div>
                        <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-indigo-600" />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-4">No businesses linked yet</p>
                    <Link to="/business" className="inline-block px-6 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50">Link via LinkedIn</Link>
                  </div>
                )}
              </section>

              {user.linkedinConnected && user.linkedinActivity && (
                <section className="bg-[#0077b5]/5 border border-[#0077b5]/10 rounded-[2rem] p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xs font-black text-[#0077b5] uppercase tracking-widest flex items-center gap-2">
                      <Linkedin className="w-4 h-4" /> Recent LinkedIn Activity
                    </h3>
                    <ExternalLink className="w-4 h-4 text-[#0077b5]/50" />
                  </div>
                  <div className="space-y-4">
                    {user.linkedinActivity.map((activity, i) => (
                      <div key={i} className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-100">
                        <div className="p-2 bg-slate-50 rounded-lg h-fit"><Clock className="w-4 h-4 text-slate-400" /></div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{activity}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">2 hours ago</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 relative">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Lock className="w-4 h-4" /> Professional Dossier</h3>
                <p className="text-slate-700 leading-relaxed font-medium">{profileData.careerGoals || 'Complete your dossier to activate matching.'}</p>
              </div>
            </div>

            <div className="space-y-6">
              <section className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl">
                <div className="flex justify-between items-start mb-6"><h3 className="text-lg font-black tracking-tight">Market Strength</h3><Trophy className={`w-6 h-6 ${profileData.profileStrength > 80 ? 'text-amber-400' : 'text-slate-500'}`} /></div>
                <div className="text-5xl font-black mb-4">{profileData.profileStrength}%</div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-4"><div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${profileData.profileStrength}%` }}></div></div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  {user.linkedinConnected ? 'LinkedIn Sync +15% Boost Active' : 'Sync LinkedIn for +15% Boost'}
                </p>
              </section>
              <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-xl">
                <h3 className="text-lg font-black mb-2 text-white">Resume Sync</h3>
                <label className="block w-full text-center py-4 bg-white text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest cursor-pointer hover:bg-indigo-50">
                  {analyzing ? 'Analyzing...' : 'Secure Upload'}
                  <input type="file" className="hidden" onChange={handleFileUpload} />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
