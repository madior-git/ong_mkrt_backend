#  Description
   API RESTful pour la gestion des activités, services et messages de contact d'un ONG. Authentification sécurisée par JWT.

# Lien EndpointS API deployé sur render
 https://ong-mkrt-backend.onrender.com/api


# structure du projet
backend/
├── 📁 src/
│   ├── 📁 controllers/      # Logique métier
│   │   ├── authController.js
│   │   ├── activityController.js
│   │   ├── serviceController.js
│   │   └── contactController.js
│   │
│   ├── 📁 routes/           # Définition des routes API
│   │   ├── authRoutes.js
│   │   ├── activityRoutes.js
│   │   ├── serviceRoutes.js
│   │   └── contactRoutes.js
│   │
│   ├── 📁 models/           # Modèles de données
│   │   └── User.js 
│   │   └── Contact.js 
│   │   └── Activity.js 
│   │   └── Service.js 
│   │
│   ├── 📁 middleware/       # Middlewares (auth, validation)
│   │   ├── auth.js
│   │   └── validate.js
│   │
│   ├── 📁 config/           # Configuration
│   │   └── database.js
│   │
│   └── app.js               # Configuration Express
│
├── 📁 scripts/              # Scripts utilitaires
│   └── create-admin.js
│
├── server.js                 # Point d'entrée
├── package.json
├── .env
└── render.yaml              # Configuration déploiement

# Fonctionnement
   - Login : POST /api/auth/login

   - Vérification email/mot de passe

   - Génération d'un token JWT

   - Stockage dans cookies + localStorage

   - Vérification : Middleware auth.js

   - Token vérifié à chaque requête protégée

   - Ajout de l'utilisateur à l'objet req

   - Déconnexion : Nettoyage cookies et localStorage


#  Base de Données (PostgreSQL)
  -- Utilisateurs (admin)
	CREATE TABLE users (
	  id SERIAL PRIMARY KEY,
	  username VARCHAR(255) NOT NULL,
	  email VARCHAR(255) UNIQUE NOT NULL,
	  password_hash VARCHAR(255) NOT NULL,
	  role VARCHAR(50) DEFAULT 'user',
	  created_at TIMESTAMP DEFAULT NOW()
	);

-- Activités
	CREATE TABLE activities (
	  id SERIAL PRIMARY KEY,
	  title VARCHAR(255) NOT NULL,
	  description TEXT,
	  date DATE NOT NULL,
	  location VARCHAR(255),
	  image_url TEXT,
	  created_at TIMESTAMP DEFAULT NOW()
	);

-- Services
	CREATE TABLE services (
	  id SERIAL PRIMARY KEY,
	  title VARCHAR(255) NOT NULL,
	  description TEXT,
	  icon VARCHAR(50),
	  created_at TIMESTAMP DEFAULT NOW()
	);

-- Contacts
	CREATE TABLE contacts (
	  id SERIAL PRIMARY KEY,
	  name VARCHAR(255) NOT NULL,
	  email VARCHAR(255) NOT NULL,
	  subject VARCHAR(255),
	  message TEXT NOT NULL,
	  status VARCHAR(50) DEFAULT 'pending',
	  created_at TIMESTAMP DEFAULT NOW()
	);


#  Technologies Utilisées


   - Node.js / Express

   - PostgreSQL

   - JWT (authentification)

   - Bcrypt (hash mots de passe)

   - Cloudinary (gestion images)

# Cloner le repository
   git clone https://github.com/madior-git/ong_mkrt_backend.git
   cd ong_mkrt_backend

# Installer les dépendances
  npm install

# Configurer les variables d'environnement
   cp .env.example .env
# Éditer .env avec vos identifiants