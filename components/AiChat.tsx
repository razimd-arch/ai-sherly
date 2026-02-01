import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, Wifi, ShieldAlert, Terminal } from 'lucide-react';
import { ChatMessage } from '../types';

const AiChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'model', 
      text: "System initialized. I am Sherly (Model v2.5 - SIMULATION MODE). Ready to assist with penetration testing, code analysis, and security protocols. How can I help you operator?", 
      timestamp: new Date().toLocaleTimeString() 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Simulated AI Logic
  const generateSimulatedResponse = (query: string): string => {
    const q = query.toLowerCase();
    
    // Knowledge Base
    if (q.includes('help') || q.includes('menu')) {
      return "Available Modules:\n1. Network Scanning (Nmap)\n2. Vulnerability Assessment\n3. Wireless Security\n4. Encryption Analysis\n\nTry asking about 'nmap commands', 'how to crack wifi', or 'explain ddos'.";
    }
    if (q.includes('nmap') || q.includes('scan')) {
      return "Nmap (Network Mapper) is essential. \n\nCommon commands:\n- `nmap -sS [target]` (SYN Stealth Scan)\n- `nmap -A [target]` (OS Detection & Version Scanning)\n- `nmap -p- [target]` (Scan all 65535 ports)\n\nDo you need to simulate a scan on a specific IP?";
    }
    if (q.includes('wifi') || q.includes('aircrack') || q.includes('wpa')) {
      return "Wireless auditing requires monitoring mode.\n\nProtocol:\n1. `airmon-ng start wlan0`\n2. `airodump-ng wlan0mon` (Capture handshake)\n3. `aircrack-ng -w wordlist.txt capture.cap`\n\nWarning: Only audit networks you own or have permission to test.";
    }
    if (q.includes('password') || q.includes('hash') || q.includes('crack')) {
      return "Password security depends on entropy. \n\nTools like John the Ripper or Hashcat use dictionary and brute-force attacks. \n\nRecommendation: Use bcrypt or Argon2 for hashing. Avoid MD5 or SHA-1 as they are collision-prone.";
    }
    if (q.includes('ddos') || q.includes('attack') || q.includes('flood')) {
      return "DDoS (Distributed Denial of Service) aims to overwhelm resources. \n\nTypes:\n- Volumetric (UDP Flood)\n- Protocol (SYN Flood)\n- Application Layer (HTTP Flood)\n\nMitigation: Rate limiting, WAF (Web Application Firewall), and Anycast networks.";
    }
    if (q.includes('sql') || q.includes('injection') || q.includes('database')) {
      return "SQL Injection (SQLi) occurs when untrusted data is sent to an interpreter. \n\nPayload Example: `' OR 1=1 --`\n\nPrevention: Always use prepared statements (Parameterized Queries).";
    }
    if (q.includes('phishing') || q.includes('email')) {
      return "Phishing remains the #1 initial access vector. \n\nIndicators:\n- Urgency cues\n- Mismatched domains (typosquatting)\n- Generic greetings\n\nAlways verify headers (SPF, DKIM, DMARC) before trusting an email.";
    }
    if (q.includes('who are you') || q.includes('identity')) {
      return "I am Sherly, a specialized Cyber Security AI construct designed to assist ethical hackers and SecOps teams. I run on a secure, isolated kernel.";
    }

    // Random Fallback Responses
    const fallbacks = [
      "Acknowledged. Analyzing parameters... No immediate threats detected in that context.",
      "Could you elaborate? I need more specific data to run a vulnerability assessment on that topic.",
      "Accessing secure archives... Data restricted. Please refine your query.",
      "That falls under advanced penetration testing protocols. Proceed with caution.",
      "Scanning knowledge base... Topic indexed. What specific aspect do you want to explore?",
      "System operating at optimal efficiency. Ready for next command.",
      "Encryption key verification required for deep analysis. Giving general overview instead."
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      role: 'user',
      text: input,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      const responseText = generateSimulatedResponse(userMsg.text);

      setMessages(prev => [...prev, {
        role: 'model',
        text: responseText,
        timestamp: new Date().toLocaleTimeString()
      }]);
      setIsLoading(false);
    }, 1000 + Math.random() * 1000); // 1-2 second delay
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-black border border-green-800 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-green-900 bg-black flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="p-2 rounded-full bg-green-500/20 border border-green-500 text-green-400 animate-pulse">
            <Bot size={20} />
          </div>
          <div>
            <h3 className="font-orbitron font-bold text-lg">AI_SHERLY.exe</h3>
            <p className="text-xs text-green-600">Secure Uplink • Local Simulation Mode</p>
          </div>
        </div>
        
        {/* Status Badge */}
        <div className="flex items-center gap-2 bg-green-900/20 border border-green-900 rounded px-3 py-1.5">
            <Wifi size={14} className="text-green-500 animate-pulse" />
            <span className="text-xs text-green-400 font-mono">NET_ACTIVE</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] md:max-w-[70%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              
              <div className={`w-8 h-8 rounded border flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user' ? 'bg-blue-900/20 border-blue-500 text-blue-400' : 'bg-green-900/20 border-green-500 text-green-400'
              }`}>
                {msg.role === 'user' ? <User size={14} /> : <Sparkles size={14} />}
              </div>

              <div className={`p-3 rounded-lg border text-sm whitespace-pre-wrap ${
                 msg.role === 'user' 
                 ? 'bg-blue-950/40 border-blue-900 text-gray-200' 
                 : 'bg-green-950/40 border-green-900 text-gray-300'
              }`}>
                <div className="flex justify-between items-center mb-1 opacity-50 text-[10px] font-mono uppercase">
                   <span>{msg.role}</span>
                   <span>{msg.timestamp}</span>
                </div>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="flex items-center gap-2 text-green-500 bg-green-900/10 px-4 py-2 rounded-full border border-green-900">
                <Loader2 size={14} className="animate-spin" />
                <span className="text-xs font-mono">Processing Neural Request...</span>
             </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-black border-t border-green-900">
        <div className="relative flex items-center gap-2">
           <textarea
             value={input}
             onChange={(e) => setInput(e.target.value)}
             onKeyDown={handleKeyDown}
             placeholder="Query the AI mainframe..."
             className="w-full bg-gray-900/50 border border-green-800 rounded px-4 py-3 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500/50 resize-none h-12 text-gray-200 placeholder-gray-600"
           />
           <button 
             onClick={handleSend}
             disabled={isLoading}
             className="p-3 bg-green-600 hover:bg-green-500 text-black rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
           >
             <Send size={18} />
           </button>
        </div>
        <div className="text-[10px] text-gray-600 mt-2 text-center font-mono">
            AI Sherly (Simulation Mode). Verify critical security intel.
        </div>
      </div>
    </div>
  );
};

export default AiChat;