
import React, { useState } from 'react';
import { 
  Search, 
  MoreHorizontal, 
  Edit3, 
  Mic, 
  ImageIcon, 
  FileText, 
  Send, 
  Sparkles,
  ChevronLeft,
  Paperclip,
  Smile,
  Play,
  MessageSquare
} from 'lucide-react';
import { ChatThread } from '../types';

export const Messaging = () => {
  const [selectedThread, setSelectedThread] = useState<string | null>('1');
  const [message, setMessage] = useState('');

  const mockThreads: ChatThread[] = [
    {
      id: '1',
      participantName: 'Sarah Chen',
      participantPic: 'https://picsum.photos/seed/sarah/100/100',
      lastMessage: 'Great report! Thanks for sharing those insights on Gemini.',
      lastTimestamp: '2:15 PM',
      unread: true
    },
    {
      id: '2',
      participantName: 'James Wilson',
      participantPic: 'https://picsum.photos/seed/james/100/100',
      lastMessage: 'Are you still looking for a Lead role?',
      lastTimestamp: 'Yesterday',
      unread: false
    }
  ];

  return (
    <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden flex h-[750px] animate-in fade-in zoom-in duration-300">
      {/* Sidebar: Threads */}
      <div className={`w-full md:w-[350px] border-r border-slate-100 flex flex-col ${selectedThread ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-800">Messaging</h2>
          <div className="flex gap-1">
            <button className="p-2 hover:bg-slate-50 rounded-full transition-all text-slate-400"><MoreHorizontal className="w-5 h-5" /></button>
            <button className="p-2 hover:bg-slate-50 rounded-full transition-all text-slate-400"><Edit3 className="w-5 h-5" /></button>
          </div>
        </div>
        
        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search messages..." 
              className="w-full bg-slate-50 border-none rounded-xl py-2 pl-10 pr-4 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {mockThreads.map(thread => (
            <button 
              key={thread.id}
              onClick={() => setSelectedThread(thread.id)}
              className={`w-full p-4 flex gap-3 hover:bg-slate-50 transition-all text-left border-l-4 ${selectedThread === thread.id ? 'bg-slate-50 border-indigo-600' : 'border-transparent'}`}
            >
              <div className="relative">
                <img src={thread.participantPic} className="w-12 h-12 rounded-full shrink-0" alt="" />
                {thread.unread && <div className="absolute top-0 right-0 w-3 h-3 bg-indigo-600 border-2 border-white rounded-full"></div>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-0.5">
                  <h4 className={`text-sm font-bold truncate ${thread.unread ? 'text-slate-900' : 'text-slate-700'}`}>{thread.participantName}</h4>
                  <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap">{thread.lastTimestamp}</span>
                </div>
                <p className={`text-xs truncate ${thread.unread ? 'text-slate-900 font-bold' : 'text-slate-500 font-medium'}`}>{thread.lastMessage}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className={`flex-1 flex flex-col ${!selectedThread ? 'hidden md:flex' : 'flex'}`}>
        {selectedThread ? (
          <>
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button className="md:hidden p-2 -ml-2 text-slate-400" onClick={() => setSelectedThread(null)}><ChevronLeft className="w-5 h-5" /></button>
                <img src="https://picsum.photos/seed/sarah/100/100" className="w-10 h-10 rounded-full" alt="" />
                <div>
                  <h3 className="text-sm font-black text-slate-800 leading-none">Sarah Chen</h3>
                  <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest mt-1">Online</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-slate-50 rounded-full transition-all text-slate-400"><Search className="w-5 h-5" /></button>
                <button className="p-2 hover:bg-slate-50 rounded-full transition-all text-slate-400"><MoreHorizontal className="w-5 h-5" /></button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
              <div className="flex flex-col items-center mb-8">
                <img src="https://picsum.photos/seed/sarah/100/100" className="w-20 h-20 rounded-full mb-3" alt="" />
                <h4 className="text-lg font-black text-slate-800">Sarah Chen</h4>
                <p className="text-xs text-slate-500 font-bold text-center">AI Engineering Lead at NeuralSoft • You both know David Miller</p>
              </div>

              {/* Sample Messages */}
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm max-w-[80%] border border-slate-100">
                  <p className="text-sm text-slate-700 font-medium">Hey Alex! I saw your profile updates. That project with Gemini 3 looks really interesting.</p>
                  <span className="text-[10px] text-slate-400 mt-2 block font-bold">1:45 PM</span>
                </div>
              </div>

              <div className="flex justify-end">
                <div className="bg-indigo-600 p-4 rounded-2xl rounded-tr-none shadow-lg max-w-[80%] text-white">
                  <p className="text-sm font-medium">Thanks Sarah! It was a blast building it. We really pushed the multimodal capabilities.</p>
                  <span className="text-[10px] text-indigo-200 mt-2 block font-bold">2:02 PM</span>
                </div>
              </div>

              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm max-w-[80%] border border-slate-100">
                  <div className="flex items-center gap-3">
                    <button className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600"><Play className="w-4 h-4" /></button>
                    <div className="h-1 flex-1 bg-slate-100 rounded-full overflow-hidden w-32"><div className="h-full bg-indigo-500 w-1/3"></div></div>
                    <span className="text-xs font-bold text-slate-400">0:24</span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-2 block font-bold">2:15 PM • Voice Message</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white border-t border-slate-100">
              {/* AI Suggested Replies */}
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap cursor-pointer hover:bg-indigo-100">Sure!</span>
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap cursor-pointer hover:bg-indigo-100">Tell me more</span>
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap cursor-pointer hover:bg-indigo-100">Let's talk soon</span>
                <div className="flex items-center gap-1 text-[8px] text-slate-300 font-black uppercase ml-2"><Sparkles className="w-2 h-2" /> AI Suggested</div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-2">
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write a message..."
                  className="w-full bg-transparent border-none focus:ring-0 text-sm font-medium p-3 resize-none h-20 outline-none"
                />
                <div className="flex justify-between items-center p-2">
                  <div className="flex gap-1">
                    <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all"><Paperclip className="w-5 h-5" /></button>
                    <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all"><ImageIcon className="w-5 h-5" /></button>
                    <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all"><FileText className="w-5 h-5" /></button>
                    <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all"><Smile className="w-5 h-5" /></button>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-3 bg-white text-slate-400 hover:text-indigo-600 rounded-xl transition-all shadow-sm"><Mic className="w-5 h-5" /></button>
                    <button className="p-3 bg-indigo-600 text-white rounded-xl transition-all shadow-lg hover:bg-indigo-700 active:scale-95"><Send className="w-5 h-5" /></button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mb-6">
              <MessageSquare className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-2">Your Inbox</h3>
            <p className="text-slate-500 max-w-sm">Connect with industry peers, mentors, and recruiters directly within HireAI.</p>
            <button className="mt-8 px-8 py-3 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-700 transition-all shadow-xl">New Message</button>
          </div>
        )}
      </div>
    </div>
  );
};
