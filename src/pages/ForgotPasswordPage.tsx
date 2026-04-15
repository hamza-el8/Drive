import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HardDrive, Mail, ArrowLeft } from 'lucide-react';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-4">
            <HardDrive className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground">Mot de passe oublié</h1>
          <p className="text-muted-foreground mt-1">Réinitialisez votre mot de passe</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          {sent ? (
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-drive-green/10 flex items-center justify-center mx-auto">
                <Mail className="w-6 h-6 text-drive-green" />
              </div>
              <p className="text-foreground font-medium">Email envoyé !</p>
              <p className="text-sm text-muted-foreground">Si un compte existe avec l'adresse {email}, vous recevrez un lien de réinitialisation.</p>
              <Link to="/login" className="inline-flex items-center gap-1 text-primary text-sm hover:underline mt-2">
                <ArrowLeft className="w-4 h-4" /> Retour à la connexion
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="nom@exemple.com" />
                </div>
              </div>
              <button type="submit" className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity">
                Envoyer le lien
              </button>
              <Link to="/login" className="flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-foreground mt-2">
                <ArrowLeft className="w-4 h-4" /> Retour à la connexion
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
