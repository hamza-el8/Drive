import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

const savedUser = localStorage.getItem('drive_user');

const initialState: AuthState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  isAuthenticated: !!savedUser,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('drive_user', JSON.stringify(action.payload));
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
    deleteAccount(state) {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('drive_user');
      localStorage.removeItem('drive_files');
    },
  },
});

export const { login, logout, updateProfile, deleteAccount } = authSlice.actions;
export default authSlice.reducer;
