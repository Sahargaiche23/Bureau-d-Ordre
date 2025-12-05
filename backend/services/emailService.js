const nodemailer = require('nodemailer');

// Configure transporter (use environment variables in production)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Email templates
const templates = {
  nouveauCourrier: (data) => ({
    subject: `📬 Nouveau courrier affecté - ${data.reference}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1e40af; color: white; padding: 20px; text-align: center;">
          <h1>Bureau d'Ordre - Gouvernorat de Monastir</h1>
        </div>
        <div style="padding: 20px; background: #f3f4f6;">
          <h2>Nouveau courrier affecté à votre service</h2>
          <p><strong>Référence:</strong> ${data.reference}</p>
          <p><strong>Objet:</strong> ${data.objet}</p>
          <p><strong>Priorité:</strong> ${data.priorite}</p>
          <p><strong>Date limite:</strong> ${data.dateEcheance || 'Non spécifiée'}</p>
          <a href="${process.env.FRONTEND_URL}/courriers/${data.id}" 
             style="display: inline-block; background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 16px;">
            Voir le courrier
          </a>
        </div>
      </div>
    `
  }),

  rappel: (data) => ({
    subject: `🔔 Rappel: Courrier en attente - ${data.reference}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #f59e0b; color: white; padding: 20px; text-align: center;">
          <h1>⚠️ Rappel - Action requise</h1>
        </div>
        <div style="padding: 20px; background: #f3f4f6;">
          <h2>Un courrier nécessite votre attention</h2>
          <p><strong>Référence:</strong> ${data.reference}</p>
          <p><strong>Objet:</strong> ${data.objet}</p>
          <p><strong>En attente depuis:</strong> ${data.joursAttente} jours</p>
          <p style="color: #dc2626;"><strong>Ce courrier dépasse le délai de traitement!</strong></p>
          <a href="${process.env.FRONTEND_URL}/courriers/${data.id}" 
             style="display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 16px;">
            Traiter maintenant
          </a>
        </div>
      </div>
    `
  }),

  escalade: (data) => ({
    subject: `🚨 ESCALADE: Courrier bloqué - ${data.reference}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #dc2626; color: white; padding: 20px; text-align: center;">
          <h1>🚨 ESCALADE - Intervention requise</h1>
        </div>
        <div style="padding: 20px; background: #f3f4f6;">
          <h2>Un courrier est bloqué depuis trop longtemps</h2>
          <p><strong>Référence:</strong> ${data.reference}</p>
          <p><strong>Objet:</strong> ${data.objet}</p>
          <p><strong>Service:</strong> ${data.serviceName}</p>
          <p><strong>Bloqué depuis:</strong> ${data.joursAttente} jours</p>
          <p><strong>Statut:</strong> ${data.status}</p>
          <a href="${process.env.FRONTEND_URL}/courriers/${data.id}" 
             style="display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 16px;">
            Intervenir
          </a>
        </div>
      </div>
    `
  }),

  courrierTraite: (data) => ({
    subject: `✅ Votre demande a été traitée - ${data.reference}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #059669; color: white; padding: 20px; text-align: center;">
          <h1>✅ Demande Traitée</h1>
        </div>
        <div style="padding: 20px; background: #f3f4f6;">
          <h2>Bonne nouvelle! Votre demande a été traitée.</h2>
          <p><strong>Référence:</strong> ${data.reference}</p>
          <p><strong>Objet:</strong> ${data.objet}</p>
          <p><strong>Réponse:</strong></p>
          <div style="background: white; padding: 16px; border-radius: 8px; margin: 16px 0;">
            ${data.reponse || 'Veuillez consulter votre espace pour plus de détails.'}
          </div>
          <a href="${process.env.FRONTEND_URL}/courriers/${data.id}" 
             style="display: inline-block; background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 16px;">
            Consulter le détail
          </a>
        </div>
      </div>
    `
  })
};

// Send email function
const sendEmail = async (to, templateName, data) => {
  try {
    if (!process.env.SMTP_USER) {
      console.log(`📧 [EMAIL SIMULATION] To: ${to}, Template: ${templateName}`);
      console.log(`   Subject: ${templates[templateName](data).subject}`);
      return { success: true, simulated: true };
    }

    const template = templates[templateName](data);
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Bureau d\'Ordre" <noreply@gouvernorat-monastir.tn>',
      to,
      subject: template.subject,
      html: template.html
    });

    console.log(`📧 Email sent: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email error:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = { sendEmail, templates };
