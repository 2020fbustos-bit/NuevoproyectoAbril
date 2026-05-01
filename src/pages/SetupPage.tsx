import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Settings, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SetupPage = () => {
  const navigate = useNavigate();
  const teamName = useAppStore(state => state.teamName);
  const setTeamName = useAppStore(state => state.setTeamName);

  const [localName, setLocalName] = useState(teamName);

  const handleSaveTeam = () => {
    if (localName) {
      setTeamName(localName);
      navigate('/');
    }
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
        <h2 className="text-lg font-bold text-primary uppercase mb-4">Nombre del Equipo</h2>
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
      
      <div className="text-center mt-12">
         <p className="text-white/40 text-xs">La administración de credenciales y roles ahora se gestiona directamente desde la pestaña <strong className="text-white/60">Fichas</strong> al editar a cada jugadora.</p>
      </div>

    </div>
  );
};
