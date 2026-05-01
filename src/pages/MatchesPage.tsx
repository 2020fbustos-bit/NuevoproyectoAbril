import React, { useState } from 'react';
import { useAppStore, type MatchEvent } from '../store/useAppStore';
import { Trophy, Timer, Crosshair, Shield, Check, X, ShieldAlert } from 'lucide-react';

export const MatchesPage = () => {
  const players = useAppStore(state => state.players);
  const saveMatch = useAppStore(state => state.saveMatch);
  const matchesLog = useAppStore(state => state.matches);
  const teamName = useAppStore(state => state.teamName);

  const [isMatchActive, setIsMatchActive] = useState(false);
  const [rivalName, setRivalName] = useState('');
  
  // Match Live State
  const [ourScore, setOurScore] = useState(0);
  const [theirScore, setTheirScore] = useState(0);
  const [saves, setSaves] = useState(0);
  const [events, setEvents] = useState<MatchEvent[]>([]);

  // Modals
  const [showOurGoalModal, setShowOurGoalModal] = useState(false);
  const [showTheirGoalModal, setShowTheirGoalModal] = useState(false);
  const [tempRivalJersey, setTempRivalJersey] = useState('');

  const startMatch = () => {
    if (!rivalName) return;
    setIsMatchActive(true);
    setOurScore(0);
    setTheirScore(0);
    setSaves(0);
    setEvents([]);
  };

  const registerOurGoal = (nickname: string) => {
    setOurScore(prev => prev + 1);
    setEvents(prev => [...prev, { type: 'goal_us', playerNickname: nickname, timestamp: Date.now() }]);
    setShowOurGoalModal(false);
  };

  const registerTheirGoal = () => {
    if (!tempRivalJersey) return;
    setTheirScore(prev => prev + 1);
    setEvents(prev => [...prev, { type: 'goal_them', rivalJerseyNumber: tempRivalJersey, timestamp: Date.now() }]);
    setShowTheirGoalModal(false);
    setTempRivalJersey('');
  };

  const registerSave = () => {
    setSaves(prev => prev + 1);
    setEvents(prev => [...prev, { type: 'save', timestamp: Date.now() }]);
  };

  const finishMatch = () => {
    saveMatch({
      rivalName,
      date: Date.now(),
      ourScore,
      theirScore,
      saves,
      events
    });
    setIsMatchActive(false);
    setRivalName('');
  };

  if (!isMatchActive) {
    return (
      <div className="min-h-screen pb-24 font-sans px-4">
        <div className="mb-6 pt-6 pb-2">
           <h1 className="text-3xl font-black text-white uppercase tracking-tight">Partidos</h1>
           <p className="text-white/70 text-sm font-medium">Registro oficial en vivo y estadísticas</p>
        </div>

        {/* Start Match Box */}
        <div className="bg-surface rounded-2xl p-6 shadow-xl border border-white/10 mb-8">
           <div className="flex items-center gap-3 mb-4">
              <Trophy className="text-primary" size={24} />
              <h2 className="text-xl font-bold text-white uppercase">Nuevo Encuentro</h2>
           </div>
           <input 
             type="text" 
             value={rivalName} 
             onChange={e => setRivalName(e.target.value)} 
             placeholder="Nombre del equipo contrario" 
             className="w-full bg-background border border-white/20 rounded-xl p-4 text-white uppercase font-bold focus:border-primary outline-none focus:ring-1 focus:ring-primary mb-4 placeholder:text-white/30"
           />
           <button 
             onClick={startMatch}
             disabled={!rivalName}
             className="w-full bg-primary text-background font-black uppercase tracking-wider py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors shadow-lg"
           >
             Iniciar Partido
           </button>
        </div>

        {/* Match History */}
        <div>
           <h3 className="text-white/70 font-bold uppercase tracking-widest text-sm mb-3">Historial Reciente</h3>
           {matchesLog.length === 0 ? (
             <p className="text-white/40 text-sm text-center py-8">No hay partidos jugados aún.</p>
           ) : (
             <div className="space-y-3">
               {matchesLog.map(m => (
                 <div key={m.id} className="bg-surface/50 border border-white/10 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-primary font-bold">{new Date(m.date).toLocaleDateString()}</p>
                      <p className="text-white font-bold uppercase">vs. {m.rivalName}</p>
                      <p className="text-xs text-white/60 mt-1 flex items-center gap-1"><Shield size={12}/> {m.saves} Atajadas</p>
                    </div>
                    <div className="flex items-center gap-2">
                       <span className={`text-2xl font-black ${m.ourScore >= m.theirScore ? 'text-primary' : 'text-red-400'}`}>{m.ourScore}</span>
                       <span className="text-white/40 text-lg">-</span>
                       <span className={`text-2xl font-black ${m.ourScore < m.theirScore ? 'text-primary' : 'text-white'}`}>{m.theirScore}</span>
                    </div>
                 </div>
               ))}
             </div>
           )}
        </div>
      </div>
    );
  }

  // ACTIVE MATCH UI
  return (
    <div className="min-h-screen pb-24 font-sans bg-background">
      
      {/* Live Scoreboard */}
      <div className="sticky top-0 bg-surface z-10 border-b border-primary shadow-xl rounded-b-[40px] p-6 pt-8 backdrop-blur-md">
         <div className="flex justify-center items-center gap-2 mb-4">
            <span className="animate-pulse w-2 h-2 rounded-full bg-red-500"></span>
            <span className="text-red-500 font-bold text-xs uppercase tracking-widest">En Vivo</span>
         </div>
         <div className="flex justify-between items-center px-4">
            <div className="text-center flex-1">
               <h3 className="text-primary text-xs font-black uppercase tracking-widest mb-1 truncate">{teamName}</h3>
               <span className="text-6xl font-black text-white drop-shadow-lg">{ourScore}</span>
            </div>
            <div className="px-4 text-white/30 text-4xl font-black">-</div>
            <div className="text-center flex-1">
               <h3 className="text-white/60 text-xs font-black uppercase tracking-widest mb-1 truncate">{rivalName}</h3>
               <span className="text-6xl font-black text-white drop-shadow-lg">{theirScore}</span>
            </div>
         </div>
      </div>

      <div className="px-4 mt-8 space-y-4">
         {/* Goals Row */}
         <div className="flex gap-4">
            <button 
              onClick={() => setShowOurGoalModal(true)}
              className="flex-1 bg-surface border border-primary/30 p-6 rounded-2xl flex flex-col items-center justify-center hover:bg-surface/80 transition-colors shadow-lg group active:scale-95"
            >
               <Crosshair className="text-primary mb-2" size={32} />
               <span className="text-white font-black uppercase text-sm group-hover:text-primary transition-colors">+ Gol Nuestro</span>
            </button>
            <button 
              onClick={() => setShowTheirGoalModal(true)}
              className="flex-1 bg-surface border border-red-500/30 p-6 rounded-2xl flex flex-col items-center justify-center hover:bg-surface/80 transition-colors shadow-lg group active:scale-95"
            >
               <ShieldAlert className="text-red-400 mb-2" size={32} />
               <span className="text-white font-black uppercase text-sm group-hover:text-red-400 transition-colors">+ Gol Rival</span>
            </button>
         </div>

         {/* Saves Row */}
         <button 
            onClick={registerSave}
            className="w-full bg-primary text-background p-6 rounded-2xl flex flex-col items-center justify-center shadow-[0_4px_25px_rgba(253,224,71,0.2)] active:scale-95 transition-transform"
         >
            <div className="flex items-center gap-3">
              <Shield size={32} strokeWidth={2.5} />
              <span className="text-4xl font-black">{saves}</span>
            </div>
            <span className="font-black uppercase tracking-widest mt-1">Arquera Ataja</span>
         </button>

         {/* KPI Log Summary */}
         {events.length > 0 && (
           <div className="bg-surface/50 rounded-xl p-4 border border-white/10 mt-6">
              <h4 className="text-white/60 text-xs font-bold uppercase mb-2">Últimos Registros</h4>
              <ul className="space-y-1">
                 {events.slice(-5).reverse().map((ev, i) => (
                   <li key={i} className="text-sm">
                      {ev.type === 'goal_us' && <span className="text-primary font-bold">⚽ Gol Valkyrie ({ev.playerNickname})</span>}
                      {ev.type === 'goal_them' && <span className="text-red-400 font-bold">⚠️ Gol Rival (Nº {ev.rivalJerseyNumber})</span>}
                      {ev.type === 'save' && <span className="text-emerald-400 font-bold">🧤 Gran Atajada</span>}
                   </li>
                 ))}
              </ul>
           </div>
         )}
      </div>

      <div className="fixed bottom-24 left-4 right-4">
        <button 
          onClick={finishMatch}
          className="w-full bg-red-600 text-white p-4 rounded-xl font-black uppercase shadow-lg shadow-red-900/50 hover:bg-red-500 active:scale-95 transition-all flex justify-center items-center gap-2"
        >
           <Check size={20} /> Finalizar Partido
        </button>
      </div>

      {/* Modals */}
      {showOurGoalModal && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end justify-center animate-in fade-in">
           <div className="bg-surface w-full max-h-[80vh] rounded-t-3xl border-t border-slate-700 flex flex-col p-6 animate-in slide-in-from-bottom">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-white uppercase text-primary">¿Quién anotó el gol?</h3>
                <button onClick={() => setShowOurGoalModal(false)} className="text-white/50"><X/></button>
              </div>
              <div className="overflow-y-auto grid grid-cols-2 gap-3 mb-8">
                 {players.filter(p => p.isActive).map(p => (
                   <button 
                     key={p.id} 
                     onClick={() => registerOurGoal(p.nickname)}
                     className="bg-background border border-white/10 p-4 rounded-xl text-center active:scale-95 hover:border-primary"
                   >
                      <span className="text-primary font-black text-xl mb-1 block">{p.jerseyNumber}</span>
                      <span className="text-white font-bold">{p.nickname}</span>
                   </button>
                 ))}
              </div>
           </div>
        </div>
      )}

      {showTheirGoalModal && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
           <div className="bg-surface w-full max-w-sm rounded-3xl border border-slate-700 p-6 shadow-2xl">
              <h3 className="text-xl font-black text-white uppercase text-red-400 mb-4">Registro Gol Rival</h3>
              <p className="text-white/60 text-sm mb-4">¿Qué número de camiseta del equipo rival anotó el gol?</p>
              <input 
                type="number" 
                value={tempRivalJersey}
                onChange={(e) => setTempRivalJersey(e.target.value)}
                autoFocus
                placeholder="Nº Camiseta"
                className="w-full bg-background border border-white/20 p-4 rounded-xl text-white font-black text-2xl text-center mb-6 outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400"
              />
              <div className="flex gap-3">
                 <button onClick={() => setShowTheirGoalModal(false)} className="flex-1 p-4 rounded-xl font-bold bg-slate-800 text-white">Cancelar</button>
                 <button onClick={registerTheirGoal} disabled={!tempRivalJersey} className="flex-1 p-4 rounded-xl font-bold bg-red-600 disabled:opacity-50 text-white uppercase tracking-widest">Guardar</button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};
