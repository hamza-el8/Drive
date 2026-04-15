import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { updateProfile, logout, deleteAccount } from '@/redux/authSlice';
import { clearAllFiles } from '@/redux/filesSlice';
import { toggleTheme } from '@/redux/themeSlice';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { User, Mail, Moon, Sun, LogOut, Trash2, Camera, Calendar, Save, Share2, Globe, Lock, Users, MessageCircle, Heart, Eye, Edit3, Check, X } from 'lucide-react';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((s: RootState) => s.auth.user);
  const isDark = useSelector((s: RootState) => s.theme.isDark);
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [status, setStatus] = useState(user?.status || 'Disponible');
  const [privacy, setPrivacy] = useState(user?.privacy || 'public');
  const [saved, setSaved] = useState(false);
  const [editingBio, setEditingBio] = useState(false);
  const [editingStatus, setEditingStatus] = useState(false);

  const handleSave = () => {
    dispatch(updateProfile({ name, bio, status, privacy }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleShareProfile = () => {
    const profileUrl = `${window.location.origin}/profile/${user?.id}`;
    navigator.clipboard.writeText(profileUrl);
    alert('Lien du profil copié dans le presse-papiers!');
  };

  const handlePrivacyChange = (newPrivacy: string) => {
    setPrivacy(newPrivacy);
    dispatch(updateProfile({ privacy: newPrivacy }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => dispatch(updateProfile({ avatar: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleDelete = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
      dispatch(clearAllFiles());
      dispatch(deleteAccount());
      navigate('/login');
    }
  };

  const memberSince = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="max-w-lg mx-auto space-y-6 animate-fade-in">
      <h2 className="text-xl font-semibold text-foreground">Mon profil</h2>

      <div className="bg-card border border-border rounded-xl p-6 space-y-5">
        {/* Avatar */}
        <div className="flex items-start gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xl font-semibold overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                user?.name?.charAt(0).toUpperCase()
              )}
            </div>
            <label className="absolute bottom-0 right-0 w-6 h-6 bg-primary border-2 border-card rounded-full flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
              <Camera className="w-3 h-3 text-primary-foreground" />
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </label>
            <div className="absolute bottom-0 left-0 w-4 h-4 bg-green-500 border-2 border-card rounded-full"></div>
          </div>
          <div className="flex-1">
            <p className="font-medium text-foreground text-lg">{user?.name}</p>
            <p className="text-sm text-primary">{user?.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-muted-foreground">{status}</span>
            </div>
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="flex items-center gap-1.5 text-sm font-medium text-primary mb-1.5">
            <User className="w-4 h-4" /> Nom complet
          </label>
          <input type="text" value={name} onChange={e => setName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>

        {/* Status */}
        <div>
          <label className="flex items-center gap-1.5 text-sm font-medium text-primary mb-1.5">
            <MessageCircle className="w-4 h-4" /> Statut
          </label>
          {editingStatus ? (
            <div className="flex gap-2">
              <input type="text" value={status} onChange={e => setStatus(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <button onClick={() => { setEditingStatus(false); dispatch(updateProfile({ status })); }}
                className="p-2.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
                <Check className="w-4 h-4" />
              </button>
              <button onClick={() => setEditingStatus(false)}
                className="p-2.5 rounded-lg bg-muted text-muted-foreground hover:bg-surface-hover transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between px-4 py-2.5 rounded-lg border border-input bg-background">
              <span className="text-foreground">{status}</span>
              <button onClick={() => setEditingStatus(true)}
                className="text-muted-foreground hover:text-foreground transition-colors">
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Bio */}
        <div>
          <label className="flex items-center gap-1.5 text-sm font-medium text-primary mb-1.5">
            <Users className="w-4 h-4" /> Bio
          </label>
          {editingBio ? (
            <div className="space-y-2">
              <textarea value={bio} onChange={e => setBio(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                rows={3} placeholder="Parlez un peu de vous..." />
              <div className="flex gap-2">
                <button onClick={() => { setEditingBio(false); dispatch(updateProfile({ bio })); }}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
                  <Check className="w-4 h-4 inline mr-1" /> Sauvegarder
                </button>
                <button onClick={() => setEditingBio(false)}
                  className="px-4 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-surface-hover transition-colors">
                  Annuler
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-start justify-between px-4 py-2.5 rounded-lg border border-input bg-background min-h-[80px]">
              <span className="text-foreground">{bio || 'Ajoutez une bio...'}</span>
              <button onClick={() => setEditingBio(true)}
                className="text-muted-foreground hover:text-foreground transition-colors ml-2">
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="flex items-center gap-1.5 text-sm font-medium text-primary mb-1.5">
            <Mail className="w-4 h-4" /> Email
          </label>
          <input type="email" value={user?.email || ''} disabled
            className="w-full px-4 py-2.5 rounded-lg border border-input bg-muted text-muted-foreground cursor-not-allowed" />
        </div>

        {/* Member since */}
        <div>
          <label className="flex items-center gap-1.5 text-sm font-medium text-primary mb-1.5">
            <Calendar className="w-4 h-4" /> Membre depuis
          </label>
          <input type="text" value={memberSince} disabled
            className="w-full px-4 py-2.5 rounded-lg border border-input bg-muted text-muted-foreground cursor-not-allowed" />
        </div>

        <button onClick={handleSave}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gradient-to-r from-primary to-drive-orange-light text-primary-foreground font-medium hover:opacity-90 transition-opacity">
          <Save className="w-4 h-4" />
          {saved ? '✓ Sauvegardé' : 'Enregistrer'}
        </button>
      </div>

      {/* Privacy Settings */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-base font-semibold text-foreground mb-3">Confidentialité</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {privacy === 'public' ? <Globe className="w-5 h-5 text-muted-foreground" /> : <Lock className="w-5 h-5 text-muted-foreground" />}
              <div className="text-left">
                <span className="text-sm font-medium text-foreground block">Visibilité du profil</span>
                <span className="text-xs text-muted-foreground">{privacy === 'public' ? 'Public - Tout le monde peut voir' : 'Privé - Seulement vos contacts'}</span>
              </div>
            </div>
            <select value={privacy} onChange={e => handlePrivacyChange(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="public">Public</option>
              <option value="private">Privé</option>
            </select>
          </div>
          <button onClick={handleShareProfile} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-input bg-background text-foreground hover:bg-surface-hover transition-colors">
            <Share2 className="w-4 h-4" />
            Partager le profil
          </button>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-base font-semibold text-foreground mb-3">Préférences</h3>
        <button onClick={() => dispatch(toggleTheme())} className="w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isDark ? <Moon className="w-5 h-5 text-muted-foreground" /> : <Sun className="w-5 h-5 text-muted-foreground" />}
            <div className="text-left">
              <span className="text-sm font-medium text-foreground block">Mode sombre</span>
              <span className="text-xs text-muted-foreground">{isDark ? 'Activé' : 'Désactivé'}</span>
            </div>
          </div>
          <div className={`w-11 h-6 rounded-full transition-colors ${isDark ? 'bg-primary' : 'bg-muted'} relative`}>
            <div className={`w-5 h-5 bg-card rounded-full absolute top-0.5 transition-transform shadow-sm ${isDark ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </div>
        </button>
      </div>

      {/* Account actions */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-1">
        <h3 className="text-base font-semibold text-foreground mb-3">Actions du compte</h3>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-surface-hover transition-colors">
          <LogOut className="w-5 h-5 text-muted-foreground" /> Se déconnecter
        </button>
        <button onClick={handleDelete} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors">
          <Trash2 className="w-5 h-5" /> Supprimer mon compte
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
