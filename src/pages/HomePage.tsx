import React, { useState, useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { CheckCircle2, UserX, BarChart3, AlertTriangle, ChevronRight, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const DAYS_MAP = ['D', 'L', 'M', 'Mi', 'J', 'V', 'S'];

export const HomePage = () => {
  const players = useAppStore(state => state.players);
  
  const todayIndex = new Date().getDay();
  const todayInitial = DAYS_MAP[todayIndex];
  
  const expectedPlayers = players.filter(p => p.isActive && p.trainingDays.includes(todayInitial));
  
  const [checkedInIds, setCheckedInIds] = useState<string[]>([]);
  
  const toggleCheckIn = (id: string) => {
    setCheckedInIds(prev => prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]);
  };

  const attendancePercentage = expectedPlayers.length > 0 
    ? Math.round((checkedInIds.length / expectedPlayers.length) * 100) 
    : 0;

  return (
    <div className="min-h-screen pb-24 font-sans">
      
      {/* Hero Header matching the screenshot */}
      <div className="pt-8 px-4 pb-6">
        <h1 className="text-[32px] leading-tight font-black text-primary uppercase tracking-tight">
          Donde la pasión <br />
          se encuentra con el juego
        </h1>
        <p className="text-white font-medium text-sm mt-2 tracking-widest uppercase">
          Liga Femenina Valkyrie 2026
        </p>
      </div>

      <div className="px-4 space-y-6">
        
        {/* KPI Card */}
        <div className="bg-surface rounded-2xl p-5 shadow-lg relative overflow-hidden border border-white/10">
          <div className="flex justify-between items-center relative z-10">
             <div>
               <p className="text-white text-xs font-bold uppercase tracking-widest">Asistencia de Hoy</p>
               <h2 className="text-5xl font-black text-white mt-1 drop-shadow-md">
                  {attendancePercentage}<span className="text-xl opacity-80">%</span>
               </h2>
             </div>
             <BarChart3 size={48} className="text-primary opacity-50" />
          </div>
          <div className="w-full bg-background/50 h-3 mt-4 rounded-full overflow-hidden relative z-10">
            <div 
                className="h-full bg-primary transition-all duration-700 ease-out" 
                style={{ width: `${attendancePercentage}%` }}
            />
          </div>
          {/* Decorative background shape */}
          <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        </div>

        {/* Global Statistics Graph (Valkyrie 2.0) */}
        <div className="bg-surface rounded-2xl p-5 shadow-lg border border-white/10">
           <h3 className="text-white text-sm font-bold uppercase tracking-widest flex items-center gap-2 mb-6">
              <TrendingUp className="text-primary" size={16} /> Evolución Semanal
           </h3>
           <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={[
                   { name: 'L', count: Math.floor(Math.random() * 20) + 10 },
                   { name: 'M', count: Math.floor(Math.random() * 20) + 10 },
                   { name: 'Mi', count: Math.floor(Math.random() * 20) + 10 },
                   { name: 'J', count: Math.floor(Math.random() * 20) + 10 },
                   { name: 'V', count: Math.floor(Math.random() * 20) + 10 }
                 ]}>
                    <Tooltip 
                      cursor={{fill: 'rgba(255,255,255,0.05)'}}
                      contentStyle={{ backgroundColor: '#1B3B22', border: '1px solid #3F7E44', borderRadius: '12px', color: '#fff' }}
                    />
                    <XAxis dataKey="name" stroke="#fff" opacity={0.5} tickLine={false} axisLine={false} />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {
                        /* We color today different as a demo */
                        [0,1,2,3,4].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 2 ? '#FDE047' : '#3F7E44'} />
                        ))
                      }
                    </Bar>
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Attendance List */}
        <div>
           <div className="flex justify-between items-end mb-3 px-1">
              <h2 className="text-white font-bold uppercase tracking-widest text-sm">Lista del Día ({todayInitial})</h2>
              <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">{checkedInIds.length} / {expectedPlayers.length}</span>
           </div>

           {expectedPlayers.length === 0 ? (
             <div className="bg-surface/50 rounded-2xl p-6 text-center mt-2 border border-white/10">
                <div className="bg-background w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
                   <AlertTriangle className="text-primary" />
                </div>
                <h3 className="text-white font-bold mb-1">¡Día libre o sin datos!</h3>
                <p className="text-white/60 text-sm">No hay jugadoras agendadas para entrenar hoy según sus fichas.</p>
             </div>
           ) : (
             <div className="space-y-3">
               {expectedPlayers.map(player => {
                  const isPresent = checkedInIds.includes(player.id);
                  return (
                    <button 
                      key={player.id}
                      onClick={() => toggleCheckIn(player.id)}
                      className="flex items-center p-3 rounded-xl w-full text-left transition-all active:scale-95 duration-200 bg-surface shadow-md hover:bg-surface/90 border border-transparent group"
                    >
                      <div className="flex-1 min-w-0 flex items-center gap-3">
                         <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg transition-colors ${
                           isPresent ? 'bg-primary text-background' : 'bg-background/80 border border-white/20 text-white'
                         }`}>
                            {player.jerseyNumber || '-'}
                         </div>
                         <div>
                           <span className="block font-bold text-white text-base truncate">
                              {player.nickname}
                           </span>
                           <span className="text-xs text-white/70 truncate">{player.fullName}</span>
                         </div>
                      </div>
                      
                      <div className="pl-3">
                        {isPresent ? (
                          <CheckCircle2 className="text-primary drop-shadow-[0_0_10px_rgba(253,224,71,0.5)]" size={28} />
                        ) : (
                          <div className="px-3 py-1 bg-primary text-background text-[10px] font-black uppercase rounded-md shadow-sm">
                            Marcar
                          </div>
                        )}
                      </div>
                    </button>
                  )
               })}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};
