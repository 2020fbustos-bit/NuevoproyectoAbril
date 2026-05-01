import React, { useState, useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { CheckCircle2, UserX, BarChart3, AlertTriangle, ChevronRight, TrendingUp, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const DAYS_MAP = ['D', 'L', 'M', 'Mi', 'J', 'V', 'S'];

export const HomePage = () => {
  const players = useAppStore(state => state.players);
  const attendances = useAppStore(state => state.attendances);
  const logAttendance = useAppStore(state => state.logAttendance);
  
  // Date selection
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  
  const parsedDate = new Date(selectedDate + 'T12:00:00');
  const dayIndex = parsedDate.getDay();
  const dayInitial = DAYS_MAP[dayIndex];
  
  // Filter active players that have training on the selected day
  const expectedPlayers = players.filter(p => p.isActive && p.trainingDays.includes(dayInitial));
  
  const currentAttendance = attendances.find(a => a.dateStr === selectedDate);
  const checkedInIds = currentAttendance?.presentPlayerIds || [];
  
  const toggleCheckIn = (id: string) => {
    const newIds = checkedInIds.includes(id) 
      ? checkedInIds.filter(pid => pid !== id) 
      : [...checkedInIds, id];
    logAttendance(selectedDate, newIds);
  };

  const attendancePercentage = expectedPlayers.length > 0 
    ? Math.round((checkedInIds.length / expectedPlayers.length) * 100) 
    : 0;

  return (
    <div className="min-h-screen pb-24 font-sans">
      
      {/* Header */}
      <div className="pt-8 px-4 pb-6">
        <h1 className="text-[32px] leading-tight font-black text-primary uppercase tracking-tight">
          Control de<br />Asistencia
        </h1>
        <p className="text-white font-medium text-sm mt-2 tracking-widest uppercase flex items-center gap-2">
          <Calendar size={16} /> Selecciona la fecha
        </p>
        
        {/* Date Picker */}
        <div className="mt-4">
          <input 
            type="date" 
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="w-full bg-surface border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary font-bold transition-colors appearance-none"
          />
        </div>
      </div>

      <div className="px-4 space-y-6">
        


        {/* Attendance List */}
        <div>
           <div className="flex justify-between items-end mb-3 px-1">
              <h2 className="text-white font-bold uppercase tracking-widest text-sm">Lista de Jugadoras ({dayInitial})</h2>
              <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">{checkedInIds.length} / {expectedPlayers.length}</span>
           </div>

           {expectedPlayers.length === 0 ? (
             <div className="bg-surface/50 rounded-2xl p-6 text-center mt-2 border border-white/10">
                <div className="bg-background w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
                   <AlertTriangle className="text-primary" />
                </div>
                <h3 className="text-white font-bold mb-1">Día sin entrenamientos</h3>
                <p className="text-white/60 text-sm">No hay jugadoras agendadas para entrenar en este día según sus fichas.</p>
             </div>
           ) : (
             <div className="space-y-3">
               {expectedPlayers.map(player => {
                  const isPresent = checkedInIds.includes(player.id);
                  return (
                    <div 
                      key={player.id}
                      className={`flex items-center p-3 rounded-xl w-full text-left transition-all duration-200 border shadow-md ${
                        isPresent ? 'bg-surface/80 border-primary/30' : 'bg-surface border-transparent'
                      }`}
                    >
                      <div className="flex-1 min-w-0 flex items-center gap-3">
                         <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg transition-colors ${
                           isPresent ? 'bg-primary text-background shadow-[0_0_15px_rgba(253,224,71,0.3)]' : 'bg-background/80 border border-white/20 text-white/50'
                         }`}>
                            {player.jerseyNumber || '-'}
                         </div>
                         <div>
                           <span className={`block font-bold text-base truncate transition-colors ${isPresent ? 'text-white' : 'text-white/70'}`}>
                              {player.nickname}
                           </span>
                           <span className="text-xs text-white/40 truncate">{player.fullName}</span>
                         </div>
                      </div>
                      
                      <div className="pl-3">
                        <div className="flex bg-background/80 rounded-lg p-1 border border-white/5">
                           <button 
                              onClick={() => isPresent && toggleCheckIn(player.id)}
                              className={`px-3 py-1.5 text-[10px] font-black uppercase rounded-md transition-all ${!isPresent ? 'bg-red-500/20 text-red-400 border border-red-500/30 shadow-sm' : 'text-white/40 hover:text-white border border-transparent'}`}
                           >
                              Falta
                           </button>
                           <button 
                              onClick={() => !isPresent && toggleCheckIn(player.id)}
                              className={`px-3 py-1.5 text-[10px] font-black uppercase rounded-md transition-all ${isPresent ? 'bg-primary text-background shadow-[0_0_10px_rgba(253,224,71,0.3)] border border-primary' : 'text-white/40 hover:text-white border border-transparent'}`}
                           >
                              Vino
                           </button>
                        </div>
                      </div>
                    </div>
                  )
               })}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

