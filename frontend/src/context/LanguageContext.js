import React, { createContext, useState, useContext, useEffect } from 'react';

// Traductions Français
const fr = {
  // Common
  common: {
    loading: 'Chargement...',
    save: 'Enregistrer',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    create: 'Créer',
    search: 'Rechercher',
    back: 'Retour',
    next: 'Suivant',
    previous: 'Précédent',
    yes: 'Oui',
    no: 'Non',
    actions: 'Actions',
    status: 'Statut',
    date: 'Date',
    download: 'Télécharger',
    downloadPDF: 'Télécharger PDF',
    all: 'Tous',
    filter: 'Filtrer',
    noData: 'Aucune donnée',
    error: 'Erreur',
    success: 'Succès',
  },
  // Auth
  auth: {
    login: 'Connexion',
    logout: 'Déconnexion',
    register: 'Inscription',
    email: 'Email',
    password: 'Mot de passe',
    confirmPassword: 'Confirmer le mot de passe',
    firstName: 'Prénom',
    lastName: 'Nom',
    phone: 'Téléphone',
    forgotPassword: 'Mot de passe oublié ?',
    noAccount: 'Pas encore de compte ?',
    haveAccount: 'Déjà un compte ?',
    loginButton: 'Se connecter',
    registerButton: 'S\'inscrire',
    welcomeBack: 'Bienvenue',
    loginSubtitle: 'Connectez-vous à votre compte',
    registerSubtitle: 'Créez votre compte citoyen',
  },
  // Navigation
  nav: {
    dashboard: 'Tableau de bord',
    courriers: 'Courriers',
    newCourrier: 'Nouveau Courrier',
    assistance: 'Assistance Vidéo',
    users: 'Utilisateurs',
    services: 'Services',
    notifications: 'Notifications',
    tracking: 'Suivi de Courrier',
  },
  // Roles
  roles: {
    admin: 'Administrateur',
    agent_bo: 'Agent Bureau d\'Ordre',
    chef_service: 'Chef de Service',
    secretaire_general: 'Secrétaire Général',
    citoyen: 'Citoyen',
  },
  // Courrier
  courrier: {
    reference: 'Référence',
    subject: 'Objet',
    content: 'Contenu',
    type: 'Type',
    priority: 'Priorité',
    service: 'Service',
    sender: 'Expéditeur',
    recipient: 'Destinataire',
    receptionDate: 'Date de réception',
    deadline: 'Échéance',
    processingDate: 'Date de traitement',
    response: 'Réponse',
    processedBy: 'Traité par',
    attachment: 'Pièce jointe',
    downloadFile: 'Télécharger le fichier',
    history: 'Historique',
    assign: 'Affecter',
    assignToService: 'Affecter au service',
    process: 'Traiter',
    processCourrier: 'Traiter le courrier',
    sendReminder: 'Envoyer rappel',
    yourResponse: 'Votre réponse...',
    validate: 'Valider',
    selectService: 'Sélectionner un service',
    aiAnalysis: 'Analyse IA',
    requestType: 'Type de demande',
    suggestedService: 'Service suggéré',
    detectedPriority: 'Priorité détectée',
    detectedKeywords: 'Mots-clés détectés',
    confidence: 'Confiance',
    notDetermined: 'Non déterminé',
    types: {
      entrant: 'Entrant',
      sortant: 'Sortant',
      interne: 'Interne',
    },
    priorities: {
      basse: 'Basse',
      normale: 'Normale',
      haute: 'Haute',
      urgente: 'Urgente',
    },
    statuses: {
      recu: 'Reçu',
      enregistre: 'Enregistré',
      affecte: 'Affecté',
      en_cours: 'En cours',
      traite: 'Traité',
      transmis: 'Transmis',
      archive: 'Archivé',
      rejete: 'Rejeté',
    },
  },
  // Tracking
  tracking: {
    title: 'Suivi de Courrier',
    subtitle: 'Gouvernorat de Monastir',
    placeholder: 'Entrez la référence (ex: BO-2024-00001)',
    searchButton: 'Rechercher',
    notFound: 'Courrier non trouvé. Vérifiez la référence.',
    inCharge: 'Service en charge',
    backToLogin: 'Retour à la connexion',
  },
  // Dashboard
  dashboard: {
    title: 'Tableau de bord',
    totalCourriers: 'Total Courriers',
    pending: 'En attente',
    processed: 'Traités',
    recentCourriers: 'Courriers récents',
    byService: 'Par service',
    statistics: 'Statistiques',
    welcome: 'Bienvenue',
  },
  // Notifications
  notifications: {
    title: 'Notifications',
    markAllRead: 'Tout marquer comme lu',
    noNotifications: 'Aucune notification',
    unread: 'Non lues',
    all: 'Toutes',
  },
  // Users
  users: {
    title: 'Gestion des Utilisateurs',
    addUser: 'Ajouter un utilisateur',
    editUser: 'Modifier l\'utilisateur',
    role: 'Rôle',
    active: 'Actif',
    inactive: 'Inactif',
    confirmDelete: 'Êtes-vous sûr de vouloir supprimer cet utilisateur ?',
  },
  // Services
  services: {
    title: 'Gestion des Services',
    addService: 'Ajouter un service',
    editService: 'Modifier le service',
    name: 'Nom du service',
    description: 'Description',
    chief: 'Chef de service',
    confirmDelete: 'Êtes-vous sûr de vouloir supprimer ce service ?',
  },
  // Video Assistance
  assistance: {
    title: 'Assistance Vidéo',
    requestAssistance: 'Demander une assistance',
    waitingList: 'En attente',
    inProgress: 'En cours',
    completed: 'Terminées',
    startCall: 'Démarrer l\'appel',
    endCall: 'Terminer l\'appel',
    rate: 'Noter',
    cancel: 'Annuler',
  },
  // Header
  header: {
    bureauOrdre: 'Bureau d\'Ordre',
    gouvernorat: 'Gouvernorat de Monastir',
  },
  // PDF
  pdf: {
    downloadFr: 'Télécharger PDF (Français)',
    downloadAr: 'Télécharger PDF (العربية)',
  },
  // Language
  language: {
    french: 'Français',
    arabic: 'العربية',
    switchLanguage: 'Changer de langue',
  },
  // History / Timeline
  history: {
    creation: 'Courrier créé',
    affectation: 'Affectation',
    affectedToService: 'Affecté au service',
    rappel: 'Rappel',
    reminderSent: 'Rappel envoyé',
    escalation: 'Escalade',
    escalationAuto: 'ESCALADE automatique vers',
    traitement: 'Traitement',
    treated: 'Traité',
    transmission: 'Transmission',
    archive: 'Archivage',
    rejection: 'Rejet',
    pendingProcessing: 'Courrier en attente de traitement',
    daysBlocked: 'jours de blocage',
    informations: 'Informations',
  },
  // Detail page
  detail: {
    sender: 'Expéditeur',
    informations: 'Informations',
    type: 'Type',
    priority: 'Priorité',
    receptionDate: 'Date de réception',
    service: 'Service',
    content: 'Contenu',
    email: 'Email',
    phone: 'Téléphone',
    name: 'Nom',
  },
};

// Traductions Arabe
const ar = {
  // Common
  common: {
    loading: 'جاري التحميل...',
    save: 'حفظ',
    cancel: 'إلغاء',
    delete: 'حذف',
    edit: 'تعديل',
    create: 'إنشاء',
    search: 'بحث',
    back: 'رجوع',
    next: 'التالي',
    previous: 'السابق',
    yes: 'نعم',
    no: 'لا',
    actions: 'إجراءات',
    status: 'الحالة',
    date: 'التاريخ',
    download: 'تحميل',
    downloadPDF: 'تحميل PDF',
    all: 'الكل',
    filter: 'تصفية',
    noData: 'لا توجد بيانات',
    error: 'خطأ',
    success: 'نجاح',
  },
  // Auth
  auth: {
    login: 'تسجيل الدخول',
    logout: 'تسجيل الخروج',
    register: 'التسجيل',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    confirmPassword: 'تأكيد كلمة المرور',
    firstName: 'الاسم',
    lastName: 'اللقب',
    phone: 'الهاتف',
    forgotPassword: 'نسيت كلمة المرور؟',
    noAccount: 'ليس لديك حساب؟',
    haveAccount: 'لديك حساب بالفعل؟',
    loginButton: 'دخول',
    registerButton: 'تسجيل',
    welcomeBack: 'مرحباً بك',
    loginSubtitle: 'سجل الدخول إلى حسابك',
    registerSubtitle: 'أنشئ حساب مواطن',
  },
  // Navigation
  nav: {
    dashboard: 'لوحة التحكم',
    courriers: 'المراسلات',
    newCourrier: 'مراسلة جديدة',
    assistance: 'المساعدة بالفيديو',
    users: 'المستخدمين',
    services: 'المصالح',
    notifications: 'الإشعارات',
    tracking: 'تتبع المراسلة',
  },
  // Roles
  roles: {
    admin: 'المسؤول',
    agent_bo: 'موظف مكتب الضبط',
    chef_service: 'رئيس المصلحة',
    secretaire_general: 'الكاتب العام',
    citoyen: 'مواطن',
  },
  // Courrier
  courrier: {
    reference: 'المرجع',
    subject: 'الموضوع',
    content: 'المحتوى',
    type: 'النوع',
    priority: 'الأولوية',
    service: 'المصلحة',
    sender: 'المرسل',
    recipient: 'المرسل إليه',
    receptionDate: 'تاريخ الاستلام',
    deadline: 'الأجل',
    processingDate: 'تاريخ المعالجة',
    response: 'الرد',
    processedBy: 'تمت المعالجة بواسطة',
    attachment: 'مرفق',
    downloadFile: 'تحميل الملف',
    history: 'السجل',
    assign: 'إحالة',
    assignToService: 'إحالة إلى المصلحة',
    process: 'معالجة',
    processCourrier: 'معالجة المراسلة',
    sendReminder: 'إرسال تذكير',
    yourResponse: 'ردك...',
    validate: 'تأكيد',
    selectService: 'اختر مصلحة',
    aiAnalysis: 'تحليل الذكاء الاصطناعي',
    requestType: 'نوع الطلب',
    suggestedService: 'المصلحة المقترحة',
    detectedPriority: 'الأولوية المكتشفة',
    detectedKeywords: 'الكلمات المفتاحية المكتشفة',
    confidence: 'الثقة',
    notDetermined: 'غير محدد',
    types: {
      entrant: 'وارد',
      sortant: 'صادر',
      interne: 'داخلي',
    },
    priorities: {
      basse: 'منخفضة',
      normale: 'عادية',
      haute: 'عالية',
      urgente: 'عاجلة',
    },
    statuses: {
      recu: 'مستلم',
      enregistre: 'مسجل',
      affecte: 'محال',
      en_cours: 'قيد المعالجة',
      traite: 'معالج',
      transmis: 'محول',
      archive: 'مؤرشف',
      rejete: 'مرفوض',
    },
  },
  // Tracking
  tracking: {
    title: 'تتبع المراسلة',
    subtitle: 'ولاية المنستير',
    placeholder: 'أدخل المرجع (مثال: BO-2024-00001)',
    searchButton: 'بحث',
    notFound: 'لم يتم العثور على المراسلة. تحقق من المرجع.',
    inCharge: 'المصلحة المكلفة',
    backToLogin: 'العودة لتسجيل الدخول',
  },
  // Dashboard
  dashboard: {
    title: 'لوحة التحكم',
    totalCourriers: 'إجمالي المراسلات',
    pending: 'قيد الانتظار',
    processed: 'معالجة',
    recentCourriers: 'المراسلات الأخيرة',
    byService: 'حسب المصلحة',
    statistics: 'الإحصائيات',
    welcome: 'مرحباً',
  },
  // Notifications
  notifications: {
    title: 'الإشعارات',
    markAllRead: 'تحديد الكل كمقروء',
    noNotifications: 'لا توجد إشعارات',
    unread: 'غير مقروءة',
    all: 'الكل',
  },
  // Users
  users: {
    title: 'إدارة المستخدمين',
    addUser: 'إضافة مستخدم',
    editUser: 'تعديل المستخدم',
    role: 'الدور',
    active: 'نشط',
    inactive: 'غير نشط',
    confirmDelete: 'هل أنت متأكد من حذف هذا المستخدم؟',
  },
  // Services
  services: {
    title: 'إدارة المصالح',
    addService: 'إضافة مصلحة',
    editService: 'تعديل المصلحة',
    name: 'اسم المصلحة',
    description: 'الوصف',
    chief: 'رئيس المصلحة',
    confirmDelete: 'هل أنت متأكد من حذف هذه المصلحة؟',
  },
  // Video Assistance
  assistance: {
    title: 'المساعدة بالفيديو',
    requestAssistance: 'طلب مساعدة',
    waitingList: 'قائمة الانتظار',
    inProgress: 'جارية',
    completed: 'مكتملة',
    startCall: 'بدء المكالمة',
    endCall: 'إنهاء المكالمة',
    rate: 'تقييم',
    cancel: 'إلغاء',
  },
  // Header
  header: {
    bureauOrdre: 'مكتب الضبط',
    gouvernorat: 'ولاية المنستير',
  },
  // PDF
  pdf: {
    downloadFr: 'تحميل PDF (Français)',
    downloadAr: 'تحميل PDF (العربية)',
  },
  // Language
  language: {
    french: 'Français',
    arabic: 'العربية',
    switchLanguage: 'تغيير اللغة',
  },
  // History / Timeline
  history: {
    creation: 'تم إنشاء المراسلة',
    affectation: 'الإحالة',
    affectedToService: 'تم الإحالة إلى المصلحة',
    rappel: 'تذكير',
    reminderSent: 'تم إرسال تذكير',
    escalation: 'تصعيد',
    escalationAuto: 'تصعيد تلقائي إلى',
    traitement: 'المعالجة',
    treated: 'تمت المعالجة',
    transmission: 'الإحالة',
    archive: 'الأرشفة',
    rejection: 'الرفض',
    pendingProcessing: 'مراسلة في انتظار المعالجة',
    daysBlocked: 'أيام من التوقف',
    informations: 'المعلومات',
  },
  // Detail page
  detail: {
    sender: 'المرسل',
    informations: 'المعلومات',
    type: 'النوع',
    priority: 'الأولوية',
    receptionDate: 'تاريخ الاستلام',
    service: 'المصلحة',
    content: 'المحتوى',
    email: 'البريد الإلكتروني',
    phone: 'الهاتف',
    name: 'الاسم',
  },
};

const translations = { fr, ar };

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'fr';
  });

  const [direction, setDirection] = useState(() => {
    const savedLang = localStorage.getItem('language') || 'fr';
    return savedLang === 'ar' ? 'rtl' : 'ltr';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    const newDirection = language === 'ar' ? 'rtl' : 'ltr';
    setDirection(newDirection);
    document.documentElement.dir = newDirection;
    document.documentElement.lang = language;
  }, [language]);

  const t = (key) => {
    // Handle undefined or null keys
    if (!key) return '';
    
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      if (value && value[k] !== undefined) {
        value = value[k];
      } else {
        // Fallback to French if key not found
        let fallback = translations.fr;
        for (const fk of keys) {
          if (fallback && fallback[fk] !== undefined) {
            fallback = fallback[fk];
          } else {
            return key; // Return key if not found in fallback
          }
        }
        return fallback;
      }
    }
    
    return value;
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'fr' ? 'ar' : 'fr');
  };

  const changeLanguage = (lang) => {
    if (lang === 'fr' || lang === 'ar') {
      setLanguage(lang);
    }
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      direction, 
      t, 
      toggleLanguage, 
      changeLanguage,
      isRTL: language === 'ar'
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
