import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { AddPlayerModal } from '../components/AddPlayerModal';
import { UserPlus, ChevronRight, ShieldAlert } from 'lucide-react';

export const PlayersPage = () => {
  const players = useAppStore(state => state.players);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedPlayerId, setExpandedPlayerId] = useState<string | null>(null);

  return (
    <div className="relative min-h-screen pb-24 font-sans px-4">
      
      {/* Header */}
      <div className="mb-6 pt-6 pb-2">
         <h1 className="text-3xl font-black text-white uppercase tracking-tight">Jugadoras</h1>
         <p className="text-white/70 text-sm font-medium">{players.length} perfiles registrados</p>
      </div>

      {/* Players List */}
      {players.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center px-4 bg-surface/30 rounded-2xl border border-white/10 mt-10">
           <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mb-4">
             <UserPlus className="text-primary" size={32} />
           </div>
           <h3 className="text-lg font-bold text-white mb-2 uppercase">Sin jugadoras</h3>
           <p className="text-white/70 text-sm">Comienza agregando los perfiles deportivos tocando el botón flotante amarillo.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {players.map(player => {
            const isExpanded = expandedPlayerId === player.id;
            return (
              <div key={player.id} onClick={() => setExpandedPlayerId(isExpanded ? null : player.id)} className="bg-surface hover:bg-surface/80 transition-colors rounded-xl p-4 flex flex-col shadow-md cursor-pointer group border border-white/5">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-background border-2 border-primary flex flex-col justify-center items-center mr-4 flex-shrink-0">
                    <span className="text-primary font-black text-lg leading-none">{player.jerseyNumber || '-'}</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                     <h3 className="text-white font-bold truncate text-base flex items-center gap-2">
                       {player.nickname} 
                       {player.allergies && (
                          <span className="bg-red-500/20 text-red-500 border border-red-500/50 text-[9px] px-2 py-0.5 rounded-full font-bold inline-flex items-center gap-1 uppercase">
                             Médico
                          </span>
                       )}
                     </h3>
                     <p className="text-white/70 text-xs truncate font-medium">{player.fullName}</p>
                     <div className="flex gap-1 mt-2">
                        {player.trainingDays.map(day => (
                          <span key={day} className="text-[9px] bg-background text-primary px-1.5 py-0.5 rounded font-bold uppercase">{day}</span>
                        ))}
                     </div>
                  </div>
                  
                  <button className="px-3 py-1.5 bg-primary text-background font-bold text-[10px] uppercase rounded-md shadow-sm">
                    {isExpanded ? 'Cerrar' : 'Ver Ficha'}
                  </button>
                </div>

                {/* Expanded Details Form */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-white/10 text-sm space-y-3 animate-in slide-in-from-top-2">
                     <div className="grid grid-cols-2 gap-2">
                       <div>
                         <p className="text-white/40 text-[10px] uppercase font-black">Posición</p>
                         <p className="text-white font-medium">{player.position}</p>
                       </div>
                       <div>
                         <p className="text-white/40 text-[10px] uppercase font-black">RUT</p>
                         <p className="text-white font-medium">{player.rut}</p>
                       </div>
                       <div>
                         <p className="text-white/40 text-[10px] uppercase font-black">Celular</p>
                         <p className="text-white font-medium">{player.phone || 'N/A'}</p>
                       </div>
                       <div>
                         <p className="text-white/40 text-[10px] uppercase font-black">Email</p>
                         <p className="text-white font-medium truncate">{player.email || 'N/A'}</p>
                       </div>
                     </div>
                     <div className="bg-orange-500/10 p-3 rounded-lg border border-orange-500/20">
                         <p className="text-orange-500/70 text-[10px] uppercase font-black">Alérgia Médica</p>
                         <p className="text-white font-medium">{player.allergies || 'Ninguna descrita'}</p>
                         
                         <p className="text-orange-500/70 text-[10px] uppercase font-black mt-2">Emergencia</p>
                         <p className="text-white font-medium">{player.emergencyContactName} ({player.emergencyContactPhone})</p>
                     </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* FAB - Floating Action Button */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-background rounded-full shadow-[0_4px_15px_rgba(253,224,71,0.4)] flex items-center justify-center hover:scale-105 transition-all active:scale-95 z-40">
        <UserPlus size={26} strokeWidth={2.5}/>
      </button>

      {/* Modal */}
      {isModalOpen && <AddPlayerModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};
