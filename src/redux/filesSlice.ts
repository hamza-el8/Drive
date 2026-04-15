import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  mimeType?: string;
  size?: number;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
  isFavorite: boolean;
  isTrashed: boolean;
  dataUrl?: string; // base64 for preview
}

interface FilesState {
  items: FileItem[];
  currentFolder: string | null;
}

const savedFiles = localStorage.getItem('drive_files');

const initialState: FilesState = {
  items: savedFiles ? JSON.parse(savedFiles) : [],
  currentFolder: null,
};

const persist = (items: FileItem[]) => {
  localStorage.setItem('drive_files', JSON.stringify(items));
};

const filesSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    addFile(state, action: PayloadAction<FileItem>) {
      state.items.push(action.payload);
      persist(state.items);
    },
    addFolder(state, action: PayloadAction<FileItem>) {
      state.items.push(action.payload);
      persist(state.items);
    },
    setCurrentFolder(state, action: PayloadAction<string | null>) {
      state.currentFolder = action.payload;
    },
    toggleFavorite(state, action: PayloadAction<string>) {
      const item = state.items.find(i => i.id === action.payload);
      if (item) {
        item.isFavorite = !item.isFavorite;
        item.updatedAt = new Date().toISOString();
        persist(state.items);
      }
    },
    moveToTrash(state, action: PayloadAction<string>) {
      const item = state.items.find(i => i.id === action.payload);
      if (item) {
        item.isTrashed = true;
        item.updatedAt = new Date().toISOString();
        persist(state.items);
      }
    },
    restoreFromTrash(state, action: PayloadAction<string>) {
      const item = state.items.find(i => i.id === action.payload);
      if (item) {
        item.isTrashed = false;
        item.updatedAt = new Date().toISOString();
        persist(state.items);
      }
    },
    deleteForever(state, action: PayloadAction<string>) {
      state.items = state.items.filter(i => i.id !== action.payload);
      persist(state.items);
    },
    emptyTrash(state) {
      state.items = state.items.filter(i => !i.isTrashed);
      persist(state.items);
    },
    renameFile(state, action: PayloadAction<{ id: string; name: string }>) {
      const item = state.items.find(i => i.id === action.payload.id);
      if (item) {
        item.name = action.payload.name;
        item.updatedAt = new Date().toISOString();
        persist(state.items);
      }
    },
    clearAllFiles(state) {
      state.items = [];
      state.currentFolder = null;
      localStorage.removeItem('drive_files');
    },
  },
});

export const {
  addFile, addFolder, setCurrentFolder, toggleFavorite,
  moveToTrash, restoreFromTrash, deleteForever, emptyTrash, renameFile, clearAllFiles,
} = filesSlice.actions;
export default filesSlice.reducer;
