import React, { useState, useEffect } from 'react';
import { Shield, Lock, ChevronRight, AlertTriangle, Terminal, Cpu, Fingerprint } from 'lucide-react';
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
      // In a real app, validate password here. 
      // For this demo, we accept any input to let users try it.
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
      <div className="relative z-20 w-full max-w-md bg-gray-900/80 backdrop-blur-md border border-green-900/50 rounded-xl shadow-[0_0_50px_rgba(0,255,65,0.15)] p-6 md:p-8 flex flex-col gap-6 animate-in fade-in zoom-in duration-500">
        
        {/* Header */}
        <div className="text-center border-b border-green-900/50 pb-6">
          <div className="inline-block p-4 rounded-full bg-black border border-green-500 mb-4 shadow-[0_0_15px_rgba(0,255,65,0.3)] relative group">
            <Shield size={48} className="animate-pulse relative z-10" />
            <div className="absolute inset-0 rounded-full bg-green-500/20 blur-md group-hover:bg-green-500/40 transition-all"></div>
          </div>
          <h1 className="text-3xl md:text-4xl font-orbitron font-bold text-white tracking-wider mb-2">AI SHERLY</h1>
          <div className="flex justify-center items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
            <p className="text-xs md:text-sm text-green-600 tracking-[0.3em] font-bold">SECURE OPS CENTER</p>
          </div>
        </div>

        {/* Boot Logs */}
        <div className="h-24 overflow-y-auto text-[10px] md:text-xs text-gray-500 font-mono border border-green-900/30 bg-black/50 p-3 rounded custom-scrollbar shadow-inner">
            {bootSequence.map((log, i) => (
                <div key={i} className="mb-1 border-l-2 border-transparent hover:border-green-500 pl-1 transition-colors">
                    <span className="text-green-800 mr-2">[{new Date().toLocaleTimeString()}]</span>
                    {log}
                </div>
            ))}
            <div className="animate-pulse text-green-500">_</div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2 group">
                <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2 group-focus-within:text-green-400 transition-colors">
                    <Terminal size={14} /> Agent Codename
                </label>
                <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="ENTER CODENAME"
                    className="w-full bg-black/50 border border-green-900 rounded px-4 py-3 text-green-400 focus:border-green-400 focus:bg-green-900/10 focus:outline-none focus:shadow-[0_0_15px_rgba(0,255,65,0.1)] transition-all placeholder-green-900/50"
                    autoComplete="off"
                />
            </div>

            <div className="space-y-2 group">
                <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2 group-focus-within:text-green-400 transition-colors">
                    <Lock size={14} /> Passphrase
                </label>
                <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-black/50 border border-green-900 rounded px-4 py-3 text-green-400 focus:border-green-400 focus:bg-green-900/10 focus:outline-none focus:shadow-[0_0_15px_rgba(0,255,65,0.1)] transition-all placeholder-green-900/50"
                />
            </div>

            <button 
                type="submit"
                disabled={status === 'authenticating' || status === 'success'}
                className={`w-full py-4 rounded font-bold font-orbitron tracking-widest transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden group ${
                    status === 'idle' || status === 'error' ? 'bg-green-600 hover:bg-green-500 text-black shadow-[0_0_20px_rgba(0,255,65,0.4)] hover:scale-[1.02]' :
                    status === 'authenticating' ? 'bg-yellow-600 text-black cursor-wait' :
                    'bg-green-500 text-black'
                }`}
            >
                {status === 'idle' && (
                    <>
                        INITIALIZE UPLINK <ChevronRight className="group-hover:translate-x-1 transition-transform"/>
                    </>
                )}
                {status === 'authenticating' && (
                    <>
                        <Cpu className="animate-spin" /> AUTHENTICATING...
                    </>
                )}
                {status === 'success' && (
                    <>
                        <Fingerprint className="animate-pulse" /> ACCESS GRANTED
                    </>
                )}
                {status === 'error' && (
                    <>
                        <AlertTriangle /> ACCESS DENIED
                    </>
                )}
            </button>
        </form>

        {/* Footer */}
        <div className="text-center text-[10px] text-gray-600 border-t border-green-900/30 pt-4">
            <p>RESTRICTED AREA. UNAUTHORIZED ACCESS IS A FEDERAL OFFENSE.</p>
            <p className="mt-1 font-mono text-green-900">SESSION ID: {Math.random().toString(36).substring(7).toUpperCase()}</p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;