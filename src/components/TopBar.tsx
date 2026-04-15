import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { toggleTheme } from '@/redux/themeSlice';
import { logout } from '@/redux/authSlice';
import { Search, Menu, Moon, Sun, Cloud, User, Settings, LogOut, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  onToggleSidebar?: () => void;
}

const TopBar = ({ onToggleSidebar }: Props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((s: RootState) => s.auth.user);
  const isDark = useSelector((s: RootState) => s.theme.isDark);
  const [search, setSearch] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setShowMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Mobile search mode
  if (mobileSearch) {
    return (
      <header className="h-14 bg-card border-b border-border flex items-center px-3 gap-3 sticky top-0 z-30 md:hidden">
        <button onClick={() => setMobileSearch(false)} className="text-muted-foreground hover:text-foreground">
          <X className="w-5 h-5" />
        </button>
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher..."
            autoFocus
            className="w-full pl-10 pr-4 py-2 rounded-full bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
          />
        </div>
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-semibold">
          {user?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
      </header>
    );
  }

  return (
    <header className="h-14 md:h-16 bg-card border-b border-border flex items-center px-3 md:px-4 gap-3 md:gap-4 sticky top-0 z-30">
      <button onClick={onToggleSidebar} className="text-muted-foreground hover:text-foreground">
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-2">
        <Cloud className="w-6 h-6 md:w-7 md:h-7 text-primary" />
        <span className="text-base md:text-lg font-semibold text-primary">CloudDrive</span>
      </div>

      {/* Desktop search */}
      <div className="hidden md:block flex-1 max-w-2xl mx-auto relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher dans Drive"
          className="w-full pl-10 pr-4 py-2 rounded-full bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
        />
      </div>

      <div className="flex-1 md:hidden" />

      <div className="flex items-center gap-1 md:gap-2">
        {/* Mobile search icon */}
        <button onClick={() => setMobileSearch(true)} className="md:hidden p-2 rounded-full hover:bg-surface-hover text-muted-foreground">
          <Search className="w-5 h-5" />
        </button>

        <button onClick={() => dispatch(toggleTheme())} className="p-2 rounded-full hover:bg-surface-hover text-muted-foreground hover:text-foreground transition-colors">
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-semibold overflow-hidden border-2 border-primary/30"
          >
            {user?.avatar ? (
              <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              user?.name?.charAt(0).toUpperCase() || 'U'
            )}
          </button>

          {showMenu && (
            <div className="absolute right-0 top-12 bg-card border border-border rounded-xl shadow-lg w-56 py-2 z-50 animate-fade-in">
              <div className="px-4 py-2 border-b border-border">
                <p className="font-medium text-foreground text-sm">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <button onClick={() => { navigate('/profile'); setShowMenu(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-surface-hover transition-colors">
                <User className="w-4 h-4 text-muted-foreground" /> Mon profil
              </button>
              <button onClick={() => { navigate('/profile'); setShowMenu(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-surface-hover transition-colors">
                <Settings className="w-4 h-4 text-muted-foreground" /> Paramètres
              </button>
              <button onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-primary hover:bg-surface-hover transition-colors">
                <LogOut className="w-4 h-4" /> Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
