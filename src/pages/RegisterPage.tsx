import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '@/redux/authSlice';
import { Cloud, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError('Le mot de passe doit contenir au moins 6 caractères'); return; }
    if (password !== confirmPassword) { setError('Les mots de passe ne correspondent pas'); return; }
    const users = JSON.parse(localStorage.getItem('drive_users') || '[]');
    if (users.find((u: any) => u.email === email)) { setError('Cet email est déjà utilisé'); return; }
    const newUser = { id: crypto.randomUUID(), name, email, password, avatar: '' };
    users.push(newUser);
    localStorage.setItem('drive_users', JSON.stringify(users));
    dispatch(login({ id: newUser.id, name: newUser.name, email: newUser.email }));
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
            <h1 className="text-xl font-bold text-white">Créer un compte</h1>
            <p className="text-white/50 text-sm mt-1">Rejoignez CloudDrive gratuitement</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg p-3">{error}</div>
            )}

            <div>
              <label className="text-sm font-medium text-white/80 mb-1.5 block">Nom complet</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input type="text" value={name} onChange={e => setName(e.target.value)} required
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors"
                  placeholder="Votre nom" />
              </div>
            </div>

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

            <div>
              <label className="text-sm font-medium text-white/80 mb-1.5 block">Confirmer le mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors"
                  placeholder="••••••••" />
              </div>
            </div>

            <button type="submit"
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-primary to-red-500 text-white font-medium hover:opacity-90 transition-opacity shadow-lg shadow-primary/25">
              Créer mon compte
            </button>
          </form>

          <p className="text-center text-sm text-white/40 mt-5">
            Déjà un compte ? <Link to="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
