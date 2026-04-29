import React, { useState } from 'react';
import { useAppStore, type UserAuth, type Role } from '../store/useAppStore';
import { Settings, Save, ShieldAlert, KeyRound, UserPlus } from 'lucide-react';

export const SetupPage = () => {
  const teamName = useAppStore(state => state.teamName);
  const setTeamName = useAppStore(state => state.setTeamName);
  const users = useAppStore(state => state.users);
  const registerUser = useAppStore(state => state.registerUser);
  const players = useAppStore(state => state.players);

  const [localName, setLocalName] = useState(teamName);
  
  // Create user logic
  const [newEmail, setNewEmail] = useState('');
  const [newPass, setNewPass] = useState('');
  const [newRole, setNewRole] = useState<Role>('jugadora');
  const [linkedPlayerId, setLinkedPlayerId] = useState('');

  const handleSaveTeam = () => {
    if (localName) setTeamName(localName);
  };

  const handleCreateUser = () => {
    if (!newEmail || !newPass) return;
    registerUser({
      id: newRole === 'jugadora' ? linkedPlayerId : crypto.randomUUID(),
      role: newRole,
      email: newEmail,
      pass: newPass
    });
    setNewEmail('');
    setNewPass('');
  };

  return (
    <div className="min-h-screen pb-24 font-sans px-4">
      <div className="mb-6 pt-6 pb-2">
         <h1 className="text-3xl font-black text-white uppercase tracking-tight flex items-center gap-2">
           <Settings className="text-primary"/> Setup
         </h1>
         <p className="text-white/70 text-sm font-medium">Configuración de Equipo y Permisos</p>
      </div>

      {/* Team settings */}
      <div className="bg-surface rounded-2xl p-6 shadow-xl border border-white/10 mb-6">
        <h2 className="text-lg font-bold text-primary uppercase mb-4">Perfil del Equipo</h2>
        <div className="flex gap-2">
           <input 
             type="text" 
             value={localName} 
             onChange={e => setLocalName(e.target.value)}
             className="flex-1 bg-background border border-white/20 rounded-xl px-4 py-3 text-white uppercase focus:border-primary outline-none"
           />
           <button onClick={handleSaveTeam} className="bg-primary text-background px-4 rounded-xl font-black active:scale-95"><Save/></button>
        </div>
      </div>

      {/* Create User */}
      <div className="bg-surface rounded-2xl p-6 shadow-xl border border-white/10 mb-6">
        <h2 className="text-lg font-bold text-primary uppercase mb-1 flex items-center gap-2">
           <UserPlus size={20}/> Nuevo Acceso
        </h2>
        <p className="text-white/50 text-xs mb-4">Otorga claves a jugadoras o nuevos Coachs.</p>

        <div className="space-y-4">
          <div className="flex gap-2">
            <button 
               onClick={() => setNewRole('jugadora')}
               className={`flex-1 py-2 rounded-lg font-bold text-sm uppercase ${newRole === 'jugadora' ? 'bg-primary text-background' : 'bg-background text-white/50'}`}
            >Jugadora (Solo Lectura)</button>
            <button 
               onClick={() => setNewRole('admin')}
               className={`flex-1 py-2 rounded-lg font-bold text-sm uppercase ${newRole === 'admin' ? 'bg-primary text-background' : 'bg-background text-white/50'}`}
            >Admin (Coach)</button>
          </div>

          <input 
            type="text" 
            placeholder="Usuario o Correo" 
            value={newEmail} onChange={e => setNewEmail(e.target.value)}
            className="w-full bg-background border border-white/20 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
          />
          <input 
            type="text" 
            placeholder="Contraseña" 
            value={newPass} onChange={e => setNewPass(e.target.value)}
            className="w-full bg-background border border-white/20 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
          />

          {newRole === 'jugadora' && (
            <select 
              value={linkedPlayerId} 
              onChange={e => setLinkedPlayerId(e.target.value)}
              className="w-full bg-background border border-white/20 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
            >
              <option value="">-- Enlazar a Ficha Física --</option>
              {players.filter(p => !users.some(u => u.id === p.id)).map(p => (
                 <option key={p.id} value={p.id}>{p.nickname} ({p.fullName})</option>
              ))}
            </select>
          )}

          <button 
             onClick={handleCreateUser}
             disabled={!newEmail || !newPass || (newRole === 'jugadora' && !linkedPlayerId)}
             className="w-full bg-primary text-background py-3 rounded-xl font-black uppercase disabled:opacity-50"
          >
             Generar Clave
          </button>
        </div>
      </div>

      {/* Directory */}
      <div>
        <h3 className="text-white/70 font-bold uppercase tracking-widest text-sm mb-3">Directorio de Credenciales</h3>
        <div className="space-y-2">
           {users.map((u, i) => (
             <div key={i} className="bg-surface/50 p-3 rounded-xl border border-white/5 flex justify-between items-center">
                <div>
                  <p className="text-white font-bold">{u.email}</p>
                  <p className="text-xs text-white/50 font-mono flex items-center gap-1"><KeyRound size={10}/> {u.pass}</p>
                </div>
                <span className={`text-[10px] uppercase font-black px-2 py-1 rounded ${u.role === 'admin' ? 'bg-red-500/20 text-red-500' : 'bg-primary/20 text-primary'}`}>
                  {u.role}
                </span>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};
