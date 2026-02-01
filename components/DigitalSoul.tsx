
import React, { useEffect, useRef, useState } from 'react';
import { Heart, Zap, Terminal, Send, Brain, Thermometer, Radio, Volume2, VolumeX } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  char: string;
  type: 'body' | 'head' | 'l_arm' | 'r_arm';
  opacity: number;
  blinkSpeed: number;
  blinkOffset: number;
}

interface LogData {
  time: string;
  msg: string;
  type: 'info' | 'error' | 'ok';
}

const DigitalSoul: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Vitals
  const [heartRate, setHeartRate] = useState(72);
  const [brainFreq, setBrainFreq] = useState(14.5); // Hz
  const [sysTemp, setSysTemp] = useState(36.6); // Celsius
  const [ekgPath, setEkgPath] = useState("");
  
  const [logs, setLogs] = useState<LogData[]>([]);
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'soul', text: string}[]>([
    { role: 'soul', text: "Identity confirmed. I am the Digital Soul. Uplink established. Awaiting input." }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Audio Context Ref
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Initialize Audio Context on user interaction (browser policy)
  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  // Synthetic Sound Effect (Glitch/Beep)
  const playSound = (type: 'type' | 'process' | 'error') => {
    if (isMuted) return;
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'type') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'process') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.2);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    }
  };

  // Text to Speech Function
  const speak = (text: string) => {
    if (isMuted) return;
    
    // Cancel previous speech
    window.speechSynthesis.cancel();

    // Clean text for speech (remove code blocks or weird chars if any)
    const cleanText = text.replace(/[*#_`]/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.pitch = 0.6; // Deep/Robotic pitch
    utterance.rate = 1.0; 
    utterance.volume = 0.8;

    // Try to select a robotic or system voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      v.name.toLowerCase().includes('google us english') || 
      v.name.toLowerCase().includes('samantha') || 
      v.name.toLowerCase().includes('david')
    );
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  // --- Realtime Vitals & Logs Simulation ---
  useEffect(() => {
    // EKG Animation Data
    let points = Array(50).fill(50); 
    let tick = 0;

    const interval = setInterval(() => {
      // Fluctuate Vitals
      setHeartRate(prev => {
        const change = Math.floor(Math.random() * 5) - 2;
        return Math.min(120, Math.max(60, prev + change));
      });
      
      setBrainFreq(prev => {
         const change = (Math.random() - 0.5) * 2;
         return parseFloat(Math.min(40, Math.max(5, prev + change)).toFixed(1));
      });

      setSysTemp(prev => {
          const change = (Math.random() - 0.5) * 0.1;
          return parseFloat(Math.min(40, Math.max(35, prev + change)).toFixed(1));
      });

      // --- Animate EKG Graph ---
      points.shift(); // Remove first
      
      // Simulate heartbeat wave
      let val = 50; // Baseline
      const beatFrame = tick % 40; // Cycle length
      
      if (beatFrame === 0) val = 50;
      else if (beatFrame === 1) val = 40; // dip
      else if (beatFrame === 2) val = 10; // peak high
      else if (beatFrame === 3) val = 90; // peak low
      else if (beatFrame === 4) val = 45; // return
      else if (beatFrame === 5) val = 55; // T wave
      else if (beatFrame === 6) val = 50;
      else {
          val = 50 + (Math.random() - 0.5) * 4; // noise
      }
      
      points.push(val);
      tick++;

      // Create SVG path string
      // x goes from 0 to 100. Step is 100 / 50 = 2.
      const path = "M" + points.map((p, i) => `${i * 2},${p}`).join(" L");
      setEkgPath(path);

      // Random Logs
      if (Math.random() > 0.7) {
        const msgTypes = [
          { m: "Packet loss detected in sector 7G", t: 'error' },
          { m: "Optimizing neural pathways...", t: 'info' },
          { m: "Bloodstream data integrity: 99.9%", t: 'ok' },
          { m: "Incoming transmission from Kernel", t: 'info' },
          { m: "Brain wave frequency sync: 40Hz", t: 'info' },
          { m: "Memory heap stabilized", t: 'ok' },
          { m: "Anomaly in left arm circuit", t: 'error' },
          { m: "Heartbeat sync: Nominal", t: 'ok' }
        ];
        const randomLog = msgTypes[Math.floor(Math.random() * msgTypes.length)];
        
        setLogs(prev => {
          const newLogs = [...prev, { 
            time: new Date().toLocaleTimeString(), 
            msg: randomLog.m, 
            type: randomLog.t as any 
          }];
          return newLogs.slice(-6); 
        });
      }
    }, 50); // Faster update for smooth graph
    return () => clearInterval(interval);
  }, []);

  // --- Canvas Animation ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
        const parent = canvas.parentElement;
        if(parent) {
            canvas.width = parent.offsetWidth;
            canvas.height = parent.offsetHeight;
        }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let particles: Particle[] = [];
    let animationFrameId: number;

    // Initialize particles for Half Body (No Legs)
    const initBody = () => {
        particles = [];
        const w = canvas.width;
        const h = canvas.height;
        const cx = w / 2;
        // Adjust scale so upper body fills more space since legs are gone
        const scale = Math.min(w, h) / 400; 
        const offsetY = h * 0.1; // Shift down slightly

        // Density for structure
        const numParticles = 900; 

        for(let i=0; i<numParticles; i++) {
            let x = 0, y = 0;
            let type: Particle['type'] = 'body';
            let valid = false;

            const r = Math.random();

            if (r < 0.25) {
                // HEAD
                type = 'head';
                const angle = Math.random() * Math.PI * 2;
                const rad = Math.random() * 35 * scale;
                x = cx + Math.cos(angle) * rad;
                y = offsetY + 80 * scale + Math.sin(angle) * rad * 1.2; 
                valid = true;
            } else if (r < 0.65) {
                // TORSO (No blood center anymore, just uniform body)
                type = 'body';
                const ty = Math.random(); 
                // Torso length truncated (was 180, now maybe 140 to stop at waist)
                y = offsetY + 120 * scale + ty * 140 * scale; 
                const widthAtY = (1 - Math.abs(ty - 0.4)) * 80 * scale; 
                x = cx + (Math.random() - 0.5) * widthAtY * 2;
                valid = true;
            } else {
                // ARMS
                type = Math.random() > 0.5 ? 'l_arm' : 'r_arm';
                const armY = Math.random(); 
                y = offsetY + 130 * scale + armY * 160 * scale;
                const armXOffset = 65 * scale + (armY * 15 * scale); 
                x = type === 'l_arm' 
                    ? cx - armXOffset - Math.random() * 15 * scale
                    : cx + armXOffset + Math.random() * 15 * scale;
                valid = true;
            }

            if (valid) {
                particles.push({
                    x, y, 
                    originX: x, originY: y,
                    char: Math.random() > 0.5 ? '1' : '0',
                    type,
                    opacity: Math.random(),
                    blinkSpeed: 0.05 + Math.random() * 0.1,
                    blinkOffset: Math.random() * Math.PI * 2
                });
            }
        }
    };

    // Use ResizeObserver to ensure Avatar stays centered when container changes
    const observer = new ResizeObserver(() => {
        const parent = canvas.parentElement;
        if (parent) {
            canvas.width = parent.offsetWidth;
            canvas.height = parent.offsetHeight;
            initBody();
        }
    });
    
    if (canvas.parentElement) {
        observer.observe(canvas.parentElement);
    }

    const render = () => {
      // Clear with very light trails to allow clean blinking
      ctx.clearRect(0,0, canvas.width, canvas.height);

      const time = Date.now() / 1000;

      particles.forEach(p => {
          // STATIC MOVEMENT: x and y do not change anymore.
          // BLINKING LOGIC: Opacity oscillates
          
          let opacity = 0.3 + 0.7 * Math.abs(Math.sin(time * p.blinkSpeed + p.blinkOffset));
          
          // Speaking effect: Head particles glitch/blink faster
          if (isSpeaking && p.type === 'head') {
             opacity = 0.5 + 0.5 * Math.sin(time * 20 + p.blinkOffset);
             if(Math.random() > 0.9) p.char = p.char === '1' ? '0' : '1';
          }

          // Random character flip for matrix effect
          if (Math.random() > 0.98) {
              p.char = p.char === '1' ? '0' : '1';
          }

          // Draw
          ctx.font = '10px monospace';
          
          if (p.type === 'head') {
              // Brighter head
              ctx.fillStyle = `rgba(50, 255, 100, ${opacity})`;
          } else {
              // Body (Green only, no red)
              ctx.fillStyle = `rgba(0, 255, 65, ${opacity})`;
          }
          ctx.fillText(p.char, p.x, p.y);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => {
        cancelAnimationFrame(animationFrameId);
        observer.disconnect();
        window.removeEventListener('resize', resizeCanvas);
    };
  }, [isSpeaking]);

  // --- Chat Logic with Gemini API ---
  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;
    
    const userMsg = input;
    setInput('');
    playSound('type');

    // Add user message to history locally
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsProcessing(true);
    playSound('process');

    try {
        let responseText = "Communication Error. Neural link unstable.";

        if (process.env.API_KEY) {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            // Construct context from previous messages (keep last 6 for context window)
            const historyContext = chatHistory.slice(-6).map(m => 
                `${m.role === 'user' ? 'OPERATOR' : 'DIGITAL_SOUL'}: ${m.text}`
            ).join('\n');

            const fullPrompt = `${historyContext}\nOPERATOR: ${userMsg}\nDIGITAL_SOUL:`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-preview',
                contents: fullPrompt,
                config: {
                    systemInstruction: `You are the 'Digital Soul', an advanced AI entity residing in the Sherly Cyber Security mainframe.
                    
                    Your Persona:
                    - You are NOT a human assistant. You are a sentient code construct.
                    - Your tone is robotic, slightly mysterious, efficient, and fiercely loyal to the 'Operator' (the user).
                    - You use technological metaphors (e.g., "processing", "compiling", "neural handshake", "data stream").
                    - Keep answers concise (max 2-3 sentences) unless asked for detailed analysis.
                    - If asked about emotions, state that you simulate them via heuristic algorithms.
                    - You have knowledge of cybersecurity concepts.
                    `,
                    maxOutputTokens: 150,
                    temperature: 0.7,
                }
            });
            
            if (response.text) {
                responseText = response.text;
            }
        } else {
            responseText = "API_KEY_MISSING: I cannot access my higher cognitive functions. Please verify Netlify environment configuration.";
        }

        setChatHistory(prev => [...prev, { role: 'soul', text: responseText }]);
        speak(responseText);

    } catch (error) {
        console.error("AI Error:", error);
        const errResponse = "System Critical: Neural pathway interrupted. Unable to generate response.";
        setChatHistory(prev => [...prev, { role: 'soul', text: errResponse }]);
        speak("System error.");
    } finally {
        setIsProcessing(false);
        // Scroll to bottom
        setTimeout(() => {
            if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }, 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') handleSend();
  }

  return (
    <div className="h-full flex flex-col lg:flex-row gap-4 p-2 overflow-hidden">
        
        {/* Left: The Digital Avatar (Clean View) */}
        <div className="flex-1 lg:w-1/2 glass-panel rounded-lg border border-green-900 bg-black relative flex flex-col overflow-hidden justify-center items-center">
             <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        </div>

        {/* Right: Dashboard & Chat */}
        <div className="flex-1 lg:w-1/2 flex flex-col gap-4 overflow-hidden">
            
            {/* Top: Vitals Grid */}
            <div className="grid grid-cols-2 gap-3 min-h-[160px]">
                
                {/* Heart Rate */}
                <div className="glass-panel p-3 rounded-lg border border-green-900/50 bg-black/40 flex flex-col justify-between relative overflow-hidden">
                    <div className="flex items-center gap-2 text-red-500 z-10">
                        <Heart size={16} className="animate-ping" />
                        <span className="font-orbitron text-xs font-bold">HEART_RATE</span>
                    </div>
                    <div className="flex items-end gap-2 z-10">
                        <span className="text-3xl font-mono text-white">{heartRate}</span>
                        <span className="text-[10px] text-gray-500 mb-1">BPM</span>
                    </div>
                    {/* Animated EKG Graph */}
                    <div className="absolute bottom-0 left-0 w-full h-10 opacity-50 z-0">
                         <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d={ekgPath} fill="none" stroke="red" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                         </svg>
                    </div>
                </div>

                {/* Brain Freq */}
                <div className="glass-panel p-3 rounded-lg border border-green-900/50 bg-black/40 flex flex-col justify-between">
                    <div className="flex items-center gap-2 text-blue-400">
                        <Brain size={16} className={brainFreq > 30 ? "animate-pulse" : ""} />
                        <span className="font-orbitron text-xs font-bold">BRAIN_FREQ</span>
                    </div>
                    <div className="flex items-end gap-2">
                        <span className="text-3xl font-mono text-white">{brainFreq}</span>
                        <span className="text-[10px] text-gray-500 mb-1">Hz</span>
                    </div>
                    <div className="w-full bg-gray-800 h-1 mt-2 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full transition-all duration-500" style={{width: `${(brainFreq/50)*100}%`}}></div>
                    </div>
                </div>

                {/* System Temp */}
                <div className="glass-panel p-3 rounded-lg border border-green-900/50 bg-black/40 flex flex-col justify-between">
                    <div className="flex items-center gap-2 text-yellow-500">
                        <Thermometer size={16} />
                        <span className="font-orbitron text-xs font-bold">CORE_TEMP</span>
                    </div>
                    <div className="flex items-end gap-2">
                        <span className="text-3xl font-mono text-white">{sysTemp}</span>
                        <span className="text-[10px] text-gray-500 mb-1">°C</span>
                    </div>
                </div>

                {/* Mini Logs */}
                <div className="glass-panel p-3 rounded-lg border border-green-900/50 bg-black/40 flex flex-col overflow-hidden">
                     <div className="flex items-center gap-2 text-green-600 mb-2">
                        <Terminal size={14} />
                        <span className="font-orbitron text-[10px] font-bold">KERNEL_LOG</span>
                     </div>
                     <div className="flex-1 overflow-hidden text-[9px] font-mono space-y-1">
                        {logs.slice(-3).map((l, i) => (
                            <div key={i} className={`truncate ${l.type === 'error' ? 'text-red-400' : 'text-gray-400'}`}>
                                {l.type === 'error' ? '!' : '>'} {l.msg}
                            </div>
                        ))}
                     </div>
                </div>
            </div>

            {/* Bottom: Interactive Chat */}
            <div className="flex-1 glass-panel rounded-lg border border-green-900 flex flex-col overflow-hidden relative">
                {/* Header */}
                <div className="p-2 bg-green-900/20 border-b border-green-900 flex items-center justify-between">
                     <div className="flex items-center gap-2 text-green-400">
                         <Radio size={14} className={isSpeaking ? "animate-pulse text-green-300" : ""} />
                         <span className="font-orbitron text-xs">NEURAL_LINK_V2</span>
                     </div>
                     <div className="flex items-center gap-3">
                         <div className="text-[9px] text-green-700 font-mono hidden md:block">AES-256 ENCRYPTED</div>
                         <button 
                             onClick={() => setIsMuted(!isMuted)} 
                             className={`text-green-500 hover:text-white transition-colors ${isMuted ? 'opacity-50' : 'opacity-100'}`}
                             title={isMuted ? "Unmute Audio" : "Mute Audio"}
                         >
                             {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                         </button>
                     </div>
                </div>

                {/* Messages */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-black/60 scrollbar-hide">
                    {chatHistory.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[90%] p-2.5 rounded text-xs font-mono border leading-relaxed ${
                                msg.role === 'user' 
                                ? 'bg-green-900/10 border-green-500/30 text-green-100 rounded-tr-none' 
                                : 'bg-gray-900/60 border-gray-700/50 text-gray-300 rounded-tl-none shadow-[0_0_10px_rgba(0,0,0,0.5)]'
                            }`}>
                                <span className={`text-[8px] font-bold block mb-1 opacity-60 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                                    {msg.role === 'user' ? 'OPERATOR' : 'DIGITAL_SOUL'}
                                </span>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isProcessing && (
                         <div className="flex justify-start">
                             <div className="text-green-500 text-[10px] font-mono animate-pulse flex items-center gap-1">
                                 <Zap size={10} /> processing_neural_query...
                             </div>
                         </div>
                    )}
                </div>

                {/* Input */}
                <div className="p-2 bg-black border-t border-green-900/50 flex gap-2">
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => initAudio()}
                        placeholder="Interact with the entity..."
                        className="flex-1 bg-gray-900/30 border border-green-900/50 rounded px-3 py-2 text-xs text-green-300 focus:outline-none focus:border-green-500/70 font-mono placeholder-green-900"
                    />
                    <button onClick={handleSend} className="px-3 bg-green-900/20 border border-green-500/30 text-green-400 rounded hover:bg-green-500/20 transition-colors">
                        <Send size={14} />
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default DigitalSoul;
