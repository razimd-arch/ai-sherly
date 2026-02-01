import React, { useState, useEffect, useMemo } from 'react';
import { Search, Download, AlertOctagon, EyeOff, Globe, Database, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { CitizenData } from '../types';
import { faker } from '@faker-js/faker';

// Static seed data generator to persist data
const generateStaticData = (): CitizenData[] => {
    faker.seed(12345); // Fixed seed for consistency
    const generated: CitizenData[] = [];
    
    const firstNames = ["Budi", "Siti", "Agus", "Dewi", "Rizky", "Putri", "Adi", "Mega", "Eko", "Wulan", "Dian", "Fajar", "Indah", "Bayu", "Rina", "Joko", "Lestari", "Bambang", "Nur", "Tono", "Andi", "Citra", "Dimas", "Eka"];
    const lastNames = ["Santoso", "Wijaya", "Saputra", "Hidayat", "Kusuma", "Pratama", "Nugroho", "Wibowo", "Lestari", "Susanto", "Purnomo", "Setiawan", "Utami", "Handayani", "Wahyuni", "Siregar", "Nasution", "Simanjuntak", "Hutapea", "Sihombing"];
    const sources = ["tokopedia.com", "bukalapak.com", "kpu.go.id", "bpjs-kesehatan.go.id", "linkedin.com", "dukcapil.kemendagri.go.id", "bjorka-leaks.onion", "darkweb_market", "pln.co.id", "indihome.co.id"];

    // Generate 500 records
    for (let i = 0; i < 500; i++) { 
        const name = `${faker.helpers.arrayElement(firstNames)} ${faker.helpers.arrayElement(lastNames)}`;
        
        // Generate realistic NIK (16 digit)
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
          email: `${name.toLowerCase().replace(/\s/g, '.')}@${faker.helpers.arrayElement(['gmail.com', 'yahoo.co.id', 'outlook.co.id', 'kemendagri.go.id', 'kampus.ac.id'])}`,
          ipAddress: `103.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`,
          source: faker.helpers.arrayElement(sources),
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
  const [page, setPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
      // Simulate fast loading
      const timer = setTimeout(() => {
          setData(generateStaticData());
          setLoading(false);
      }, 300);
      return () => clearTimeout(timer);
  }, []);

  const filteredData = useMemo(() => {
      return data.filter(item => 
        item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.nik.includes(searchTerm) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.source.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [data, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="flex flex-col h-full glass-panel rounded-lg overflow-hidden border border-green-900 bg-black/40">
      {/* Header */}
      <div className="p-4 border-b border-green-900 bg-black/40 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="text-red-500 bg-red-900/20 p-2 rounded-full border border-red-500 animate-pulse">
             <AlertOctagon size={24} />
          </div>
          <div>
              <h2 className="text-xl font-orbitron text-red-500">LEAKED DATABASE</h2>
              <p className="text-xs text-red-400 font-mono">STATUS: COMPROMISED // SOURCE: DARK WEB</p>
          </div>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-2.5 text-gray-500" size={16} />
                <input 
                    type="text" 
                    placeholder="Search NIK, Name, Email..." 
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                    className="w-full bg-black border border-green-900 rounded pl-9 pr-4 py-2 text-sm text-green-400 focus:border-red-500 focus:outline-none placeholder-green-900"
                />
            </div>
            <button className="px-4 py-2 bg-green-900/20 border border-green-500 text-green-400 rounded hover:bg-green-900/40 text-xs font-bold flex items-center gap-2">
                <Download size={16} /> DUMP
            </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="flex-1 overflow-auto bg-black/50 relative">
          {loading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-green-500 gap-4">
                  <Database size={48} className="animate-bounce" />
                  <p className="font-mono text-lg animate-pulse">DECRYPTING ARCHIVES...</p>
              </div>
          ) : (
              <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead className="sticky top-0 bg-gray-900 z-10 text-xs uppercase text-gray-500 font-mono">
                      <tr>
                          <th className="p-3 border-b border-gray-800">Unique ID</th>
                          <th className="p-3 border-b border-gray-800">NIK (KTP)</th>
                          <th className="p-3 border-b border-gray-800">Full Name</th>
                          <th className="p-3 border-b border-gray-800">Email Address</th>
                          <th className="p-3 border-b border-gray-800">Leak Source</th>
                          <th className="p-3 border-b border-gray-800">Status</th>
                          <th className="p-3 border-b border-gray-800">Password Hash</th>
                      </tr>
                  </thead>
                  <tbody className="text-xs font-mono text-gray-300">
                      {paginatedData.length > 0 ? (
                          paginatedData.map((row, i) => (
                              <tr key={row.id} className="hover:bg-red-900/10 transition-colors border-b border-gray-800/50 group">
                                  <td className="p-3 text-gray-600 font-mono text-[10px]">{row.id.substring(0,8)}...</td>
                                  <td className="p-3 text-red-300 font-bold tracking-wider">{row.nik}</td>
                                  <td className="p-3 text-white">{row.fullName}</td>
                                  <td className="p-3 text-blue-300">{row.email}</td>
                                  <td className="p-3">
                                      <span className="bg-gray-800 text-gray-400 px-2 py-0.5 rounded text-[10px] uppercase border border-gray-700">
                                          {row.source}
                                      </span>
                                  </td>
                                  <td className="p-3">
                                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                          row.status === 'BOCOR' ? 'bg-red-900/30 text-red-500 border border-red-900' :
                                          row.status === 'DIJUAL' ? 'bg-yellow-900/30 text-yellow-500 border border-yellow-900' :
                                          'bg-gray-800 text-gray-400'
                                      }`}>
                                          {row.status}
                                      </span>
                                  </td>
                                  <td className="p-3 font-mono text-[10px] text-gray-600 group-hover:text-green-500 transition-colors truncate max-w-[100px]">
                                      {row.passwordHash}
                                  </td>
                              </tr>
                          ))
                      ) : (
                          <tr>
                              <td colSpan={7} className="p-10 text-center text-gray-500">
                                  No records found matching "{searchTerm}"
                              </td>
                          </tr>
                      )}
                  </tbody>
              </table>
          )}
      </div>

      {/* Pagination Footer */}
      <div className="p-3 border-t border-green-900 bg-black/80 flex items-center justify-between text-xs text-gray-500 font-mono shrink-0">
          <div>
              Showing {Math.min((page - 1) * itemsPerPage + 1, filteredData.length)} - {Math.min(page * itemsPerPage, filteredData.length)} of {filteredData.length} records
          </div>
          <div className="flex gap-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1 rounded hover:bg-gray-800 disabled:opacity-50"
              >
                  <ChevronLeft size={16} />
              </button>
              <span className="px-2 py-1">Page {page} of {totalPages}</span>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1 rounded hover:bg-gray-800 disabled:opacity-50"
              >
                  <ChevronRight size={16} />
              </button>
          </div>
      </div>
    </div>
  );
};

export default DatabaseViewer;