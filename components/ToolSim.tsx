import React, { useState, useEffect, useRef } from 'react';
import { X, Terminal, Loader, Play } from 'lucide-react';
import { Tool } from '../types';

interface ToolSimProps {
  tool: Tool;
  onClose: () => void;
}

const ToolSim: React.FC<ToolSimProps> = ({ tool, onClose }) => {
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Start simulation
    setOutput([
      `> Initializing ${tool.name}...`, 
      `> Loading modules for category: ${tool.category}`,
      `> Executing: ${tool.command}`, 
      '----------------------------------------'
    ]);
    
    const logs = getLogsForTool(tool);
    let index = 0;

    const interval = setInterval(() => {
      if (index < logs.length) {
        setOutput(prev => [...prev, logs[index]]);
        index++;
      } else {
        setIsRunning(false);
        setOutput(prev => [...prev, '----------------------------------------', `> Process finished for ${tool.name}.`, `> Exit Code: 0`]);
        clearInterval(interval);
      }
    }, 600); // Speed of logs

    return () => clearInterval(interval);
  }, [tool]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [output]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-3xl bg-gray-950 border border-green-500 rounded-lg shadow-[0_0_50px_rgba(0,255,65,0.2)] flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-green-800 bg-gray-900">
          <div className="flex items-center gap-2 text-green-400">
            <Terminal size={18} />
            <span className="font-orbitron font-bold">{tool.name.toUpperCase()} - CLI</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white hover:bg-red-900/50 p-1 rounded">
            <X size={20} />
          </button>
        </div>

        {/* Console */}
        <div className="flex-1 overflow-auto p-4 font-mono text-sm bg-black/90 text-green-300 space-y-1">
          {output.map((line, i) => (
            <div key={i} className={`break-all whitespace-pre-wrap ${line.includes('ERROR') || line.includes('FAIL') ? 'text-red-400' : line.includes('SUCCESS') || line.includes('Discovered') ? 'text-blue-300' : 'text-green-300/90'}`}>
              {line}
            </div>
          ))}
          {isRunning && (
            <div className="flex items-center gap-2 mt-2 animate-pulse text-green-500">
              <Loader size={14} className="animate-spin" />
              <span>Running tasks...</span>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-green-800 bg-gray-900 text-xs text-gray-500 flex justify-between">
           <span>PID: {Math.floor(Math.random() * 9000) + 1000}</span>
           <span>{isRunning ? 'STATUS: ACTIVE' : 'STATUS: IDLE'}</span>
        </div>
      </div>
    </div>
  );
};

// Simulated Output Generator based on Category or Specific ID
const getLogsForTool = (tool: Tool): string[] => {
  const { id, category } = tool;

  // 1. SPECIFIC TOOLS (Detailed logs for popular ones)
  if (id === 'nmap') {
      return [
        "Starting Nmap 7.94 ( https://nmap.org )",
        "Initiating Ping Scan at 14:02",
        "Scanning 192.168.1.0/24 [4 ports]",
        "Completed Ping Scan at 14:02, 0.02s elapsed",
        "Initiating Parallel DNS resolution of 254 hosts.",
        "Initiating SYN Stealth Scan at 14:02",
        "Discovered open port 80/tcp on 192.168.1.1",
        "Discovered open port 22/tcp on 192.168.1.45",
        "Discovered open port 443/tcp on 192.168.1.1",
        "Scan 50% complete...",
        "Completed SYN Stealth Scan at 14:03, 10.5s elapsed",
        "Nmap scan report for gateway (192.168.1.1)",
        "Host is up (0.0024s latency).",
        "PORT    STATE SERVICE",
        "80/tcp  open  http",
        "443/tcp open  https"
      ];
  }
  
  if (id === 'metasploit') {
      return [
        "=[ metasploit v6.3.4-dev ]",
        "+ -- --=[ 2376 exploits - 1230 auxiliary ]",
        "msf6 > use exploit/multi/handler",
        "[*] Using configured payload generic/shell_reverse_tcp",
        "msf6 exploit(multi/handler) > set LHOST 192.168.1.5",
        "LHOST => 192.168.1.5",
        "msf6 exploit(multi/handler) > exploit",
        "[*] Started reverse TCP handler on 192.168.1.5:4444",
        "[*] Sending stage (30084 bytes) to target",
        "[*] Meterpreter session 1 opened",
        "meterpreter > sysinfo",
        "Computer : TARGET-WIN-01",
        "OS       : Windows 10 (10.0 Build 19041)",
      ];
  }

  // 2. GENERIC CATEGORY BASED LOGS
  if (category === 'Recon') {
      return [
          "Resolving target hostname...",
          "Target IP: 103.45.xx.xx (Jakarta, ID)",
          "Initiating active reconnaissance modules...",
          "Fetching DNS records (A, MX, NS, TXT)...",
          "[+] Found subdomain: mail.target.id",
          "[+] Found subdomain: dev.target.id",
          "[+] Found subdomain: vpn.target.id",
          "Harvesting email addresses from public sources...",
          "Found: admin@target.id",
          "Found: support@target.id",
          "Performing Whois lookup...",
          "Registrar: PANDI",
          "Reconnaissance complete. Report generated."
      ];
  }

  if (category === 'Web') {
      return [
          "Targeting URL: http://target.id",
          "Crawling website structure...",
          "Found /admin/login.php (Code: 200)",
          "Found /config/db.ini (Code: 403 Forbidden)",
          "Testing for SQL Injection parameters...",
          "Testing parameter 'id=1'...",
          "[!] POSITIVE: Time-based blind SQLi detected",
          "Testing for Cross-Site Scripting (XSS)...",
          "[-] Header 'X-Frame-Options' missing",
          "[-] Cookie 'PHPSESSID' missing HttpOnly flag",
          "Vulnerability scan finished.",
      ];
  }

  if (category === 'Cracking') {
      return [
          "Loading hash file...",
          "Detected hash type: MD5",
          "Loading wordlist: rockyou.txt (14,344,392 words)",
          "Initializing device: GPU (CUDA Core)",
          "Session started...",
          "[10%] 140k/s... No match",
          "[30%] 152k/s... No match",
          "[55%] Match found!",
          "Hash: 5f4dcc3b5aa765d61d8327deb882cf99",
          "Plaintext: password123",
          "Cracking session stopped successfully."
      ];
  }

  if (category === 'Wireless') {
      return [
          "Setting interface wlan0 to monitor mode...",
          "Scanning for available networks...",
          "SSID: 'CoffeeShop_Free' | CH: 6 | ENC: WPA2",
          "SSID: 'Office_Secure'   | CH: 11 | ENC: WPA2",
          "Targeting BSSID: AA:BB:CC:DD:EE:FF",
          "Sending deauth packets to broadcast...",
          "[+] WPA Handshake captured!",
          "Saving capture to dump-01.cap",
          "Starting offline dictionary attack...",
          "Key found: 'kopi1234'"
      ];
  }

  if (category === 'Sniffing') {
      return [
          "Promiscuous mode enabled on eth0",
          "Capturing traffic...",
          "Packet #1: TCP 192.168.1.5 -> 1.1 [SYN]",
          "Packet #2: TCP 192.168.1.1 -> 1.5 [SYN, ACK]",
          "Packet #55: HTTP GET /login.php",
          "Payload detected: user=admin&pass=********",
          "Packet #89: DNS Query 'malware-c2.com'",
          "[!] Suspicious traffic pattern identified",
          "Dumping pcap file..."
      ];
  }

  if (category === 'Forensics') {
      return [
          "Mounting disk image...",
          "Verifying integrity (SHA-256)...",
          "Hash match confirmed.",
          "Scanning file system tree ($MFT)...",
          "Recovering deleted files...",
          "[+] Recovered: 'passwords.txt' (Deleted 2 days ago)",
          "[+] Recovered: 'evidence.jpg'",
          "Analyzing browser history...",
          "Found 450 artifacts.",
          "Timeline reconstruction complete."
      ];
  }

  // Default fallback
  return [
      "Initializing generic module...",
      "Allocating memory...",
      "Running diagnostics...",
      "Checking dependencies...",
      "Operation in progress...",
      "Processing data chunks...",
      "Verifying checksums...",
      "Task completed successfully."
  ];
};

export default ToolSim;