
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, ArrowRight, Sparkles, Globe, Clock, X, Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SavedSearch } from '../types';

export const Discovery = () => {
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState('');
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('hireai_saved_searches') || '[]');
    setSavedSearches(saved);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (address && category) {
      triggerSearch(category, address);
    }
  };

  const triggerSearch = (q: string, l: string) => {
    navigate(`/jobs?q=${encodeURIComponent(q)}&l=${encodeURIComponent(l)}`);
  };

  const deleteSavedSearch = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = savedSearches.filter(s => s.id !== id);
    setSavedSearches(updated);
    localStorage.setItem('hireai_saved_searches', JSON.stringify(updated));
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-sm font-bold mb-6">
          <Sparkles className="w-4 h-4" />
          Powered by Gemini Global Search
        </div>
        <h1 className="text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
          Find your next <span className="text-indigo-600">opportunity.</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto">
          HireAI scans real company career pages across the world to find roles that match your expertise and location.
        </p>
      </div>

      <form onSubmit={handleSearch} className="bg-white p-2 rounded-[2.5rem] shadow-2xl border border-slate-100 flex flex-col md:flex-row gap-2 mb-12">
        <div className="flex-1 flex items-center px-6 py-4 md:py-0">
          <Briefcase className="w-6 h-6 text-indigo-500 mr-4" />
          <div className="flex-1">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Job Category</label>
            <input 
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Senior Frontend Engineer"
              className="w-full bg-transparent border-none outline-none text-slate-800 font-semibold placeholder:text-slate-300"
            />
          </div>
        </div>
        <div className="hidden md:block w-px h-12 bg-slate-100 self-center"></div>
        <div className="flex-1 flex items-center px-6 py-4 md:py-0">
          <MapPin className="w-6 h-6 text-rose-500 mr-4" />
          <div className="flex-1">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Location / Address</label>
            <input 
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. London, UK or Remote"
              className="w-full bg-transparent border-none outline-none text-slate-800 font-semibold placeholder:text-slate-300"
            />
          </div>
        </div>
        <button 
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-5 rounded-[2rem] font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-100"
        >
          Search Jobs
          <ArrowRight className="w-5 h-5" />
        </button>
      </form>

      {savedSearches.length > 0 && (
        <div className="mb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center gap-2 mb-6 px-2">
            <Bookmark className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-800">Saved Searches</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedSearches.map((saved) => (
              <div 
                key={saved.id}
                onClick={() => triggerSearch(saved.category, saved.location)}
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all group cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                    <Search className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">
                      {saved.category}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {saved.location}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={(e) => deleteSavedSearch(e, saved.id)}
                  className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mx-auto mb-6">
            <Globe className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 mb-2">Global Search</h3>
          <p className="text-sm text-slate-500 leading-relaxed">Access real-time listings from companies across all continents.</p>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center">
          <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 mx-auto mb-6">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 mb-2">Address Grounding</h3>
          <p className="text-sm text-slate-500 leading-relaxed">Intelligent location-aware suggestions based on your exact address.</p>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center">
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto mb-6">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 mb-2">Direct Apply</h3>
          <p className="text-sm text-slate-500 leading-relaxed">No middleman. Apply directly on the official company career portals.</p>
        </div>
      </div>
    </div>
  );
};
