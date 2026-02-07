
import React, { useState, useEffect } from 'react';
import { ClipboardList, Clock, CheckCircle, XCircle, MoreVertical, Search, Plus } from 'lucide-react';
import { Application, ApplicationStatus } from '../types';

const STATUS_COLORS = {
  'Applied': 'bg-blue-100 text-blue-600',
  'Under Review': 'bg-amber-100 text-amber-600',
  'Interviewing': 'bg-indigo-100 text-indigo-600',
  'Offer Extended': 'bg-green-100 text-green-600',
  'Rejected': 'bg-slate-100 text-slate-600'
};

export const Applications = () => {
  const [apps, setApps] = useState<Application[]>([]);
  
  useEffect(() => {
    const saved = localStorage.getItem('hireai_applications');
    if (saved) setApps(JSON.parse(saved));
    else {
      const demo = [
        { id: '1', jobTitle: 'Senior Frontend Engineer', company: 'Google', location: 'Remote', status: 'Interviewing', appliedDate: '2023-11-01' },
        { id: '2', jobTitle: 'Product Designer', company: 'Figma', location: 'San Francisco', status: 'Applied', appliedDate: '2023-10-28' },
      ];
      setApps(demo as Application[]);
      localStorage.setItem('hireai_applications', JSON.stringify(demo));
    }
  }, []);

  const updateStatus = (id: string, newStatus: ApplicationStatus) => {
    const updated = apps.map(a => a.id === id ? { ...a, status: newStatus } : a);
    setApps(updated);
    localStorage.setItem('hireai_applications', JSON.stringify(updated));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Job Tracker</h1>
          <p className="text-slate-500">Manage your application pipeline and stay organized.</p>
        </div>
        <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg">
          <Plus className="w-5 h-5" /> Add Manual Entry
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {['Applied', 'Under Review', 'Interviewing', 'Offer Extended'].map(status => (
          <div key={status} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">{status}</span>
              <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs font-bold">
                {apps.filter(a => a.status === status).length}
              </span>
            </div>
            <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={`h-full ${STATUS_COLORS[status as ApplicationStatus].split(' ')[1].replace('text-', 'bg-')}`} 
                style={{ width: `${(apps.filter(a => a.status === status).length / (apps.length || 1)) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Company & Role</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date Applied</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {apps.map(app => (
              <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-bold text-slate-800">{app.jobTitle}</p>
                    <p className="text-xs text-slate-500">{app.company} • {app.location}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${STATUS_COLORS[app.status]}`}>
                    {app.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {new Date(app.appliedDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <select 
                    className="bg-transparent border-none text-xs font-bold text-indigo-600 focus:ring-0 cursor-pointer"
                    value={app.status}
                    onChange={(e) => updateStatus(app.id, e.target.value as ApplicationStatus)}
                  >
                    <option value="Applied">Applied</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Interviewing">Interviewing</option>
                    <option value="Offer Extended">Offer</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {apps.length === 0 && (
          <div className="p-12 text-center">
            <ClipboardList className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-500">No applications tracked yet. Start applying from the Jobs tab!</p>
          </div>
        )}
      </div>
    </div>
  );
};
