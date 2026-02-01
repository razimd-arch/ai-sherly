
import React, { useState, useEffect } from 'react';
import { 
  Shield, Activity, Terminal as TerminalIcon, 
  Zap, FileText, Info, Globe, Lock, Search, 
  Wifi, Bot, Database, Menu, X, ChevronRight, Server, Eye, Cpu, Radio, Layers,
  Bug, User, Laptop, Key, Map as MapIcon, Crosshair, Skull, UserCheck, Users, Target, Code, ShieldAlert
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, BarChart, Bar, Cell
} from 'recharts';

import Terminal from './components/Terminal';
import AttackSim from './components/AttackSim';
import AiChat from './components/AiChat';
import DatabaseViewer from './components/DatabaseViewer';
import ToolSim from './components/ToolSim';
import RatSim from './components/RatSim';
import CryptoLab from './components/CryptoLab';
import WorldMap from './components/WorldMap';
import DigitalSoul from './components/DigitalSoul';
import TargetList from './components/TargetList';
import CodeEditor from './components/CodeEditor';
import { TabType, LogEntry, Tool } from './types';

// --- Main App Component ---
const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<Tool | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [networkData, setNetworkData] = useState<any[]>([]);
  const [freqData, setFreqData] = useState<any[]>([]); // New Frequency Data
  const [honeypotData, setHoneypotData] = useState<any[]>([]);
  const [stats, setStats] = useState({
    threats: 0,
    blocked: 0,
    networkLoad: 0
  });

  // Data Simulation Effect
  useEffect(() => {
    // Init Frequency Data
    const initFreq = Array.from({ length: 20 }, (_, i) => ({
        band: `${(i * 100)}MHz`,
        val: Math.random() * 100
    }));
    setFreqData(initFreq);

    const interval = setInterval(() => {
      const now = new Date().toLocaleTimeString();
      
      // Update Chart Data
      setNetworkData(prev => {
        const newData = [...prev, {
          time: now,
          inbound: Math.floor(Math.random() * 100) + 20,
          outbound: Math.floor(Math.random() * 80) + 10,
        }];
        return newData.slice(-20); 
      });

      // Update Frequency Data (Spectrum Analyzer Effect)
      setFreqData(prev => prev.map(item => ({
          ...item,
          val: Math.max(10, Math.min(100, item.val + (Math.random() - 0.5) * 60))
      })));

      // Update Honeypot Data (New)
      setHoneypotData(prev => {
        const protocols = ['SSH', 'FTP', 'HTTP', 'SMB', 'RDP'];
        const randomProto = protocols[Math.floor(Math.random() * protocols.length)];
        const newData = [...prev, {
            protocol: randomProto,
            attacks: Math.floor(Math.random() * 50)
        }];
        if (newData.length > 5) return newData.slice(1);
        return newData;
      });

      // Update Stats
      setStats(prev => ({
        threats: prev.threats + (Math.random() > 0.8 ? 1 : 0),
        blocked: prev.blocked + (Math.random() > 0.7 ? 1 : 0),
        networkLoad: Math.floor(Math.random() * 40) + 30
      }));

      // Random Logs
      if (Math.random() > 0.7) {
        const msgs = [
          "Port scan terdeteksi dari 103.20.x.x",
          "Login SSH gagal untuk user 'admin'",
          "Lonjakan traffic outbound terdeteksi",
          "Signature Malware diblokir oleh Firewall",
          "Query DNS ke domain berbahaya (Judi Online)",
          "AI Sherly menganalisis anomali paket",
          "Rule Firewall diperbarui otomatis",
          "Honeypot 'Zeus' menangkap payload baru",
          "Koneksi RDP mencurigakan dari IP Rusia"
        ];
        const msg = msgs[Math.floor(Math.random() * msgs.length)];
        const type = msg.includes("diblokir") || msg.includes("diperbarui") ? "success" : msg.includes("terdeteksi") || msg.includes("mencurigakan") ? "warning" : "info";
        
        setLogs(prev => [{
          id: Math.random().toString(36).substr(2, 9),
          timestamp: now,
          message: msg,
          type: type as any
        }, ...prev].slice(0, 10));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return <DashboardView stats={stats} networkData={networkData} logs={logs} honeypotData={honeypotData} freqData={freqData} />;
      case 'terminal':
        return <Terminal />;
      case 'attack':
        return <AttackSim />;
      case 'c2':
        return <RatSim />;
      case 'crypto':
        return <CryptoLab />;
      case 'ai_chat':
        return <AiChat />;
      case 'database':
        return <DatabaseViewer />;
      case 'map':
        return <WorldMap />;
      case 'avatar':
        return <DigitalSoul />;
      case 'targets':
        return <TargetList />;
      case 'tools':
        return <ToolsView onLaunch={(tool) => setActiveTool(tool)} />;
      case 'code_editor':
        return <CodeEditor />;
      case 'docs':
        return <DocsView />;
      case 'about':
        return <AboutView />;
      default:
        return <div className="p-10 text-center text-xl">Module Under Construction</div>;
    }
  };

  return (
    <div className="flex h-screen bg-black text-green-400 overflow-hidden relative font-mono selection:bg-green-500 selection:text-black">
      
      {/* Desktop Sidebar */}
      <aside className="w-64 z-30 bg-black border-r border-green-900 flex flex-col hidden md:flex">
        <SidebarContent activeTab={activeTab} onTabChange={handleTabChange} />
      </aside>

      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/90 md:hidden flex flex-col animate-fade-in">
          <div className="flex justify-end p-4">
             <button onClick={() => setIsMobileMenuOpen(false)} className="text-white hover:text-green-500">
               <X size={32} />
             </button>
          </div>
          <div className="p-6">
            <SidebarContent activeTab={activeTab} onTabChange={handleTabChange} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 z-10 flex flex-col relative h-full transition-all bg-black">
        {/* Header Mobile */}
        <header className="md:hidden p-4 border-b border-green-900 flex justify-between items-center bg-black">
          <div className="flex items-center gap-2">
            <Shield className="text-green-500" size={24} />
            <span className="font-bold font-orbitron text-white">AI SHERLY</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(true)} className="text-green-500 hover:text-white transition-colors">
            <Menu size={28} />
          </button>
        </header>

        {/* Dynamic Content Area */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden relative bg-black">
           {renderContent()}
        </div>
      </main>

      {/* Tool Simulation Modal */}
      {activeTool && (
        <ToolSim tool={activeTool} onClose={() => setActiveTool(null)} />
      )}
      
      {/* Visual Effects */}
      <div className="pointer-events-none fixed inset-0 z-50 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] opacity-50"></div>
    </div>
  );
};

// --- Sub Components ---

const SidebarContent: React.FC<{activeTab: TabType, onTabChange: (t: TabType) => void}> = ({ activeTab, onTabChange }) => (
  <>
    <div className="p-6 border-b border-green-900 flex items-center gap-3">
      <div className="relative group">
        <div className="w-12 h-12 rounded-full border-2 border-green-500 flex items-center justify-center group-hover:shadow-[0_0_15px_#00ff41] transition-shadow bg-black">
          <Shield size={24} className="group-hover:animate-pulse" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black animate-bounce"></div>
      </div>
      <div>
        <h1 className="font-bold font-orbitron text-xl tracking-wider text-white">AI SHERLY</h1>
        <p className="text-[10px] text-green-600 tracking-[0.2em] font-bold">SEC_OPS_CENTER</p>
      </div>
    </div>

    <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
      <div className="text-xs text-gray-500 uppercase tracking-wider mb-2 mt-2 font-bold px-2">Core Modules</div>
      <NavButton active={activeTab === 'dashboard'} onClick={() => onTabChange('dashboard')} icon={<Activity size={18} />} label="Dashboard" />
      <NavButton active={activeTab === 'ai_chat'} onClick={() => onTabChange('ai_chat')} icon={<Bot size={18} />} label="AI Sherly Chat" badge="AI" />
      <NavButton active={activeTab === 'terminal'} onClick={() => onTabChange('terminal')} icon={<TerminalIcon size={18} />} label="Terminal CLI" />
      <NavButton active={activeTab === 'map'} onClick={() => onTabChange('map')} icon={<MapIcon size={18} />} label="Global Threat Map" badge="LIVE" />
      <NavButton active={activeTab === 'avatar'} onClick={() => onTabChange('avatar')} icon={<UserCheck size={18} />} label="Digital Soul" />
      
      <div className="text-xs text-gray-500 uppercase tracking-wider mb-2 mt-6 font-bold px-2">Offensive Ops</div>
      <NavButton active={activeTab === 'targets'} onClick={() => onTabChange('targets')} icon={<Target size={18} />} label="Wanted List" badge="NEW" />
      <NavButton active={activeTab === 'tools'} onClick={() => onTabChange('tools')} icon={<Search size={18} />} label="Tool Armory" />
      <NavButton active={activeTab === 'code_editor'} onClick={() => onTabChange('code_editor')} icon={<Code size={18} />} label="Script Forge" />
      <NavButton active={activeTab === 'attack'} onClick={() => onTabChange('attack')} icon={<Zap size={18} />} label="Attack Sim" />
      <NavButton active={activeTab === 'c2'} onClick={() => onTabChange('c2')} icon={<Laptop size={18} />} label="Command & Control" badge="RAT" />
      <NavButton active={activeTab === 'crypto'} onClick={() => onTabChange('crypto')} icon={<Key size={18} />} label="Cryptography" />
      <NavButton active={activeTab === 'database'} onClick={() => onTabChange('database')} icon={<Database size={18} />} label="Data Breach" badge="LEAK" />
      
      <div className="text-xs text-gray-500 uppercase tracking-wider mb-2 mt-6 font-bold px-2">System</div>
      <NavButton active={activeTab === 'docs'} onClick={() => onTabChange('docs')} icon={<FileText size={18} />} label="Documentation" />
      <NavButton active={activeTab === 'about'} onClick={() => onTabChange('about')} icon={<Info size={18} />} label="System Info" />
    </nav>

    <div className="p-4 border-t border-green-900 bg-black/20">
      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
        <span>STATUS UPLINK</span>
        <span className="text-green-500 animate-pulse">AMAN</span>
      </div>
      <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
        <div className="bg-green-500 h-full w-[85%]"></div>
      </div>
      <p className="font-mono mt-2 text-xs text-green-800 text-center">IP: 103.14.88.2 [VPN]</p>
    </div>
  </>
);

const NavButton: React.FC<{active: boolean, onClick: () => void, icon: React.ReactNode, label: string, badge?: string}> = ({ active, onClick, icon, label, badge }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between px-4 py-3 rounded transition-all duration-200 group relative overflow-hidden ${
      active 
        ? 'bg-green-900/20 text-green-400 border border-green-500/50 shadow-[0_0_15px_rgba(0,255,65,0.1)] translate-x-1' 
        : 'text-gray-400 hover:text-green-300 hover:bg-green-500/5 hover:translate-x-1'
    }`}
  >
    <div className="flex items-center gap-3 relative z-10">
      {icon}
      <span className="font-medium tracking-wide">{label}</span>
    </div>
    {active && <ChevronRight size={16} className="text-green-500 animate-pulse" />}
    {badge && !active && <span className="text-[9px] bg-red-900/50 text-red-400 px-1.5 py-0.5 rounded border border-red-900">{badge}</span>}
  </button>
);

const DashboardView: React.FC<any> = ({ stats, networkData, logs, honeypotData, freqData }) => (
  <div className="space-y-6 overflow-y-auto h-full pb-20 scrollbar-hide">
    {/* Top Stats */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard label="Active Threats" value={stats.threats} icon={<Zap size={20} className="text-red-500" />} color="red" />
      <StatCard label="Mitigated Attacks" value={stats.blocked} icon={<Shield size={20} className="text-green-500" />} color="green" />
      <StatCard label="Net Traffic" value={`${stats.networkLoad}%`} icon={<Activity size={20} className="text-blue-500" />} color="blue" />
      <StatCard label="System Integrity" value="98.2%" icon={<Lock size={20} className="text-green-400" />} color="green" />
    </div>

    {/* Main Charts Area */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Network Traffic */}
      <div className="lg:col-span-2 glass-panel p-4 rounded-lg h-80 relative overflow-hidden border border-green-900 bg-black/40 flex flex-col">
        <h3 className="text-lg font-orbitron mb-4 flex items-center gap-2 relative z-10">
          <Activity size={18} className="text-green-500" /> Real-time Traffic Analysis
        </h3>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={networkData}>
              <defs>
                <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00ff41" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00ff41" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0096ff" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0096ff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="time" stroke="#4b5563" fontSize={10} tick={{fill: '#6b7280'}} />
              <YAxis stroke="#4b5563" fontSize={10} tick={{fill: '#6b7280'}} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', borderColor: '#00ff41', color: '#00ff41', fontFamily: 'monospace' }}
                itemStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="inbound" stroke="#00ff41" strokeWidth={2} fillOpacity={1} fill="url(#colorIn)" />
              <Area type="monotone" dataKey="outbound" stroke="#0096ff" strokeWidth={2} fillOpacity={1} fill="url(#colorOut)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* NEW: Frequency Spectrum Graph */}
      <div className="glass-panel p-4 rounded-lg border border-green-900 bg-black/40 flex flex-col relative overflow-hidden h-80">
         <h3 className="text-lg font-orbitron mb-4 flex items-center gap-2 relative z-10">
           <Radio size={18} className="text-yellow-500 animate-pulse" /> RF Spectrum Analyzer
         </h3>
         <div className="flex-1 relative bg-gray-900/20 rounded border border-green-900/30 overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={freqData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                    <XAxis dataKey="band" hide />
                    <Tooltip 
                        cursor={{fill: 'rgba(255,255,255,0.05)'}}
                        contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', borderColor: '#eab308', color: '#eab308', fontFamily: 'monospace' }}
                    />
                    <Bar dataKey="val" fill="#eab308" animationDuration={300}>
                         {
                           freqData?.map((entry: any, index: number) => (
                             <Cell key={`cell-${index}`} fillOpacity={0.4 + (entry.val/200)} fill={entry.val > 80 ? '#ef4444' : '#eab308'} />
                           ))
                         }
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
         </div>
         <div className="mt-2 flex justify-between text-[10px] text-gray-500 font-mono">
            <span>2.4 GHz</span>
            <span>BANDWIDTH: 40MHz</span>
            <span>5.0 GHz</span>
         </div>
      </div>
    </div>

    {/* Bottom Section */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Logs */}
      <div className="lg:col-span-2 glass-panel p-4 rounded-lg border border-green-900 bg-black/40">
        <h3 className="text-lg font-orbitron mb-3 flex items-center gap-2">
            <TerminalIcon size={18} /> System Event Logs
        </h3>
        <div className="space-y-1 max-h-60 overflow-y-auto pr-2 font-mono text-xs">
          {logs.map((log: LogEntry) => (
            <div key={log.id} className="flex gap-3 p-2 bg-black/40 rounded border-l-2 border-green-500/20 hover:bg-green-500/5 hover:border-green-500 transition-all">
              <span className="text-gray-500 shrink-0">{log.timestamp}</span>
              <span className={`break-words ${log.type === 'warning' ? 'text-yellow-400' : log.type === 'success' ? 'text-green-400' : 'text-blue-300'}`}>
                {log.type.toUpperCase()}: {log.message}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Honeypot Stats */}
      <div className="glass-panel p-4 rounded-lg flex flex-col border border-green-900 bg-black/40">
        <h3 className="text-lg font-orbitron mb-3 flex items-center gap-2">
           <Crosshair size={18} className="text-purple-500"/> Honeypot Hits
        </h3>
        <div className="flex-1 min-h-[150px]">
           <ResponsiveContainer width="100%" height="100%">
             <BarChart data={honeypotData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="protocol" stroke="#6b7280" fontSize={10} />
                <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', borderColor: '#00ff41', color: '#00ff41', fontFamily: 'monospace' }}
                />
                <Bar dataKey="attacks" fill="#8884d8" barSize={20}>
                    {
                      honeypotData?.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#a855f7' : '#ec4899'} />
                      ))
                    }
                </Bar>
             </BarChart>
           </ResponsiveContainer>
        </div>
      </div>
    </div>
  </div>
);

const ToolsView: React.FC<{onLaunch: (t: Tool) => void}> = ({ onLaunch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Generating 100 Tools List
  const tools: Tool[] = [
    // 1. Information Gathering (20)
    { id: 'nmap', name: "Nmap", description: "Network Mapper - The standard for network discovery.", category: "Recon", icon: <Globe />, command: 'nmap -sS -A 103.56.x.x' },
    { id: 'recon-ng', name: "Recon-ng", description: "Full-featured web reconnaissance framework.", category: "Recon", icon: <Search />, command: 'recon-ng' },
    { id: 'maltego', name: "Maltego", description: "Interactive data mining tool.", category: "Recon", icon: <Layers />, command: 'maltego' },
    { id: 'shodan', name: "Shodan CLI", description: "Search engine for Internet-connected devices.", category: "Recon", icon: <Globe />, command: 'shodan search apache' },
    { id: 'theharvester', name: "theHarvester", description: "E-mail, subdomain and people names harvester.", category: "Recon", icon: <Eye />, command: 'theHarvester -d target.id -b google' },
    { id: 'amass', name: "Amass", description: "In-depth DNS enumeration and network mapping.", category: "Recon", icon: <Globe />, command: 'amass enum -d example.co.id' },
    { id: 'sublist3r', name: "Sublist3r", description: "Fast subdomains enumeration tool.", category: "Recon", icon: <Search />, command: 'sublist3r -d target.com' },
    { id: 'netdiscover', name: "Netdiscover", description: "Active/passive ARP reconnaissance.", category: "Recon", icon: <Wifi />, command: 'netdiscover -r 192.168.1.0/24' },
    { id: 'dmitry', name: "Dmitry", description: "Deepmagic Information Gathering Tool.", category: "Recon", icon: <Search />, command: 'dmitry -winsep target.com' },
    { id: 'spiderfoot', name: "SpiderFoot", description: "Open Source Intelligence Automation.", category: "Recon", icon: <Bot />, command: 'spiderfoot -l 127.0.0.1:5001' },
    { id: 'whatweb', name: "WhatWeb", description: "Next generation web scanner.", category: "Recon", icon: <Globe />, command: 'whatweb google.com' },
    { id: 'whois', name: "Whois", description: "Domain registration information.", category: "Recon", icon: <Info />, command: 'whois go.id' },
    { id: 'nslookup', name: "Nslookup", description: "Query Internet name servers interactively.", category: "Recon", icon: <TerminalIcon />, command: 'nslookup google.com' },
    { id: 'dig', name: "Dig", description: "DNS lookup utility.", category: "Recon", icon: <TerminalIcon />, command: 'dig google.com' },
    { id: 'fierce', name: "Fierce", description: "DNS reconnaissance tool for locating non-contiguous IP space.", category: "Recon", icon: <Globe />, command: 'fierce -dns example.com' },
    { id: 'masscan', name: "Masscan", description: "Mass IP port scanner.", category: "Recon", icon: <Zap />, command: 'masscan -p80 10.0.0.0/8' },
    { id: 'enum4linux', name: "Enum4linux", description: "SMB enumeration tool.", category: "Recon", icon: <Server />, command: 'enum4linux -a 192.168.1.5' },
    { id: 'snmpwalk', name: "Snmpwalk", description: "Communicate with a network entity using SNMP.", category: "Recon", icon: <Activity />, command: 'snmpwalk -v1 -c public 192.168.1.1' },
    { id: 'wafw00f', name: "Wafw00f", description: "Identifies and fingerprints Web Application Firewall.", category: "Recon", icon: <Shield />, command: 'wafw00f https://target.com' },
    { id: 'hping3', name: "Hping3", description: "Packet generator and analyzer for TCP/IP.", category: "Recon", icon: <Zap />, command: 'hping3 -S target.com -p 80' },

    // 2. Web Analysis (15)
    { id: 'burp', name: "Burp Suite", description: "Web vulnerability scanner.", category: "Web", icon: <Search />, command: 'java -jar burpsuite.jar' },
    { id: 'owasp-zap', name: "OWASP ZAP", description: "Integrated penetration testing tool for finding vulnerabilities.", category: "Web", icon: <Shield />, command: 'zap-cli quick-scan https://target.com' },
    { id: 'nikto', name: "Nikto", description: "Web server scanner.", category: "Web", icon: <Search />, command: 'nikto -h target.com' },
    { id: 'dirb', name: "Dirb", description: "Web content scanner.", category: "Web", icon: <FileText />, command: 'dirb http://target.com' },
    { id: 'gobuster', name: "Gobuster", description: "Directory/file & DNS busting tool.", category: "Web", icon: <Zap />, command: 'gobuster dir -u http://target.com -w wordlist.txt' },
    { id: 'wfuzz', name: "Wfuzz", description: "Web application fuzzer.", category: "Web", icon: <Bug />, command: 'wfuzz -c -z file,common.txt --hc 404 http://target.com/FUZZ' },
    { id: 'commix', name: "Commix", description: "Automated All-in-One OS Command Injection.", category: "Web", icon: <TerminalIcon />, command: 'commix --url="http://target.com?id=1"' },
    { id: 'sqlmap', name: "Sqlmap", description: "Automatic SQL injection tool.", category: "Web", icon: <Database />, command: 'sqlmap -u "http://target.com?id=1" --dbs' },
    { id: 'wpscan', name: "WPScan", description: "WordPress security scanner.", category: "Web", icon: <Search />, command: 'wpscan --url target.com' },
    { id: 'joomscan', name: "JoomScan", description: "Joomla security scanner.", category: "Web", icon: <Search />, command: 'joomscan -u target.com' },
    { id: 'droopescan', name: "Droopescan", description: "Plugin scanner for Drupal, SilverStripe, etc.", category: "Web", icon: <Search />, command: 'droopescan scan drupal -u target.com' },
    { id: 'skipfish', name: "Skipfish", description: "Active web application security reconnaissance tool.", category: "Web", icon: <Search />, command: 'skipfish -o output_dir http://target.com' },
    { id: 'ffuf', name: "Ffuf", description: "Fast web fuzzer written in Go.", category: "Web", icon: <Zap />, command: 'ffuf -w wordlist.txt -u http://target.com/FUZZ' },
    { id: 'xsser', name: "XSSer", description: "Cross Site 'Scripter' (aka XSSer).", category: "Web", icon: <TerminalIcon />, command: 'xsser --url "http://target.com"' },
    { id: 'xsstrike', name: "XSStrike", description: "Advanced XSS detection suite.", category: "Web", icon: <TerminalIcon />, command: 'python3 xsstrike.py -u "http://target.com?q=test"' },

    // 3. Vulnerability Analysis (10)
    { id: 'nessus', name: "Nessus", description: "Vulnerability scanner.", category: "Vuln", icon: <Shield />, command: '/etc/init.d/nessusd start' },
    { id: 'openvas', name: "OpenVAS", description: "Open vulnerability assessment system.", category: "Vuln", icon: <Shield />, command: 'openvas-start' },
    { id: 'golismero', name: "Golismero", description: "Web application testing framework.", category: "Vuln", icon: <Search />, command: 'golismero scan target.com' },
    { id: 'lynus', name: "Lynis", description: "Security auditing tool for Unix based systems.", category: "Vuln", icon: <FileText />, command: 'lynis audit system' },
    { id: 'tiger', name: "Tiger", description: "UNIX security audit and intrusion detection tool.", category: "Vuln", icon: <Shield />, command: 'tiger' },
    { id: 'yara', name: "Yara", description: "Pattern matching swiss knife for malware.", category: "Vuln", icon: <Search />, command: 'yara rules.yar target_file' },
    { id: 'clamav', name: "ClamAV", description: "Open source antivirus engine.", category: "Vuln", icon: <Shield />, command: 'clamscan -r /home' },
    { id: 'rkhunter', name: "Rkhunter", description: "Rootkit Hunter.", category: "Vuln", icon: <Search />, command: 'rkhunter --check' },
    { id: 'chkrootkit', name: "Chkrootkit", description: "Check for signs of a rootkit.", category: "Vuln", icon: <Search />, command: 'chkrootkit' },
    { id: 'lisen', name: "Lisen", description: "Linux security auditing.", category: "Vuln", icon: <TerminalIcon />, command: 'lisen' },

    // 4. Wireless Attacks (10)
    { id: 'aircrack', name: "Aircrack-ng", description: "WiFi network security auditing.", category: "Wireless", icon: <Wifi />, command: 'aircrack-ng capture.cap' },
    { id: 'kismet', name: "Kismet", description: "Wireless network detector and sniffer.", category: "Wireless", icon: <Radio />, command: 'kismet' },
    { id: 'wifite', name: "Wifite", description: "Automated wireless attack tool.", category: "Wireless", icon: <Wifi />, command: 'wifite' },
    { id: 'reaver', name: "Reaver", description: "Brute force attack against WPS.", category: "Wireless", icon: <Wifi />, command: 'reaver -i wlan0mon -b MAC' },
    { id: 'fern', name: "Fern WiFi", description: "Wireless security audit software.", category: "Wireless", icon: <Wifi />, command: 'fern-wifi-cracker' },
    { id: 'pixiewps', name: "Pixiewps", description: "Offline WPS bruteforce tool.", category: "Wireless", icon: <Lock />, command: 'pixiewps -e PKE -s E-Hash' },
    { id: 'bluez', name: "BlueZ", description: "Bluetooth protocol stack.", category: "Wireless", icon: <Radio />, command: 'hcitool scan' },
    { id: 'spooftooph', name: "Spooftooph", description: "Bluetooth spoofing/cloning.", category: "Wireless", icon: <Radio />, command: 'spooftooph -i hci0 -s' },
    { id: 'mdk3', name: "MDK3", description: "WLAN DoS/stress testing tool.", category: "Wireless", icon: <Zap />, command: 'mdk3 wlan0mon d' },
    { id: 'bully', name: "Bully", description: "WPS brute force attack implementation in C.", category: "Wireless", icon: <Lock />, command: 'bully wlan0mon -b MAC' },

    // 5. Password Attacks (10)
    { id: 'john', name: "John the Ripper", description: "Advanced Password cracker.", category: "Cracking", icon: <Lock />, command: 'john --wordlist=rockyou.txt hash.txt' },
    { id: 'hashcat', name: "Hashcat", description: "World's fastest password cracker.", category: "Cracking", icon: <Cpu />, command: 'hashcat -m 0 hash.txt rockyou.txt' },
    { id: 'hydra', name: "Hydra", description: "Parallelized login cracker.", category: "Cracking", icon: <Lock />, command: 'hydra -l user -P pass.txt ssh://target' },
    { id: 'medusa', name: "Medusa", description: "Speedy, parallel, and modular login brute-forcer.", category: "Cracking", icon: <Lock />, command: 'medusa -h target -u admin -P pass.txt -M ssh' },
    { id: 'ncrack', name: "Ncrack", description: "High-speed network authentication cracking.", category: "Cracking", icon: <Lock />, command: 'ncrack -p 22 --user admin -P pass.txt target' },
    { id: 'ophcrack', name: "Ophcrack", description: "Windows password cracker based on rainbow tables.", category: "Cracking", icon: <Lock />, command: 'ophcrack' },
    { id: 'crunch', name: "Crunch", description: "Wordlist generator.", category: "Cracking", icon: <TerminalIcon />, command: 'crunch 8 8 0123456789' },
    { id: 'cupp', name: "Cupp", description: "Common User Password Profiler.", category: "Cracking", icon: <FileText />, command: 'python3 cupp.py -i' },
    { id: 'mimikatz', name: "Mimikatz", description: "Extracts plaintexts passwords from memory.", category: "Cracking", icon: <Lock />, command: 'mimikatz.exe "privilege::debug" "sekurlsa::logonpasswords" exit' },
    { id: 'patator', name: "Patator", description: "Multi-purpose brute-forcer.", category: "Cracking", icon: <Lock />, command: 'python patator.py ssh_login ...' },

    // 6. Sniffing & Spoofing (10)
    { id: 'wireshark', name: "Wireshark", description: "Network protocol analyzer.", category: "Sniffing", icon: <Activity />, command: 'wireshark' },
    { id: 'tcpdump', name: "Tcpdump", description: "Command-line packet analyzer.", category: "Sniffing", icon: <TerminalIcon />, command: 'tcpdump -i eth0' },
    { id: 'bettercap', name: "Bettercap", description: "The Swiss Army knife for network attacks.", category: "Sniffing", icon: <Zap />, command: 'bettercap -iface eth0' },
    { id: 'ettercap', name: "Ettercap", description: "Comprehensive suite for man in the middle attacks.", category: "Sniffing", icon: <Activity />, command: 'ettercap -G' },
    { id: 'mitmproxy', name: "Mitmproxy", description: "Interactive HTTPS proxy.", category: "Sniffing", icon: <Server />, command: 'mitmproxy' },
    { id: 'responder', name: "Responder", description: "LLMNR/NBT-NS Poisoner.", category: "Sniffing", icon: <Zap />, command: 'python Responder.py -I eth0' },
    { id: 'driftnet', name: "Driftnet", description: "Captures images from network traffic.", category: "Sniffing", icon: <Eye />, command: 'driftnet -i eth0' },
    { id: 'dsniff', name: "Dsniff", description: "Password sniffer.", category: "Sniffing", icon: <Search />, command: 'dsniff -i eth0' },
    { id: 'macchanger', name: "Macchanger", description: "Utility for viewing/manipulating MAC addresses.", category: "Sniffing", icon: <TerminalIcon />, command: 'macchanger -r eth0' },
    { id: 'scapy', name: "Scapy", description: "Interactive packet manipulation program.", category: "Sniffing", icon: <TerminalIcon />, command: 'scapy' },

    // 7. Exploitation (10)
    { id: 'metasploit', name: "Metasploit", description: "Penetration testing framework.", category: "Exploit", icon: <Zap />, command: 'msfconsole' },
    { id: 'searchsploit', name: "Searchsploit", description: "Offline Exploit-DB command line search.", category: "Exploit", icon: <Search />, command: 'searchsploit wordpress' },
    { id: 'sqljuggler', name: "SQLJuggler", description: "SQL injection tool.", category: "Exploit", icon: <Database />, command: 'sqljuggler' },
    { id: 'beef', name: "BeEF", description: "Browser Exploitation Framework.", category: "Exploit", icon: <Globe />, command: 'beef-xss' },
    { id: 'setoolkit', name: "SET", description: "Social-Engineer Toolkit.", category: "Exploit", icon: <User />, command: 'setoolkit' },
    { id: 'routersploit', name: "RouterSploit", description: "Exploitation Framework for Embedded Devices.", category: "Exploit", icon: <Wifi />, command: 'rsf.py' },
    { id: 'armitage', name: "Armitage", description: "GUI for Metasploit.", category: "Exploit", icon: <Zap />, command: 'armitage' },
    { id: 'powersploit', name: "PowerSploit", description: "PowerShell scripts for post-exploitation.", category: "Exploit", icon: <TerminalIcon />, command: 'Import-Module PowerSploit' },
    { id: 'empire', name: "Empire", description: "PowerShell and Python post-exploitation agent.", category: "Exploit", icon: <Zap />, command: './empire' },
    { id: 'star killer', name: "Starkiller", description: "GUI for Empire.", category: "Exploit", icon: <Zap />, command: './starkiller' },

    // 8. Forensics (10)
    { id: 'autopsy', name: "Autopsy", description: "Digital forensics platform.", category: "Forensics", icon: <Search />, command: 'autopsy' },
    { id: 'volatility', name: "Volatility", description: "Memory forensics framework.", category: "Forensics", icon: <Cpu />, command: 'volatility -f dump.mem imageinfo' },
    { id: 'binwalk', name: "Binwalk", description: "Firmware analysis tool.", category: "Forensics", icon: <Search />, command: 'binwalk firmware.bin' },
    { id: 'foremost', name: "Foremost", description: "Recover files using headers/footers.", category: "Forensics", icon: <FileText />, command: 'foremost -i image.dd' },
    { id: 'scalpel', name: "Scalpel", description: "File carving tool.", category: "Forensics", icon: <FileText />, command: 'scalpel image.dd' },
    { id: 'bulk-extractor', name: "Bulk Extractor", description: "Stream-based forensics tool.", category: "Forensics", icon: <Search />, command: 'bulk_extractor image.dd' },
    { id: 'guymager', name: "Guymager", description: "Forensic imager.", category: "Forensics", icon: <Database />, command: 'guymager' },
    { id: 'exiftool', name: "ExifTool", description: "Read/Write meta information in files.", category: "Forensics", icon: <Info />, command: 'exiftool image.jpg' },
    { id: 'pdf-parser', name: "Pdf-parser", description: "Parse PDF documents.", category: "Forensics", icon: <FileText />, command: 'pdf-parser.py file.pdf' },
    { id: 'sleuthkit', name: "Sleuth Kit", description: "Library and collection of command line tools.", category: "Forensics", icon: <Search />, command: 'fls image.dd' },

    // 9. Reverse Engineering (5)
    { id: 'ghidra', name: "Ghidra", description: "Software reverse engineering suite by NSA.", category: "Reverse", icon: <Cpu />, command: './ghidraRun' },
    { id: 'radare2', name: "Radare2", description: "Unix-like reverse engineering framework.", category: "Reverse", icon: <TerminalIcon />, command: 'r2 binary' },
    { id: 'ida-pro', name: "IDA Pro", description: "Multi-processor disassembler and debugger.", category: "Reverse", icon: <Cpu />, command: 'idapro' },
    { id: 'ollydbg', name: "OllyDbg", description: "32-bit assembler level analyzing debugger.", category: "Reverse", icon: <Bug />, command: 'ollydbg' },
    { id: 'apktool', name: "Apktool", description: "Tool for reverse engineering Android APK files.", category: "Reverse", icon: <Radio />, command: 'apktool d app.apk' },
  ];

  const filteredTools = tools.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      {/* Search Bar for Tools */}
      <div className="p-4 border-b border-green-900 flex items-center gap-4 bg-black">
         <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search Tool Database (e.g., 'wifi', 'scan', 'password')" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black border border-green-900 rounded pl-10 pr-4 py-2 text-green-400 placeholder-green-800 focus:border-green-500 focus:outline-none"
            />
         </div>
         <div className="text-xs text-gray-500 font-mono hidden md:block">
            DATABASE: {tools.length} TOOLS LOADED
         </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-4 pb-20 bg-black">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredTools.map((tool) => (
            <div key={tool.id} onClick={() => onLaunch(tool)} className="glass-panel p-4 rounded-lg hover:border-green-400 transition-all cursor-pointer group hover:-translate-y-1 hover:shadow-[0_5px_15px_rgba(0,255,65,0.1)] flex flex-col h-40 border border-green-900 bg-black/40">
              <div className="flex justify-between items-start mb-2">
                 <div className="text-green-500 group-hover:scale-110 transition-transform duration-300 bg-green-900/20 p-2 rounded-lg border border-green-900">
                    {tool.icon}
                 </div>
                 <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-bold ${
                    tool.category === 'Recon' ? 'bg-blue-900/40 text-blue-400' :
                    tool.category === 'Web' ? 'bg-orange-900/40 text-orange-400' :
                    tool.category === 'Cracking' ? 'bg-red-900/40 text-red-400' :
                    'bg-gray-800 text-gray-400'
                 }`}>{tool.category}</span>
              </div>
              <h4 className="font-bold text-sm text-white mb-1 font-orbitron truncate">{tool.name}</h4>
              <p className="text-xs text-gray-400 mb-auto line-clamp-2">{tool.description}</p>
              <div className="flex items-center text-[10px] text-green-500 font-bold opacity-60 group-hover:opacity-100 transition-opacity mt-2">
                 <TerminalIcon size={10} className="mr-1" /> RUN SIMULATION
              </div>
            </div>
          ))}
        </div>
        {filteredTools.length === 0 && (
          <div className="text-center py-20 text-gray-600">
             <Search size={48} className="mx-auto mb-4 opacity-20" />
             <p>No tools found matching "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

const DocsView = () => (
  <div className="glass-panel p-8 rounded-lg h-full overflow-y-auto border border-green-900 bg-black/40">
    <div className="flex items-center gap-3 mb-6 border-b border-gray-700 pb-4">
      <FileText size={32} className="text-green-500" />
      <h2 className="text-2xl font-orbitron text-white">System Documentation</h2>
    </div>
    <div className="space-y-8 text-gray-300 max-w-4xl">
      <section>
        <h3 className="text-green-400 text-lg font-bold mb-2 flex items-center gap-2"><Info size={16}/> 1.0 Overview</h3>
        <p className="leading-relaxed">AI Sherly is an advanced, high-fidelity cyber security simulation environment designed for educational purposes. It replicates a Security Operations Center (SOC) dashboard, providing tools for network analysis, threat detection, and offensive security simulations.</p>
      </section>
      <section>
        <h3 className="text-green-400 text-lg font-bold mb-2 flex items-center gap-2"><Lock size={16}/> 2.0 AI Integration</h3>
        <p className="leading-relaxed">The 'Sherly' AI model (powered by OpenAI GPT-4o) serves as an interactive assistant. Operators can query the AI for shell command syntax, vulnerability explanations, and generated reports. Use the <span className="text-white bg-gray-800 px-1 rounded">AI Chat</span> tab to initialize the uplink.</p>
      </section>
      <section>
        <h3 className="text-green-400 text-lg font-bold mb-2 flex items-center gap-2"><Database size={16}/> 3.0 Data Breach Simulator</h3>
        <p className="leading-relaxed">The Database module demonstrates the impact of SQL injection attacks, visualizing large datasets of compromised synthetic user identities (PII). This tool emphasizes the importance of encryption and access control.</p>
      </section>
      <section>
        <h3 className="text-green-400 text-lg font-bold mb-2 flex items-center gap-2"><Shield size={16}/> 4.0 Operational Security (OPSEC)</h3>
        <p className="leading-relaxed">
            When conducting operations, maintaining OPSEC is critical. The system provides real-time feedback on network visibility and potential leaks. 
            Operators must ensure VPN tunnels are active before engaging in offensive simulations.
        </p>
        <ul className="list-disc list-inside mt-2 space-y-1 text-gray-400 text-sm">
            <li>Always verify target authorization before scanning.</li>
            <li>Use the integrated VPN (Virtual Private Network) toggle in the dashboard.</li>
            <li>Monitor the IDS/IPS logs for counter-surveillance.</li>
        </ul>
      </section>
       <section>
        <h3 className="text-green-400 text-lg font-bold mb-2 flex items-center gap-2"><Zap size={16}/> 5.0 Attack Simulation Tools</h3>
        <p className="leading-relaxed">
            The platform includes several simulated attack vectors for educational purposes:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div className="bg-gray-900/50 p-3 rounded border border-gray-800">
                <span className="text-green-400 font-bold block mb-1">Network Attacks</span>
                <span className="text-xs">DDoS simulation, Port Scanning (Nmap), and Packet Sniffing.</span>
            </div>
            <div className="bg-gray-900/50 p-3 rounded border border-gray-800">
                <span className="text-yellow-400 font-bold block mb-1">Malware Labs</span>
                <span className="text-xs">Ransomware visualization and behavioral analysis (WannaCry simulation).</span>
            </div>
            <div className="bg-gray-900/50 p-3 rounded border border-gray-800">
                <span className="text-blue-400 font-bold block mb-1">Web Exploits</span>
                <span className="text-xs">SQL Injection, XSS, and Brute Force attacks.</span>
            </div>
            <div className="bg-gray-900/50 p-3 rounded border border-gray-800">
                <span className="text-purple-400 font-bold block mb-1">Cryptography</span>
                <span className="text-xs">Hashing, Encoding/Decoding, and Encryption challenges.</span>
            </div>
        </div>
      </section>
    </div>
  </div>
);

const AboutView = () => (
  <div className="glass-panel p-8 rounded-lg h-full overflow-y-auto border border-green-900 bg-black/40">
      <div className="flex items-center gap-3 mb-6 border-b border-gray-700 pb-4">
        <Info size={32} className="text-green-500" />
        <div>
            <h2 className="text-2xl font-orbitron text-white">System Information</h2>
            <p className="text-xs text-green-400 font-mono">AI SHERLY v2.1 (RELEASE_PROD)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
           {/* Hardware Specs - Copied from DocsView */}
           <div className="bg-gray-950/50 p-5 rounded-lg border border-gray-800 hover:border-green-900/50 transition-colors">
              <h4 className="text-white font-orbitron text-sm mb-4 border-b border-gray-800 pb-2 flex justify-between items-center">
                 <span>HARDWARE ARCHITECTURE</span>
                 <Activity size={14} className="text-green-500"/>
              </h4>
              <ul className="space-y-3 font-mono text-xs">
                 <li className="flex justify-between items-center">
                    <span className="text-gray-500">PROCESSOR</span>
                    <span className="text-green-300">AMD EPYC™ 9654 (96-Core) @ 3.7GHz</span>
                 </li>
                 <li className="flex justify-between items-center">
                    <span className="text-gray-500">MEMORY (RAM)</span>
                    <span className="text-green-300">512 GB DDR5-4800 ECC</span>
                 </li>
                 <li className="flex justify-between items-center">
                    <span className="text-gray-500">GPU ACCELERATION</span>
                    <span className="text-green-300">4x NVIDIA H100 Tensor Core</span>
                 </li>
                 <li className="flex justify-between items-center">
                    <span className="text-gray-500">STORAGE ARRAY</span>
                    <span className="text-green-300">2PB NVMe RAID 10 Cluster</span>
                 </li>
                 <li className="flex justify-between items-center">
                    <span className="text-gray-500">NETWORK INTERFACE</span>
                    <span className="text-green-300">Dual 100Gbps QSFP28 Uplink</span>
                 </li>
              </ul>
           </div>

           {/* Software Specs - Copied from DocsView */}
           <div className="bg-gray-950/50 p-5 rounded-lg border border-gray-800 hover:border-blue-900/50 transition-colors">
              <h4 className="text-white font-orbitron text-sm mb-4 border-b border-gray-800 pb-2 flex justify-between items-center">
                 <span>SOFTWARE STACK</span>
                 <TerminalIcon size={14} className="text-blue-500"/>
              </h4>
               <ul className="space-y-3 font-mono text-xs">
                 <li className="flex justify-between items-center">
                    <span className="text-gray-500">OPERATING SYSTEM</span>
                    <span className="text-blue-300">Kali Linux Rolling (2024.1)</span>
                 </li>
                 <li className="flex justify-between items-center">
                    <span className="text-gray-500">KERNEL VERSION</span>
                    <span className="text-blue-300">Linux 6.8.1-kali-amd64</span>
                 </li>
                 <li className="flex justify-between items-center">
                    <span className="text-gray-500">SECURITY FRAMEWORK</span>
                    <span className="text-blue-300">Metasploit Pro v6.4.12</span>
                 </li>
                 <li className="flex justify-between items-center">
                    <span className="text-gray-500">FRONTEND ENGINE</span>
                    <span className="text-blue-300">React 19 + Tailwind CSS</span>
                 </li>
                 <li className="flex justify-between items-center">
                    <span className="text-gray-500">AI CORE</span>
                    <span className="text-blue-300">OpenAI GPT-4o</span>
                 </li>
              </ul>
           </div>
        </div>

        <div className="mt-6 p-4 bg-yellow-900/10 border border-yellow-900/30 rounded text-yellow-500/80 text-xs font-mono max-w-5xl">
            <h4 className="font-bold flex items-center gap-2 mb-2"><ShieldAlert size={14}/> SYSTEM WARNING</h4>
            <p>This system is a restricted environment. All actions are logged and monitored. Unauthorized access attempts will be met with active countermeasures. This simulation environment runs on an isolated sandbox kernel to prevent real-world network leakage.</p>
        </div>
  </div>
);

const StatCard: React.FC<{label: string, value: string | number, icon: React.ReactNode, color: string}> = ({ label, value, icon, color }) => (
  <div className={`glass-panel p-4 rounded-lg flex items-center justify-between border-l-4 transition-all hover:scale-[1.02] border border-green-900 bg-black/40 ${
    color === 'red' ? 'border-l-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 
    color === 'green' ? 'border-l-green-500 hover:shadow-[0_0_15px_rgba(34,197,94,0.2)]' : 
    'border-l-blue-500 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]'
  }`}>
    <div>
      <p className="text-gray-400 text-[10px] uppercase tracking-wider font-bold">{label}</p>
      <p className="text-2xl font-bold font-orbitron mt-1 text-white">{value}</p>
    </div>
    <div className="opacity-80 bg-black/40 p-2 rounded-full">{icon}</div>
  </div>
);

const ResourceBar: React.FC<{label: string, usage: number, color: string}> = ({ label, usage, color }) => (
  <div>
    <div className="flex justify-between text-xs mb-1">
      <span className="text-gray-400 font-mono">{label}</span>
      <span className="text-green-400 font-bold">{usage}%</span>
    </div>
    <div className="h-2 bg-gray-900 rounded-full overflow-hidden border border-gray-800">
      <div className={`h-full ${color} transition-all duration-1000 ease-out shadow-[0_0_10px_currentColor]`} style={{ width: `${usage}%` }}></div>
    </div>
  </div>
);

export default App;
