// lib/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
const APP_NAME = process.env.APP_NAME || 'FiveUp';

interface SendVerificationEmailParams {
  to: string;
  userName: string;
  verificationUrl: string;
}

export async function sendVerificationEmail({
  to,
  userName,
  verificationUrl,
}: SendVerificationEmailParams) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not configured');
  }

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Vérifiez votre adresse email - ${APP_NAME}`,
      html: getEmailTemplate(userName, verificationUrl),
    });

    if (result.error) {
      console.error('❌ Erreur Resend:', result.error);
      console.error('❌ Détails de l\'erreur:', JSON.stringify(result.error, null, 2));
      throw new Error(`Erreur Resend: ${JSON.stringify(result.error)}`);
    }

    return result;
  } catch (error) {
    console.error('❌ Erreur envoi email:', error);
    // Re-throw pour que Better Auth puisse gérer l'erreur
    throw error;
  }
}

function getEmailTemplate(userName: string, verificationUrl: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background-color: #f9f9f9;
            border-radius: 8px;
            padding: 30px;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #0070f3;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
          }
          .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Bienvenue ${userName} !</h2>
          <p>Merci de vous être inscrit. Pour finaliser votre inscription, veuillez vérifier votre adresse email.</p>
          
          <a href="${verificationUrl}" class="button">
            Vérifier mon email
          </a>
          
          <p>Ou copiez ce lien dans votre navigateur :</p>
          <p style="word-break: break-all; color: #0070f3;">${verificationUrl}</p>
          
          <div class="footer">
            <p>Si vous n'avez pas créé de compte, ignorez cet email.</p>
            <p>Ce lien expirera dans 1 heure.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}