# Bureau d'Ordre Digital - Gouvernorat de Monastir

Application web full-stack pour la digitalisation du bureau d'ordre du Gouvernorat de Monastir.

## 🎯 Objectifs du Projet

- Enregistrement électronique des courriers
- Affectation automatique/manuelle aux services
- Suivi en temps réel
- Notifications automatiques
- Archivage numérique
- Tableau de bord pour les responsables

## 🏗️ Architecture

### Backend (Node.js/Express)
- **Port**: 5000
- **Base de données**: SQLite
- **Authentification**: JWT
- **Upload**: Multer

### Frontend (React)
- **Port**: 3000
- **UI**: TailwindCSS (CDN)
- **Routing**: React Router v6
- **HTTP Client**: Axios

## 📋 Sprints du Projet

### Sprint 1 - Authentification & Structure
- ✅ Setup backend + base de données
- ✅ Authentification JWT
- ✅ Gestion des rôles (Admin, Agent BO, Chef Service, Citoyen)
- ✅ CRUD Utilisateurs

### Sprint 2 - Gestion des Courriers
- ✅ Dépôt de demandes (citoyens)
- ✅ Affectation courrier aux services
- ✅ Interface Agent BO
- ✅ Workflow des statuts

### Sprint 3 - Suivi & Notifications
- ✅ Suivi en temps réel (timeline)
- ✅ Système de notifications
- ✅ Rappels automatiques
- ✅ Tableau de bord statistiques

### Sprint 4 - IA & Archivage
- ✅ Mots-clés pour suggestion de service
- ✅ Archivage numérique
- ✅ Documentation

## 🚀 Installation

### Prérequis
- Node.js 18+
- MySQL 8+

### Backend

```bash
cd backend
cp .env.example .env
# Configurer les variables dans .env
npm install
npm run seed  # Créer les données initiales
npm run dev   # Démarrer en mode développement
```

### Frontend

```bash
cd frontend
npm install
npm start
```

## 🎭 Rôles disponibles

| Rôle | Responsabilités |
|------|-----------------|
| **Citoyen** | Dépose et suit ses courriers |
| **Agent BO** | Gère, affecte, envoie des rappels |
| **Chef de Service** | Traite les courriers de son service |
| **Secrétaire Général** | Supervision globale + Dashboard |
| **Admin** | Gestion utilisateurs et services |

---

## 📋 Backlog Global (EPICs & User Stories)

### 🔐 EPIC 1 : Authentification & Gestion des Comptes

#### US01 — Authentification sécurisée
- ✅ Login via email + mot de passe (hashé bcrypt)
- ✅ Droits basés sur le rôle (RBAC)
- ✅ Token JWT sécurisé
- ⏳ Double facteur d'authentification (option)
- ⏳ Déconnexion automatique après inactivité

#### US02 — Gestion centralisée des comptes (Admin)
- ✅ Création, modification, désactivation de comptes
- ✅ Gestion des 5 rôles
- ⏳ Réinitialisation du mot de passe
- ⏳ Journalisation (audit log)

---

### 📥 EPIC 2 : Gestion des Demandes & Courriers

#### US03 — Dépôt de demande par le citoyen
- ✅ Upload pièces jointes (PDF, images, docs)
- ✅ Accusé de réception (référence unique)
- ✅ Suivi via tableau de bord citoyen
- ⏳ Classification automatique (catégorie + urgence)

#### US04 — Affectation du courrier au service
- ✅ Affectation manuelle
- ✅ Historique des affectations
- ✅ Possibilité de réaffecter
- ⏳ Affectation assistée par IA
- ⏳ Règle de charge de travail

#### US05 — Suivi de l'état du courrier
- ✅ Statuts: Reçu → Affecté → En cours → Traité → Transmis → Archivé
- ✅ Timeline chronologique complète
- ✅ Journalisation de chaque action
- ⏳ Date limite automatique selon type

#### US06 — Relance & notification au chef de service
- ✅ Rappel manuel depuis interface agent
- ✅ Notification in-app
- ✅ Rappel automatique si délai dépassé
- ✅ Notification Email (templates HTML)
- ✅ Escalade automatique vers Secrétaire Général

#### US07 — Transmission des courriers traités
- ✅ Réponse textuelle
- ✅ Archivage numérique
- ⏳ Génération PDF automatique
- ⏳ Signature électronique

#### US08 — Notification au citoyen après traitement
- ✅ Notification automatique in-app
- ✅ Notification Email automatique
- ⏳ Accès direct au document PDF

---

### 🧠 EPIC 3 : Intelligence Artificielle

#### AI01 — Extraction intelligente des mots-clés
- ✅ Extraction automatique des mots-clés
- ✅ Dictionnaire de catégories enrichi:
  - Urbanisme
  - Affaires sociales
  - Infrastructure / Domaine public
  - Environnement
  - Économie / Commerce
  - Ressources Humaines
  - Permis / Autorisation
  - Municipalité / État civil
- ✅ Détection automatique de la priorité
- ✅ Gestion multilingue (FR/AR translittéré)

#### AI02 — Suggestion automatique du service
- ✅ Suggestion basée sur les mots-clés
- ✅ Score de confiance (0-100%)
- ✅ Interface visuelle pour agents
- ✅ Affichage du type de demande détecté
- ⏳ Apprentissage continu

---

## 🔐 Comptes de Test

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | admin@gouvernorat-monastir.tn | admin123 |
| Agent BO | agent@gouvernorat-monastir.tn | agent123 |
| Secrétaire Général | sg@gouvernorat-monastir.tn | sg123 |
| Chef Service (SAG) | chef@gouvernorat-monastir.tn | chef123 |
| Chef Technique | chef.technique@gouvernorat-monastir.tn | chef123 |
| Chef Social | chef.social@gouvernorat-monastir.tn | chef123 |
| Citoyen | citoyen@example.com | citoyen123 |

## 📁 Structure du Projet

```
├── backend/
│   ├── config/          # Configuration DB
│   ├── middleware/      # Auth, Upload
│   ├── models/          # Sequelize models
│   ├── routes/          # API routes
│   ├── seeds/           # Données initiales
│   └── server.js        # Point d'entrée
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/  # Composants réutilisables
│       ├── context/     # Auth context
│       ├── pages/       # Pages de l'application
│       └── services/    # API services
```

## 🔧 API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription citoyen
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Profil utilisateur

### Courriers
- `GET /api/courriers` - Liste des courriers
- `POST /api/courriers` - Créer un courrier
- `GET /api/courriers/:id` - Détail courrier
- `PUT /api/courriers/:id/affecter` - Affecter au service
- `PUT /api/courriers/:id/traiter` - Traiter le courrier
- `PUT /api/courriers/:id/rappel` - Envoyer un rappel
- `GET /api/courriers/suivi/:reference` - Suivi public

### Utilisateurs (Admin)
- `GET /api/users` - Liste utilisateurs
- `POST /api/users` - Créer utilisateur
- `PUT /api/users/:id` - Modifier
- `DELETE /api/users/:id` - Supprimer

### Services (Admin)
- `GET /api/services` - Liste services
- `POST /api/services` - Créer service
- `PUT /api/services/:id` - Modifier
- `DELETE /api/services/:id` - Désactiver

### Dashboard
- `GET /api/dashboard/stats` - Statistiques
- `GET /api/dashboard/recent` - Courriers récents

### Notifications
- `GET /api/notifications` - Liste notifications
- `PUT /api/notifications/:id/read` - Marquer comme lu
- `PUT /api/notifications/read-all` - Tout marquer comme lu

## 👥 Acteurs et Fonctionnalités

| Acteur | Fonctionnalités |
|--------|----------------|
| **Citoyen** | Déposer demande, Suivre courrier, Recevoir notifications |
| **Agent BO** | Enregistrer, Affecter, Suivre, Envoyer rappels |
| **Chef Service** | Traiter courriers, Répondre |
| **Admin** | Gérer utilisateurs, Gérer services, Statistiques |


 ## Fonctionnalités à tester:
Login → Connectez-vous avec un des comptes ci-dessus
Dashboard → Visualisez les statistiques
Nouveau courrier → Créez une demande
Affectation → (Agent BO) Affectez aux services
Suivi public → Allez sur /suivi pour tracker un courrier par référence
Gestion utilisateurs → (Admin) Créez/modifiez les comptes

## 📄 Licence

Projet développé pour le Gouvernorat de Monastir - 2025
