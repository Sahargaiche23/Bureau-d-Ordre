const { Service } = require('../models');

// Dictionnaire de mots-clés par catégorie (FR + AR)
const KEYWORDS_CATEGORIES = {
  urbanisme: [
    // Français
    'permis', 'construction', 'bâtiment', 'terrain', 'lotissement', 'plan', 'architecture', 
    'travaux', 'démolition', 'urbanisme', 'immeuble', 'facade', 'etage', 'renovation',
    // Arabe translittéré
    'rkhsa', 'bina', 'ardhiya', 'tasrih', 'taswir'
  ],
  social: [
    // Français
    'aide', 'social', 'famille', 'handicap', 'allocation', 'pension', 'assistance', 
    'pauvreté', 'logement social', 'solidarité', 'veuve', 'orphelin', 'indigent', 'secours',
    'maladie', 'invalidité', 'retraite', 'vieillesse',
    // Arabe translittéré
    'mosaada', 'ijtimai', 'aaila', 'moaak', 'marda'
  ],
  technique: [
    // Français - Infrastructure / domaine public
    'route', 'infrastructure', 'voirie', 'éclairage', 'assainissement', 'eau', 
    'électricité', 'maintenance', 'réparation', 'technique', 'trottoir', 'chaussée',
    'égout', 'canalisation', 'réseau', 'pont', 'tunnel',
    // Arabe translittéré
    'tariq', 'inara', 'maa', 'kahraba', 'taswiya'
  ],
  environnement: [
    // Français
    'environnement', 'pollution', 'déchet', 'vert', 'arbre', 'parc', 'jardin', 
    'écologie', 'recyclage', 'propreté', 'ordures', 'nettoyage', 'espaces verts',
    // Arabe translittéré
    'bia', 'talawoth', 'nifayat', 'shajar', 'hadika'
  ],
  economique: [
    // Français
    'commerce', 'entreprise', 'investissement', 'licence', 'marché', 'économie', 
    'emploi', 'formation', 'subvention', 'société', 'patente', 'registre',
    // Arabe translittéré
    'tijara', 'shariqa', 'istithmar', 'souq', 'amal'
  ],
  rh: [
    // Français - Ressources Humaines
    'recrutement', 'emploi', 'poste', 'candidature', 'mutation', 'promotion', 
    'salaire', 'congé', 'retraite', 'carrière', 'fonctionnaire', 'stage',
    // Arabe translittéré
    'tawdhif', 'wadhifa', 'ratib', 'otla', 'takaaod'
  ],
  permis: [
    // Français - Permis / Autorisation
    'permis', 'autorisation', 'licence', 'agrément', 'habilitation', 'certification',
    'visa', 'accréditation', 'homologation', 'dérogation',
    // Arabe translittéré
    'rkhsa', 'idhn', 'tasrih', 'moafaka'
  ],
  municipalite: [
    // Français - Municipalité
    'état civil', 'naissance', 'décès', 'mariage', 'divorce', 'nationalité',
    'résidence', 'domicile', 'certificat', 'extrait', 'copie', 'légalisation',
    // Arabe translittéré
    'halat madaniya', 'wilaada', 'wafaat', 'zawaj', 'talak', 'jinsiya'
  ],
  general: [
    'attestation', 'certificat', 'demande', 'information', 'renseignement', 
    'document', 'administratif', 'légalisation', 'réclamation', 'plainte',
    // Arabe translittéré
    'shahada', 'wathiqa', 'talab', 'maaluma', 'shakwa'
  ]
};

// Priorités par mots-clés (FR + AR)
const PRIORITY_KEYWORDS = {
  urgente: [
    'urgent', 'urgence', 'immédiat', 'danger', 'sécurité', 'accident', 'sinistre', 
    'catastrophe', 'critique', 'vital', 'incendie', 'inondation',
    // Arabe
    'aaajil', 'khatar', 'tawari'
  ],
  haute: [
    'important', 'prioritaire', 'rapide', 'délai court', 'pressé', 'nécessaire',
    // Arabe
    'mohim', 'daroori'
  ],
  basse: [
    'information', 'renseignement', 'question', 'consultation', 'conseil',
    // Arabe
    'istifsar', 'sual'
  ]
};

// Extraction des mots-clés du texte
const extractKeywords = (text) => {
  if (!text) return [];
  
  // Normaliser le texte
  const normalizedText = text.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Enlever les accents
    .replace(/[^\w\s]/g, ' '); // Enlever la ponctuation

  const words = normalizedText.split(/\s+/).filter(w => w.length > 2);
  
  // Trouver les mots-clés correspondants
  const foundKeywords = [];
  
  Object.entries(KEYWORDS_CATEGORIES).forEach(([category, keywords]) => {
    keywords.forEach(keyword => {
      if (normalizedText.includes(keyword.toLowerCase())) {
        foundKeywords.push({ keyword, category, score: 1 });
      }
    });
  });

  // Vérifier les mots partiels
  words.forEach(word => {
    Object.entries(KEYWORDS_CATEGORIES).forEach(([category, keywords]) => {
      keywords.forEach(keyword => {
        if (keyword.includes(word) || word.includes(keyword)) {
          const existing = foundKeywords.find(k => k.keyword === keyword);
          if (!existing) {
            foundKeywords.push({ keyword, category, score: 0.5 });
          }
        }
      });
    });
  });

  return foundKeywords;
};

// Détecter la priorité automatiquement
const detectPriority = (text) => {
  if (!text) return 'normale';
  
  const normalizedText = text.toLowerCase();
  
  for (const [priority, keywords] of Object.entries(PRIORITY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (normalizedText.includes(keyword)) {
        return priority;
      }
    }
  }
  
  return 'normale';
};

// Suggérer le service destinataire
const suggestService = async (objet, contenu) => {
  const fullText = `${objet} ${contenu}`;
  const keywords = extractKeywords(fullText);
  
  if (keywords.length === 0) {
    return { service: null, confidence: 0, keywords: [], reason: 'Aucun mot-clé détecté' };
  }

  // Compter les scores par catégorie
  const categoryScores = {};
  keywords.forEach(({ category, score }) => {
    categoryScores[category] = (categoryScores[category] || 0) + score;
  });

  // Trouver la catégorie dominante
  const topCategory = Object.entries(categoryScores)
    .sort((a, b) => b[1] - a[1])[0];

  if (!topCategory) {
    return { service: null, confidence: 0, keywords: [], reason: 'Catégorie non identifiée' };
  }

  // Mapper les catégories aux codes de service
  const categoryToServiceCode = {
    urbanisme: 'ST',        // Service Technique
    technique: 'ST',        // Service Technique  
    social: 'SS',           // Service Social
    environnement: 'ENV',   // Service Environnement
    economique: 'SE',       // Service Économique
    rh: 'SAG',              // Affaires Générales (RH)
    permis: 'ST',           // Service Technique (permis)
    municipalite: 'SAG',    // Affaires Générales (état civil)
    general: 'SAG'          // Affaires Générales
  };
  
  // Labels pour l'affichage
  const categoryLabels = {
    urbanisme: 'Urbanisme',
    technique: 'Infrastructure / Domaine public',
    social: 'Affaires sociales',
    environnement: 'Environnement',
    economique: 'Économie / Commerce',
    rh: 'Ressources Humaines',
    permis: 'Permis / Autorisation',
    municipalite: 'Municipalité / État civil',
    general: 'Affaires générales'
  };

  const serviceCode = categoryToServiceCode[topCategory[0]] || 'SAG';
  
  // Trouver le service dans la base de données
  const service = await Service.findOne({ where: { code: serviceCode, isActive: true } });
  
  // Calculer le score de confiance (0-100)
  const maxPossibleScore = keywords.length;
  const confidence = Math.min(100, Math.round((topCategory[1] / Math.max(maxPossibleScore, 1)) * 100));

  return {
    service,
    serviceId: service?.id,
    confidence,
    category: topCategory[0],
    categoryLabel: categoryLabels[topCategory[0]] || topCategory[0],
    keywords: keywords.map(k => k.keyword),
    reason: `Type de demande: ${categoryLabels[topCategory[0]] || topCategory[0]} (${keywords.length} mots-clés détectés)`
  };
};

// Analyser un courrier complet
const analyzeCourrier = async (objet, contenu) => {
  const suggestion = await suggestService(objet, contenu);
  const priority = detectPriority(`${objet} ${contenu}`);
  const keywords = extractKeywords(`${objet} ${contenu}`);

  return {
    suggestion,
    detectedPriority: priority,
    keywords: [...new Set(keywords.map(k => k.keyword))].slice(0, 10),
    analysis: {
      hasKeywords: keywords.length > 0,
      confidence: suggestion.confidence,
      category: suggestion.category
    }
  };
};

module.exports = {
  extractKeywords,
  detectPriority,
  suggestService,
  analyzeCourrier,
  KEYWORDS_CATEGORIES,
  PRIORITY_KEYWORDS
};
