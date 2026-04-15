import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface SavedAccount {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  lastLogin: string;
  deviceName?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  savedAccounts: SavedAccount[];
}

const savedUser = localStorage.getItem('drive_user');
const savedAccounts = localStorage.getItem('drive_saved_accounts');

const initialState: AuthState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  isAuthenticated: !!savedUser,
  savedAccounts: savedAccounts ? JSON.parse(savedAccounts) : [],
};

const persistSavedAccounts = (accounts: SavedAccount[]) => {
  localStorage.setItem('drive_saved_accounts', JSON.stringify(accounts));
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('drive_user', JSON.stringify(action.payload));
      const existingAccounts = state.savedAccounts;
      const newAccount: SavedAccount = {
        id: action.payload.id,
        name: action.payload.name,
        email: action.payload.email,
        avatar: action.payload.avatar,
        lastLogin: new Date().toISOString(),
      };
      const updatedAccounts = [...existingAccounts, newAccount];
      state.savedAccounts = updatedAccounts;
      persistSavedAccounts(updatedAccounts);
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('drive_user');
    },
    updateProfile(state, action: PayloadAction<Partial<User>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('drive_user', JSON.stringify(state.user));
      }
    },
    saveAccount(state, action: PayloadAction<SavedAccount>) {
      const existingIndex = state.savedAccounts.findIndex(acc => acc.email === action.payload.email);
      if (existingIndex >= 0) {
        state.savedAccounts[existingIndex] = action.payload;
      } else {
        state.savedAccounts.push(action.payload);
      }
      persistSavedAccounts(state.savedAccounts);
    },
    removeAccount(state, action: PayloadAction<string>) {
      state.savedAccounts = state.savedAccounts.filter(acc => acc.email !== action.payload);
      persistSavedAccounts(state.savedAccounts);
    },
    deleteAccount(state) {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('drive_user');
      localStorage.removeItem('drive_files');
    },
  },
});

export const { login, logout, updateProfile, deleteAccount, saveAccount, removeAccount } = authSlice.actions;
export default authSlice.reducer;
