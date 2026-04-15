import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { restoreFromTrash, deleteForever, emptyTrash } from '@/redux/filesSlice';
import { Trash2, RotateCcw, AlertTriangle, FileText, Image, File as FileIcon } from 'lucide-react';

const formatSize = (bytes?: number) => {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
};

const TrashPage = () => {
  const dispatch = useDispatch();
  const items = useSelector((s: RootState) => s.files.items.filter(i => i.isTrashed));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Corbeille</h2>
        </div>
        {items.length > 0 && (
          <button onClick={() => dispatch(emptyTrash())}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-destructive text-destructive hover:bg-destructive/10 text-sm font-medium transition-colors">
            <Trash2 className="w-4 h-4" /> Vider la corbeille
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-warning-bg text-warning-text text-sm">
        <AlertTriangle className="w-4 h-4 shrink-0" />
        Les éléments de la corbeille seront supprimés définitivement après 30 jours
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Trash2 className="w-16 h-16 mb-3 opacity-30" />
          <p>La corbeille est vide</p>
        </div>
      ) : (
        <div className="space-y-1">
          {items.map(item => (
            <div key={item.id} className="flex items-center gap-3 bg-card border border-border rounded-lg px-4 py-3 animate-fade-in hover:bg-surface-hover transition-colors">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                {item.mimeType?.startsWith('image/') ? <Image className="w-5 h-5 text-primary" /> :
                 item.mimeType?.includes('pdf') ? <FileText className="w-5 h-5 text-primary" /> :
                 <FileIcon className="w-5 h-5 text-primary" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                <p className="text-xs text-muted-foreground">Supprimé le {new Date(item.updatedAt).toLocaleDateString('fr-FR')} • {formatSize(item.size)}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => dispatch(restoreFromTrash(item.id))} className="p-2 rounded-lg hover:bg-surface-hover text-muted-foreground hover:text-foreground transition-colors" title="Restaurer">
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button onClick={() => dispatch(deleteForever(item.id))} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors" title="Supprimer définitivement">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrashPage;
