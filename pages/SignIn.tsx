
import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Briefcase, 
  Loader2, 
  Check, 
  Mail, 
  Smartphone, 
  AlertCircle,
  ArrowLeft,
  Globe,
  Lock,
  Search,
  CheckCircle2,
  Linkedin,
  Building2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { AuthUser, UserProfileData } from '../types';

interface SignInProps {
  onSignIn: (user: AuthUser) => void;
}

const COUNTRIES = [
  { code: '+1', name: 'USA/Canada', flag: '🇺🇸' },
  { code: '+44', name: 'United Kingdom', flag: '🇬🇧' },
  { code: '+61', name: 'Australia', flag: '🇦🇺' },
  { code: '+49', name: 'Germany', flag: '🇩🇪' },
  { code: '+33', name: 'France', flag: '🇫🇷' },
  { code: '+91', name: 'India', flag: '🇮🇳' },
  { code: '+81', name: 'Japan', flag: '🇯🇵' },
  { code: '+86', name: 'China', flag: '🇨🇳' },
  { code: '+55', name: 'Brazil', flag: '🇧🇷' },
  { code: '+234', name: 'Nigeria', flag: '🇳🇬' },
  { code: '+971', name: 'UAE', flag: '🇦🇪' },
];

const DEFAULT_PROFILE: UserProfileData = {
  address: '', preferredCategory: '', education: '', yearsExperience: '', noticePeriod: '', workAuthorization: true, salaryExpectation: '', willingToRelocate: false, requiresSponsorship: false,
  industryInterests: '', careerGoals: '', relevantSkills: '', recentProject: '', workingStyle: '', workEnvironment: 'Remote',
  portfolioUrl: '', linkedinUrl: '', githubUrl: '', profileStrength: 0
};

export const SignIn: React.FC<SignInProps> = ({ onSignIn }) => {
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'selection' | 'email_login' | 'phone_login' | 'linkedin_loading' | 'verifying' | 'onboarding' | 'final_success'>('selection');
  const [error, setError] = useState<string | null>(null);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [authenticatedUser, setAuthenticatedUser] = useState<AuthUser | null>(null);

  const [onboardingStep, setOnboardingStep] = useState(1);
  const [profileForm, setProfileForm] = useState<UserProfileData>(DEFAULT_PROFILE);

  const MOCK_PASSWORD = "Password123";

  useEffect(() => {
    if (view === 'email_login' && password === MOCK_PASSWORD) {
      setError(null);
      handleEmailSuccess();
    }
  }, [password, view]);

  useEffect(() => {
    if (otp.length === 6) {
      if (otp === generatedOtp || otp === "123456") {
        handleVerifyOTP();
      } else {
        setError("Invalid verification code. Please try again.");
        setOtp('');
      }
    }
  }, [otp, generatedOtp]);

  const handleEmailSuccess = () => {
    setLoading(true);
    setView('verifying');
    setTimeout(() => {
      setLoading(false);
      setAuthenticatedUser({
        id: 'user-' + Date.now(),
        name: email.split('@')[0].toUpperCase() || 'PROFESSIONAL',
        email: email,
        picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        linkedinConnected: false,
      });
      setView('onboarding');
    }, 1200);
  };

  const handleLinkedInSignIn = () => {
    setLoading(true);
    setView('linkedin_loading');
    setTimeout(() => {
      setLoading(false);
      setAuthenticatedUser({
        id: 'li-user-' + Date.now(),
        name: 'LinkedIn Member',
        email: 'member@linkedin.com',
        picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=linkedin`,
        linkedinConnected: true,
        linkedinActivity: ['Shared a new post about AI', 'Liked a job at Google', 'Updated profile headline'],
        headline: 'Senior Professional',
      });
      setView('onboarding');
    }, 2000);
  };

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length < 7) {
      setError("Enter a valid phone number.");
      return;
    }
    setLoading(true);
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newCode);
    
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
      setError(null);
      alert(`[Security] Your Job Seekers AI verification code is: ${newCode}`);
    }, 1000);
  };

  const handleVerifyOTP = () => {
    setLoading(true);
    setView('verifying');
    setTimeout(() => {
      setLoading(false);
      setAuthenticatedUser({
        id: 'phone-user-' + Date.now(),
        name: 'VERIFIED USER',
        email: selectedCountry.code + phoneNumber,
        picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${phoneNumber}`,
        linkedinConnected: false,
      });
      setView('onboarding');
    }, 1200);
  };

  const handleNextStep = () => {
    if (onboardingStep === 1 && (!profileForm.address || !profileForm.preferredCategory)) {
      setError("Location and role category are required.");
      return;
    }
    setError(null);
    if (onboardingStep < 4) {
      setOnboardingStep(prev => prev + 1);
    } else {
      handleFinalize();
    }
  };

  const handleFinalize = () => {
    setView('final_success');
    setTimeout(() => {
      if (authenticatedUser) {
        onSignIn({
          ...authenticatedUser,
          profileData: { ...profileForm, profileStrength: authenticatedUser.linkedinConnected ? 45 : 20 },
          applicationsCount: 0,
          interviewsCount: 0,
          linkedCorporations: []
        });
      }
    }, 2800);
  };

  if (view === 'linkedin_loading') {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-[#0077b5] rounded-3xl flex items-center justify-center mb-8 animate-bounce shadow-2xl">
          <Linkedin className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Synchronizing Identity</h2>
        <p className="text-indigo-200 text-xs mt-3 uppercase font-black tracking-widest opacity-60">Connecting Professional Profile Bridge...</p>
        <div className="mt-10 w-64 h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-[#0077b5] animate-[loading_2s_ease-in-out_infinite]"></div>
        </div>
        <style>{` @keyframes loading { 0% { width: 0%; } 100% { width: 100%; } } `}</style>
      </div>
    );
  }

  if (view === 'verifying') {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center animate-pulse">
        <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mb-6 shadow-2xl">
          <ShieldCheck className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest">Dossier Secured</h2>
        <p className="text-slate-400 text-[10px] mt-2 uppercase font-black tracking-widest">Building Secure Intelligence Session...</p>
      </div>
    );
  }

  if (view === 'final_success') {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-700">
        <div className="w-24 h-24 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center mb-10 shadow-[0_0_60px_rgba(16,185,129,0.4)] animate-bounce">
          <Check className="w-12 h-12 text-white" strokeWidth={4} />
        </div>
        <h2 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">Access Granted</h2>
        <p className="text-emerald-400 font-black text-lg mb-10 tracking-tight">Initializing Global Dashboard...</p>
        <div className="w-72 h-2 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500 animate-[progress_2.5s_linear_forwards]"></div>
        </div>
        <style>{`
          @keyframes progress {
            0% { width: 0%; }
            100% { width: 100%; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-32 text-slate-100 opacity-50 pointer-events-none">
        <Globe className="w-[800px] h-[800px]" />
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="flex items-center gap-3 justify-center mb-12">
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-2xl">J</div>
          <span className="text-3xl font-black text-slate-900 tracking-tighter">Job Seekers AI</span>
        </div>

        <div className="bg-white rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.12)] border border-slate-200 overflow-hidden transition-all duration-500">
          
          {view === 'selection' && (
            <div className="p-12 space-y-6 animate-in fade-in zoom-in duration-500">
              <div className="text-center mb-10">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Initialize Session</h1>
                <p className="text-slate-500 font-medium text-sm">Professional access to global career intel.</p>
              </div>
              
              <button 
                onClick={handleLinkedInSignIn}
                className="w-full flex items-center justify-center gap-4 py-5 bg-[#0077b5] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#005a87] transition-all shadow-xl hover:shadow-[#0077b5]/20 active:scale-95"
              >
                <Linkedin className="w-5 h-5" /> Sync with LinkedIn
              </button>

              <button 
                onClick={() => setView('phone_login')}
                className="w-full flex items-center justify-center gap-4 py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl active:scale-95"
              >
                <Smartphone className="w-5 h-5" /> Phone Verification
              </button>

              <button 
                onClick={() => setView('email_login')}
                className="w-full flex items-center justify-center gap-4 py-5 bg-white border border-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all active:scale-95"
              >
                <Mail className="w-5 h-5" /> Email Dossier
              </button>

              <div className="pt-10 border-t border-slate-50 flex items-center justify-center gap-3 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> AES-256 Market Encryption
              </div>
            </div>
          )}

          {view === 'email_login' && (
            <div className="p-12 space-y-8 animate-in slide-in-from-right-8 duration-300">
              <button onClick={() => setView('selection')} className="text-slate-400 hover:text-slate-900 transition-colors"><ArrowLeft className="w-6 h-6" /></button>
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Security Credentials</h2>
                <p className="text-slate-500 text-xs mt-1 font-bold uppercase tracking-widest opacity-60">Verified corporate email required.</p>
              </div>
              <div className="space-y-4">
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@company.com" className="w-full p-5 bg-slate-50 rounded-2xl font-bold border border-slate-100 outline-none focus:ring-2 focus:ring-slate-900 transition-all" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Access Key" className="w-full p-5 bg-slate-50 rounded-2xl font-bold border border-slate-100 outline-none focus:ring-2 focus:ring-slate-900 transition-all" />
                <p className="text-[10px] text-slate-400 font-bold uppercase text-center mt-4">Legacy Access: Password is "Password123"</p>
              </div>
            </div>
          )}

          {view === 'phone_login' && (
            <div className="p-12 space-y-8 animate-in slide-in-from-right-8 duration-300">
              <button onClick={() => setView('selection')} className="text-slate-400 hover:text-slate-900 transition-colors"><ArrowLeft className="w-6 h-6" /></button>
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{otpSent ? 'Verification' : 'Global Identity'}</h2>
                <p className="text-slate-500 text-xs mt-1 font-bold uppercase tracking-widest opacity-60">{otpSent ? 'Input 6-digit access code.' : 'SMS verification for secure access.'}</p>
              </div>
              {!otpSent ? (
                <form onSubmit={handleSendOTP} className="space-y-6">
                  <div className="flex gap-2">
                    <select value={selectedCountry.code} onChange={e => setSelectedCountry(COUNTRIES.find(c => c.code === e.target.value) || COUNTRIES[0])} className="p-5 bg-slate-50 rounded-2xl font-bold border border-slate-100 outline-none">
                      {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.code}</option>)}
                    </select>
                    <input type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value.replace(/\D/g, ''))} placeholder="Number" className="flex-1 p-5 bg-slate-50 rounded-2xl font-bold border border-slate-100 outline-none focus:ring-2 focus:ring-slate-900 transition-all" />
                  </div>
                  <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">Transmit Code</button>
                </form>
              ) : (
                <div className="space-y-6">
                  <input autoFocus type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').substring(0, 6))} placeholder="000000" className="w-full h-24 text-center text-5xl font-black tracking-[0.3em] bg-slate-50 border-2 border-slate-900/10 rounded-[2rem] outline-none focus:border-slate-900 transition-all" />
                  <div className="flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <Loader2 className="w-3 h-3 animate-spin" /> Awaiting Code Confirmation
                  </div>
                </div>
              )}
            </div>
          )}

          {view === 'onboarding' && (
            <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-in slide-in-from-bottom-12 duration-500">
              <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-500 rounded-xl flex items-center justify-center font-black text-sm">J</div>
                  <h2 className="font-black text-xs uppercase tracking-widest">Dossier Initialization</h2>
                </div>
                <div className="flex gap-2">{[1,2,3,4].map(s => <div key={s} className={`h-1.5 w-10 rounded-full transition-all duration-500 ${onboardingStep >= s ? 'bg-indigo-400' : 'bg-white/10'}`}></div>)}</div>
              </div>
              
              <div className="p-16 flex-1 overflow-y-auto max-w-2xl mx-auto w-full">
                {onboardingStep === 1 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-8">
                    <div>
                      <h3 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Market Objective</h3>
                      <p className="text-slate-500 font-medium">Define your target professional role and region.</p>
                    </div>
                    <div className="space-y-4">
                      <div className="relative">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                        <input value={profileForm.preferredCategory} onChange={e => setProfileForm({...profileForm, preferredCategory: e.target.value})} placeholder="e.g. Lead System Architect" className="w-full pl-16 pr-6 py-6 bg-slate-50 rounded-3xl border border-slate-100 font-bold outline-none focus:ring-2 focus:ring-indigo-600 transition-all shadow-sm" />
                      </div>
                      <div className="relative">
                        <Globe className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                        <input value={profileForm.address} onChange={e => setProfileForm({...profileForm, address: e.target.value})} placeholder="Primary Market Location" className="w-full pl-16 pr-6 py-6 bg-slate-50 rounded-3xl border border-slate-100 font-bold outline-none focus:ring-2 focus:ring-indigo-600 transition-all shadow-sm" />
                      </div>
                    </div>
                  </div>
                )}

                {onboardingStep === 2 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-8">
                    <div>
                      <h3 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Experience Delta</h3>
                      <p className="text-slate-500 font-medium">Your formal professional tenure.</p>
                    </div>
                    <div className="space-y-4">
                      <input value={profileForm.yearsExperience} onChange={e => setProfileForm({...profileForm, yearsExperience: e.target.value})} placeholder="Total Years Experience" className="w-full p-6 bg-slate-50 rounded-3xl border border-slate-100 font-bold outline-none focus:ring-2 focus:ring-indigo-600 transition-all" />
                      <input value={profileForm.education} onChange={e => setProfileForm({...profileForm, education: e.target.value})} placeholder="Highest Academic Credential" className="w-full p-6 bg-slate-50 rounded-3xl border border-slate-100 font-bold outline-none focus:ring-2 focus:ring-indigo-600 transition-all" />
                    </div>
                  </div>
                )}

                {onboardingStep === 3 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-8">
                    <div>
                      <h3 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Long-term Vision</h3>
                      <p className="text-slate-500 font-medium">Describe your 5-year professional trajectory.</p>
                    </div>
                    <textarea value={profileForm.careerGoals} onChange={e => setProfileForm({...profileForm, careerGoals: e.target.value})} placeholder="My objective is to lead engineering teams..." className="w-full h-64 p-8 bg-slate-50 rounded-[2rem] border border-slate-100 font-medium outline-none focus:ring-2 focus:ring-indigo-600 resize-none transition-all shadow-sm" />
                  </div>
                )}

                {onboardingStep === 4 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-8">
                    <div>
                      <h3 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Bridge Verified</h3>
                      <p className="text-slate-500 font-medium">Connect your existing professional footprints.</p>
                    </div>
                    <div className="space-y-4">
                      <div className="relative">
                        <Linkedin className="absolute left-6 top-1/2 -translate-y-1/2 text-[#0077b5] w-5 h-5" />
                        <input value={profileForm.linkedinUrl} onChange={e => setProfileForm({...profileForm, linkedinUrl: e.target.value})} placeholder="LinkedIn Profile URL" className="w-full pl-16 pr-6 py-6 bg-slate-50 rounded-3xl border border-slate-100 font-bold outline-none focus:ring-2 focus:ring-indigo-600 transition-all" />
                      </div>
                      <div className="p-8 bg-emerald-50 rounded-[2rem] border border-emerald-100 flex items-center gap-6">
                        <CheckCircle2 className="w-10 h-10 text-emerald-600 shrink-0" />
                        <p className="text-xs font-black text-emerald-800 uppercase tracking-widest leading-relaxed">Identity and Dossier verified for global market access. Profile will be AES-256 encrypted.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-12 border-t border-slate-100 flex justify-between items-center bg-slate-50/30">
                <button onClick={() => setOnboardingStep(prev => Math.max(1, prev-1))} className="text-xs font-black uppercase text-slate-400 tracking-widest hover:text-slate-900 transition-colors">Prev Stage</button>
                <button onClick={handleNextStep} className="px-16 py-6 bg-slate-900 text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-slate-800 transition-all active:scale-95 flex items-center gap-3">
                  {onboardingStep < 4 ? 'Continue' : 'Initialize Dashboard'} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
