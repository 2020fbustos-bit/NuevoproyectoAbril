import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, Users, LayoutDashboard, CalendarDays, ClipboardCheck, BarChart2 } from 'lucide-react';

const NavLink = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link to={to} className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${isActive ? 'text-[#EAB308] scale-110' : 'text-slate-400 hover:text-slate-600'}`}>
      <Icon size={24} />
      <span className="text-[10px] uppercase font-bold tracking-wider mt-1">{label}</span>
    </Link>
  );
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-background">
      <main className="flex-1 overflow-y-auto w-full p-4 pb-24 max-w-4xl mx-auto">
        {children}
      </main>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe px-6 py-2 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] rounded-t-3xl">
         <div className="flex justify-between items-center max-w-4xl mx-auto">
           <NavLink to="/" icon={ClipboardCheck} label="Asistencia" />
           <NavLink to="/players" icon={Users} label="Fichas" />
           <NavLink to="/tactics" icon={LayoutDashboard} label="Pizarra" />
           <NavLink to="/matches" icon={CalendarDays} label="Partidos" />
         </div>
      </nav>
    </div>
  );
};

import { PlayersPage } from './pages/PlayersPage';
import { HomePage } from './pages/HomePage';
import { MatchesPage } from './pages/MatchesPage';
import { TacticsPage } from './pages/TacticsPage';
import { LoginPage } from './pages/LoginPage';
import { SetupPage } from './pages/SetupPage';
import { TrainingPage } from './pages/TrainingPage';
import { IndicatorsPage } from './pages/IndicatorsPage';
import { useAppStore } from './store/useAppStore';
import { Settings, LogOut, Swords } from 'lucide-react';

function App() {
  const currentUser = useAppStore(state => state.currentUser);
  const logout = useAppStore(state => state.logout);

  if (!currentUser) {
    return <LoginPage />;
  }

  const isAdmin = currentUser.role === 'admin';

  return (
    <BrowserRouter>
      <div className="flex flex-col h-screen w-full overflow-hidden bg-background relative">
        {/* Top Header Logout */}
        <div className="absolute top-4 right-4 z-50 text-white/50 flex gap-4">
           {isAdmin && <Link to="/setup"><Settings size={20} className="hover:text-primary transition-colors"/></Link>}
           <button onClick={logout}><LogOut size={20} className="hover:text-red-500 transition-colors"/></button>
        </div>

        <main className="flex-1 overflow-y-auto w-full pb-24 max-w-4xl mx-auto">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/players" element={isAdmin ? <PlayersPage /> : <div className="text-center p-20 text-white">Vista restringida solo para perfil personal (En progreso)</div>} />
            <Route path="/tactics" element={<TacticsPage />} />
            <Route path="/matches" element={isAdmin ? <MatchesPage /> : <div className="text-center p-20 text-white">Modo Lectura Activo. Esperando actualizaciones.</div>} />
            <Route path="/training" element={isAdmin ? <TrainingPage /> : <div className="text-center p-20 text-white">Solo Coaches.</div>} />
            <Route path="/indicators" element={isAdmin ? <IndicatorsPage /> : <div className="text-center p-20 text-white">Solo Coaches.</div>} />
            {isAdmin && <Route path="/setup" element={<SetupPage />} />}
          </Routes>
        </main>
        
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe px-2 sm:px-6 py-2 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] rounded-t-3xl">
           <div className="flex justify-between items-center max-w-4xl mx-auto">
             <NavLink to="/" icon={ClipboardCheck} label="Asistencia" />
             {isAdmin && <NavLink to="/indicators" icon={BarChart2} label="Métricas" />}
             {isAdmin && <NavLink to="/players" icon={Users} label="Fichas" />}
             {isAdmin && <NavLink to="/tactics" icon={LayoutDashboard} label="Pizarra" />}
             {isAdmin && <NavLink to="/training" icon={Swords} label="Entrenar" />}
             <NavLink to="/matches" icon={CalendarDays} label="Partidos" />
           </div>
        </nav>
      </div>
    </BrowserRouter>
  )
}

export default App;
