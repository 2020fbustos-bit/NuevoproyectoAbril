import React, { useState, useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { BarChart3, TrendingUp, Calendar, ChevronDown, ChevronUp, Award } from 'lucide-react';

const DAYS_MAP = ['D', 'L', 'M', 'Mi', 'J', 'V', 'S'];

export const IndicatorsPage = () => {
  const players = useAppStore(state => state.players);
  const attendances = useAppStore(state => state.attendances);

  // Defaults to current month
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(firstDay);
  const [endDate, setEndDate] = useState(lastDay);
  
  const [showAll, setShowAll] = useState(false);

  const { ranking, totalPercentage, totalExpected } = useMemo(() => {
    const rangeAttendances = attendances.filter(a => a.dateStr >= startDate && a.dateStr <= endDate);

    const playerStats = new Map<string, { expected: number; present: number }>();
    
    players.filter(p => p.isActive).forEach(p => {
      playerStats.set(p.id, { expected: 0, present: 0 });
    });

    rangeAttendances.forEach(log => {
      const dayInitial = DAYS_MAP[new Date(log.dateStr + 'T12:00:00').getDay()];
      players.forEach(p => {
         if (p.isActive && p.trainingDays.includes(dayInitial)) {
            const stats = playerStats.get(p.id) || { expected: 0, present: 0 };
            stats.expected += 1;
            if (log.presentPlayerIds.includes(p.id)) {
               stats.present += 1;
            }
            playerStats.set(p.id, stats);
         }
      });
    });

    const attendanceRanking = Array.from(playerStats.entries())
      .map(([id, stats]) => {
        const player = players.find(p => p.id === id)!;
        const percentage = stats.expected > 0 ? Math.round((stats.present / stats.expected) * 100) : 0;
        return { player, ...stats, percentage };
      })
      .filter(item => item.expected > 0)
      .sort((a, b) => {
         if (b.percentage === a.percentage) {
            return b.present - a.present; // Tie-breaker by absolute attendance
         }
         return b.percentage - a.percentage;
      });

    const expected = attendanceRanking.reduce((sum, item) => sum + item.expected, 0);
    const present = attendanceRanking.reduce((sum, item) => sum + item.present, 0);
    const percentage = expected > 0 ? Math.round((present / expected) * 100) : 0;

    return { ranking: attendanceRanking, totalPercentage: percentage, totalExpected: expected };
  }, [startDate, endDate, attendances, players]);

  const displayedRanking = showAll ? ranking : ranking.slice(0, 5);

  return (
    <div className="min-h-screen pb-24 font-sans">
      <div className="pt-8 px-4 pb-6">
        <h1 className="text-[32px] leading-tight font-black text-primary uppercase tracking-tight">
          Indicadores
        </h1>
        <p className="text-white font-medium text-sm mt-2 tracking-widest uppercase flex items-center gap-2">
          <BarChart3 size={16} /> Rendimiento del Equipo
        </p>
      </div>

      <div className="px-4 space-y-6">
        {/* Date Range Picker */}
        <div className="bg-surface rounded-2xl p-4 border border-white/10 shadow-lg">
           <h3 className="text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 mb-3">
              <Calendar size={14} className="text-primary" /> Periodo a Evaluar
           </h3>
           <div className="flex gap-3">
              <div className="flex-1">
                 <label className="text-[10px] text-white/50 uppercase font-bold block mb-1">Desde</label>
                 <input 
                   type="date" 
                   value={startDate}
                   onChange={e => setStartDate(e.target.value)}
                   className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary transition-colors appearance-none"
                 />
              </div>
              <div className="flex-1">
                 <label className="text-[10px] text-white/50 uppercase font-bold block mb-1">Hasta</label>
                 <input 
                   type="date" 
                   value={endDate}
                   onChange={e => setEndDate(e.target.value)}
                   className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary transition-colors appearance-none"
                 />
              </div>
           </div>
        </div>

        {/* Total KPI */}
        <div className="bg-surface rounded-2xl p-5 shadow-lg relative overflow-hidden border border-white/10">
          <div className="flex justify-between items-center relative z-10">
             <div>
               <p className="text-white text-xs font-bold uppercase tracking-widest">Asistencia Global</p>
               <h2 className="text-5xl font-black text-white mt-1 drop-shadow-md">
                  {totalPercentage}<span className="text-xl opacity-80">%</span>
               </h2>
               <p className="text-white/50 text-[10px] uppercase font-bold mt-1">
                  Basado en {totalExpected} cupos de entrenamiento
               </p>
             </div>
             <TrendingUp size={48} className="text-primary opacity-50" />
          </div>
          <div className="w-full bg-background/50 h-3 mt-4 rounded-full overflow-hidden relative z-10">
            <div 
                className="h-full bg-primary transition-all duration-700 ease-out" 
                style={{ width: `${totalPercentage}%` }}
            />
          </div>
        </div>

        {/* Ranking List */}
        <div>
           <div className="flex justify-between items-end mb-3 px-1">
              <h2 className="text-white font-bold uppercase tracking-widest text-sm">Ranking de Asistencia</h2>
              <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">{ranking.length} Jugadoras</span>
           </div>

           {ranking.length === 0 ? (
             <div className="bg-surface/50 rounded-2xl p-6 text-center mt-2 border border-white/10">
                <p className="text-white/60 text-sm">No hay registros de asistencia en este periodo.</p>
             </div>
           ) : (
             <div className="space-y-3">
               {displayedRanking.map((item, index) => (
                  <div key={item.player.id} className="flex items-center p-3 rounded-xl w-full bg-surface border border-white/5 shadow-md">
                    <div className="flex-1 min-w-0 flex items-center gap-3">
                       <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${
                         index === 0 ? 'bg-[#FFD700] text-black shadow-[0_0_15px_rgba(255,215,0,0.5)]' :
                         index === 1 ? 'bg-[#C0C0C0] text-black' :
                         index === 2 ? 'bg-[#CD7F32] text-white' :
                         'bg-background border border-white/20 text-white'
                       }`}>
                          {index < 3 ? <Award size={16} /> : index + 1}
                       </div>
                       <div className="min-w-0 flex-1">
                         <span className="block font-bold text-white text-base truncate">
                            {item.player.nickname}
                         </span>
                         <span className="text-[10px] text-white/50 uppercase block">
                            {item.present} de {item.expected} clases
                         </span>
                       </div>
                    </div>
                    
                    <div className="pl-3 text-right">
                       <span className={`text-lg font-black ${item.percentage >= 80 ? 'text-primary' : item.percentage >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                          {item.percentage}%
                       </span>
                    </div>
                  </div>
               ))}

               {ranking.length > 5 && (
                 <button 
                   onClick={() => setShowAll(!showAll)}
                   className="w-full py-3 mt-2 flex items-center justify-center gap-2 bg-surface/50 hover:bg-surface border border-white/10 rounded-xl transition-colors text-white/70 hover:text-white text-xs font-bold uppercase tracking-widest"
                 >
                   {showAll ? (
                     <><ChevronUp size={16} /> Ver solo Top 5</>
                   ) : (
                     <><ChevronDown size={16} /> Abrir Pantalla ({ranking.length - 5} más)</>
                   )}
                 </button>
               )}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};
