const { Op } = require('sequelize');
const { Courrier, User, Service, Notification, CourrierHistory } = require('../models');
const { sendEmail } = require('./emailService');

// Configuration des délais (en jours) - MODE TEST: délais réduits à 0
const DELAIS = {
  RAPPEL_NORMAL: 0,      // Rappel immédiat (prod: 3 jours)
  RAPPEL_URGENT: 0,      // Rappel immédiat (prod: 1 jour)
  ESCALADE: 0,           // Escalade immédiate (prod: 7 jours)
  ESCALADE_URGENT: 0     // Escalade immédiate (prod: 3 jours)
};

// Créer une notification
const createNotification = async (userId, type, titre, message, courrierId) => {
  return await Notification.create({
    userId, type, titre, message, courrierId
  });
};

// Vérifier et envoyer les rappels automatiques
const checkAndSendReminders = async () => {
  console.log('🔔 Vérification des rappels automatiques...');

  try {
    // Trouver les courriers en attente (affecté, en_cours)
    const courriersEnAttente = await Courrier.findAll({
      where: {
        status: { [Op.in]: ['affecte', 'en_cours'] }
      },
      include: [
        { model: Service, as: 'serviceDestinataire' },
        { model: User, as: 'expediteur' }
      ]
    });

    console.log(`📋 ${courriersEnAttente.length} courrier(s) en attente trouvé(s)`);

    const now = new Date();
    let rappelsEnvoyes = 0;
    let escalades = 0;

    for (const courrier of courriersEnAttente) {
      const dateAffectation = new Date(courrier.updatedAt);
      const joursAttente = Math.floor((now - dateAffectation) / (1000 * 60 * 60 * 24));

      console.log(`  - ${courrier.reference}: ${joursAttente} jour(s) d'attente, priorité: ${courrier.priorite}`);

      const delaiRappel = courrier.priorite === 'urgente' ? DELAIS.RAPPEL_URGENT : DELAIS.RAPPEL_NORMAL;
      const delaiEscalade = courrier.priorite === 'urgente' ? DELAIS.ESCALADE_URGENT : DELAIS.ESCALADE;

      // Vérifier si escalade nécessaire
      if (joursAttente >= delaiEscalade) {
        await handleEscalade(courrier, joursAttente);
        escalades++;
      }
      // Vérifier si rappel nécessaire
      else if (joursAttente >= delaiRappel) {
        await handleRappel(courrier, joursAttente);
        rappelsEnvoyes++;
      }
    }

    console.log(`✅ Rappels: ${rappelsEnvoyes}, Escalades: ${escalades}`);
    return { rappels: rappelsEnvoyes, escalades };

  } catch (error) {
    console.error('❌ Erreur rappels automatiques:', error.message);
    throw error;
  }
};

// Gérer un rappel
const handleRappel = async (courrier, joursAttente) => {
  // Trouver le chef du service
  const service = courrier.serviceDestinataire;
  if (!service || !service.chefId) {
    console.log(`⚠️ Pas de chef pour le service du courrier ${courrier.reference}`);
    return;
  }

  const chef = await User.findByPk(service.chefId);
  if (!chef) {
    console.log(`⚠️ Chef non trouvé pour le service ${service.name}`);
    return;
  }

  // Créer notification
  await createNotification(
    chef.id,
    'rappel',
    `⏰ Rappel: Courrier en attente`,
    `Le courrier ${courrier.reference} est en attente depuis ${joursAttente} jours`,
    courrier.id
  );

  // Envoyer email
  await sendEmail(chef.email, 'rappel', {
    id: courrier.id,
    reference: courrier.reference,
    objet: courrier.objet,
    joursAttente
  });

  // Ajouter à l'historique
  await CourrierHistory.create({
    courrierId: courrier.id,
    userId: chef.id,
    action: 'rappel',
    ancienStatus: courrier.status,
    nouveauStatus: courrier.status,
    commentaire: `Rappel automatique envoyé (${joursAttente} jours d'attente)`
  });

  console.log(`📧 Rappel envoyé pour ${courrier.reference} à ${chef.email}`);
};

// Gérer une escalade vers le Secrétaire Général
const handleEscalade = async (courrier, joursAttente) => {
  // Trouver le Secrétaire Général
  const secretaireGeneral = await User.findOne({
    where: { role: 'secretaire_general', isActive: true }
  });

  if (!secretaireGeneral) {
    console.log('⚠️ Aucun Secrétaire Général trouvé pour escalade');
    return;
  }

  // Créer notification pour le Secrétaire Général
  await createNotification(
    secretaireGeneral.id,
    'urgence',
    `🚨 ESCALADE: Courrier bloqué`,
    `Le courrier ${courrier.reference} est bloqué depuis ${joursAttente} jours au service ${courrier.serviceDestinataire?.name}`,
    courrier.id
  );

  // Envoyer email d'escalade
  await sendEmail(secretaireGeneral.email, 'escalade', {
    id: courrier.id,
    reference: courrier.reference,
    objet: courrier.objet,
    serviceName: courrier.serviceDestinataire?.name,
    status: courrier.status,
    joursAttente
  });

  // Notifier aussi le chef de service
  const service = courrier.serviceDestinataire;
  if (service && service.chefId) {
    const chef = await User.findByPk(service.chefId);
    if (chef) {
      await createNotification(
        chef.id,
        'urgence',
        `🚨 Courrier escaladé au Secrétaire Général`,
        `Le courrier ${courrier.reference} a été escaladé suite au dépassement du délai`,
        courrier.id
      );
    }
  }

  // Ajouter à l'historique
  await CourrierHistory.create({
    courrierId: courrier.id,
    userId: secretaireGeneral.id,
    action: 'rappel',
    ancienStatus: courrier.status,
    nouveauStatus: courrier.status,
    commentaire: `⚠️ ESCALADE automatique vers Secrétaire Général (${joursAttente} jours de blocage)`,
    metadata: { escalade: true, joursAttente }
  });

  console.log(`🚨 Escalade pour ${courrier.reference} vers ${secretaireGeneral.email}`);
};

// Notifier le citoyen après traitement
const notifyCitizenOnComplete = async (courrier) => {
  if (!courrier.expediteurId) return;

  const citoyen = await User.findByPk(courrier.expediteurId);
  if (!citoyen) return;

  // Notification in-app
  await createNotification(
    citoyen.id,
    'traitement',
    `✅ Votre demande a été traitée`,
    `Le courrier ${courrier.reference} a été traité. Consultez la réponse.`,
    courrier.id
  );

  // Email
  await sendEmail(citoyen.email, 'courrierTraite', {
    id: courrier.id,
    reference: courrier.reference,
    objet: courrier.objet,
    reponse: courrier.reponse
  });

  console.log(`📧 Notification citoyen envoyée pour ${courrier.reference}`);
};

module.exports = {
  checkAndSendReminders,
  handleRappel,
  handleEscalade,
  notifyCitizenOnComplete,
  DELAIS
};
