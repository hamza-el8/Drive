import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { FileItem, toggleFavorite, moveToTrash, setCurrentFolder, renameFile } from '@/redux/filesSlice';
import { Folder, FileText, Image, File, Star, Trash2, Eye, Download, Pencil, MoreVertical, Grid, List, ArrowUpDown, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import FilePreviewModal from './FilePreviewModal';

const getFileIcon = (item: FileItem) => {
  if (item.type === 'folder') return <Folder className="w-12 h-12 text-primary-foreground/80" />;
  if (item.mimeType?.startsWith('image/')) return <Image className="w-10 h-10 text-drive-green" />;
  if (item.mimeType?.includes('pdf')) return <FileText className="w-10 h-10 text-drive-red" />;
  return <File className="w-10 h-10 text-muted-foreground" />;
};

const formatSize = (bytes?: number) => {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
};

interface Props {
  items: FileItem[];
  title: string;
  emptyMessage?: string;
  showActions?: boolean;
}

interface ContextMenu {
  itemId: string;
  x: number;
  y: number;
}

type SortBy = 'name' | 'date' | 'size';
const sortLabels: Record<SortBy, string> = { name: 'Nom', date: 'Date', size: 'Taille' };

const FileGrid = ({ items, title, emptyMessage = 'Aucun fichier', showActions = true }: Props) => {
  const dispatch = useDispatch();
  const [contextMenu, setContextMenu] = useState<ContextMenu | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [renaming, setRenaming] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('name');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [sortAsc, setSortAsc] = useState(true);
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  // Close menus on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setContextMenu(null);
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setShowSortMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Sort items
  const sortedItems = [...items].sort((a, b) => {
    let cmp = 0;
    if (sortBy === 'name') cmp = a.name.localeCompare(b.name);
    else if (sortBy === 'date') cmp = new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    else if (sortBy === 'size') cmp = (a.size || 0) - (b.size || 0);
    return sortAsc ? cmp : -cmp;
  });

  const handleOpen = (item: FileItem) => {
    if (item.type === 'folder') {
      dispatch(setCurrentFolder(item.id));
    } else if (item.dataUrl) {
      setPreviewFile(item);
    }
  };

  const openContextMenu = (e: React.MouseEvent, itemId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ itemId, x: e.clientX, y: e.clientY });
  };

  const openDotMenu = (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setContextMenu({ itemId, x: rect.right + 4, y: rect.top });
  };

  const handleRename = (id: string) => {
    if (newName.trim()) dispatch(renameFile({ id, name: newName.trim() }));
    setRenaming(null);
    setNewName('');
  };

  const handleDownload = (item: FileItem) => {
    if (item.dataUrl) {
      const link = document.createElement('a');
      link.href = item.dataUrl;
      link.download = item.name;
      link.click();
    }
    setContextMenu(null);
  };

  const contextItem = contextMenu ? items.find(i => i.id === contextMenu.itemId) : null;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <div className="flex items-center gap-2">
          {/* Sort dropdown */}
          <div className="relative" ref={sortRef}>
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="flex items-center gap-1 border border-border rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>{sortLabels[sortBy]}</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            {showSortMenu && (
              <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-lg py-1 w-28 z-50 animate-fade-in">
                {(['name', 'date', 'size'] as SortBy[]).map(s => (
                  <button
                    key={s}
                    onClick={() => { if (sortBy === s) setSortAsc(!sortAsc); else { setSortBy(s); setSortAsc(true); } setShowSortMenu(false); }}
                    className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                      sortBy === s ? 'bg-primary text-primary-foreground font-medium' : 'text-foreground hover:bg-surface-hover'
                    }`}
                  >
                    {sortLabels[s]}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button onClick={() => { setSortAsc(!sortAsc); }}
            className="p-1.5 rounded text-muted-foreground hover:text-foreground">
            <ArrowUpDown className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {sortedItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <File className="w-16 h-16 mb-3 opacity-30" />
          <p>{emptyMessage}</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
          {sortedItems.map(item => (
            <div
              key={item.id}
              className="group relative rounded-xl overflow-hidden border border-border hover:shadow-md transition-all cursor-pointer animate-fade-in"
              onDoubleClick={() => handleOpen(item)}
              onContextMenu={(e) => showActions && openContextMenu(e, item.id)}
            >
              {/* Thumbnail */}
              <div className={`relative h-40 flex items-center justify-center ${
                item.type === 'folder'
                  ? 'bg-gradient-to-br from-primary to-drive-orange-light'
                  : item.mimeType?.startsWith('image/') && item.dataUrl ? '' : 'bg-secondary'
              }`}>
                {item.type === 'file' && item.mimeType?.startsWith('image/') && item.dataUrl ? (
                  <img src={item.dataUrl} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  getFileIcon(item)
                )}

                {/* 3-dot button */}
                {showActions && (
                  <button
                    onClick={(e) => openDotMenu(e, item.id)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1.5 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card transition-all"
                  >
                    <MoreVertical className="w-4 h-4 text-foreground" />
                  </button>
                )}
              </div>

              {/* File info */}
              <div className="p-3 bg-card">
                {renaming === item.id ? (
                  <input
                    type="text" value={newName} onChange={e => setNewName(e.target.value)}
                    onBlur={() => handleRename(item.id)}
                    onKeyDown={e => e.key === 'Enter' && handleRename(item.id)}
                    autoFocus
                    className="w-full px-2 py-1 text-sm rounded border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                ) : (
                  <>
                    <p className="text-sm font-medium text-foreground truncate text-center">{item.name}</p>
                    {item.type === 'file' && (
                      <p className="text-xs text-muted-foreground mt-0.5 text-center">{formatSize(item.size)}</p>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-1">
          {sortedItems.map(item => (
            <div key={item.id}
              className="group flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-surface-hover transition-colors cursor-pointer animate-fade-in"
              onDoubleClick={() => handleOpen(item)}
              onContextMenu={(e) => showActions && openContextMenu(e, item.id)}
            >
              <div className="w-8 h-8 flex items-center justify-center">
                {item.type === 'folder' ? <Folder className="w-6 h-6 text-primary" /> :
                 item.mimeType?.startsWith('image/') ? <Image className="w-6 h-6 text-drive-green" /> :
                 item.mimeType?.includes('pdf') ? <FileText className="w-6 h-6 text-drive-red" /> :
                 <File className="w-6 h-6 text-muted-foreground" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground truncate">{item.name}</p>
              </div>
              <p className="text-xs text-muted-foreground">{formatSize(item.size)}</p>
              <p className="text-xs text-muted-foreground">{new Date(item.updatedAt).toLocaleDateString('fr-FR')}</p>
              {showActions && (
                <button onClick={(e) => openDotMenu(e, item.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-muted transition-all">
                  <MoreVertical className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Floating context menu */}
      {contextMenu && contextItem && (
        <div ref={menuRef}
          className="fixed bg-card border border-border rounded-xl shadow-xl py-1.5 w-48 z-50 animate-fade-in"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button onClick={() => { handleOpen(contextItem); setContextMenu(null); }}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-surface-hover transition-colors">
            <Eye className="w-4 h-4 text-muted-foreground" /> Aperçu
          </button>
          <button onClick={() => { dispatch(toggleFavorite(contextItem.id)); setContextMenu(null); }}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-surface-hover transition-colors">
            <Star className={`w-4 h-4 ${contextItem.isFavorite ? 'fill-drive-yellow text-drive-yellow' : 'text-muted-foreground'}`} />
            {contextItem.isFavorite ? 'Retirer favoris' : 'Ajouter favoris'}
          </button>
          <button onClick={() => { setRenaming(contextItem.id); setNewName(contextItem.name); setContextMenu(null); }}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-surface-hover transition-colors">
            <Pencil className="w-4 h-4 text-muted-foreground" /> Renommer
          </button>
          {contextItem.type === 'file' && (
            <button onClick={() => handleDownload(contextItem)}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-surface-hover transition-colors">
              <Download className="w-4 h-4 text-muted-foreground" /> Télécharger
            </button>
          )}
          <button onClick={() => { dispatch(moveToTrash(contextItem.id)); setContextMenu(null); }}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-destructive hover:bg-surface-hover transition-colors">
            <Trash2 className="w-4 h-4" /> Supprimer
          </button>
        </div>
      )}

      {/* File preview modal */}
      {previewFile && (
        <FilePreviewModal file={previewFile} onClose={() => setPreviewFile(null)} />
      )}
    </div>
  );
};

export default FileGrid;
