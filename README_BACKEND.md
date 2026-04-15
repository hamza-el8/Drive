# CloudDrive Backend - Installation et Configuration

## Installation du Backend

### 1. Prérequis
- Node.js (v14 ou supérieur)
- MongoDB (local ou cloud)
- npm ou yarn

### 2. Installation des dépendances
```bash
cd server
npm install
```

### 3. Configuration des variables d'environnement
Copiez le fichier `.env` et modifiez les valeurs :
```bash
cp .env.example .env
```

Variables à configurer dans `.env` :
```
PORT=5000
NODE_ENV=development
JWT_SECRET=votre_cle_secrete_jwt_tres_longue_et_securisee
JWT_EXPIRE=7d
MONGODB_URI=mongodb://localhost:27017/clouddrive
```

### 4. Démarrer le serveur
```bash
# Développement
npm run dev

# Production
npm start
```

## API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Profil utilisateur
- `PUT /api/auth/profile` - Mettre à jour profil
- `POST /api/auth/logout` - Déconnexion
- `DELETE /api/auth/delete` - Supprimer compte

### Santé du serveur
- `GET /api/health` - Vérifier l'état du serveur

## Configuration du Frontend

Ajoutez ces variables dans votre `.env` du frontend :
```
VITE_API_URL=http://localhost:5000/api
```

## Sécurité

- JWT tokens avec expiration configurable
- Rate limiting pour prévenir les attaques
- Validation des entrées
- Hashage des mots de passe avec bcrypt
- Headers de sécurité avec Helmet

## Déploiement

### 1. MongoDB Atlas (Recommandé)
1. Créez un compte sur MongoDB Atlas
2. Créez un cluster gratuit
3. Obtenez votre chaîne de connexion
4. Mettez à jour `MONGODB_URI` dans `.env`

### 2. Services Cloud (Heroku, Vercel, etc.)
1. Déployez le serveur Node.js
2. Configurez les variables d'environnement
3. Mettez à jour `VITE_API_URL` dans le frontend

## Fonctionnalités

- **Authentification JWT persistante** : Sessions qui restent actives
- **Support multi-appareils** : Même session sur différents appareils
- **Gestion des comptes récents** : Accès rapide aux comptes utilisés
- **Sécurité renforcée** : Tokens JWT, rate limiting, validation
- **Base de données MongoDB** : Persistance des données utilisateur
- **API RESTful** : Interface claire pour le frontend

## Problème résolu

Le backend résout le problème de session qui se termine :
- **Avant** : localStorage uniquement (session perdue à la fermeture)
- **Après** : JWT tokens + base de données (session persistante)

Les utilisateurs restent connectés même après :
- Fermeture du navigateur
- Redémarrage de l'appareil
- Connexion depuis un autre appareil
