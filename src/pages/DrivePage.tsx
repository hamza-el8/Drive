import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { setCurrentFolder } from '@/redux/filesSlice';
import FileGrid from '@/components/FileGrid';
import { ChevronRight, Home } from 'lucide-react';

const DrivePage = () => {
  const dispatch = useDispatch();
  const { items, currentFolder } = useSelector((s: RootState) => s.files);

  const visibleItems = items.filter(i => !i.isTrashed && i.parentId === currentFolder);
  const folders = visibleItems.filter(i => i.type === 'folder');
  const files = visibleItems.filter(i => i.type === 'file');
  const allItems = [...folders, ...files];

  // Build breadcrumb
  const breadcrumb: { id: string | null; name: string }[] = [{ id: null, name: 'Mon Drive' }];
  let folderId = currentFolder;
  while (folderId) {
    const folder = items.find(i => i.id === folderId);
    if (folder) {
      breadcrumb.splice(1, 0, { id: folder.id, name: folder.name });
      folderId = folder.parentId;
    } else break;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-1 text-sm">
        {breadcrumb.map((b, i) => (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
            <button
              onClick={() => dispatch(setCurrentFolder(b.id))}
              className={`px-1.5 py-0.5 rounded hover:bg-surface-hover transition-colors ${
                i === breadcrumb.length - 1 ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {i === 0 && <Home className="w-4 h-4 inline mr-1" />}
              {b.name}
            </button>
          </span>
        ))}
      </div>

      <FileGrid
        items={allItems}
        title="Mon Drive"
        emptyMessage="Aucun fichier. Cliquez sur « + Nouveau » pour commencer."
      />
    </div>
  );
};

export default DrivePage;
