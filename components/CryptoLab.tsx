import React, { useState } from 'react';
import { Key, Lock, Unlock, RefreshCw } from 'lucide-react';

const CryptoLab: React.FC = () => {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  
  const toBase64 = (str: string) => {
      try { return btoa(str); } catch { return 'Invalid Input'; }
  };
  
  const fromBase64 = (str: string) => {
      try { return atob(str); } catch { return 'Invalid Base64'; }
  };

  const toHex = (str: string) => {
    let result = '';
    for (let i = 0; i < str.length; i++) {
      result += str.charCodeAt(i).toString(16).padStart(2, '0');
    }
    return result;
  };

  // Fake simple hash for demo
  const simpleHash = (str: string): string => {
    let hash = 0;
    if (str.length === 0) return '00000000';
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
  };

  return (
    <div className="h-full glass-panel p-6 rounded-lg border border-green-900 bg-black/40 flex flex-col gap-6">
       <div className="flex items-center gap-3 border-b border-green-800 pb-4">
           <div className="bg-green-900/20 p-2 rounded-full border border-green-500 text-green-500">
               <Key size={24} />
           </div>
           <h2 className="text-xl font-orbitron text-white">Cryptography Lab</h2>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="space-y-4">
               <label className="text-sm font-mono text-gray-400">INPUT TEXT / PAYLOAD</label>
               <textarea 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full h-40 bg-black border border-green-800 rounded p-3 text-green-400 font-mono text-sm focus:border-green-500 outline-none"
                  placeholder="Enter secret message..."
               />
               <div className="flex gap-2">
                   <button onClick={() => setMode('encode')} className={`flex-1 py-2 rounded text-xs font-bold border ${mode === 'encode' ? 'bg-green-600 text-black border-green-600' : 'border-green-800 text-gray-400'}`}>
                       ENCODE
                   </button>
                   <button onClick={() => setMode('decode')} className={`flex-1 py-2 rounded text-xs font-bold border ${mode === 'decode' ? 'bg-green-600 text-black border-green-600' : 'border-green-800 text-gray-400'}`}>
                       DECODE
                   </button>
               </div>
           </div>

           <div className="space-y-4">
                <ResultBox label="BASE64" value={mode === 'encode' ? toBase64(input) : fromBase64(input)} />
                <ResultBox label="HEXADECIMAL" value={mode === 'encode' ? toHex(input) : 'Hex decode not implemented in demo'} />
                <ResultBox label="MD5 (SIMULATED)" value={simpleHash(input) + simpleHash(input).split('').reverse().join('')} />
                <ResultBox label="ROT13" value={input.replace(/[a-zA-Z]/g, (char) => {
                    const code = char.charCodeAt(0);
                    // Uppercase: 65-90, Lowercase: 97-122
                    if (code >= 65 && code <= 90) {
                        return String.fromCharCode(((code - 65 + 13) % 26) + 65);
                    } else {
                        return String.fromCharCode(((code - 97 + 13) % 26) + 97);
                    }
                })} />
           </div>
       </div>
    </div>
  );
};

const ResultBox: React.FC<{label: string, value: string | number}> = ({label, value}) => (
    <div className="bg-gray-900/50 border border-green-900/50 rounded p-2">
        <div className="text-[10px] text-gray-500 mb-1 font-bold">{label}</div>
        <div className="font-mono text-sm text-blue-300 break-all select-all hover:bg-black/20 p-1 rounded">
            {value || <span className="text-gray-700 italic">waiting for input...</span>}
        </div>
    </div>
);

export default CryptoLab;