import React, { useState, useMemo } from 'react';
import { useAppStore, type Player } from '../store/useAppStore';
import { Shield, Trophy, RotateCcw } from 'lucide-react';
import { CrossedSticks } from '../components/CrossedSticks';

export const TrainingPage = () => {
  const allPlayers = useAppStore(state => state.players);
  const players = useMemo(() => allPlayers.filter(p => p.isActive), [allPlayers]);
  
  const activeTraining = useAppStore(state => state.activeTraining);
  const setActiveTraining = useAppStore(state => state.setActiveTraining);
  const clearActiveTraining = useAppStore(state => state.clearActiveTraining);

  const teamA = useMemo(() => players.filter(p => activeTraining.teamA.includes(p.id)), [players, activeTraining.teamA]);
  const teamB = useMemo(() => players.filter(p => activeTraining.teamB.includes(p.id)), [players, activeTraining.teamB]);
  
  const scoreA = activeTraining.scoreA;
  const scoreB = activeTraining.scoreB;
  const setScoreA = (score: number) => setActiveTraining({ scoreA: score });
  const setScoreB = (score: number) => setActiveTraining({ scoreB: score });

  const availablePlayers = useMemo(() => {
    return players.filter(p => !activeTraining.teamA.includes(p.id) && !activeTraining.teamB.includes(p.id));
  }, [players, activeTraining]);

  const addToTeamA = (p: Player) => setActiveTraining({ teamA: [...activeTraining.teamA, p.id] });
  const addToTeamB = (p: Player) => setActiveTraining({ teamB: [...activeTraining.teamB, p.id] });
  
  const removeFromTeam = (p: Player, team: 'A'|'B') => {
    if (team === 'A') setActiveTraining({ teamA: activeTraining.teamA.filter(id => id !== p.id) });
    if (team === 'B') setActiveTraining({ teamB: activeTraining.teamB.filter(id => id !== p.id) });
  };

  const handleClear = () => {
    if (window.confirm('¿Deseas reiniciar la pizarra de entrenamiento?')) {
      clearActiveTraining();
    }
  };

  return (
    <div className="min-h-screen pb-32 font-sans px-4">
      <div className="mb-4 pt-6 pb-2">
         <h1 className="text-3xl font-black text-white uppercase tracking-tight flex items-center gap-2">
           <CrossedSticks className="text-primary"/> Draft & Práctica
         </h1>
         <p className="text-white/70 text-sm font-medium">Arma los equipos y registra el marcador</p>
      </div>

      {/* Scoreboard */}
      <div className="bg-surface rounded-3xl p-4 shadow-xl border border-white/10 mb-6 flex justify-between items-center relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 via-transparent to-red-600/10 pointer-events-none"/>
         
         <div className="text-center z-10 w-1/3">
           <h3 className="text-primary font-black uppercase text-xs mb-2">Equipo A</h3>
           <div className="flex justify-center items-center gap-2">
              <button 
                onClick={() => setScoreA(Math.max(0, scoreA - 1))}
                className="w-8 h-8 rounded-full bg-background border border-white/10 text-white flex items-center justify-center active:bg-primary active:text-black font-bold"
              >-</button>
              <span className="text-4xl text-white font-black w-12">{scoreA}</span>
              <button 
                onClick={() => setScoreA(scoreA + 1)}
                className="w-8 h-8 rounded-full bg-background border border-white/10 text-white flex items-center justify-center active:bg-primary active:text-black font-bold"
              >+</button>
           </div>
         </div>

         <div className="z-10 flex flex-col items-center">
            <span className="text-white/30 text-xs font-bold font-mono">VS</span>
         </div>

         <div className="text-center z-10 w-1/3">
           <h3 className="text-red-400 font-black uppercase text-xs mb-2">Equipo B</h3>
           <div className="flex justify-center items-center gap-2">
              <button 
                onClick={() => setScoreB(Math.max(0, scoreB - 1))}
                className="w-8 h-8 rounded-full bg-background border border-white/10 text-white flex items-center justify-center active:bg-red-500 active:text-white font-bold"
              >-</button>
              <span className="text-4xl text-white font-black w-12">{scoreB}</span>
              <button 
                onClick={() => setScoreB(scoreB + 1)}
                className="w-8 h-8 rounded-full bg-background border border-white/10 text-white flex items-center justify-center active:bg-red-500 active:text-white font-bold"
              >+</button>
           </div>
         </div>
      </div>

      {/* Roster Draft Area */}
      <h3 className="text-white/50 text-xs font-black uppercase tracking-widest mb-3">Jugadoras Disponibles ({availablePlayers.length})</h3>
      <div className="flex gap-2 overflow-x-auto pb-4 hide-scrollbar snap-x">
         {availablePlayers.map(p => (
           <div key={p.id} className="snap-start flex-shrink-0 bg-background border border-white/10 rounded-2xl p-3 w-36 shadow-lg">
              <div className="text-primary font-black mb-1 truncate">{p.nickname}</div>
              <div className="text-[10px] text-white/50 uppercase tracking-widest truncate">{p.position}</div>
              <div className="flex gap-2 mt-3">
                 <button onClick={() => addToTeamA(p)} className="flex-1 bg-green-500/20 text-green-400 py-1.5 rounded-lg text-xs font-bold hover:bg-green-500 hover:text-white transition">+ A</button>
                 <button onClick={() => addToTeamB(p)} className="flex-1 bg-red-500/20 text-red-400 py-1.5 rounded-lg text-xs font-bold hover:bg-red-500 hover:text-white transition">+ B</button>
              </div>
           </div>
         ))}
         {availablePlayers.length === 0 && <div className="text-white/30 text-xs italic px-2">No hay más jugadoras.</div>}
      </div>

      {/* Configured Teams View */}
      <div className="grid grid-cols-2 gap-4 mt-4">
         <div className="bg-surface rounded-2xl border border-green-500/20 p-3">
            <h4 className="text-green-400 text-xs font-black uppercase mb-3 text-center border-b border-green-500/20 pb-2">Team A ({teamA.length})</h4>
            <div className="space-y-2">
              {teamA.map(p => (
                <div key={p.id} onClick={() => removeFromTeam(p, 'A')} className="text-xs text-white bg-background px-2 py-2 rounded-lg flex justify-between cursor-pointer active:scale-95 border border-white/5">
                   <span className="truncate pr-1">{p.nickname}</span>
                   <span className="text-white/30 truncate pl-1 border-l border-white/10 w-16 text-right">{p.position}</span>
                </div>
              ))}
            </div>
         </div>

         <div className="bg-surface rounded-2xl border border-red-500/20 p-3">
            <h4 className="text-red-400 text-xs font-black uppercase mb-3 text-center border-b border-red-500/20 pb-2">Team B ({teamB.length})</h4>
            <div className="space-y-2">
              {teamB.map(p => (
                <div key={p.id} onClick={() => removeFromTeam(p, 'B')} className="text-xs text-white bg-background px-2 py-2 rounded-lg flex justify-between cursor-pointer active:scale-95 border border-white/5">
                   <span className="truncate pr-1">{p.nickname}</span>
                   <span className="text-white/30 truncate pl-1 border-l border-white/10 w-16 text-right">{p.position}</span>
                </div>
              ))}
            </div>
         </div>
      </div>

      <button 
        onClick={handleClear}
        className="w-full mt-8 bg-white/5 text-white/50 font-black uppercase rounded-2xl py-4 border border-white/10 active:scale-[0.98] flex justify-center items-center gap-2"
      >
        <RotateCcw size={20}/> Reiniciar Pizarra
      </button>

    </div>
  );
};
