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

### Utilisateurs principaux

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | admin@gouvernorat-monastir.tn | admin123 |
| Agent BO | agent@gouvernorat-monastir.tn | agent123 |
| Secrétaire Général | sg@gouvernorat-monastir.tn | sg123 |
| Citoyen | citoyen@example.com | citoyen123 |

### 👤 Chefs de Service

| Service | Email | Mot de passe |
|---------|-------|--------------|
| SAG | chef@gouvernorat-monastir.tn | chef123 |
| Technique | chef.technique@gouvernorat-monastir.tn | chef123 |
| Social | chef.social@gouvernorat-monastir.tn | chef123 |
| Économique | chef.economique@gouvernorat-monastir.tn | chef123 |
| Environnement | chef.environnement@gouvernorat-monastir.tn | chef123 |

---

## 🧪 Guide de Test

### ✅ Tester les Rappels et Notifications

1. **Créez un courrier** (connecté en citoyen)
2. **Affectez-le à un service** (connecté en Agent BO)
3. **Envoyez un rappel** (bouton "Envoyer rappel" sur le courrier)
4. **Connectez-vous en tant que Chef du service** → La notification apparaît!

### 📋 Exemple de test:

| Courrier | Service affecté | Chef à connecter |
|----------|-----------------|------------------|
| BO-2025-00001 | Service Social | chef.social@gouvernorat-monastir.tn |
| BO-2025-00002 | Service Technique | chef.technique@gouvernorat-monastir.tn |
| BO-2025-00003 | Service Environnement | chef.environnement@gouvernorat-monastir.tn |

> **Note**: Le rappel est toujours envoyé au **Chef du Service** auquel le courrier est affecté.

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

---

# 🚀 ROADMAP - Fonctionnalités Avancées

## 🤖 1️⃣ Intelligence Artificielle & Automatisation

### ✔ Lecture automatique de documents (OCR Intelligent)
Le système peut :
- Lire automatiquement un PDF scanné
- Extraire texte / numéros / dates / objets
- Rechercher dans le contenu comme un moteur Google

### ✔ Moteur de workflow dynamique
Chaque type de courrier peut avoir :
- Un parcours différent
- Des règles spécifiques
- Des étapes obligatoires
- Des délais légaux automatiques

> **Exemple** : Un "permis de construire" suit un workflow spécial de 4 étapes + validation.

### ✔ Suggestion automatique de modèles de réponse
Le système propose un texte de réponse pré-rempli basé sur :
- Le type de demande
- La décision du chef de service
- La loi applicable

✨ **Gain de temps énorme pour les agents.**

### ✔ Pré-analyse avant enregistrement (Pre-Check Smart Engine)
Avant même que l'agent enregistre un courrier :
- Analyse le contenu
- Propose un résumé automatique
- Détecte l'objet le plus probable
- Signale les anomalies
- Propose le workflow le plus adapté

🎯 **Réduit 40% du temps d'enregistrement.**

### ✔ Détection automatique des pièces manquantes
L'IA comprend le type de demande et vérifie :
- Pièces obligatoires présentes ?
- Format correct ?
- Qualité du scan suffisante ?

### ✔ Auto-rédaction intelligente des réponses (LLM avancé)
L'application génère automatiquement une réponse :
- Polie
- Conforme à la loi
- Adaptée au type de demande
- En français, arabe ou bilingue

### ✔ Détection du ton et intention du demandeur (IA Sémantique)
L'IA analyse le texte et détecte :
- Ton urgent
- Plainte
- Demande administrative
- Demande sensible
- Risque potentiel

---

## 🔒 2️⃣ Sécurité & Conformité

### ✔ Archivage certifié et horodatage légal
Conforme aux exigences :
- Commissions d'audit administratif
- Archives nationales
- Sécurité juridique

Le système génère :
- Un identifiant unique inviolable
- Une date certifiée (timestamp blockchain possible)
- L'historique complet des actions

### ✔ Journalisation avancée (Audit Log 360°)
Chaque action est enregistrée :
- Qui a ouvert le courrier
- Qui l'a affecté
- Qui l'a modifié
- Qui l'a traité
- Qui l'a consulté

👉 **Obligatoire pour lutter contre corruption et falsifications.**

### ✔ Gestion des niveaux de confidentialité
Les courriers peuvent être catégorisés :
| Niveau | Accès |
|--------|-------|
| Public | Tous |
| Interne | Agents uniquement |
| Confidentiel | Chef + Admin |
| Très sensible | Gouverneur uniquement |

Avec : masquage partiel, accès restreint, suivi des consultations

### ✔ Mécanisme Auto-Stop
Le système bloque automatiquement un courrier si :
- Il manque une pièce obligatoire
- Il y a incohérence (dates, noms…)
- Doublon détecté
- Courrier suspect (fraude potentielle)

### ✔ Détection de fraude / anomalies avec IA
Cas possibles :
- Faux documents
- Pièces d'identité modifiées
- Pattern suspect (même demande répétée)
- Signature incohérente

⚠️ **Alertes automatiques + remontée au responsable.**

### ✔ Certificat numérique anti-fraude
Chaque courrier traité reçoit :
- Un certificat numérique
- Une signature blockchain
- Un identifiant universel (UUID public)
- Un QR code vérifiable par smartphone

---

## 📊 3️⃣ Pilotage & Gouvernance

### ✔ Tableau de bord "performance des services"
Indicateurs clés :
- Taux de retard
- Temps moyen de traitement
- Charge de travail par service
- Types de demandes les plus fréquents
- Pics d'activité

### ✔ Analyse prédictive (IA avancée)
L'IA prédit :
- Le volume de demandes la semaine prochaine
- Les services qui vont être surchargés
- Les périodes de pic
- Les demandes les plus probables

🧠 **Comme un assistant d'aide à la décision.**

### ✔ Gestion proactive des délais légaux (Legal Time Guardian)
Le système connaît :
- Les lois d'administration publique
- Les délais légaux obligatoires
- Les exceptions

Il calcule automatiquement :
- Date limite légale
- Délais restants
- Alertes préventives à J-3 / J-1 / J0

✨ **Aucun courrier ne dépasse les délais légaux.**

### ✔ Validation Multi-Niveaux Automatique
Pour certains courriers sensibles, le système déclenche :
1. Validation chef de service
2. Validation secrétaire général
3. Validation gouverneur si nécessaire

### ✔ Système d'audit entièrement automatisé (AutoAudit 360°)
Il analyse automatiquement :
- Retards
- Erreurs
- Anomalies
- Accès suspects
- Actions douteuses
- Décisions incohérentes

---

## 🧠 4️⃣ Intelligence Augmentée

### ✔ Agent Virtuel d'assistance au traitement
Un assistant intelligent peut :
- Proposer des actions
- Alerter sur les délais
- Analyser les documents
- Expliquer le contexte d'un courrier
- Proposer une réponse automatique

💡 **Comme un copilote administratif.**

### ✔ Assistant IA "Analyseur juridique"
Le système analyse les documents et identifie :
- Articles de loi concernés
- Procédures obligatoires
- Contraintes légales

Il propose également :
- La meilleure réponse
- Les modèles de textes juridiques exacts
- Les documents manquants selon la loi

🧠 **Un véritable juriste numérique intégré.**

### ✔ Système anti-duplication basé IA
Analyse sémantique :
- Détecte si la même demande a déjà été déposée
- Même citoyen, même objet, mêmes documents
- Propose fusion des dossiers

### ✔ Réconciliation automatique entre services
Quand un courrier dépend de plusieurs services :
- Le système rassemble les informations automatiquement
- Propose une synthèse intelligente
- Évite les échanges manuels longs

### ✔ IA spécialisée par domaine administratif
| Domaine | Spécialisation |
|---------|----------------|
| IA Urbanisme | Permis, constructions |
| IA Social | Aides, allocations |
| IA Environnement | Autorisations |
| IA Foncier | Domaines de l'État |
| IA RH | Gestion personnel |

---

## 👥 5️⃣ Expérience Citoyenne

### ✔ Traçabilité citoyenne en mode "transparence totale"
Le citoyen voit :
- Les étapes
- La personne responsable
- Les délais prévus
- L'avancement en pourcentage

✨ **Comme le suivi d'un colis, mais pour un document administratif.**

### ✔ Portail citoyen ultra-simplifié
Inspiré ANTS France :
- Scan automatique via smartphone
- Pré-remplissage intelligent
- Suivi clair et pédagogique
- Historique de toutes les anciennes demandes

### ✔ Système de chat intégré (citoyen ↔ agent)
Échanges directs internes à la plateforme :
- Clarifications
- Demandes de pièces complémentaires
- Historique intégré au dossier

### ✔ Assistant citoyen intelligent (Chatbot + IA)
Le citoyen pose une question, l'IA :
- Comprend
- Propose la démarche
- Explique les pièces nécessaires
- Crée la demande automatiquement
- Vérifie le dossier

### ✔ Interface citoyenne narrative (Story Mode)
L'application explique le traitement sous forme d'histoire :
> "Votre dossier a été reçu" → "Transmis au service X" → "En cours d'étude"

💡 **Très intuitif pour tout public.**

### ✔ Assistance vocale (Voice Assistant)
Le citoyen peut :
- Demander un état d'avancement
- Dicter une nouvelle demande
- Entendre les étapes

Disponible en : **Français | Arabe | Dialecte tunisien**

### ✔ Mode simplifié pour personnes âgées / analphabètes
- Navigation 100% vocale
- Lecture de documents
- Explication simplifiée
- Assistance par icônes et couleurs

### ✔ Espace citoyen familial (Gestion multi-personnes)
Un seul compte peut gérer :
- Parents
- Enfants
- Personnes âgées
- Associations
- Entreprises

🧠 **Un guichet unique réel.**

---

## 🏛️ 6️⃣ Gouvernance & Organisation

### ✔ Réallocation automatique de charges
Si un service est saturé :
- Envoie automatiquement certains courriers à un autre service
- Priorise les services performants
- Calcule la capacité idéale

### ✔ Gestion multi-entités (Gouvernorat ↔ Municipalités)
Le système reconnaît si un courrier :
- Est destiné au gouvernorat
- Doit être transmis à une municipalité
- Concerne une direction régionale
- Doit circuler entre plusieurs structures

### ✔ Mode "crise" pour périodes critiques
En cas de crise (pluies, urgences sociales, élections…) :
- Priorité automatique pour certaines demandes
- Renforcement des alertes
- Notifications rapides
- Tableau de bord crise

### ✔ Score de performance des services
Le système calcule automatiquement :
- Délai moyen réel
- Taux de réclamation
- Taux de correction d'erreurs
- Niveau de satisfaction citoyen
- Performance individuelle des agents

### ✔ Gestion dynamique des compétences internes
L'IA identifie :
- Agents performants
- Agents spécialisés par domaine
- Surcharge de certains services

Puis recommande : renforts, formations, réaffectations

---

## 🔮 7️⃣ Fonctionnalités Futuristes

### ✔ IA Directeur Général Virtuel
Une IA supervise entièrement :
- Le flux administratif
- La charge de travail
- Les performances
- Les risques
- Les points critiques

🧠 **C'est un "directeur administratif numérique" intégré.**

### ✔ Digital Twin Administration (Jumeau Numérique)
Un modèle numérique simule :
- Flux de courriers
- Capacités des services
- Impact d'un retard
- Effets d'une grève
- Impact d'une catastrophe naturelle

Le gouvernorat peut tester : **« Que se passerait-il si… ? »**

### ✔ Carte de chaleur citoyenne (Citizen HeatMap)
Le système affiche sur une carte :
- Problèmes fréquents par zone
- Plaintes récurrentes
- Demandes bloquées
- Services sous pression

### ✔ Auto-décision pour demandes simples
Certaines demandes standard peuvent être :
- Validées automatiquement
- Signées automatiquement
- Envoyées au citoyen sans intervention humaine

✨ **Automatisation complète pour les cas simples.**

### ✔ Intégration identité numérique nationale
Le système s'interface avec :
- Base nationale de CIN
- Certificats numériques
- Identité digitale (MobileID, GOV-ID)

Résultats : **zéro erreur d'identité, pas de documents manquants**

### ✔ Connexion inter-ministérielle
Le système peut récupérer automatiquement des informations depuis :
- Municipalités
- Ministères
- Registres nationaux
- CNSS / CNAM
- Registre du commerce

🎯 **L'agent BO n'a plus besoin de demander des papiers déjà existants ailleurs.**

---

## 📄 Licence

Projet développé pour le Gouvernorat de Monastir - 2025
