import React, { useRef, useState, useEffect } from 'react';
import { Eraser, Trash2, PenTool } from 'lucide-react';

export const TacticsPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#FFFFFF'); // Default White or 'eraser'
  const [lineWidth, setLineWidth] = useState(2);
  
  // Set up canvas layout on load
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Make canvas fill the parent wrapper
    const parent = canvas.parentElement;
    if (parent) {
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    }

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 1.5; // Thin brush requested
    }
  }, []);

  const drawCourt = () => {
     // A pure CSS court is already underneath, we just draw lines on the transparent canvas
  };

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (color === 'eraser') {
       ctx.globalCompositeOperation = 'destination-out';
       ctx.lineWidth = 40; // Grande
       ctx.strokeStyle = 'rgba(0,0,0,1)';
    } else {
       ctx.globalCompositeOperation = 'source-over';
       ctx.lineWidth = lineWidth;
       ctx.strokeStyle = color;
    }
    
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.getContext('2d')?.closePath();
    }
  };

  const clearBoard = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  return (
    <div className="min-h-screen pb-24 font-sans bg-background flex flex-col">
      <div className="px-4 pt-6 pb-2">
         <h1 className="text-3xl font-black text-white uppercase tracking-tight">Pizarra</h1>
         <p className="text-white/70 text-sm font-medium mb-4">Dibuja tus tácticas sobre la cancha</p>
      </div>

      {/* Tools Panel */}
      <div className="px-4 mb-4 flex justify-between items-center bg-surface/50 p-2 rounded-2xl mx-4 border border-white/10">
         <div className="flex gap-2">
            {[
              { hex: '#FFFFFF', name: 'Blanco' },
              { hex: '#FF0000', name: 'Rojo' },
              { hex: '#000000', name: 'Negro' },
              { hex: '#EAB308', name: 'Amarillo' },
            ].map(c => (
              <button 
                key={c.hex}
                onClick={() => setColor(c.hex)}
                className={`w-10 h-10 rounded-full border-2 transition-transform shadow-md ${color === c.hex ? 'scale-110 border-white' : 'border-black/20'}`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
            <button
               onClick={() => setColor('eraser')}
               className={`w-10 h-10 rounded-xl border-2 transition-transform flex items-center justify-center bg-slate-200 text-slate-800 shadow-md ${color === 'eraser' ? 'scale-110 border-primary' : 'border-transparent'}`}
               title="Goma de Borrar Grande"
            >
               <Eraser size={20} />
            </button>
         </div>
         
         <button 
           onClick={clearBoard}
           className="flex items-center gap-2 bg-red-500/20 text-red-500 px-4 py-2 rounded-xl font-bold uppercase text-xs active:scale-95"
         >
           <Trash2 size={16} /> Borrar Todo
         </button>
      </div>

      {/* The Court */}
      <div className="flex-1 mx-0 sm:mx-0 mb-0 mt-2 relative rounded-t-3xl overflow-hidden border-t-8 border-surface shadow-2xl bg-gradient-to-b from-[#2E5E32] to-[#1B3B22]">
         
         {/* CSS Court Lines Background */}
         <div className="absolute inset-0 pointer-events-none opacity-20">
            {/* Center Line */}
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white -translate-y-1/2" />
            
            {/* Center Circle */}
            <div className="absolute top-1/2 left-1/2 w-32 h-32 border-[3px] border-white rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />

            {/* 25-Yard Lines (Hockey 23m) */}
            <div className="absolute top-[25%] left-0 w-full h-[2px] bg-white/70" />
            <div className="absolute bottom-[25%] left-0 w-full h-[2px] bg-white/70" />

            {/* Top Goal Area (Striking Circle) */}
            <div className="absolute top-0 left-1/2 border-[3px] border-t-0 border-white w-64 h-32 -translate-x-1/2 rounded-b-full" />
            <div className="absolute top-0 left-1/2 border-[3px] border-t-0 border-white w-20 h-8 -translate-x-1/2 bg-white/10" />

            {/* Bottom Goal Area (Striking Circle) */}
            <div className="absolute bottom-0 left-1/2 border-[3px] border-b-0 border-white w-64 h-32 -translate-x-1/2 rounded-t-full" />
            <div className="absolute bottom-0 left-1/2 border-[3px] border-b-0 border-white w-20 h-8 -translate-x-1/2 bg-white/10" />
         </div>

         {/* Canvas Layer */}
         <canvas 
           ref={canvasRef}
           onPointerDown={startDrawing}
           onPointerMove={draw}
           onPointerUp={stopDrawing}
           onPointerOut={stopDrawing}
           className="absolute inset-0 w-full h-full touch-none cursor-crosshair z-10"
         />
      </div>

    </div>
  );
};
