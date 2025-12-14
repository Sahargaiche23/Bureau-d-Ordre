const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

/**
 * Service de génération de PDF professionnel pour les réponses aux courriers
 * Design moderne, clair et innovant
 */
class PDFService {
  
  // Couleurs du thème
  static colors = {
    primary: '#0369a1',      // Bleu professionnel
    primaryDark: '#075985',  // Bleu foncé
    secondary: '#0891b2',    // Cyan
    success: '#059669',      // Vert
    successLight: '#d1fae5', // Vert clair
    gold: '#b45309',         // Or/Bronze
    text: '#1e293b',         // Texte principal
    textLight: '#64748b',    // Texte secondaire
    border: '#cbd5e1',       // Bordures
    background: '#f8fafc',   // Fond
    white: '#ffffff'
  };

  /**
   * Génère un PDF de réponse pour un courrier
   */
  static generateReponsePDF(courrier, lang = 'fr') {
    const isArabic = lang === 'ar';
    const c = this.colors;
    
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 40, bottom: 40, left: 50, right: 50 },
      info: {
        Title: isArabic ? 'رد رسمي - ولاية المنستير' : 'Réponse Officielle - Gouvernorat de Monastir',
        Author: 'Bureau d\'Ordre Digitalisé',
        Subject: courrier.reference,
        Creator: 'Système Bureau d\'Ordre'
      }
    });

    // Register Arabic font
    const arabicFontPath = path.join(__dirname, '..', 'fonts', 'Amiri-Regular.ttf');
    const hasArabicFont = fs.existsSync(arabicFontPath);
    if (hasArabicFont) {
      doc.registerFont('Arabic', arabicFontPath);
    }

    // Traductions
    const t = {
      fr: {
        republic: 'RÉPUBLIQUE TUNISIENNE',
        ministry: 'Ministère de l\'Intérieur',
        governorate: 'GOUVERNORAT DE MONASTIR',
        bureau: 'Bureau d\'Ordre Digitalisé',
        docTitle: 'RÉPONSE OFFICIELLE',
        docNumber: 'N° Document',
        date: 'Date d\'émission',
        ref: 'Référence',
        subject: 'Objet',
        from: 'Demandeur',
        email: 'Email',
        service: 'Service traitant',
        status: 'Statut',
        dates: 'Chronologie',
        received: 'Réception',
        processed: 'Traitement',
        requestContent: 'CONTENU DE LA DEMANDE',
        officialResponse: 'RÉPONSE OFFICIELLE',
        processedBy: 'Agent responsable',
        signature: 'Signature & Cachet',
        footer1: 'Document officiel généré par le système Bureau d\'Ordre Digitalisé',
        footer2: 'Gouvernorat de Monastir - Tous droits réservés',
        qrNote: 'Scannez pour vérifier l\'authenticité',
        statusLabels: {
          recu: 'Reçu', enregistre: 'Enregistré', affecte: 'Affecté',
          en_cours: 'En cours', traite: 'Traité', transmis: 'Transmis',
          archive: 'Archivé', rejete: 'Rejeté'
        }
      },
      ar: {
        republic: 'الجمهورية التونسية',
        ministry: 'وزارة الداخلية',
        governorate: 'ولاية المنستير',
        bureau: 'مكتب الضبط الرقمي',
        docTitle: 'رد رسمي',
        docNumber: 'رقم الوثيقة',
        date: 'تاريخ الإصدار',
        ref: 'المرجع',
        subject: 'الموضوع',
        from: 'مقدم الطلب',
        email: 'البريد الإلكتروني',
        service: 'المصلحة المعالجة',
        status: 'الحالة',
        dates: 'التسلسل الزمني',
        received: 'الاستلام',
        processed: 'المعالجة',
        requestContent: 'محتوى الطلب',
        officialResponse: 'الرد الرسمي',
        processedBy: 'الموظف المسؤول',
        signature: 'التوقيع والختم',
        footer1: 'وثيقة رسمية صادرة عن نظام مكتب الضبط الرقمي',
        footer2: 'ولاية المنستير - جميع الحقوق محفوظة',
        qrNote: 'امسح للتحقق من الأصالة',
        statusLabels: {
          recu: 'مستلم', enregistre: 'مسجل', affecte: 'محال',
          en_cours: 'قيد المعالجة', traite: 'معالج', transmis: 'محول',
          archive: 'مؤرشف', rejete: 'مرفوض'
        }
      }
    };

    const labels = t[lang] || t.fr;
    const align = isArabic ? 'right' : 'left';
    const alignOpp = isArabic ? 'left' : 'right';

    // Font helper
    const setFont = (bold = false) => {
      if (isArabic && hasArabicFont) {
        doc.font('Arabic');
      } else {
        doc.font(bold ? 'Helvetica-Bold' : 'Helvetica');
      }
    };

    // ==================== HEADER ====================
    // Top decorative bar
    doc.rect(0, 0, 595, 8).fill(c.primary);
    doc.rect(0, 8, 595, 3).fill(c.secondary);
    
    // Header background
    doc.rect(0, 11, 595, 95).fill(c.background);
    
    // Republic & Ministry
    setFont();
    doc.fontSize(9).fillColor(c.textLight);
    doc.text(labels.republic, 50, 25, { width: 495, align: 'center', features: ['rtla'] });
    doc.text(labels.ministry, 50, 38, { width: 495, align: 'center', features: ['rtla'] });
    
    // Governorate Title
    setFont(true);
    doc.fontSize(22).fillColor(c.primary);
    doc.text(labels.governorate, 50, 55, { width: 495, align: 'center', features: ['rtla'] });
    
    // Bureau subtitle
    setFont();
    doc.fontSize(11).fillColor(c.secondary);
    doc.text(labels.bureau, 50, 82, { width: 495, align: 'center', features: ['rtla'] });
    
    // Decorative line under header
    doc.moveTo(100, 105).lineTo(495, 105).strokeColor(c.primary).lineWidth(2).stroke();
    doc.moveTo(150, 109).lineTo(445, 109).strokeColor(c.secondary).lineWidth(1).stroke();

    // ==================== DOCUMENT TITLE ====================
    doc.y = 125;
    
    // Title box
    const titleBoxY = doc.y;
    doc.roundedRect(150, titleBoxY, 295, 35, 5).fill(c.primary);
    
    setFont(true);
    doc.fontSize(16).fillColor(c.white);
    doc.text(labels.docTitle, 150, titleBoxY + 10, { width: 295, align: 'center', features: ['rtla'] });
    
    doc.y = titleBoxY + 50;

    // ==================== REFERENCE BOX ====================
    const refBoxY = doc.y;
    doc.roundedRect(50, refBoxY, 495, 45, 5).fillAndStroke(c.background, c.border);
    
    setFont(true);
    doc.fontSize(10).fillColor(c.text);
    
    // Reference number
    const refX = isArabic ? 300 : 60;
    doc.text(`${labels.ref}:`, refX, refBoxY + 8, { features: ['rtla'] });
    setFont();
    doc.fontSize(12).fillColor(c.primary);
    doc.text(courrier.reference, refX, refBoxY + 22, { features: ['rtla'] });
    
    // Date
    const dateX = isArabic ? 60 : 400;
    setFont(true);
    doc.fontSize(10).fillColor(c.text);
    doc.text(`${labels.date}:`, dateX, refBoxY + 8, { features: ['rtla'] });
    setFont();
    doc.fontSize(11).fillColor(c.textLight);
    
    // Format today's date properly
    const now = new Date();
    const monthsFr = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
    const monthsAr = ['جانفي', 'فيفري', 'مارس', 'أفريل', 'ماي', 'جوان', 'جويلية', 'أوت', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    
    if (isArabic) {
      // For Arabic: render year, month, day separately to avoid mixing issues
      // Format: 2025 ديسمبر 7
      doc.font('Helvetica').fontSize(11).fillColor(c.textLight);
      doc.text(`${now.getFullYear()}`, dateX, refBoxY + 22, { continued: true });
      if (hasArabicFont) doc.font('Arabic');
      doc.text(` ${monthsAr[now.getMonth()]} `, { continued: true });
      doc.font('Helvetica');
      doc.text(`${now.getDate()}`);
    } else {
      const today = `${now.getDate()} ${monthsFr[now.getMonth()]} ${now.getFullYear()}`;
      doc.text(today, dateX, refBoxY + 22);
    }

    doc.y = refBoxY + 60;

    // ==================== INFO GRID ====================
    const gridY = doc.y;
    const gridHeight = 100;
    
    // Left/Right column based on language
    const col1X = 50;
    const col2X = 300;
    const colWidth = 220;

    // Column 1 - Demandeur info
    doc.roundedRect(col1X, gridY, 240, gridHeight, 5).fillAndStroke('#f0f9ff', c.border);
    
    setFont(true);
    doc.fontSize(10).fillColor(c.primary);
    doc.text(labels.from, col1X + 15, gridY + 10, { features: ['rtla'] });
    
    const citizenName = courrier.expediteur 
      ? `${courrier.expediteur.firstName} ${courrier.expediteur.lastName}`
      : courrier.expediteurExterne || '-';
    
    setFont();
    doc.fontSize(11).fillColor(c.text);
    doc.text(citizenName, col1X + 15, gridY + 28, { width: 210, features: ['rtla'] });
    
    if (courrier.expediteur?.email) {
      doc.fontSize(9).fillColor(c.textLight);
      doc.text(courrier.expediteur.email, col1X + 15, gridY + 45, { features: ['rtla'] });
    }
    
    // Subject
    setFont(true);
    doc.fontSize(10).fillColor(c.primary);
    doc.text(labels.subject, col1X + 15, gridY + 62, { features: ['rtla'] });
    setFont();
    doc.fontSize(10).fillColor(c.text);
    doc.text(courrier.objet || '-', col1X + 15, gridY + 78, { width: 210, features: ['rtla'] });

    // Column 2 - Service & Status
    doc.roundedRect(col2X, gridY, 245, gridHeight, 5).fillAndStroke('#f0fdf4', c.border);
    
    setFont(true);
    doc.fontSize(10).fillColor(c.success);
    doc.text(labels.service, col2X + 15, gridY + 10, { features: ['rtla'] });
    
    setFont();
    doc.fontSize(11).fillColor(c.text);
    doc.text(courrier.serviceDestinataire?.name || '-', col2X + 15, gridY + 28, { width: 215, features: ['rtla'] });
    
    // Status badge
    setFont(true);
    doc.fontSize(10).fillColor(c.success);
    doc.text(labels.status, col2X + 15, gridY + 50, { features: ['rtla'] });
    
    const statusText = labels.statusLabels[courrier.status] || courrier.status;
    doc.roundedRect(col2X + 15, gridY + 65, 80, 22, 3).fill(c.success);
    setFont();
    doc.fontSize(10).fillColor(c.white);
    doc.text(statusText, col2X + 20, gridY + 71, { width: 70, align: 'center', features: ['rtla'] });

    doc.y = gridY + gridHeight + 15;

    // ==================== DATES LINE ====================
    const datesY = doc.y;
    doc.roundedRect(50, datesY, 495, 30, 3).fill('#fefce8');
    
    setFont();
    doc.fontSize(9).fillColor(c.gold);
    
    // Format dates properly (use French format for numbers to avoid RTL issues)
    const formatDate = (dateStr) => {
      if (!dateStr) return '-';
      const d = new Date(dateStr);
      const day = d.getDate();
      const month = d.getMonth() + 1;
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    };
    
    const receptionDate = formatDate(courrier.dateReception);
    const traitementDate = formatDate(courrier.dateTraitement);
    
    if (isArabic) {
      // For Arabic: put label after the date to avoid RTL number issues
      doc.font('Helvetica').text(receptionDate, 150, datesY + 10);
      setFont();
      doc.text(`:${labels.received}`, 70, datesY + 10, { features: ['rtla'] });
      doc.font('Helvetica').text('|', 280, datesY + 10);
      doc.font('Helvetica').text(traitementDate, 430, datesY + 10);
      setFont();
      doc.text(`:${labels.processed}`, 320, datesY + 10, { features: ['rtla'] });
    } else {
      doc.text(`${labels.received}: ${receptionDate}`, 70, datesY + 10);
      doc.text('|', 280, datesY + 10);
      doc.text(`${labels.processed}: ${traitementDate}`, 320, datesY + 10);
    }

    doc.y = datesY + 45;

    // ==================== REQUEST CONTENT ====================
    const contentY = doc.y;
    
    setFont(true);
    doc.fontSize(11).fillColor(c.primary);
    doc.text(labels.requestContent, 50, contentY, { align, features: ['rtla'] });
    
    doc.moveTo(50, contentY + 15).lineTo(250, contentY + 15).strokeColor(c.primary).lineWidth(1).stroke();
    
    setFont();
    doc.fontSize(10).fillColor(c.text);
    doc.text(courrier.contenu || '-', 50, contentY + 25, { 
      width: 495, 
      align: isArabic ? 'right' : 'justify',
      features: ['rtla']
    });

    doc.moveDown(2);

    // ==================== RESPONSE BOX ====================
    if (courrier.reponse) {
      const respY = doc.y;
      const respHeight = Math.max(100, Math.ceil(courrier.reponse.length / 70) * 15 + 60);
      
      // Green gradient-like box
      doc.roundedRect(50, respY, 495, respHeight, 8).fill(c.successLight);
      doc.roundedRect(50, respY, 495, respHeight, 8).strokeColor(c.success).lineWidth(2).stroke();
      
      // Response header bar
      doc.roundedRect(50, respY, 495, 28, 8).fill(c.success);
      doc.rect(50, respY + 20, 495, 10).fill(c.success);
      
      setFont(true);
      doc.fontSize(12).fillColor(c.white);
      doc.text(labels.officialResponse, 70, respY + 8, { width: 455, align, features: ['rtla'] });
      
      // Response content
      setFont();
      doc.fontSize(11).fillColor('#065f46');
      doc.text(courrier.reponse, 70, respY + 40, {
        width: 455,
        align: isArabic ? 'right' : 'justify',
        features: ['rtla']
      });

      doc.y = respY + respHeight + 15;
    }

    // ==================== PROCESSED BY ====================
    if (courrier.traiteur) {
      const sigY = doc.y;
      
      doc.roundedRect(350, sigY, 195, 50, 5).strokeColor(c.border).lineWidth(1).stroke();
      
      setFont(true);
      doc.fontSize(9).fillColor(c.textLight);
      doc.text(labels.processedBy, 360, sigY + 8, { features: ['rtla'] });
      
      setFont();
      doc.fontSize(11).fillColor(c.text);
      doc.text(`${courrier.traiteur.firstName} ${courrier.traiteur.lastName}`, 360, sigY + 25, { features: ['rtla'] });
      
      doc.fontSize(8).fillColor(c.textLight);
      doc.text(labels.signature, 360, sigY + 40, { features: ['rtla'] });
    }

    // ==================== FOOTER ====================
    const footerY = doc.page.height - 70;
    
    // Footer line
    doc.moveTo(50, footerY).lineTo(545, footerY).strokeColor(c.border).lineWidth(1).stroke();
    
    // Footer bars
    doc.rect(0, doc.page.height - 10, 595, 5).fill(c.secondary);
    doc.rect(0, doc.page.height - 5, 595, 5).fill(c.primary);
    
    setFont();
    doc.fontSize(8).fillColor(c.textLight);
    doc.text(labels.footer1, 50, footerY + 10, { width: 495, align: 'center', features: ['rtla'] });
    doc.text(labels.footer2, 50, footerY + 22, { width: 495, align: 'center', features: ['rtla'] });
    
    // Document ID
    doc.fontSize(7).fillColor(c.border);
    doc.text(`ID: ${courrier.id || courrier.reference}`, 50, footerY + 38, { width: 495, align: 'center' });

    return doc;
  }
}

module.exports = PDFService;
