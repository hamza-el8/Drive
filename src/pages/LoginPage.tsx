import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '@/redux/authSlice';
import { Cloud, Mail, Lock, Eye, EyeOff, Rocket } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const users = JSON.parse(localStorage.getItem('drive_users') || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);
    if (!user) { setError('Email ou mot de passe incorrect'); return; }
    dispatch(login({ id: user.id, name: user.name, email: user.email, avatar: user.avatar }));
    navigate('/');
  };

  const handleDemo = () => {
    const demoUser = { id: 'demo', name: 'Demo User', email: 'demo@clouddrive.com' };
    dispatch(login(demoUser));
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: '#0f172a' }}>
      {/* Glowing orbs */}
      <div className="absolute w-96 h-96 rounded-full opacity-30 blur-3xl" style={{ background: 'radial-gradient(circle, hsl(33, 100%, 50%) 0%, transparent 70%)', top: '10%', left: '15%' }} />
      <div className="absolute w-80 h-80 rounded-full opacity-20 blur-3xl" style={{ background: 'radial-gradient(circle, hsl(33, 100%, 50%) 0%, transparent 70%)', bottom: '10%', right: '15%' }} />

      <div className="w-full max-w-md p-4 relative z-10 animate-fade-in">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-drive-orange-light flex items-center justify-center mb-4 shadow-lg shadow-primary/30">
              <Cloud className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">Bienvenue</h1>
            <p className="text-white/50 text-sm mt-1">Connectez-vous à CloudDrive</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg p-3">{error}</div>
            )}

            <div>
              <label className="text-sm font-medium text-white/80 mb-1.5 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors"
                  placeholder="votre@email.com" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-white/80 mb-1.5 block">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors"
                  placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-white/20 bg-white/5 text-primary focus:ring-primary/50" />
                <span className="text-xs text-white/50">Se souvenir de moi</span>
              </label>
              <Link to="/forgot-password" className="text-xs text-primary hover:text-primary/80 transition-colors">Mot de passe oublié ?</Link>
            </div>

            <button type="submit"
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-primary to-red-500 text-white font-medium hover:opacity-90 transition-opacity shadow-lg shadow-primary/25">
              Se connecter
            </button>
          </form>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-white/30">ou</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <button onClick={handleDemo}
            className="w-full py-2.5 rounded-lg border border-white/10 bg-white/5 text-white/80 font-medium hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
            <Rocket className="w-4 h-4" /> Essayer avec un compte démo
          </button>

          <p className="text-center text-sm text-white/40 mt-5">
            Pas encore de compte ? <Link to="/register" className="text-primary hover:text-primary/80 font-medium transition-colors">S'inscrire</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
