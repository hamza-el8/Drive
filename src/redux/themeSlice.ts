import { createSlice } from '@reduxjs/toolkit';

interface ThemeState {
  isDark: boolean;
}

const saved = localStorage.getItem('drive_theme');

const initialState: ThemeState = {
  isDark: saved === 'dark',
};

if (saved === 'dark') {
  document.documentElement.classList.add('dark');
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme(state) {
      state.isDark = !state.isDark;
      localStorage.setItem('drive_theme', state.isDark ? 'dark' : 'light');
      if (state.isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
