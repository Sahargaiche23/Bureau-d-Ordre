# 📋 SCÉNARIOS DE TEST COMPLETS - Bureau d'Ordre Digital
## Gouvernorat de Monastir - Version 2.0

---

# 🔑 COMPTES DE TEST

## Tous les comptes disponibles

| Rôle | Email | Mot de passe | Accès |
|------|-------|--------------|-------|
| **Admin** | admin@gouvernorat-monastir.tn | admin123 | Tout |
| **Agent BO** | agent@gouvernorat-monastir.tn | agent123 | Courriers, Affectation |
| **Secrétaire Général** | sg@gouvernorat-monastir.tn | sg123 | Supervision, Escalades |
| **Chef SAG** | chef@gouvernorat-monastir.tn | chef123 | Affaires Générales |
| **Chef Technique** | chef.technique@gouvernorat-monastir.tn | chef123 | Urbanisme, Travaux |
| **Chef Social** | chef.social@gouvernorat-monastir.tn | chef123 | Aides sociales |
| **Chef Économique** | chef.economique@gouvernorat-monastir.tn | chef123 | Commerce, Licences |
| **Chef Environnement** | chef.environnement@gouvernorat-monastir.tn | chef123 | Pollution, Écologie |
| **Citoyen** | citoyen@example.com | citoyen123 | Dépôt, Suivi |

---

# 👤 SCÉNARIOS PAR ACTEUR

---

## 🟢 ACTEUR 1 : CITOYEN

### 📝 Scénario C1 - Inscription et Connexion
| Étape | Action | Résultat |
|-------|--------|----------|
| 1 | Aller sur http://localhost:3000/login | Page de connexion |
| 2 | Cliquer "Créer un compte citoyen" | Formulaire inscription |
| 3 | Remplir: Prénom, Nom, CIN, Email, Téléphone | Champs validés |
| 4 | Mot de passe: `monpass123` | Min 6 caractères |
| 5 | Cliquer "S'inscrire" | ✅ Compte créé |
| 6 | Redirection automatique | Dashboard citoyen |

### 📤 Scénario C2 - Dépôt d'une demande
| Étape | Action | Résultat |
|-------|--------|----------|
| 1 | Connecter: `citoyen@example.com` / `citoyen123` | Dashboard |
| 2 | Menu → **Nouveau Courrier** | Formulaire |
| 3 | Objet: `Demande de permis de construction` | |
| 4 | Contenu: `Je souhaite construire une maison à Monastir` | |
| 5 | Type: `Entrant` | |
| 6 | Priorité: `Haute` | |
| 7 | Joindre fichier PDF (optionnel) | Upload ok |
| 8 | Cliquer "Soumettre" | ✅ Référence: **BO-2025-00001** |

### 🤖 Scénario C3 - Utilisation de l'IA
| Étape | Action | Résultat |
|-------|--------|----------|
| 1 | Dans formulaire Nouveau Courrier | |
| 2 | Taper objet: `Réclamation pollution` | |
| 3 | Taper contenu: `Déchets dans ma rue depuis 1 semaine` | |
| 4 | Voir panneau **Suggestion IA** | Automatique |
| 5 | Vérifier | ✅ Service: **Environnement** |
| 6 | Vérifier | ✅ Catégorie: **Environnement** |
| 7 | Vérifier | ✅ Mots-clés: pollution, déchet |

### 📊 Scénario C4 - Suivi de ses demandes
| Étape | Action | Résultat |
|-------|--------|----------|
| 1 | Menu → **Courriers** | Liste de MES courriers |
| 2 | Voir statut de chaque courrier | Brouillon / En attente / Affecté / Traité |
| 3 | Cliquer sur une référence | Page détail |
| 4 | Voir **Historique** | Timeline des actions |
| 5 | Voir **Analyse IA** | Catégorie, service suggéré |

### 🔔 Scénario C5 - Notifications
| Étape | Action | Résultat |
|-------|--------|----------|
| 1 | Icône 🔔 en haut à droite | Badge si notifications |
| 2 | Menu → **Notifications** | Liste complète |
| 3 | Voir notification "Courrier traité" | |
| 4 | Cliquer dessus | ✅ Redirection vers le courrier |
| 5 | Notification marquée comme lue | Badge diminue |

### 📹 Scénario C6 - Assistance Vidéo
| Étape | Action | Résultat |
|-------|--------|----------|
| 1 | Menu → **Assistance Vidéo** | Page assistance |
| 2 | Cliquer "📞 Nouvelle demande" | Modal formulaire |
| 3 | Sujet: `Aide pour permis de construction` | |
| 4 | Description: `Je ne comprends pas les documents requis` | |
| 5 | Date souhaitée: demain | |
| 6 | Heure: 10:00 | |
| 7 | Cliquer "Envoyer" | ✅ Demande créée |
| 8 | Attendre notification agent | Statut: "En attente" |
| 9 | Quand agent démarre | Bouton "📹 Rejoindre l'appel" |
| 10 | Cliquer "Rejoindre" | ✅ Appel vidéo Jitsi ouvert |

---

## 🔵 ACTEUR 2 : AGENT BUREAU D'ORDRE

### 📥 Scénario A1 - Voir tous les courriers
| Étape | Action | Résultat |
|-------|--------|----------|
| 1 | Connecter: `agent@gouvernorat-monastir.tn` / `agent123` | Dashboard |
| 2 | Voir statistiques | Total, En attente, Traités, Urgents |
| 3 | Menu → **Courriers** | Liste TOUS les courriers |
| 4 | Filtrer par statut | Dropdown fonctionnel |
| 5 | Filtrer par priorité | Dropdown fonctionnel |
| 6 | Rechercher par référence | Barre de recherche |

### 📝 Scénario A2 - Créer un courrier pour citoyen
| Étape | Action | Résultat |
|-------|--------|----------|
| 1 | Menu → **Nouveau Courrier** | Formulaire |
| 2 | Objet: `Plainte voirie - Rue de la République` | |
| 3 | Contenu: `Trous dangereux sur la chaussée` | |
| 4 | Type: `Entrant` | |
| 5 | Priorité: `Urgente` | |
| 6 | Voir **Suggestion IA** | Service Technique suggéré |
| 7 | Soumettre | ✅ Courrier créé |

### 🎯 Scénario A3 - Affecter un courrier à un service
| Étape | Action | Résultat |
|-------|--------|----------|
| 1 | Menu → Courriers → Cliquer sur `BO-2025-00001` | Page détail |
| 2 | Vérifier statut: **En attente** | |
| 3 | Cliquer bouton "**Affecter**" | Modal affectation |
| 4 | Voir **Suggestion IA**: Service Technique | Confiance 85% |
| 5 | Sélectionner "Service Technique" | |
| 6 | Cliquer "Confirmer" | ✅ Statut → **Affecté** |
| 7 | Vérifier Historique | "Affectation au Service Technique" |
| 8 | Vérifier | ✅ Notification envoyée au Chef Technique |

### ⏰ Scénario A4 - Envoyer un rappel
| Étape | Action | Résultat |
|-------|--------|----------|
| 1 | Ouvrir un courrier affecté depuis > 2 jours | |
| 2 | Cliquer "**Envoyer un rappel**" | Confirmation |
| 3 | Confirmer | ✅ Rappel envoyé |
| 4 | Vérifier Historique | "Rappel envoyé" |
| 5 | Chef de service reçoit | ✅ Notification rappel |

### 📹 Scénario A5 - Gérer les demandes d'assistance vidéo
| Étape | Action | Résultat |
|-------|--------|----------|
| 1 | Menu → **Assistance Vidéo** | Liste des demandes |
| 2 | Voir demande en attente d'un citoyen | Statut: "En attente" |
| 3 | Cliquer "📹 Démarrer l'appel" | |
| 4 | Appel vidéo s'ouvre (Jitsi) | |
| 5 | Citoyen reçoit notification | Peut rejoindre |
| 6 | Terminer l'appel → "✓ Terminer" | ✅ Statut: Terminé |

---

## 🟡 ACTEUR 3 : CHEF DE SERVICE

### 📊 Scénario CS1 - Dashboard Chef
| Étape | Action | Résultat |
|-------|--------|----------|
| 1 | Connecter: `chef.technique@gouvernorat-monastir.tn` / `chef123` | |
| 2 | Voir Dashboard | Statistiques du service |
| 3 | Voir badge rôle | "Chef de Service" |
| 4 | Voir courriers affectés | Courriers de MON service |

### 📬 Scénario CS2 - Voir courriers de son service
| Étape | Action | Résultat |
|-------|--------|----------|
| 1 | Menu → **Courriers** | Liste filtrée |
| 2 | Voir uniquement | Courriers affectés à Service Technique |
| 3 | Cliquer sur un courrier | Page détail |
| 4 | Vérifier | Bouton "Traiter" disponible |

### ✅ Scénario CS3 - Traiter un courrier
| Étape | Action | Résultat |
|-------|--------|----------|
| 1 | Ouvrir courrier `BO-2025-00001` | Page détail |
| 2 | Cliquer "**Traiter**" | Modal traitement |
| 3 | Réponse: `Votre permis est approuvé. RDV le 20/12/2025` | |
| 4 | Cliquer "Confirmer" | ✅ Statut → **Traité** |
| 5 | Vérifier Historique | "Traité par Chef Technique" |
| 6 | Citoyen reçoit | ✅ Notification "Demande traitée" |

### 🔔 Scénario CS4 - Recevoir un rappel
| Étape | Action | Résultat |
|-------|--------|----------|
| 1 | Agent BO envoie un rappel | |
| 2 | Chef se connecte | |
| 3 | Voir 🔔 avec badge | Notification non lue |
| 4 | Menu → Notifications | "Rappel: Courrier en attente" |
| 5 | Cliquer | Redirection vers le courrier |

---

## 🟣 ACTEUR 4 : SECRÉTAIRE GÉNÉRAL

### 📊 Scénario SG1 - Supervision globale
| Étape | Action | Résultat |
|-------|--------|----------|
| 1 | Connecter: `sg@gouvernorat-monastir.tn` / `sg123` | |
| 2 | Dashboard | Vue globale tous services |
| 3 | Voir badge | "Secrétaire Général" |
| 4 | Menu | PAS de "Nouveau Courrier" |

### 🚨 Scénario SG2 - Recevoir escalade
| Étape | Action | Résultat |
|-------|--------|----------|
| 1 | Courrier bloqué > 7 jours | Escalade automatique |
| 2 | SG reçoit notification | "Escalade: Courrier bloqué" |
| 3 | Cliquer sur notification | Détail du courrier |
| 4 | Voir historique complet | Comprendre le blocage |

### 📈 Scénario SG3 - Consulter les statistiques
| Étape | Action | Résultat |
|-------|--------|----------|
| 1 | Dashboard | |
| 2 | Voir tous les compteurs | Total, En attente, Traités |
| 3 | Voir courriers urgents | Badge rouge si > 0 |
| 4 | Voir par service | Répartition des courriers |

---

## 🔴 ACTEUR 5 : ADMINISTRATEUR

### 👥 Scénario AD1 - Gérer les utilisateurs
| Étape | Action | Résultat |
|-------|--------|----------|
| 1 | Connecter: `admin@gouvernorat-monastir.tn` / `admin123` | |
| 2 | Menu → **Utilisateurs** | Liste tous utilisateurs |
| 3 | Cliquer "+ Nouvel utilisateur" | Modal création |
| 4 | Remplir: Prénom, Nom, Email, Téléphone | |
| 5 | Rôle: `Chef de Service` | |
| 6 | Service: `Service Social` | |
| 7 | Mot de passe: `nouveauchef123` | |
| 8 | Cliquer "Créer" | ✅ Utilisateur créé |

### 🏢 Scénario AD2 - Gérer les services
| Étape | Action | Résultat |
|-------|--------|----------|
| 1 | Menu → **Services** | Liste des services |
| 2 | Voir tous les services | Nom, Chef, Membres |
| 3 | Cliquer sur un service | Détails |
| 4 | Modifier le chef | Dropdown utilisateurs |
| 5 | Enregistrer | ✅ Chef mis à jour |

### 📊 Scénario AD3 - Dashboard Admin
| Étape | Action | Résultat |
|-------|--------|----------|
| 1 | Dashboard | Vue globale |
| 2 | Total courriers | Nombre exact |
| 3 | Répartition par statut | En attente, Affecté, Traité |
| 4 | Courriers urgents | Badge rouge |
| 5 | Actions rapides | Nouveau courrier disponible |

### 🔔 Scénario AD4 - Notifications Admin
| Étape | Action | Résultat |
|-------|--------|----------|
| 1 | Menu → Notifications | |
| 2 | Voir toutes les alertes système | |
| 3 | Escalades reçues | Si courrier bloqué > 7j |
| 4 | Nouvelles inscriptions | Alertes citoyens |

---

# 📬 SCÉNARIOS COURRIERS

## Cycle de vie complet d'un courrier

```
[Citoyen]           [Agent BO]          [Chef Service]       [Citoyen]
    |                   |                     |                  |
    | 1. Dépôt          |                     |                  |
    |------------------>|                     |                  |
    |                   | 2. Affectation      |                  |
    |                   |-------------------->|                  |
    |                   |                     | 3. Traitement    |
    |                   |                     |----------------->|
    |                   |                     |                  | 4. Notification
```

### Scénario COURRIER-1 : Demande de permis
| Étape | Acteur | Action | Statut |
|-------|--------|--------|--------|
| 1 | Citoyen | Dépose "Demande permis construction" | `Brouillon` → `En attente` |
| 2 | Agent BO | Voit le courrier, analyse IA suggère Technique | `En attente` |
| 3 | Agent BO | Affecte au Service Technique | `Affecté` |
| 4 | Chef Technique | Reçoit notification | |
| 5 | Chef Technique | Ouvre et traite | `Traité` |
| 6 | Citoyen | Reçoit notification "Demande traitée" | ✅ Terminé |

### Scénario COURRIER-2 : Réclamation environnement
| Étape | Acteur | Action | Statut |
|-------|--------|--------|--------|
| 1 | Citoyen | Dépose "Pollution usine" | `En attente` |
| 2 | IA | Suggère: Service Environnement (90%) | |
| 3 | Agent BO | Affecte au Service Environnement | `Affecté` |
| 4 | Chef Environnement | Traite: "Inspection programmée" | `Traité` |

### Scénario COURRIER-3 : Demande sociale urgente
| Étape | Acteur | Action | Statut |
|-------|--------|--------|--------|
| 1 | Citoyen | Dépose "Aide urgente famille" + Priorité Urgente | `En attente` |
| 2 | IA | Détecte priorité URGENTE, suggère Social | |
| 3 | Agent BO | Affecte immédiatement | `Affecté` |
| 4 | Chef Social | Traite en priorité | `Traité` |

---

# 🔔 SCÉNARIOS NOTIFICATIONS

### Qui reçoit quoi ?

| Événement | Destinataire | Type notification |
|-----------|--------------|-------------------|
| Nouveau courrier déposé | Agent BO | `nouveau_courrier` |
| Courrier affecté | Chef du service | `affectation` |
| Courrier traité | Citoyen expéditeur | `traitement` |
| Rappel manuel | Chef du service | `rappel` |
| Rappel automatique (3j) | Chef du service | `rappel` |
| Escalade (7j) | Secrétaire Général | `escalade` |
| Demande assistance vidéo | Agents BO | `assistance` |
| Appel vidéo démarré | Citoyen | `assistance` |

### Scénario NOTIF-1 : Flux complet
| Temps | Événement | Notification |
|-------|-----------|--------------|
| T+0 | Citoyen dépose courrier | Agent BO reçoit alerte |
| T+1h | Agent affecte à Technique | Chef Technique reçoit "Nouveau courrier affecté" |
| T+3j | Pas de traitement | Chef reçoit "Rappel automatique" |
| T+7j | Toujours pas traité | SG reçoit "Escalade: blocage" |
| T+8j | Chef traite enfin | Citoyen reçoit "Demande traitée" |

---

# 🏢 SCÉNARIOS SERVICES

### Services disponibles

| Service | Chef | Domaines |
|---------|------|----------|
| Service des Affaires Générales (SAG) | chef@gouvernorat-monastir.tn | État civil, Documents |
| Service Technique | chef.technique@gouvernorat-monastir.tn | Urbanisme, Travaux, Permis |
| Service Social | chef.social@gouvernorat-monastir.tn | Aides, Allocations, Handicap |
| Service Économique | chef.economique@gouvernorat-monastir.tn | Commerce, Licences |
| Service Environnement | chef.environnement@gouvernorat-monastir.tn | Pollution, Déchets, Écologie |

### Scénario SERVICE-1 : Affectation par mots-clés

| Mots-clés dans le courrier | Service suggéré | Confiance |
|----------------------------|-----------------|-----------|
| permis, construction, bâtiment, urbanisme | Service Technique | 85% |
| aide, social, famille, handicap, pauvreté | Service Social | 90% |
| pollution, déchet, environnement, ordure | Service Environnement | 88% |
| commerce, licence, patente, économique | Service Économique | 82% |
| état civil, naissance, mariage, certificat | Affaires Générales | 80% |

---

# 📹 SCÉNARIOS ASSISTANCE VIDÉO

### Scénario VIDEO-1 : Demande citoyen
| Étape | Acteur | Action |
|-------|--------|--------|
| 1 | Citoyen | Menu → Assistance Vidéo |
| 2 | Citoyen | Clique "📞 Nouvelle demande" |
| 3 | Citoyen | Remplit: Sujet, Description, Date, Heure |
| 4 | Citoyen | Envoie la demande |
| 5 | Agent BO | Reçoit notification |
| 6 | Agent BO | Va dans Assistance Vidéo |
| 7 | Agent BO | Clique "📹 Démarrer l'appel" |
| 8 | Système | Ouvre Jitsi Meet |
| 9 | Citoyen | Reçoit notification "Appel démarré" |
| 10 | Citoyen | Clique "📹 Rejoindre l'appel" |
| 11 | Les deux | Communication vidéo en direct |
| 12 | Agent BO | Clique "✓ Terminer" |
| 13 | Système | Appel terminé, historique sauvegardé |

---

# ✅ CHECKLIST DE VALIDATION COMPLÈTE

## Authentification
- [ ] Connexion Admin
- [ ] Connexion Agent BO
- [ ] Connexion Secrétaire Général
- [ ] Connexion Chef de Service (x5)
- [ ] Connexion Citoyen
- [ ] Inscription nouveau citoyen
- [ ] Déconnexion

## Courriers
- [ ] Dépôt par citoyen
- [ ] Dépôt par agent BO
- [ ] Suggestion IA affichée
- [ ] Upload fichier PDF
- [ ] Affectation à un service
- [ ] Traitement par chef
- [ ] Historique visible
- [ ] Suivi public par référence

## Notifications
- [ ] Badge 🔔 avec compteur
- [ ] Liste des notifications
- [ ] Marquer comme lu
- [ ] Redirection au clic
- [ ] Notification affectation (chef)
- [ ] Notification traitement (citoyen)
- [ ] Rappel manuel
- [ ] Rappel automatique

## Administration
- [ ] Liste utilisateurs
- [ ] Créer utilisateur
- [ ] Modifier utilisateur
- [ ] Liste services
- [ ] Modifier chef de service

## Assistance Vidéo
- [ ] Créer demande (citoyen)
- [ ] Voir demandes (agent)
- [ ] Démarrer appel
- [ ] Rejoindre appel
- [ ] Terminer appel

## Dashboard
- [ ] Statistiques globales
- [ ] Courriers récents
- [ ] Actions rapides
- [ ] Rôle affiché

---

# 🧪 TESTS RAPIDES

## Test 1 : Cycle complet (5 min)
1. ✅ Citoyen dépose → Agent affecte → Chef traite → Citoyen notifié

## Test 2 : IA (2 min)
1. ✅ Taper "pollution usine" → Suggestion Environnement

## Test 3 : Assistance Vidéo (3 min)
1. ✅ Citoyen demande → Agent démarre → Appel fonctionne

## Test 4 : Notifications (2 min)
1. ✅ Traiter un courrier → Citoyen reçoit notification

---

**Document créé le:** 5 décembre 2025  
**Version:** 2.0  
**Application:** Bureau d'Ordre Digital - Gouvernorat de Monastir
