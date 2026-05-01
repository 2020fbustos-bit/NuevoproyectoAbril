import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ------------------------------
// TYPES
// ------------------------------
export type Role = 'admin' | 'jugadora';

export type UserAuth = {
  id: string; // Links to Player.id if role === 'jugadora'
  role: Role;
  email: string;
  pass: string; // Plaintext for demo simulator purposes
};

export type Player = {
  id: string;
  fullName: string;
  nickname: string;
  jerseyNumber: string;
  phone: string;
  email: string;
  rut: string;
  position: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  allergies: string;
  preferredClinic: string;
  trainingDays: string[];
  isActive: boolean;
  activationDate?: string;
  deactivationDate?: string;
};

// Match module
export type MatchEvent = {
  type: 'goal_us' | 'goal_them' | 'save';
  playerNickname?: string; // Links to Player.nickname
  rivalJerseyNumber?: string; 
  timestamp: number;
};
export type Match = {
  id: string;
  rivalName: string;
  date: number;
  ourScore: number;
  theirScore: number;
  saves: number;
  events: MatchEvent[];
};

// Training module
export type TrainingMatch = {
  id: string;
  date: number;
  teamAScore: number;
  teamBScore: number;
  teamA_PlayerIds: string[];
  teamB_PlayerIds: string[];
};

// Attendance module (Relational Table connecting Dates -> Players)
export type AttendanceLog = {
  id: string;
  dateStr: string; // YYYY-MM-DD
  presentPlayerIds: string[];
};

// ------------------------------
// STATE INTERFACE
// ------------------------------
interface AppState {
  teamName: string;
  setTeamName: (name: string) => void;

  // Autenticación (Simulador JWT Backend)
  users: UserAuth[];
  currentUser: UserAuth | null;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  registerUser: (auth: UserAuth) => void;
  
  // Tablas
  players: Player[];
  matches: Match[];
  trainings: TrainingMatch[];
  attendances: AttendanceLog[];

  // Acciones Crud
  addPlayer: (player: Omit<Player, 'id'>) => string;
  updatePlayer: (id: string, player: Partial<Player>) => void;
  deletePlayer: (id: string) => void;
  updateUserAuth: (playerId: string, role: Role, pass: string, email?: string) => void;
  saveMatch: (match: Omit<Match, 'id'>) => void;
  saveTraining: (t: Omit<TrainingMatch, 'id'>) => void;
  logAttendance: (dateStr: string, playerIds: string[]) => void;
}

// ------------------------------
// STORE IMPLEMENTATION
// ------------------------------
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      teamName: 'Valkyrie Team HC',
      setTeamName: (name) => set({ teamName: name }),

      users: [{ id: 'admin1', role: 'admin', email: 'admin', pass: 'admin123' }],
      currentUser: null,
      
      login: (email, pass) => {
        const u = get().users.find(u => u.email === email && u.pass === pass);
        if (u) {
          set({ currentUser: u });
          return true;
        }
        return false;
      },
      logout: () => set({ currentUser: null }),
      registerUser: (auth) => set((s) => ({ users: [...s.users, auth] })),

      players: [],
      matches: [],
      trainings: [],
      attendances: [],

      addPlayer: (playerData) => {
        const id = crypto.randomUUID();
        const rutSanitized = playerData.rut.replace(/[\.\-]/g, '');
        const defaultPass = rutSanitized.slice(-4) || '1234'; // last 4 digits of RUT
        
        set((state) => ({ 
           players: [...state.players, { ...playerData, id }],
           users: [...state.users, { id, role: 'jugadora', email: rutSanitized, pass: defaultPass }]
        }));
        return id;
      },
      updatePlayer: (id, playerData) => set((state) => ({
        players: state.players.map(p => p.id === id ? { ...p, ...playerData } : p)
      })),
      deletePlayer: (id) => set((state) => ({
        players: state.players.filter(p => p.id !== id),
        users: state.users.filter(u => u.id !== id)
      })),
      updateUserAuth: (playerId, role, pass, email) => set((state) => {
         const existingUser = state.users.find(u => u.id === playerId);
         const player = state.players.find(p => p.id === playerId);
         if (existingUser) {
            return { users: state.users.map(u => u.id === playerId ? { ...u, role, pass, email: email || u.email } : u) };
         } else if (player) {
            const rutSanitized = email || player.rut.replace(/[\.\-]/g, '');
            return { users: [...state.users, { id: playerId, role, email: rutSanitized, pass }] };
         }
         return state;
      }),
      saveMatch: (matchData) => set((state) => ({
        matches: [{ ...matchData, id: crypto.randomUUID() }, ...state.matches]
      })),
      saveTraining: (tData) => set((state) => ({
        trainings: [{ ...tData, id: crypto.randomUUID() }, ...state.trainings]
      })),
      logAttendance: (dateStr, playerIds) => set((state) => {
        const others = state.attendances.filter(a => a.dateStr !== dateStr);
        return {
          attendances: [...others, { id: crypto.randomUUID(), dateStr, presentPlayerIds: playerIds }]
        };
      })
    }),
    {
      name: 'valkyrie-v2-relational-db', 
      // Renamed key to force fresh start due to schema change
    }
  )
);
