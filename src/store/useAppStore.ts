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
  trainingDays: string[];
  isActive: boolean;
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
        set((state) => ({ players: [...state.players, { ...playerData, id }] }));
        return id;
      },
      updatePlayer: (id, playerData) => set((state) => ({
        players: state.players.map(p => p.id === id ? { ...p, ...playerData } : p)
      })),
      deletePlayer: (id) => set((state) => ({
        players: state.players.filter(p => p.id !== id),
        // Cascading deletes would optionally drop them from users if role: jugadora
        users: state.users.filter(u => u.id !== id)
      })),
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
