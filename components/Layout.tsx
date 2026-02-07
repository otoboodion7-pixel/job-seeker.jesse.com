
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart2,
  Briefcase, 
  Users,
  Bell,
  User,
  Search,
  Menu,
  X,
  Target,
  ShieldCheck,
  Building2,
  Linkedin
} from 'lucide-react';
import { AuthUser } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: AuthUser;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  
  const navItems = [
    { icon: BarChart2, label: 'Market', path: '/' },
    { icon: Briefcase, label: 'Jobs', path: '/jobs' },
    { icon: Target, label: 'Pipeline', path: '/applications' },
    { icon: Users, label: 'Talent', path: '/network' },
    { icon: Building2, label: 'Corp Intel', path: '/business' },
    { icon: User, label: 'Me', path: '/profile' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans overflow-x-hidden pb-14 lg:pb-0">
      <header className="sticky top-0 z-[100] bg-white border-b border-slate-200 h-14 md:h-16 flex items-center justify-center shadow-sm w-full px-4 md:px-6">
        <div className="max-w-[1128px] w-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 md:gap-4 flex-1">
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 md:w-9 md:h-9 bg-slate-900 rounded flex items-center justify-center text-white font-black text-xl shadow-sm">
                J
              </div>
              <span className="hidden sm:block text-xl font-black text-slate-900 tracking-tighter">Job Seekers AI</span>
            </Link>
            
            <div className="hidden md:block flex-1 max-w-[300px] relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Global job search..."
                className="w-full bg-slate-50 border-none focus:bg-white focus:ring-1 focus:ring-slate-900 rounded-md py-1.5 pl-10 pr-4 transition-all outline-none text-xs font-medium"
              />
            </div>
            <button onClick={() => setIsMobileSearchOpen(true)} className="md:hidden p-2 text-slate-500">
              <Search className="w-5 h-5" />
            </button>
          </div>

          <nav className="hidden lg:flex items-center h-full">
            {navItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center min-w-[80px] h-full transition-all relative group ${
                  location.pathname === item.path ? 'text-slate-900' : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <item.icon className="w-5 h-5 mb-1" strokeWidth={location.pathname === item.path ? 2.5 : 2} />
                <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
                {location.pathname === item.path && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-t-full"></div>
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4 shrink-0 pl-4 border-l border-slate-100">
            <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-3 text-slate-500 hover:text-slate-900">
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                 <img src={user.picture} alt={user.name} className="w-full h-full object-cover" />
              </div>
            </button>
            
            {showUserMenu && (
              <>
                <div className="fixed inset-0 z-[110]" onClick={() => setShowUserMenu(false)}></div>
                <div className="absolute right-0 mt-3 w-64 bg-white border border-slate-200 rounded-xl shadow-xl z-[120] overflow-hidden">
                  <div className="p-4 border-b border-slate-100">
                    <p className="font-bold text-sm text-slate-900 truncate">{user.name}</p>
                    <p className="text-[9px] text-slate-500 mt-1 uppercase font-black tracking-widest leading-none">
                      {user.linkedCorporations && user.linkedCorporations.length > 0 ? 'Business Owner' : 'Professional Member'}
                    </p>
                  </div>
                  <div className="p-2 space-y-1">
                    <Link to="/profile" onClick={() => setShowUserMenu(false)} className="block px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-lg">My Career Profile</Link>
                    <Link to="/business" onClick={() => setShowUserMenu(false)} className="block px-4 py-2 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg">Corp Intelligence</Link>
                    <button onClick={onLogout} className="w-full text-left px-4 py-3 text-xs font-black uppercase tracking-widest text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
                      Terminate Session
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {isMobileSearchOpen && (
        <div className="fixed inset-0 z-[200] bg-white p-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsMobileSearchOpen(false)} className="text-slate-500"><X className="w-6 h-6" /></button>
            <input 
              type="text" 
              autoFocus
              placeholder="Search global markets..."
              className="flex-1 bg-slate-100 rounded-lg py-2 px-4 text-sm font-medium outline-none"
            />
          </div>
        </div>
      )}

      <main className="flex-1 w-full max-w-[1128px] mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="mb-4 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-lg flex items-center justify-between">
           <div className="flex items-center gap-2">
             <ShieldCheck className="w-4 h-4 text-emerald-600" />
             <p className="text-[9px] font-black uppercase text-emerald-700 tracking-widest">
               Encrypted Intelligence Stream Active
             </p>
           </div>
           {user.linkedinConnected && (
             <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-[#0077b5] tracking-widest">
               <Linkedin className="w-3 h-3" /> Linked
             </div>
           )}
        </div>
        {children}
      </main>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around items-center h-14 z-[90] pb-safe">
        {navItems.map((item) => (
          <Link 
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              location.pathname === item.path ? 'text-slate-900' : 'text-slate-400'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[8px] font-black uppercase tracking-widest mt-1">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};
