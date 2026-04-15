import { ReactNode, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '@/redux/store';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import BottomNav from './BottomNav';

const AppLayout = ({ children }: { children: ReactNode }) => {
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <TopBar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1">
        {/* Sidebar: hidden on mobile, toggleable on desktop */}
        <div className="hidden md:block">
          {sidebarOpen && <Sidebar />}
        </div>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-40" onClick={() => setSidebarOpen(false)}>
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative z-50 animate-fade-in" onClick={e => e.stopPropagation()}>
              <Sidebar />
            </div>
          </div>
        )}

        <main className={`flex-1 ${sidebarOpen ? 'md:ml-56' : 'md:ml-0'} ml-0 p-4 md:p-6 pb-20 md:pb-6 transition-[margin] duration-200`}>
          {children}
        </main>
      </div>

      <BottomNav />
    </div>
  );
};

export default AppLayout;
