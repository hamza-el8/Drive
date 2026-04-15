import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Star, Clock, Trash2, Plus } from 'lucide-react';
import { useState } from 'react';
import NewItemModal from './NewItemModal';

const navItems = [
  { path: '/', icon: Home, label: 'Drive' },
  { path: '/favorites', icon: Star, label: 'Favoris' },
  { path: '/recent', icon: Clock, label: 'Récents' },
  { path: '/trash', icon: Trash2, label: 'Corbeille' },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showNewModal, setShowNewModal] = useState(false);

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40 flex items-center justify-around px-2 py-1 safe-bottom">
        {navItems.slice(0, 2).map(item => {
          const active = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                active ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}

        {/* Center + button */}
        <button
          onClick={() => setShowNewModal(true)}
          className="w-12 h-12 -mt-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity"
        >
          <Plus className="w-6 h-6" />
        </button>

        {navItems.slice(2).map(item => {
          const active = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                active ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      {showNewModal && <NewItemModal onClose={() => setShowNewModal(false)} />}
    </>
  );
};

export default BottomNav;
