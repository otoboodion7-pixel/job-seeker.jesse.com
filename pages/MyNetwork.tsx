
import React from 'react';
import { 
  Users, 
  UserPlus, 
  Calendar, 
  Clock, 
  Check, 
  X, 
  Search,
  ChevronRight,
  TrendingUp,
  Briefcase
} from 'lucide-react';

export const MyNetwork = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Sidebar: Stats */}
      <aside className="lg:col-span-3 space-y-4">
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-black text-slate-800">Manage network</h3>
          </div>
          <div className="py-2">
            {[
              { icon: Users, label: 'Connections', count: 1204 },
              { icon: Calendar, label: 'Events', count: 12 },
              { icon: Briefcase, label: 'Company Pages', count: 45 },
              { icon: TrendingUp, label: 'Newsletters', count: 8 }
            ].map(item => (
              <button key={item.label} className="w-full flex items-center justify-between px-6 py-3 hover:bg-slate-50 transition-all text-slate-600 hover:text-indigo-600">
                <div className="flex items-center gap-4">
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm font-bold">{item.label}</span>
                </div>
                <span className="text-xs font-black text-slate-400">{item.count}</span>
              </button>
            ))}
          </div>
          <button className="w-full p-4 bg-slate-50 text-center text-[10px] font-black uppercase tracking-widest text-slate-400 border-t border-slate-100 hover:text-indigo-600 transition-all">
            Show more
          </button>
        </div>

        <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-xl">
          <h4 className="font-bold mb-2">Sync your calendar</h4>
          <p className="text-xs text-indigo-100 mb-4 font-medium leading-relaxed">See the profiles of people you're meeting with today and get AI-powered icebreakers.</p>
          <button className="w-full bg-white text-indigo-600 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all">Sync Now</button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:col-span-9 space-y-8">
        {/* Connection Invitations */}
        <section>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="font-black text-slate-800">Invitations (2)</h2>
              <button className="text-sm font-bold text-indigo-600 hover:underline">See all</button>
            </div>
            <div className="divide-y divide-slate-100">
              {[
                { name: 'David Miller', headline: 'Technical Recruiter at FintechX', pic: 'https://picsum.photos/seed/david/100/100', mutual: 12 },
                { name: 'Elena Rossi', headline: 'Senior Product Manager', pic: 'https://picsum.photos/seed/elena/100/100', mutual: 4 }
              ].map(inv => (
                <div key={inv.name} className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 hover:bg-slate-50 transition-all">
                  <img src={inv.pic} className="w-14 h-14 rounded-full shadow-sm" alt="" />
                  <div className="flex-1 text-center sm:text-left">
                    <h4 className="font-black text-slate-800 leading-none mb-1">{inv.name}</h4>
                    <p className="text-xs text-slate-500 font-medium mb-1">{inv.headline}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center justify-center sm:justify-start gap-1">
                      <Users className="w-3 h-3" /> {inv.mutual} mutual connections
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button className="p-3 text-slate-400 hover:text-rose-500 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-100"><X className="w-6 h-6" /></button>
                    <button className="px-6 py-3 bg-white text-indigo-600 font-black text-sm rounded-xl border-2 border-indigo-600 hover:bg-indigo-50 transition-all">Accept</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* People You May Know */}
        <section>
          <div className="flex justify-between items-center mb-6 px-2">
            <h2 className="text-xl font-black text-slate-800 tracking-tight">People you may know</h2>
            <button className="text-sm font-bold text-indigo-600 flex items-center gap-1">See all <ChevronRight className="w-4 h-4" /></button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Marcus Aurelius', headline: 'Stoic Leadership Consultant', pic: 'https://picsum.photos/seed/marcus/150/150' },
              { name: 'Ada Lovelace', headline: 'Algorithm Architect', pic: 'https://picsum.photos/seed/ada/150/150' },
              { name: 'Nikola Tesla', headline: 'Electrical Engineering Innovator', pic: 'https://picsum.photos/seed/nikola/150/150' },
              { name: 'Grace Hopper', headline: 'Compiling Systems Pioneer', pic: 'https://picsum.photos/seed/grace/150/150' },
              { name: 'Alan Turing', headline: 'Mathematical Logic Strategist', pic: 'https://picsum.photos/seed/alan/150/150' },
              { name: 'Marie Curie', headline: 'Research Physics Director', pic: 'https://picsum.photos/seed/marie/150/150' }
            ].map(rec => (
              <div key={rec.name} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col">
                <div className="h-16 bg-slate-50 relative">
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
                    <img src={rec.pic} className="w-16 h-16 rounded-full border-4 border-white shadow-md group-hover:scale-110 transition-transform" alt="" />
                  </div>
                </div>
                <div className="pt-10 px-6 pb-6 text-center flex-1 flex flex-col">
                  <h4 className="font-black text-slate-800 leading-tight mb-1">{rec.name}</h4>
                  <p className="text-[10px] text-slate-500 font-bold mb-4 line-clamp-2 min-h-[30px]">{rec.headline}</p>
                  <div className="mt-auto">
                    <button className="w-full flex items-center justify-center gap-2 py-2 px-4 border-2 border-indigo-600 rounded-full text-indigo-600 font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all">
                      <UserPlus className="w-4 h-4" /> Connect
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
