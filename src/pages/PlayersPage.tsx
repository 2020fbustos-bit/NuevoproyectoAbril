import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { AddPlayerModal } from '../components/AddPlayerModal';
import { UserPlus, ChevronRight, ShieldAlert, Save, Key, UserCog, Calendar } from 'lucide-react';

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
                   <div className="mt-4 pt-4 border-t border-white/10 text-sm space-y-3 animate-in slide-in-from-top-2" onClick={e => e.stopPropagation()}>
                      <PlayerEditor player={player} onClose={() => setExpandedPlayerId(null)} />
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

const PlayerEditor = ({ player, onClose }: { player: any, onClose: () => void }) => {
  const updatePlayer = useAppStore(state => state.updatePlayer);
  const updateUserAuth = useAppStore(state => state.updateUserAuth);
  const users = useAppStore(state => state.users);
  
  const [formData, setFormData] = useState(player);
  
  const userAuth = users.find(u => u.id === player.id) || { role: 'jugadora', pass: '1234', email: player.rut.replace(/[\.\-]/g, '') };
  const [role, setRole] = useState(userAuth.role);
  const [pass, setPass] = useState(userAuth.pass);
  const [username, setUsername] = useState(userAuth.email);
  const DAYS = ['L', 'M', 'Mi', 'J', 'V', 'S', 'D'];

  const handleDaySelect = (day: string) => {
    setFormData((prev: any) => ({
      ...prev,
      trainingDays: prev.trainingDays.includes(day)
        ? prev.trainingDays.filter((d: string) => d !== day)
        : [...prev.trainingDays, day]
    }));
  };

  const handleSave = () => {
    updatePlayer(player.id, formData);
    updateUserAuth(player.id, role, pass, username);
    onClose();
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
         <div>
            <label className="text-[10px] font-bold text-white/50 uppercase">Posición</label>
            <input type="text" value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} className="w-full bg-white text-black font-bold border-0 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-primary outline-none" />
         </div>
         <div>
            <label className="text-[10px] font-bold text-white/50 uppercase">Celular</label>
            <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-white text-black font-bold border-0 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-primary outline-none" />
         </div>
      </div>
      
      {/* Edit Training Days */}
      <div>
         <label className="text-[10px] font-bold text-white/50 uppercase mb-2 block">Días de Entrenamiento</label>
         <div className="flex justify-between items-center bg-surface p-2 rounded-xl border border-white/10">
            {DAYS.map(day => {
              const isSelected = formData.trainingDays.includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDaySelect(day)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-200
                    ${isSelected ? 'bg-primary text-black scale-110 shadow-md' : 'bg-background text-white/40 hover:bg-white/10'}
                  `}
                >
                  {day}
                </button>
              )
            })}
         </div>
      </div>

      <div className="bg-orange-500/10 p-3 rounded-lg border border-orange-500/20 space-y-2">
         <p className="text-orange-500/70 text-[10px] uppercase font-black flex items-center gap-1"><ShieldAlert size={12}/> Info Médica y Emergencia</p>
         <div>
            <label className="text-[10px] font-bold text-orange-200/50 uppercase">Clínica de Preferencia</label>
            <input type="text" value={formData.preferredClinic || ''} onChange={e => setFormData({...formData, preferredClinic: e.target.value})} className="w-full bg-white text-black font-bold border-0 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-orange-500 outline-none" placeholder="Indisa, Alemana, etc." />
         </div>
         <div>
            <label className="text-[10px] font-bold text-orange-200/50 uppercase">Alergias</label>
            <input type="text" value={formData.allergies} onChange={e => setFormData({...formData, allergies: e.target.value})} className="w-full bg-white text-black font-bold border-0 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-orange-500 outline-none" />
         </div>
         <div className="grid grid-cols-2 gap-2">
           <div>
              <label className="text-[10px] font-bold text-orange-200/50 uppercase">Contacto</label>
              <input type="text" value={formData.emergencyContactName} onChange={e => setFormData({...formData, emergencyContactName: e.target.value})} className="w-full bg-white text-black font-bold border-0 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-orange-500 outline-none" />
           </div>
           <div>
              <label className="text-[10px] font-bold text-orange-200/50 uppercase">Teléfono Contacto</label>
              <input type="text" value={formData.emergencyContactPhone} onChange={e => setFormData({...formData, emergencyContactPhone: e.target.value})} className="w-full bg-white text-black font-bold border-0 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-orange-500 outline-none" />
           </div>
         </div>
      </div>

      <div className="bg-blue-500/10 p-3 rounded-lg border border-blue-500/20 space-y-2">
         <p className="text-blue-500/70 text-[10px] uppercase font-black flex items-center gap-1"><Calendar size={12}/> Tiempos de Activación</p>
         <div className="grid grid-cols-2 gap-2">
           <div>
              <label className="text-[10px] font-bold text-blue-200/50 uppercase">Fecha Activación</label>
              <input type="date" value={formData.activationDate || ''} onChange={e => setFormData({...formData, activationDate: e.target.value})} className="w-full bg-white text-black font-bold border-0 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none" />
           </div>
           <div>
              <label className="text-[10px] font-bold text-blue-200/50 uppercase">Fecha Desactivación</label>
              <input type="date" value={formData.deactivationDate || ''} onChange={e => setFormData({...formData, deactivationDate: e.target.value})} className="w-full bg-white text-black font-bold border-0 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none" />
           </div>
         </div>
      </div>

      <div className="bg-purple-500/10 p-3 rounded-lg border border-purple-500/20 space-y-2">
         <p className="text-purple-500/70 text-[10px] uppercase font-black flex items-center gap-1"><Key size={12}/> Acceso a la App</p>
         <div>
            <label className="text-[10px] font-bold text-purple-200/50 uppercase">Usuario</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-white text-black font-bold border-0 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-purple-500 outline-none mb-2" />
         </div>
         <div className="grid grid-cols-2 gap-2">
           <div>
              <label className="text-[10px] font-bold text-purple-200/50 uppercase">Perfil</label>
              <select value={role} onChange={e => setRole(e.target.value as any)} className="w-full bg-white text-black font-bold border-0 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-purple-500 outline-none">
                 <option value="jugadora">Jugadora</option>
                 <option value="admin">Administradora</option>
              </select>
           </div>
           <div>
              <label className="text-[10px] font-bold text-purple-200/50 uppercase">Clave (4 dígitos)</label>
              <input type="text" maxLength={4} value={pass} onChange={e => setPass(e.target.value)} className="w-full bg-white text-black font-bold border-0 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-purple-500 outline-none" placeholder="1234" />
           </div>
         </div>
      </div>

      <button onClick={handleSave} className="w-full py-2 bg-primary text-background font-bold uppercase rounded-lg shadow-md hover:bg-primary/90 flex items-center justify-center gap-2">
         <Save size={16} /> Guardar Ficha
      </button>
    </div>
  );
};

