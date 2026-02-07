
import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Play, Pause, AlertCircle, Loader2, Sparkles, UserCircle } from 'lucide-react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { audioUtils } from '../services/geminiService';

export const Interview = () => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [transcript, setTranscript] = useState<{ role: 'user' | 'ai', text: string }[]>([]);
  
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const startInterview = async () => {
    setIsConnecting(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = outputCtx;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsConnecting(false);
            setIsActive(true);
            
            // Microphone streaming
            const source = inputCtx.createMediaStreamSource(stream);
            const processor = inputCtx.createScriptProcessor(4096, 1, 1);
            processor.onaudioprocess = (e) => {
              const input = e.inputBuffer.getChannelData(0);
              const l = input.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) int16[i] = input[i] * 32768;
              
              const base64 = audioUtils.encode(new Uint8Array(int16.buffer));
              // CRITICAL: Solely rely on sessionPromise resolves and then call `session.sendRealtimeInput`
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ 
                  media: { data: base64, mimeType: 'audio/pcm;rate=16000' } 
                });
              });
            };
            source.connect(processor);
            processor.connect(inputCtx.destination);
          },
          onmessage: async (msg: LiveServerMessage) => {
            const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioData) {
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              const decoded = audioUtils.decode(audioData);
              const buffer = await audioUtils.decodeAudioData(decoded, outputCtx, 24000, 1);
              const node = outputCtx.createBufferSource();
              node.buffer = buffer;
              node.connect(outputCtx.destination);
              
              node.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(node);
              node.onended = () => sourcesRef.current.delete(node);
            }

            if (msg.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => {
                try { s.stop(); } catch (e) {}
                sourcesRef.current.delete(s);
              });
              nextStartTimeRef.current = 0;
            }

            if (msg.serverContent?.outputTranscription) {
              setTranscript(prev => [...prev, { role: 'ai', text: msg.serverContent!.outputTranscription!.text! }]);
            }
          },
          onerror: (e) => {
            console.error('API Error:', e);
            setIsActive(false);
          },
          onclose: () => setIsActive(false),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          outputAudioTranscription: {},
          systemInstruction: "You are a senior tech interviewer at a top company. Interview the user for a Senior Frontend Engineer role. Be professional but encouraging. Start by introducing yourself and asking the user to talk about their most challenging project."
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setIsConnecting(false);
    }
  };

  const stopInterview = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
      setIsActive(false);
    }
  };

  // Ensure session is closed on component unmount
  useEffect(() => {
    return () => {
      if (sessionRef.current) {
        sessionRef.current.close();
      }
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm text-center">
        <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 relative">
          <Mic className={`w-10 h-10 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
          {isActive && (
            <span className="absolute inset-0 rounded-full border-4 border-indigo-600 animate-ping opacity-20"></span>
          )}
        </div>
        
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Voice Mock Interview</h1>
        <p className="text-slate-500 max-w-md mx-auto mb-8">
          Practice your interviewing skills in real-time with Gemini. Get low-latency feedback on your voice and answers.
        </p>

        <div className="flex justify-center gap-4">
          {!isActive ? (
            <button 
              onClick={startInterview}
              disabled={isConnecting}
              className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-xl disabled:opacity-50"
            >
              {isConnecting ? <Loader2 className="w-6 h-6 animate-spin" /> : <Play className="w-6 h-6" />}
              {isConnecting ? 'Connecting...' : 'Start Session'}
            </button>
          ) : (
            <button 
              onClick={stopInterview}
              className="px-10 py-4 bg-red-500 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-red-600 transition-all shadow-xl"
            >
              <MicOff className="w-6 h-6" />
              End Session
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-900 rounded-3xl p-6 text-white overflow-hidden min-h-[400px] flex flex-col">
          <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <span className="font-bold">Live Transcription</span>
          </div>
          <div className="flex-1 space-y-4 overflow-y-auto scrollbar-hide">
            {transcript.map((t, i) => (
              <div key={i} className={`flex gap-3 ${t.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                {t.role === 'ai' && <div className="w-6 h-6 rounded-full bg-indigo-500 shrink-0 text-[10px] flex items-center justify-center font-bold">AI</div>}
                <div className={`p-3 rounded-2xl text-sm ${t.role === 'ai' ? 'bg-white/10' : 'bg-indigo-600'}`}>
                  {t.text}
                </div>
              </div>
            ))}
            {!isActive && transcript.length === 0 && (
              <p className="text-white/20 text-center mt-20 text-sm">Transcription will appear here during the session.</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-indigo-600" /> Interview Tips
          </h3>
          <div className="space-y-4">
            <div className="flex gap-4 p-4 bg-indigo-50 rounded-2xl">
              <div className="w-8 h-8 rounded-lg bg-indigo-200 flex items-center justify-center shrink-0">1</div>
              <p className="text-sm text-indigo-900">Use the STAR method (Situation, Task, Action, Result) for behavioral questions.</p>
            </div>
            <div className="flex gap-4 p-4 bg-indigo-50 rounded-2xl">
              <div className="w-8 h-8 rounded-lg bg-indigo-200 flex items-center justify-center shrink-0">2</div>
              <p className="text-sm text-indigo-900">Be clear and concise. The model will analyze your verbal fluidity.</p>
            </div>
            <div className="flex gap-4 p-4 bg-indigo-50 rounded-2xl">
              <div className="w-8 h-8 rounded-lg bg-indigo-200 flex items-center justify-center shrink-0">3</div>
              <p className="text-sm text-indigo-900">Don't be afraid to ask clarifying questions about the role.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
