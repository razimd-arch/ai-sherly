import React, { useState, useEffect, useMemo } from 'react';
import { Search, Download, AlertOctagon, EyeOff, Globe } from 'lucide-react';
import { CitizenData } from '../types';
import { faker } from '@faker-js/faker';

// Static seed data generator outside component to keep data persistent during session
const generateStaticData = (): CitizenData[] => {
    faker.seed(1337); // Set seed for consistent data
    const generated: CitizenData[] = [];
    
    const firstNames = ["Budi", "Siti", "Agus", "Dewi", "Rizky", "Putri", "Adi", "Mega", "Eko", "Wulan", "Dian", "Fajar", "Indah", "Bayu", "Rina", "Joko", "Lestari", "Bambang", "Nur", "Tono"];
    const lastNames = ["Santoso", "Wijaya", "Saputra", "Hidayat", "Kusuma", "Pratama", "Nugroho", "Wibowo", "Lestari", "Susanto", "Purnomo", "Setiawan", "Utami", "Handayani", "Wahyuni", "Siregar", "Nasution", "Simanjuntak"];
    const sources = ["tokopedia.com", "bukalapak.com", "kpu.go.id", "bpjs-kesehatan.go.id", "linkedin.com", "dukcapil.kemendagri.go.id", "bjorka-leaks.onion"];

    for (let i = 0; i < 200; i++) { 
        const name = `${firstNames[i % firstNames.length]} ${lastNames[(i + 5) % lastNames.length]}`;
        // Generate NIK style (16 digit)
        const prov = Math.floor(faker.number.float({min: 11, max: 90}));
        const kota = Math.floor(faker.number.float({min: 11, max: 90}));
        const tgl = Math.floor(faker.number.float({min: 1, max: 30})).toString().padStart(2,'0');
        const bln = Math.floor(faker.number.float({min: 1, max: 12})).toString().padStart(2,'0');
        const thn = Math.floor(faker.number.float({min: 70, max: 99})).toString().padStart(2,'0');
        const urut = Math.floor(faker.number.float({min: 1000, max: 9999}));
        const nik = `${prov}${kota}${tgl}${bln}${thn}${urut}`;

        generated.push({
          id: faker.string.uuid(),
          nik: nik,
          fullName: name,
          email: `${name.toLowerCase().replace(' ', '.')}@${faker.helpers.arrayElement(['gmail.com', 'yahoo.co.id', 'outlook.co.id', 'kemendagri.go.id', 'kampus.ac.id'])}`,
          ipAddress: `103.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`,
          source: sources[Math.floor(Math.random() * sources.length)],
          passwordHash: faker.string.hexadecimal({ length: 32, casing: 'lower' }),
          status: faker.helpers.arrayElement(['BOCOR', 'TERENKRIPSI', 'TEREKSPOS', 'DIJUAL']) as any
        });
    }
    return generated;
};

const DatabaseViewer: React.FC = () => {
  const [data, setData] = useState<CitizenData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Use useMemo ensures we don't regenerate if not needed, though the function is static now.
  // In a real app, this would fetch from API.
  useEffect(() => {
      // Simulate loading delay only once
      const timer = setTimeout(() => {
          setData(generateStaticData());
          setLoading(false);
      }, 1500);
      return () => clearTimeout(timer);
  }, []);

  const filteredData = data.filter(item => 
    item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.nik.includes(searchTerm) ||
    item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.source.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full glass-panel rounded-lg overflow-hidden border border-green-900 bg-black/40">
      <div className="p-4 border-b border-green-900 bg-black/40 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="text-red-500 animate-pulse">
             <AlertOctagon size={24} />
          </div>
          <div>
            <h2 className="text-xl font-orbitron text-red-500 tracking-wider">KEBOCORAN DATA (PDN LEAK)</h2>
            <p className="text-xs text-red-400/70">AKSES ILEGAL - DATA PENDUDUK RI (SIMULASI)</p>
          </div>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-2.5 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Cari NIK, Nama, Source..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-900 border border-red-900/50 rounded pl-9 pr-4 py-2 text-sm text-red-100 placeholder-red-900/50 focus:border-red-500 outline-none"
            />
          </div>
          <button className="px-3 py-2 border border-red-500 text-red-500 rounded hover:bg-red-500/10 flex items-center gap-2 text-xs font-bold">
            <Download size={14} /> UNDUH .CSV
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 border-4 border-red-900 border-t-red-500 rounded-full animate-spin"></div>
            <p className="text-red-500 font-mono animate-pulse">MENDEKRIPSI DATA SHARD...</p>
            <div className="w-64 h-1 bg-gray-900 rounded overflow-hidden">
               <div className="h-full bg-red-600 animate-[scan_2s_infinite]"></div>
            </div>
          </div>
        ) : (
          <table className="w-full text-left text-sm font-mono">
            <thead className="bg-red-900/20 sticky top-0 backdrop-blur-md z-10">
              <tr className="text-red-300">
                <th className="p-3 border-b border-red-900/30">STATUS</th>
                <th className="p-3 border-b border-red-900/30">ASAL (SOURCE)</th>
                <th className="p-3 border-b border-red-900/30">NIK (KTP)</th>
                <th className="p-3 border-b border-red-900/30">NAMA LENGKAP</th>
                <th className="p-3 border-b border-red-900/30 hidden md:table-cell">EMAIL</th>
                <th className="p-3 border-b border-red-900/30 hidden lg:table-cell">IP ORIGIN</th>
                <th className="p-3 border-b border-red-900/30 hidden xl:table-cell">HASH PASSWORD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-red-900/10">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-red-500/5 transition-colors group cursor-pointer">
                  <td className="p-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded border font-bold ${
                      item.status === 'BOCOR' ? 'border-red-500 text-red-500 bg-red-900/20' :
                      item.status === 'TERENKRIPSI' ? 'border-orange-500 text-orange-500 bg-orange-900/20' :
                      item.status === 'DIJUAL' ? 'border-purple-500 text-purple-500 bg-purple-900/20' :
                      'border-yellow-500 text-yellow-500 bg-yellow-900/20'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3 text-blue-400 font-bold flex items-center gap-2">
                      <Globe size={12} /> {item.source}
                  </td>
                  <td className="p-3 text-gray-300 font-bold tracking-widest">{item.nik}</td>
                  <td className="p-3 text-gray-400 group-hover:text-red-300">{item.fullName}</td>
                  <td className="p-3 text-gray-500 hidden md:table-cell">{item.email}</td>
                  <td className="p-3 text-gray-500 hidden lg:table-cell font-mono">{item.ipAddress}</td>
                  <td className="p-3 text-gray-600 hidden xl:table-cell truncate max-w-[150px] font-mono text-xs">
                    <div className="flex items-center gap-2">
                       <EyeOff size={10} /> {item.passwordHash}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="p-2 border-t border-red-900/30 bg-black/60 text-xs text-red-500/50 flex justify-between">
         <span>TOTAL DATA: {data.length.toLocaleString()} ENTRI</span>
         <span>SESSION_ID: {Math.random().toString(36).substring(7)}</span>
      </div>
    </div>
  );
};

export default DatabaseViewer;