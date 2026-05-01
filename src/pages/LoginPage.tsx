import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Shield, Lock, Mail, AlertTriangle, Eye, EyeOff } from 'lucide-react';

export const LoginPage = () => {
  const login = useAppStore(state => state.login);
  const teamName = useAppStore(state => state.teamName);

  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(email, pass);
    if (!success) {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center font-sans px-6 relative overflow-hidden">
       {/* Background decorative elements */}
       <div className="absolute top-0 w-full h-full pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-surface via-background to-background" />
       
       <div className="z-10 w-full max-w-sm flex flex-col items-center">
         <div className="w-24 h-24 bg-surface rounded-3xl border border-white/10 shadow-2xl flex items-center justify-center mb-6 rotate-3">
           <Shield className="text-primary w-14 h-14 -rotate-3" />
         </div>
         
         <h1 className="text-3xl font-black text-primary uppercase text-center tracking-tighter leading-tight mb-1">
           {teamName}
         </h1>
         <p className="text-white/60 text-sm font-bold tracking-widest uppercase mb-10">Command Suite</p>

         <form onSubmit={handleLogin} className="w-full space-y-4">
           {error && (
             <div className="bg-red-500/20 text-red-400 p-3 rounded-xl flex items-center gap-2 text-sm font-bold border border-red-500/30 animate-in shake">
               <AlertTriangle size={18} /> Credenciales incorrectas
             </div>
           )}

           <div className="relative">
             <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
             <input 
               type="text" 
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               placeholder="Correo o ID de usuario"
               className="w-full bg-surface border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white font-medium focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-white/30"
             />
           </div>

           <div className="relative">
             <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
             <input 
               type={showPass ? "text" : "password"}
               value={pass}
               onChange={(e) => setPass(e.target.value)}
               placeholder="Contraseña"
               className="w-full bg-surface border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white font-medium focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-white/30"
             />
             <button
               type="button"
               onClick={() => setShowPass(!showPass)}
               className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
             >
               {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
             </button>
           </div>

           <button 
             type="submit"
             disabled={!email || !pass}
             className="w-full bg-primary text-background font-black uppercase text-lg tracking-widest py-4 rounded-2xl mt-4 shadow-[0_0_20px_rgba(253,224,71,0.2)] hover:shadow-[0_0_30px_rgba(253,224,71,0.4)] disabled:opacity-50 disabled:shadow-none transition-all active:scale-[0.98]"
           >
             Ingresar
           </button>
         </form>
       </div>
    </div>
  );
};
