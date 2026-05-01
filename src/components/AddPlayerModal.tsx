import React, { useState } from 'react';
import { X, Save, User, Phone, Mail, FileText, AlertCircle, Calendar } from 'lucide-react';
import { useAppStore, type Player } from '../store/useAppStore';

const DAYS = ['L', 'M', 'Mi', 'J', 'V', 'S', 'D'];
const POSITIONS = ['Arquera', 'Defensa', 'Mediocampista', 'Delantera', 'Pivot', 'Lateral'];

export const AddPlayerModal = ({ onClose }: { onClose: () => void }) => {
  const addPlayer = useAppStore(state => state.addPlayer);
  const [formData, setFormData] = useState<Omit<Player, 'id' | 'isActive'>>({
    fullName: '',
    nickname: '',
    jerseyNumber: '',
    phone: '',
    email: '',
    rut: '',
    position: 'Mediocampista',
    emergencyContactName: '',
    emergencyContactPhone: '',
    allergies: '',
    regularMedications: '',
    preferredClinic: '',
    comments: '',
    trainingDays: [],
    activationDate: new Date().toISOString().split('T')[0],
    deactivationDate: '',
  });

  const handleDaySelect = (day: string) => {
    setFormData(prev => ({
      ...prev,
      trainingDays: prev.trainingDays.includes(day)
        ? prev.trainingDays.filter(d => d !== day)
        : [...prev.trainingDays, day]
    }));
  };

  const handleSave = () => {
    if (!formData.fullName || !formData.nickname) return;
    addPlayer({ ...formData, isActive: true });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-surface w-full max-w-md h-[90vh] sm:h-auto sm:max-h-[85vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-700 animate-in slide-in-from-bottom flex-shrink-0">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-slate-700 bg-surface/50 backdrop-blur-md">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <User className="text-primary" />
            Nueva Jugadora
          </h2>
          <button onClick={onClose} className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white">
             <X size={20} />
          </button>
        </div>

        {/* Scrolling Form */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          
          <div className="space-y-4">
             <div>
                <label className="text-xs font-semibold text-slate-400 uppercase">Nombre Completo</label>
                <input type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none" placeholder="Ej. Valentina Rojas" />
             </div>
             
             <div className="grid grid-cols-2 gap-3">
               <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase">Nickname</label>
                  <input type="text" value={formData.nickname} onChange={e => setFormData({...formData, nickname: e.target.value})} className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-primary outline-none" placeholder="Vale" />
               </div>
               <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase">Número</label>
                  <input type="number" value={formData.jerseyNumber} onChange={e => setFormData({...formData, jerseyNumber: e.target.value})} className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-primary outline-none" placeholder="10" />
               </div>
             </div>

             <div className="grid grid-cols-2 gap-3">
               <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase">Celular</label>
                  <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-primary outline-none" placeholder="+569..." />
               </div>
               <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase">RUT</label>
                  <input type="text" value={formData.rut} onChange={e => setFormData({...formData, rut: e.target.value})} className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-primary outline-none" placeholder="12.345.678-9" />
               </div>
             </div>
             
             <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase">Posición</label>
                  <select value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-primary outline-none">
                     {POSITIONS.map(pos => <option key={pos} value={pos}>{pos}</option>)}
                  </select>
             </div>
          </div>

          <hr className="border-slate-800" />
          
          {/* Emergency & Medical */}
          <div className="space-y-4">
             <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                <AlertCircle className="text-orange-500" size={16} /> 
                Datos Médicos y Emergencia
             </h3>
             <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl space-y-3">
                  <div>
                     <label className="text-xs font-semibold text-orange-200/70 uppercase">¿Alergias?</label>
                     <input type="text" value={formData.allergies} onChange={e => setFormData({...formData, allergies: e.target.value})} className="w-full mt-1 bg-slate-900 border border-orange-500/30 rounded-xl p-3 text-white focus:border-orange-500 outline-none" placeholder="Ej. Penicilina (Dejar en blanco si ninguna)" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                       <label className="text-xs font-semibold text-orange-200/70 uppercase">Contacto</label>
                       <input type="text" value={formData.emergencyContactName} onChange={e => setFormData({...formData, emergencyContactName: e.target.value})} className="w-full mt-1 bg-slate-900 border border-orange-500/30 rounded-xl p-3 text-white focus:border-orange-500 outline-none" placeholder="Nombre" />
                    </div>
                    <div>
                       <label className="text-xs font-semibold text-orange-200/70 uppercase">Teléfono</label>
                       <input type="tel" value={formData.emergencyContactPhone} onChange={e => setFormData({...formData, emergencyContactPhone: e.target.value})} className="w-full mt-1 bg-slate-900 border border-orange-500/30 rounded-xl p-3 text-white focus:border-orange-500 outline-none" placeholder="Celular" />
                    </div>
                  </div>
                  <div>
                     <label className="text-xs font-semibold text-orange-200/70 uppercase">Clínica de Preferencia</label>
                     <input type="text" value={formData.preferredClinic} onChange={e => setFormData({...formData, preferredClinic: e.target.value})} className="w-full mt-1 bg-slate-900 border border-orange-500/30 rounded-xl p-3 text-white focus:border-orange-500 outline-none" placeholder="Clínica Alemana, Indisa, etc." />
                  </div>
                  <div>
                     <label className="text-xs font-semibold text-orange-200/70 uppercase">Remedios de Base</label>
                     <input type="text" value={formData.regularMedications} onChange={e => setFormData({...formData, regularMedications: e.target.value})} className="w-full mt-1 bg-slate-900 border border-orange-500/30 rounded-xl p-3 text-white focus:border-orange-500 outline-none" placeholder="Ej. Antialérgicos, etc." />
                  </div>
                  <div>
                     <label className="text-xs font-semibold text-orange-200/70 uppercase">Comentarios / Observaciones</label>
                     <textarea value={formData.comments} onChange={e => setFormData({...formData, comments: e.target.value})} className="w-full mt-1 bg-slate-900 border border-orange-500/30 rounded-xl p-3 text-white focus:border-orange-500 outline-none min-h-[80px]" placeholder="Información adicional relevante..." />
                  </div>
             </div>
          </div>

          <hr className="border-slate-800" />

          {/* Fechas de Activación */}
          <div className="space-y-4">
             <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                <Calendar className="text-primary" size={16} /> 
                Estado en el Club
             </h3>
             <div className="grid grid-cols-2 gap-3">
               <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase">F. Activación</label>
                  <input type="date" value={formData.activationDate} onChange={e => setFormData({...formData, activationDate: e.target.value})} className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-primary outline-none" />
               </div>
               <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase">F. Desactivación</label>
                  <input type="date" value={formData.deactivationDate} onChange={e => setFormData({...formData, deactivationDate: e.target.value})} className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-primary outline-none" />
               </div>
             </div>
          </div>

          <hr className="border-slate-800" />

          {/* Training Days */}
          <div>
            <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2 mb-3">
                <Calendar className="text-blue-500" size={16} /> 
                Días de Entrenamiento (Touch)
             </h3>
             <div className="flex justify-between items-center bg-slate-900 p-2 rounded-2xl border border-slate-700">
                {DAYS.map(day => {
                  const isSelected = formData.trainingDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleDaySelect(day)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-200 shadow-sm
                        ${isSelected ? 'bg-primary text-white scale-110 shadow-primary/40' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}
                      `}
                    >
                      {day}
                    </button>
                  )
                })}
             </div>
             <p className="text-[10px] text-slate-500 text-center mt-2">Estos días afectarán la lista interactiva de asistencia diaria.</p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700 bg-surface/50 backdrop-blur-md">
           <button 
             onClick={handleSave}
             disabled={!formData.fullName || !formData.nickname}
             className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-lg shadow-primary/20">
             <Save size={20} />
             Guardar Ficha
           </button>
        </div>

      </div>
    </div>
  );
};
