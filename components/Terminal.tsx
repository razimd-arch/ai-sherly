import React, { useState, useEffect, useRef } from 'react';
import { TerminalLine } from '../types';
import { Terminal as TerminalIcon } from 'lucide-react';

const Terminal: React.FC = () => {
  const [history, setHistory] = useState<TerminalLine[]>([
    { type: 'output', content: 'AI Sherly Cyber Security Lab v1.0.0', timestamp: new Date().toLocaleTimeString() },
    { type: 'output', content: "Type 'help' for available commands.", timestamp: new Date().toLocaleTimeString() }
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (cmd: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const newHistory = [...history, { type: 'input' as const, content: cmd, timestamp }];
    
    const args = cmd.trim().toLowerCase().split(' ');
    const mainCmd = args[0];

    let response = '';

    switch (mainCmd) {
      case 'help':
        response = `Available commands:
  help      - Show this message
  clear     - Clear terminal
  nmap      - [target] Scan ports
  whois     - [domain] Domain info
  ping      - [host] Ping host
  date      - Show current date
  whoami    - Show current user`;
        break;
      case 'clear':
        setHistory([]);
        return;
      case 'whoami':
        response = 'sherly@kali-linux';
        break;
      case 'date':
        response = new Date().toString();
        break;
      case 'ping':
        if (!args[1]) response = 'Usage: ping [host]';
        else response = `PING ${args[1]} (127.0.0.1): 56 data bytes\n64 bytes from 127.0.0.1: icmp_seq=0 ttl=64 time=0.045 ms\n64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.038 ms\n--- ${args[1]} ping statistics ---`;
        break;
      case 'nmap':
        if (!args[1]) response = 'Usage: nmap [target]';
        else response = `Starting Nmap 7.94 ( https://nmap.org )\nNmap scan report for ${args[1]}\nHost is up (0.0024s latency).\nNot shown: 997 closed ports\nPORT    STATE SERVICE\n22/tcp  open  ssh\n80/tcp  open  http\n443/tcp open  https\n\nNmap done: 1 IP address (1 host up) scanned in 0.12 seconds`;
        break;
      case 'whois':
        if (!args[1]) response = 'Usage: whois [domain]';
        else response = `Domain Name: ${args[1].toUpperCase()}\nRegistry Domain ID: 123456789_DOMAIN_COM-VRSN\nRegistrar WHOIS Server: whois.example.com\nRegistrar URL: http://www.example.com\nUpdated Date: 2023-11-15T04:22:11Z\nCreation Date: 2000-09-14T01:00:00Z\nRegistry Expiry Date: 2025-09-14T04:00:00Z`;
        break;
      default:
        response = `Command not found: ${mainCmd}`;
    }

    if (response) {
      newHistory.push({ type: 'output', content: response, timestamp });
    }

    setHistory(newHistory);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (input.trim()) {
        handleCommand(input);
        setInput('');
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-950 rounded-lg overflow-hidden border border-green-900 shadow-[0_0_15px_rgba(0,255,65,0.15)]">
      <div className="bg-gray-900 px-4 py-2 flex items-center gap-2 border-b border-green-900">
        <TerminalIcon size={16} />
        <span className="text-sm font-semibold">sherly@kali:~</span>
        <div className="flex gap-1.5 ml-auto">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto font-mono text-sm space-y-2">
        {history.map((line, i) => (
          <div key={i} className={`${line.type === 'input' ? 'text-green-400' : 'text-gray-300'}`}>
             {line.type === 'input' ? (
               <div className="flex gap-2">
                 <span className="text-blue-400 font-bold">➜</span>
                 <span className="text-green-300 font-bold">~</span>
                 <span>{line.content}</span>
               </div>
             ) : (
               <div className="whitespace-pre-wrap ml-6 opacity-90">{line.content}</div>
             )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="p-3 bg-gray-900 border-t border-green-900 flex items-center gap-2">
        <span className="text-blue-400 font-bold">➜</span>
        <span className="text-green-300 font-bold">~</span>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none text-green-400 placeholder-green-900"
          placeholder="Enter command..."
          autoFocus
        />
      </div>
    </div>
  );
};

export default Terminal;