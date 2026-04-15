import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Plus, Home, Star, Clock, Trash2, Cloud } from 'lucide-react';
import { useState } from 'react';
import NewItemModal from './NewItemModal';

const navItems = [
  { path: '/', icon: Home, label: 'Mon Drive' },
  { path: '/favorites', icon: Star, label: 'Favoris' },
  { path: '/recent', icon: Clock, label: 'Récents' },
  { path: '/trash', icon: Trash2, label: 'Corbeille' },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const files = useSelector((s: RootState) => s.files.items);
  const [showNewModal, setShowNewModal] = useState(false);

  const totalSize = files.reduce((acc, f) => acc + (f.size || 0), 0);
  const usedGB = (totalSize / (1024 * 1024 * 1024)).toFixed(2);

  return (
    <>
      <aside className="w-64 md:w-56 h-screen bg-card md:bg-sidebar-bg border-r border-border flex flex-col fixed left-0 top-0 md:top-16 z-50 md:z-20 shadow-xl md:shadow-none">
        <div className="px-3 pt-16 md:pt-4 mb-2">
          <button
            onClick={() => setShowNewModal(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-drive-orange-light text-primary-foreground font-medium shadow-md hover:opacity-90 transition-opacity"
          >
            <Plus className="w-5 h-5" />
            Nouveau
          </button>
        </div>

        <nav className="flex-1 px-2 py-1 space-y-0.5">
          {navItems.map(item => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-sidebar-active text-sidebar-active-text'
                    : 'text-sidebar-foreground hover:bg-sidebar-hover'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border">
          <div className="px-1">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Stockage</span>
              <span>{usedGB} Go / 15 Go</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-drive-orange-light rounded-full transition-all" style={{ width: `${Math.min((totalSize / (15 * 1024 * 1024 * 1024)) * 100, 100)}%`, minWidth: totalSize > 0 ? '4px' : '0' }} />
            </div>
          </div>
        </div>
      </aside>
      {showNewModal && <NewItemModal onClose={() => setShowNewModal(false)} />}
    </>
  );
};

export default Sidebar;
