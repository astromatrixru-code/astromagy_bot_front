import { create } from 'zustand';
import { deleteCookie } from 'cookies-next';

export interface User {
  telegramId: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  gender?: "MALE" | "FEMALE";
  birthDate?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
}

interface UserState {
  user: User | null;
  isUnauthorized: boolean;
  isLoading: boolean;

  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  setUnauthorized: (status: boolean) => void;
  setLoading: (status: boolean) => void;
  logout: () => void;

  isProfileComplete: () => boolean;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  isUnauthorized: false,
  isLoading: true,

  setUser: (user) => set({
    user,
    isUnauthorized: false,
    isLoading: false
  }),

  updateUser: (updates) => set((state) => ({
    user: state.user ? { ...state.user, ...updates } : null,
    isLoading: false
  })),

  setUnauthorized: (status) => set({ isUnauthorized: status }),

  setLoading: (status) => set({ isLoading: status }),

  logout: () => {
    deleteCookie('userAuth');
    set({ user: null, isUnauthorized: false });
  },

  isProfileComplete: () => {
    const u = get().user;
    return !!(u?.birthDate && u?.latitude && u?.longitude);
  }
}));