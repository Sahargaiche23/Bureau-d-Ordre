# 📋 Scénarios de Test - Bureau d'Ordre Digital

## 🔐 EPIC 1 : Authentification

### Scénario 1.1 - Connexion Admin
| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Aller sur http://localhost:3000/login | Page de connexion affichée |
| 2 | Email: `admin@gouvernorat-monastir.tn` | Champ rempli |
| 3 | Mot de passe: `admin123` | Champ rempli |
| 4 | Cliquer "Se connecter" | ✅ Redirection vers Dashboard |
| 5 | Vérifier le menu | Menu complet (Utilisateurs, Services) |

### Scénario 1.2 - Connexion Citoyen
| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Email: `citoyen@example.com` / `citoyen123` | Connexion réussie |
| 2 | Vérifier le menu | Menu limité (Courriers, Notifications) |

### Scénario 1.3 - Inscription Citoyen
| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Cliquer "Créer un compte citoyen" | Formulaire d'inscription |
| 2 | Prénom: `Mohamed` | |
| 3 | Nom: `Ben Ahmed` | |
| 4 | CIN: `12345678` | |
| 5 | Email: `mohamed@test.com` | |
| 6 | Téléphone: `98765432` | |
| 7 | Mot de passe: `test1234` (min 6 car.) | |
| 8 | Confirmer: `test1234` | |
| 9 | Cliquer "S'inscrire" | ✅ Compte créé, redirection Dashboard |

---

## 📥 EPIC 2 : Gestion des Courriers

### Scénario 2.1 - Dépôt de demande (Citoyen)
| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Connecté en tant que citoyen | |
| 2 | Menu → "Nouveau Courrier" | Formulaire affiché |
| 3 | Objet: `Demande de permis de construction` | |
| 4 | Contenu: `Je souhaite obtenir un permis pour construire une maison à Monastir` | |
| 5 | Type: `Entrant` | |
| 6 | Priorité: `Haute` | |
| 7 | Joindre un fichier PDF (optionnel) | |
| 8 | Cliquer "Soumettre" | ✅ Courrier créé avec référence BO-2025-XXXXX |

### Scénario 2.2 - Affectation (Agent BO)
| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Connexion: `agent@gouvernorat-monastir.tn` / `agent123` | |
| 2 | Menu → "Courriers" | Liste des courriers |
| 3 | Cliquer sur référence `BO-2025-XXXXX` | Page détail |
| 4 | Cliquer "Affecter" | Modal d'affectation |
| 5 | Sélectionner "Service Technique" | |
| 6 | Cliquer "Confirmer" | ✅ Statut → "Affecté" |
| 7 | Vérifier historique | Action "Affectation" enregistrée |

### Scénario 2.3 - Traitement (Chef de Service)
| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Connexion: `chef@gouvernorat-monastir.tn` / `chef123` | |
| 2 | Dashboard → Courriers affectés | Liste visible |
| 3 | Ouvrir un courrier affecté | Page détail |
| 4 | Cliquer "Traiter" | Modal de traitement |
| 5 | Réponse: `Votre demande a été approuvée. RDV le 15/01/2025.` | |
| 6 | Confirmer | ✅ Statut → "Traité" |
| 7 | Vérifier notification citoyen | Notification créée |

### Scénario 2.4 - Envoi de rappel (Agent BO)
| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Ouvrir un courrier en attente | |
| 2 | Cliquer "Envoyer un rappel" | |
| 3 | Confirmer | ✅ Rappel envoyé au chef de service |
| 4 | Vérifier historique | Action "Rappel" enregistrée |

---

## 🧠 EPIC 3 : Intelligence Artificielle

### Scénario 3.1 - Suggestion IA (Urbanisme)
| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Connexion Agent BO ou Admin | |
| 2 | Nouveau Courrier | |
| 3 | Objet: `Demande de permis de construction` | |
| 4 | Contenu: `Construction d'un immeuble de 3 étages` | |
| 5 | Cliquer "🤖 Analyser" | |
| **Résultat** | | ✅ Service suggéré: **Service Technique** |
| | | ✅ Catégorie: Urbanisme |
| | | ✅ Mots-clés: permis, construction, immeuble |
| | | ✅ Confiance: 70%+ |

### Scénario 3.2 - Suggestion IA (Social)
| Objet | Contenu | Résultat attendu |
|-------|---------|------------------|
| `Demande d'aide sociale` | `Famille en difficulté, 3 enfants, père handicapé` | ✅ Service Social |
| **Mots-clés détectés** | aide, famille, handicap | Confiance: 80%+ |

### Scénario 3.3 - Suggestion IA (Environnement)
| Objet | Contenu | Résultat attendu |
|-------|---------|------------------|
| `Réclamation pollution` | `Odeurs nauséabondes, déchets dans la rue` | ✅ Service Environnement |
| **Mots-clés détectés** | pollution, déchet | Confiance: 75%+ |

### Scénario 3.4 - Suggestion IA (État civil - Arabe)
| Objet | Contenu | Résultat attendu |
|-------|---------|------------------|
| `Talab shahada wilaada` | `Certificat de naissance pour mon fils` | ✅ Affaires Générales |
| **Mots-clés détectés** | shahada, wilaada | Catégorie: Municipalité |

### Scénario 3.5 - Détection de priorité
| Contenu | Priorité détectée |
|---------|-------------------|
| `C'est urgent, situation de danger` | 🔴 Urgente |
| `Demande importante et prioritaire` | 🟠 Haute |
| `Simple demande d'information` | 🟢 Basse |
| `Demande standard` | ⚪ Normale |

---

## 🔔 Notifications & Rappels

### Scénario 4.1 - Notification après traitement
| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Chef de service traite un courrier | |
| 2 | Citoyen se connecte | |
| 3 | Icône 🔔 avec badge | Notification non lue |
| 4 | Menu → Notifications | Liste des notifications |
| 5 | Cliquer sur notification | ✅ Détail du courrier |

### Scénario 4.2 - Rappel automatique (simulation)
| Configuration | Délai | Action |
|---------------|-------|--------|
| Courrier normal | > 3 jours en attente | 📧 Rappel au chef de service |
| Courrier urgent | > 1 jour en attente | 📧 Rappel immédiat |
| Blocage prolongé | > 7 jours | 🚨 Escalade au Secrétaire Général |

---

## 👥 Gestion Utilisateurs (Admin)

### Scénario 5.1 - Créer un utilisateur
| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Menu → Utilisateurs | Liste des utilisateurs |
| 2 | Cliquer "+ Nouvel utilisateur" | Modal création |
| 3 | Prénom: `Fatma` | |
| 4 | Nom: `Trabelsi` | |
| 5 | Email: `fatma@gouvernorat.tn` | |
| 6 | Rôle: `Chef de Service` | |
| 7 | Service: `Service Social` | |
| 8 | Cliquer "Créer" | ✅ Utilisateur créé |

### Scénario 5.2 - Modifier un rôle
| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Cliquer "Modifier" sur un utilisateur | Modal modification |
| 2 | Changer rôle → `Secrétaire Général` | |
| 3 | Enregistrer | ✅ Rôle mis à jour |

---

## 📊 Dashboard

### Scénario 6.1 - Statistiques Admin
| Élément | Vérification |
|---------|--------------|
| Total courriers | Nombre affiché |
| En attente | Compteur courriers non traités |
| Traités | Compteur courriers terminés |
| Urgents | Badge rouge si > 0 |
| Courriers récents | Liste des 5 derniers |

---

## 🔍 Suivi Public

### Scénario 7.1 - Suivi par référence
| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Aller sur http://localhost:3000/suivi | Page de suivi |
| 2 | Entrer référence: `BO-2025-00001` | |
| 3 | Cliquer "Rechercher" | |
| 4 | Vérifier résultat | ✅ Statut actuel affiché |
| | | ✅ Timeline du courrier |

---

## ✅ Checklist de validation

- [ ] Connexion/Déconnexion fonctionnelle
- [ ] Inscription citoyen
- [ ] Création de courrier
- [ ] Upload de fichier
- [ ] Affectation au service
- [ ] Traitement du courrier
- [ ] Notifications in-app
- [ ] Suggestion IA fonctionnelle
- [ ] Gestion utilisateurs (Admin)
- [ ] Gestion services (Admin)
- [ ] Suivi public par référence
- [ ] Dashboard avec statistiques

---

## 🔑 Comptes de Test

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | admin@gouvernorat-monastir.tn | admin123 |
| Agent BO | agent@gouvernorat-monastir.tn | agent123 |
| Chef Service | chef@gouvernorat-monastir.tn | chef123 |
| Citoyen | citoyen@example.com | citoyen123 |
