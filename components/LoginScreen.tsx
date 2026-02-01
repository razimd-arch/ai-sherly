import React, { useState, useEffect } from 'react';
import { Shield, Lock, ChevronRight, AlertTriangle, Terminal, Cpu } from 'lucide-react';
import MatrixRain from './MatrixRain';

interface LoginScreenProps {
  onLogin: (username: string) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'authenticating' | 'success' | 'error'>('idle');
  const [bootSequence, setBootSequence] = useState<string[]>([]);

  // Simulated Boot Sequence Animation
  useEffect(() => {
    const steps = [
      "INITIALIZING SECURE KERNEL...",
      "LOADING NEURAL MODULES...",
      "ESTABLISHING ENCRYPTED UPLINK...",
      "VERIFYING BIOMETRIC HASH...",
      "SYSTEM READY. WAITING FOR AUTHENTICATION."
    ];
    
    let i = 0;
    const interval = setInterval(() => {
      if (i < steps.length) {
        setBootSequence(prev => [...prev, steps[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 400);

    return () => clearInterval(interval);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 2000);
        return;
    }

    setStatus('authenticating');

    // Simulate Network Delay & Auth Check
    setTimeout(() => {
      // You can hardcode a password here if you want specific access control
      // For now, it accepts any non-empty password to be user-friendly for the demo
      if (password.length > 0) {
        setStatus('success');
        setTimeout(() => {
            onLogin(username);
        }, 1500);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 2000);
      }
    }, 2000);
  };

  return (
    <div className="relative min-h-screen w-full bg-black text-green-500 font-mono flex flex-col items-center justify-center overflow-hidden p-4">
      <MatrixRain />
      
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/90 to-black z-10 pointer-events-none"></div>

      {/* Login Card */}
      <div className="relative z-20 w-full max-w-md bg-gray-900/60 backdrop-blur-md border border-green-900/50 rounded-xl shadow-[0_0_50px_rgba(0,255,65,0.1)] p-6 md:p-8 flex flex-col gap-6 animate-in fade-in zoom-in duration-500">
        
        {/* Header */}
        <div className="text-center border-b border-green-900/50 pb-6">
          <div className="inline-block p-4 rounded-full bg-black border border-green-500 mb-4 shadow-[0_0_15px_rgba(0,255,65,0.3)]">
            <Shield size={48} className="animate-pulse" />
          </div>
          <h1 className="text-3xl md:text-4xl font-orbitron font-bold text-white tracking-wider mb-2">AI SHERLY</h1>
          <p className="text-xs md:text-sm text-green-600 tracking-[0.3em] font-bold">SECURE OPERATIONS CENTER</p>
        </div>

        {/* Boot Logs */}
        <div className="h-24 overflow-y-auto text-[10px] md:text-xs text-gray-500 font-mono border border-green-900/30 bg-black/50 p-3 rounded">
            {bootSequence.map((log, i) => (
                <div key={i} className="mb-1">
                    <span className="text-green-800 mr-2">[{new Date().toLocaleTimeString()}]</span>
                    {log}
                </div>
            ))}
            <div className="animate-pulse">_</div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2">
                    <Terminal size={14} /> Agent Codename
                </label>
                <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="ENTER IDENTIFIER"
                    className="w-full bg-black border border-green-800 rounded px-4 py-3 text-green-400 focus:border-green-400 focus:outline-none focus:shadow-[0_0_10px_rgba(0,255,65,0.2)] transition-all placeholder-green-900"
                    autoComplete="off"
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2">
                    <Lock size={14} /> Passphrase
                </label>
                <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-black border border-green-800 rounded px-4 py-3 text-green-400 focus:border-green-400 focus:outline-none focus:shadow-[0_0_10px_rgba(0,255,65,0.2)] transition-all placeholder-green-900"
                />
            </div>

            <button 
                type="submit"
                disabled={status === 'authenticating' || status === 'success'}
                className={`w-full py-4 rounded font-bold font-orbitron tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${
                    status === 'idle' || status === 'error' ? 'bg-green-600 hover:bg-green-500 text-black shadow-[0_0_20px_rgba(0,255,65,0.4)] hover:scale-[1.02]' :
                    status === 'authenticating' ? 'bg-yellow-600 text-black cursor-wait' :
                    'bg-green-500 text-black'
                }`}
            >
                {status === 'idle' && <>INITIALIZE UPLINK <ChevronRight /></>}
                {status === 'authenticating' && <><Cpu className="animate-spin" /> AUTHENTICATING...</>}
                {status === 'success' && <>ACCESS GRANTED</>}
                {status === 'error' && <><AlertTriangle /> ACCESS DENIED</>}
            </button>
        </form>

        {/* Footer */}
        <div className="text-center text-[10px] text-gray-600">
            <p>RESTRICTED AREA. UNAUTHORIZED ACCESS IS A FEDERAL OFFENSE.</p>
            <p className="mt-1">SESSION ID: {Math.random().toString(36).substring(7).toUpperCase()}</p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;