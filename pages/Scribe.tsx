
import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Loader2, Sparkles, FileText, Download, Trash2 } from 'lucide-react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { audioUtils } from '../services/geminiService';

export const Scribe = () => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [transcript, setTranscript] = useState<string>('');
  const sessionRef = useRef<any>(null);

  const startScribe = async () => {
    setIsConnecting(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsConnecting(false);
            setIsActive(true);
            const source = inputCtx.createMediaStreamSource(stream);
            const processor = inputCtx.createScriptProcessor(4096, 1, 1);
            processor.onaudioprocess = (e) => {
              const input = e.inputBuffer.getChannelData(0);
              const l = input.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) int16[i] = input[i] * 32768;
              const base64 = audioUtils.encode(new Uint8Array(int16.buffer));
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: { data: base64, mimeType: 'audio/pcm;rate=16000' } });
              });
            };
            source.connect(processor);
            processor.connect(inputCtx.destination);
          },
          onmessage: async (msg: LiveServerMessage) => {
            // Correct property name for user input transcription is inputTranscription
            if (msg.serverContent?.inputTranscription) {
              setTranscript(prev => prev + ' ' + msg.serverContent!.inputTranscription!.text!);
            }
          },
          onerror: (e) => {
            console.error('Scribe Error:', e);
            setIsActive(false);
          },
          onclose: () => setIsActive(false),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
          systemInstruction: "You are a silent scribe. Do not speak back. Just transcribe everything the user says or what you hear through the microphone accurately."
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setIsConnecting(false);
    }
  };

  const stopScribe = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
      setIsActive(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Live Scribe</h1>
          <p className="text-slate-500">Transcribe meetings, interviews, or voice notes in real-time.</p>
        </div>
        <div className="flex gap-3">
          {!isActive ? (
            <button 
              onClick={startScribe}
              disabled={isConnecting}
              className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg disabled:opacity-50"
            >
              {isConnecting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Mic className="w-5 h-5" />}
              {isConnecting ? 'Initializing...' : 'Start Transcription'}
            </button>
          ) : (
            <button 
              onClick={stopScribe}
              className="px-8 py-3 bg-red-500 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-red-600 transition-all shadow-lg"
            >
              <MicOff className="w-5 h-5" />
              Stop Scribe
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm min-h-[500px] flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-bold text-slate-700">Live Note.txt</span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setTranscript('')}
              className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="flex-1 p-8 font-mono text-sm leading-relaxed text-slate-600 overflow-y-auto">
          {transcript || (isActive ? 'Listening...' : 'Transcript will appear here as you speak.')}
          {isActive && <span className="inline-block w-2 h-4 ml-1 bg-indigo-500 animate-pulse"></span>}
        </div>
        <div className="p-4 bg-indigo-50 border-t border-indigo-100 flex items-center justify-center gap-2 text-xs font-bold text-indigo-600">
          <Sparkles className="w-3 h-3" /> Powered by Gemini Live Transcription
        </div>
      </div>
    </div>
  );
};
