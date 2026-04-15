import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addFile, addFolder } from '@/redux/filesSlice';
import { RootState } from '@/redux/store';
import { FolderPlus, Upload, X } from 'lucide-react';

interface Props {
  onClose: () => void;
}

const NewItemModal = ({ onClose }: Props) => {
  const [mode, setMode] = useState<'menu' | 'folder'>('menu');
  const [folderName, setFolderName] = useState('');
  const dispatch = useDispatch();
  const currentFolder = useSelector((s: RootState) => s.files.currentFolder);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreateFolder = () => {
    if (!folderName.trim()) return;
    dispatch(addFolder({
      id: crypto.randomUUID(),
      name: folderName.trim(),
      type: 'folder',
      parentId: currentFolder,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isFavorite: false,
      isTrashed: false,
    }));
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        dispatch(addFile({
          id: crypto.randomUUID(),
          name: file.name,
          type: 'file',
          mimeType: file.type,
          size: file.size,
          parentId: currentFolder,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isFavorite: false,
          isTrashed: false,
          dataUrl: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm flex items-end md:items-center justify-center z-50" onClick={onClose}>
      <div className="bg-card border border-border rounded-t-2xl md:rounded-xl shadow-lg w-full md:w-80 animate-fade-in" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h3 className="font-medium text-foreground">{mode === 'folder' ? 'Nouveau dossier' : 'Nouveau'}</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
        </div>

        {mode === 'menu' ? (
          <div className="p-3">
            <button onClick={() => setMode('folder')} className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm text-foreground hover:bg-surface-hover transition-colors">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-drive-orange-light flex items-center justify-center">
                <FolderPlus className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="text-left">
                <p className="font-medium">Nouveau dossier</p>
                <p className="text-xs text-muted-foreground">Créer un nouveau dossier</p>
              </div>
            </button>
            <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm text-foreground hover:bg-surface-hover transition-colors">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <Upload className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-medium">Importer des fichiers</p>
                <p className="text-xs text-muted-foreground">PDF, images, documents...</p>
              </div>
            </button>
            <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileUpload} accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip" />
          </div>
        ) : (
          <div className="p-4 space-y-3">
            <input
              type="text"
              value={folderName}
              onChange={e => setFolderName(e.target.value)}
              placeholder="Nom du dossier"
              autoFocus
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              onKeyDown={e => e.key === 'Enter' && handleCreateFolder()}
            />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setMode('menu')} className="px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:bg-surface-hover">Annuler</button>
              <button onClick={handleCreateFolder} className="px-3 py-1.5 rounded-lg text-sm bg-primary text-primary-foreground hover:opacity-90">Créer</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewItemModal;
