
import React, { useState, useRef } from 'react';
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';

const WorldMap: React.FC = () => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Adjusted Attack Coordinates for new map projection (approximate)
  const attacks = [
      { id: 1, x: 180, y: 130, country: "USA", risk: "high" }, 
      { id: 2, x: 260, y: 280, country: "Brazil", risk: "medium" }, 
      { id: 3, x: 420, y: 100, country: "Europe", risk: "medium" }, 
      { id: 4, x: 550, y: 80, country: "Russia", risk: "high" }, 
      { id: 5, x: 430, y: 220, country: "Africa", risk: "low" }, 
      { id: 6, x: 620, y: 140, country: "China", risk: "high" }, 
      { id: 7, x: 650, y: 250, country: "Indonesia", risk: "medium" }, 
      { id: 8, x: 700, y: 320, country: "Australia", risk: "low" }, 
  ];

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault(); 
    const newScale = Math.max(0.5, Math.min(4, scale - e.deltaY * 0.001));
    setScale(newScale);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
      setScale(1);
      setPosition({x: 0, y: 0});
  }

  return (
    <div className="h-full glass-panel flex flex-col border border-green-900 bg-black overflow-hidden relative">
      <div className="absolute top-4 left-4 z-20 flex gap-2">
          <button onClick={() => setScale(s => Math.min(4, s + 0.5))} className="p-2 bg-gray-900 border border-green-700 text-green-500 rounded hover:bg-green-900/30"><ZoomIn size={18}/></button>
          <button onClick={() => setScale(s => Math.max(0.5, s - 0.5))} className="p-2 bg-gray-900 border border-green-700 text-green-500 rounded hover:bg-green-900/30"><ZoomOut size={18}/></button>
          <button onClick={resetView} className="p-2 bg-gray-900 border border-green-700 text-green-500 rounded hover:bg-green-900/30"><Maximize size={18}/></button>
      </div>

      <div className="absolute top-4 right-4 z-20 bg-black/80 p-2 border border-green-900 rounded text-xs font-mono text-green-400">
          <div><span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-2"></span>CRITICAL</div>
          <div><span className="inline-block w-2 h-2 rounded-full bg-yellow-500 mr-2"></span>WARNING</div>
          <div><span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>STABLE</div>
      </div>

      <div 
        ref={containerRef}
        className="flex-1 w-full h-full cursor-move bg-[#050505] relative overflow-hidden"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div 
            style={{ 
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                transition: isDragging ? 'none' : 'transform 0.2s ease-out',
                transformOrigin: 'center',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <svg viewBox="0 0 800 450" className="w-full h-full opacity-80">
                <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0, 255, 65, 0.1)" strokeWidth="0.5"/>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                
                {/* World Map Polygons - Simplified Miller/Mercator Approximation */}
                <g className="drop-shadow-[0_0_5px_rgba(0,255,65,0.2)]"> 
                   
                   {/* North America */}
                   <path d="M 50,60 L 120,40 L 200,30 L 300,30 L 340,70 L 280,110 L 250,150 L 190,190 L 130,170 L 100,140 L 50,100 Z" fill="#0f1f15" stroke="#1a4d2e" strokeWidth="1.5" />
                   
                   {/* South America */}
                   <path d="M 190,200 L 270,200 L 310,250 L 280,380 L 240,410 L 210,360 L 190,280 Z" fill="#0f1f15" stroke="#1a4d2e" strokeWidth="1.5" />
                   
                   {/* Europe */}
                   <path d="M 360,60 L 450,50 L 500,80 L 480,120 L 440,120 L 400,100 L 360,90 Z" fill="#0f1f15" stroke="#1a4d2e" strokeWidth="1.5" />
                   
                   {/* Africa */}
                   <path d="M 350,130 L 460,130 L 490,200 L 470,300 L 410,340 L 360,250 L 340,170 Z" fill="#0f1f15" stroke="#1a4d2e" strokeWidth="1.5" />
                   
                   {/* Asia */}
                   <path d="M 460,60 L 650,60 L 750,90 L 760,180 L 700,230 L 630,220 L 580,180 L 500,130 Z" fill="#0f1f15" stroke="#1a4d2e" strokeWidth="1.5" />

                   {/* Australia */}
                   <path d="M 640,280 L 740,280 L 750,350 L 630,350 Z" fill="#0f1f15" stroke="#1a4d2e" strokeWidth="1.5" />
                   
                   {/* Greenland */}
                   <path d="M 280,30 L 360,30 L 340,70 L 300,60 Z" fill="#0f1f15" stroke="#1a4d2e" strokeWidth="1.5" />

                   {/* Indonesia & Islands */}
                   <path d="M 600,230 L 670,230 L 690,260 L 610,260 Z" fill="#0f1f15" stroke="#1a4d2e" strokeWidth="1.5" />
                   
                   {/* Japan */}
                   <path d="M 730,120 L 760,130 L 750,160 L 720,150 Z" fill="#0f1f15" stroke="#1a4d2e" strokeWidth="1.5" />
                   
                   {/* UK */}
                   <path d="M 370,80 L 390,80 L 390,100 L 370,100 Z" fill="#0f1f15" stroke="#1a4d2e" strokeWidth="1.5" />
                </g>

                {/* Attack Points */}
                {attacks.map(attack => (
                    <g key={attack.id} transform={`translate(${attack.x}, ${attack.y})`}>
                        <circle 
                            r="4" 
                            fill={attack.risk === 'high' ? '#ef4444' : attack.risk === 'medium' ? '#eab308' : '#22c55e'} 
                            className="animate-pulse"
                        />
                        <circle 
                            r="15" 
                            fill="transparent" 
                            stroke={attack.risk === 'high' ? '#ef4444' : attack.risk === 'medium' ? '#eab308' : '#22c55e'} 
                            strokeWidth="1"
                            opacity="0.5"
                        >
                            <animate attributeName="r" from="4" to="20" dur="1.5s" repeatCount="indefinite" />
                            <animate attributeName="opacity" from="0.8" to="0" dur="1.5s" repeatCount="indefinite" />
                        </circle>
                        {scale > 1.5 && (
                            <text y="-10" x="0" textAnchor="middle" fill="white" fontSize="12" fontFamily="monospace" className="select-none font-bold drop-shadow-md">
                                {attack.country}
                            </text>
                        )}
                    </g>
                ))}
            </svg>
        </div>
      </div>
    </div>
  );
};

export default WorldMap;
