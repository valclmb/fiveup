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
      subject: `Verify your email address - ${APP_NAME}`,
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

interface SendResetPasswordEmailParams {
  to: string;
  userName: string;
  resetUrl: string;
}

export async function sendResetPasswordEmail({
  to,
  userName,
  resetUrl,
}: SendResetPasswordEmailParams) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not configured');
  }

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Reset your password - ${APP_NAME}`,
      html: getResetPasswordEmailTemplate(userName, resetUrl),
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
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            line-height: 1.6;
            color: #1a1a1a;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
          }
          .container {
            background-color: #ffffff;
            border-radius: 12px;
            padding: 40px;
            border: 1px solid #e5e7eb;
          }
          .button {
            display: inline-block;
            padding: 14px 32px;
            background-color: #10CEA5;
            color: #ffffff;
            text-decoration: none;
            border-radius: 8px;
            margin: 24px 0;
            font-weight: 600;
            font-size: 16px;
            transition: background-color 0.2s;
          }
          .button:hover {
            background-color: #0db892;
          }
          .link {
            word-break: break-all;
            color: #10CEA5;
            text-decoration: none;
          }
          .footer {
            margin-top: 32px;
            font-size: 13px;
            color: #6b7280;
            line-height: 1.5;
          }
          h2 {
            color: #1a1a1a;
            margin: 0 0 16px 0;
            font-size: 24px;
            font-weight: 600;
          }
          p {
            margin: 12px 0;
            color: #374151;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Welcome ${userName}!</h2>
          <p>Thank you for signing up. To complete your registration, please verify your email address.</p>
          
          <div style="text-align: center; margin: 32px 0;">
            <a href="${verificationUrl}" class="button">
              Verify my email
            </a>
          </div>
          
          <p style="text-align: center; color: #6b7280; font-size: 14px;">Or copy this link into your browser:</p>
          <p style="text-align: center; word-break: break-all;">
            <a href="${verificationUrl}" class="link">${verificationUrl}</a>
          </p>
          
          <div class="footer">
            <p>If you didn't create an account, please ignore this email.</p>
            <p>This link will expire in 1 hour.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

function getResetPasswordEmailTemplate(userName: string, resetUrl: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            line-height: 1.6;
            color: #1a1a1a;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
          }
          .container {
            background-color: #ffffff;
            border-radius: 12px;
            padding: 40px;
            border: 1px solid #e5e7eb;
          }
          .button {
            display: inline-block;
            padding: 14px 32px;
            background-color: #10CEA5;
            color: #ffffff;
            text-decoration: none;
            border-radius: 8px;
            margin: 24px 0;
            font-weight: 600;
            font-size: 16px;
            transition: background-color 0.2s;
          }
          .button:hover {
            background-color: #0db892;
          }
          .link {
            word-break: break-all;
            color: #10CEA5;
            text-decoration: none;
          }
          .footer {
            margin-top: 32px;
            font-size: 13px;
            color: #6b7280;
            line-height: 1.5;
          }
          h2 {
            color: #1a1a1a;
            margin: 0 0 16px 0;
            font-size: 24px;
            font-weight: 600;
          }
          p {
            margin: 12px 0;
            color: #374151;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Reset your password</h2>
          <p>Hello ${userName},</p>
          <p>You requested to reset your password. Click the button below to create a new password.</p>
          
          <div style="text-align: center; margin: 32px 0;">
            <a href="${resetUrl}" class="button">
              Reset my password
            </a>
          </div>
          
          <p style="text-align: center; color: #6b7280; font-size: 14px;">Or copy this link into your browser:</p>
          <p style="text-align: center; word-break: break-all;">
            <a href="${resetUrl}" class="link">${resetUrl}</a>
          </p>
          
          <div class="footer">
            <p>If you didn't request this password reset, please ignore this email.</p>
            <p>This link will expire in 1 hour.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}