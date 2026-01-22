import { Resend } from 'resend'

// Initialisation du client Resend
const resend = new Resend(process.env.RESEND_API_KEY)

// Email par défaut depuis Resend (vous devez le configurer dans votre compte Resend)
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
const APP_NAME = process.env.APP_NAME || 'FiveUp'
const APP_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000'

/**
 * Envoie un email de vérification à un utilisateur
 */
export async function sendVerificationEmail({
  email,
  name,
  token,
}: {
  email: string
  name?: string | null
  token: string
}) {
  try {
    const verificationUrl = `${APP_URL}/api/auth/verify-email?token=${token}`

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [email],
      subject: `Vérifiez votre adresse email - ${APP_NAME}`,
      html: getVerificationEmailTemplate({
        name: name || email,
        verificationUrl,
      }),
    })

    if (error) {
      console.error('❌ Erreur Resend:', error)
      throw new Error('Erreur lors de l\'envoi de l\'email')
    }

    return { success: true, messageId: data?.id }
  } catch (error) {
    console.error('❌ Erreur sendVerificationEmail:', error)
    throw error
  }
}

/**
 * Template HTML pour l'email de vérification
 */
function getVerificationEmailTemplate({
  name,
  verificationUrl,
}: {
  name: string
  verificationUrl: string
}) {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vérifiez votre email</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5; padding: 20px;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 100%; max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; border-bottom: 1px solid #e5e5e5;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #1a1a1a;">
                ${APP_NAME}
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; font-size: 24px; font-weight: 600; color: #1a1a1a;">
                Vérifiez votre adresse email
              </h2>
              
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
                Bonjour ${name},
              </p>
              
              <p style="margin: 0 0 32px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
                Merci de vous être inscrit sur ${APP_NAME} ! Pour activer votre compte, veuillez vérifier votre adresse email en cliquant sur le bouton ci-dessous.
              </p>
              
              <!-- Button -->
              <table role="presentation" style="width: 100%; margin: 32px 0;">
                <tr>
                  <td align="center" style="padding: 0;">
                    <a href="${verificationUrl}" style="display: inline-block; padding: 14px 32px; background-color: #0070f3; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                      Vérifier mon email
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 32px 0 0; font-size: 14px; line-height: 1.6; color: #737373;">
                Si le bouton ne fonctionne pas, vous pouvez copier et coller ce lien dans votre navigateur :
              </p>
              
              <p style="margin: 8px 0 0; font-size: 14px; line-height: 1.6; color: #0070f3; word-break: break-all;">
                <a href="${verificationUrl}" style="color: #0070f3; text-decoration: none;">
                  ${verificationUrl}
                </a>
              </p>
              
              <p style="margin: 32px 0 0; font-size: 14px; line-height: 1.6; color: #737373;">
                Ce lien expire dans 24 heures. Si vous n'avez pas créé de compte sur ${APP_NAME}, vous pouvez ignorer cet email.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 32px 40px; background-color: #fafafa; border-top: 1px solid #e5e5e5; border-radius: 0 0 8px 8px;">
              <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #737373; text-align: center;">
                © ${new Date().getFullYear()} ${APP_NAME}. Tous droits réservés.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}
