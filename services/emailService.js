// services/emailService.js
const nodemailer = require('nodemailer');
const axios = require('axios');

// Función para enviar email usando SendGrid API REST
const sendEmailViaSendGridAPI = async (to, subject, html, text) => {
  const response = await axios.post(
    'https://api.sendgrid.com/v3/mail/send',
    {
      personalizations: [{
        to: [{ email: to }],
        subject: subject
      }],
      from: {
        email: process.env.EMAIL_FROM || 'arleycordova2015@gmail.com',
        name: process.env.EMAIL_FROM_NAME || 'Hypothesis Manager'
      },
      content: [
        { type: 'text/plain', value: text },
        { type: 'text/html', value: html }
      ]
    },
    {
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 15000 // 15 segundos timeout
    }
  );
  return response;
};

// Configuración del transportador de email (fallback SMTP)
const createTransporter = () => {
  // Opción 1: SendGrid SMTP (si API no está disponible)
  if (process.env.SENDGRID_API_KEY && !process.env.USE_SENDGRID_API) {
    return nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      secure: false,
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000
    });
  }

  // Opción 2: SMTP Genérico (Gmail, Outlook, etc.)
  if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT || 587,
      secure: process.env.EMAIL_SECURE === 'true', // true para 465, false para 587
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  // Opción 3: Desarrollo - Ethereal Email (emails de prueba)
  console.warn('⚠️  No se encontró configuración de email. Usando modo de desarrollo (Ethereal).');
  console.warn('📧 Para producción, configure SENDGRID_API_KEY o credenciales SMTP.');

  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: 'ethereal.user@ethereal.email',
      pass: 'ethereal.password'
    }
  });
};

/**
 * Envía email de reseteo de contraseña
 * @param {string} email - Email del destinatario
 * @param {string} resetToken - Token único de reseteo
 * @param {string} userName - Nombre del usuario
 * @returns {Promise<Object>} - Resultado del envío
 */
const sendPasswordResetEmail = async (email, resetToken, userName) => {
  try {
    // URL del frontend para resetear contraseña
    const frontendURL = process.env.FRONTEND_URL || 'https://hypothesis-manager-ksjs.vercel.app';
    const resetURL = `${frontendURL}/reset-password/${resetToken}`;

    // Configurar remitente
    const fromEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@hypothesis.com';
    const fromName = process.env.EMAIL_FROM_NAME || 'Hypothesis Manager';

    // Contenido del email (HTML)
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
          }
          .container {
            background-color: #ffffff;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 2px solid #0d6efd;
          }
          .header h1 {
            color: #0d6efd;
            margin: 0;
            font-size: 24px;
          }
          .content {
            margin: 30px 0;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #0d6efd;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            margin: 20px 0;
          }
          .button:hover {
            background-color: #0b5ed7;
          }
          .alert {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #dee2e6;
            font-size: 12px;
            color: #6c757d;
            text-align: center;
          }
          .code {
            background-color: #f8f9fa;
            padding: 10px;
            border-radius: 4px;
            font-family: monospace;
            font-size: 14px;
            text-align: center;
            margin: 10px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Restablecer Contraseña</h1>
          </div>

          <div class="content">
            <p>Hola <strong>${userName}</strong>,</p>

            <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en <strong>Hypothesis Manager</strong>.</p>

            <p>Si solicitaste este cambio, haz clic en el siguiente botón para crear una nueva contraseña:</p>

            <div style="text-align: center;">
              <a href="${resetURL}" class="button">Restablecer Contraseña</a>
            </div>

            <p>O copia y pega este enlace en tu navegador:</p>
            <div class="code">${resetURL}</div>

            <div class="alert">
              <strong>⏰ Importante:</strong> Este enlace expirará en <strong>1 hora</strong> por razones de seguridad.
            </div>

            <p><strong>¿No solicitaste este cambio?</strong></p>
            <p>Si no fuiste tú quien solicitó restablecer la contraseña, puedes ignorar este correo de forma segura. Tu contraseña actual seguirá siendo válida.</p>
          </div>

          <div class="footer">
            <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
            <p>&copy; ${new Date().getFullYear()} Hypothesis Manager. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Contenido del email (texto plano como fallback)
    const textContent = `
Hola ${userName},

Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en Hypothesis Manager.

Si solicitaste este cambio, haz clic en el siguiente enlace para crear una nueva contraseña:
${resetURL}

IMPORTANTE: Este enlace expirará en 1 hora por razones de seguridad.

¿No solicitaste este cambio?
Si no fuiste tú quien solicitó restablecer la contraseña, puedes ignorar este correo de forma segura. Tu contraseña actual seguirá siendo válida.

---
Este es un correo automático, por favor no respondas a este mensaje.
© ${new Date().getFullYear()} Hypothesis Manager. Todos los derechos reservados.
    `;

    // Enviar email usando SendGrid API REST (más confiable)
    if (process.env.SENDGRID_API_KEY) {
      try {
        const response = await sendEmailViaSendGridAPI(
          email,
          '🔐 Restablece tu contraseña - Hypothesis Manager',
          htmlContent,
          textContent
        );

        console.log('✅ Email de reseteo enviado via SendGrid API');

        return {
          success: true,
          messageId: response.headers['x-message-id'] || 'sendgrid-api'
        };
      } catch (apiError) {
        console.error('❌ Error con SendGrid API:', apiError.response?.data || apiError.message);
        throw new Error('No se pudo enviar el email de reseteo');
      }
    }

    // Fallback: usar SMTP si no hay API key
    const transporter = createTransporter();
    const mailOptions = {
      from: `"${fromName}" <${fromEmail}>`,
      to: email,
      subject: '🔐 Restablece tu contraseña - Hypothesis Manager',
      text: textContent,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email de reseteo enviado via SMTP:', info.messageId);

    return {
      success: true,
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info)
    };

  } catch (error) {
    console.error('❌ Error al enviar email de reseteo:', error);
    throw new Error('No se pudo enviar el email de reseteo. Por favor, inténtalo más tarde.');
  }
};

/**
 * Envía email de confirmación de cambio de contraseña
 * @param {string} email - Email del destinatario
 * @param {string} userName - Nombre del usuario
 * @returns {Promise<Object>} - Resultado del envío
 */
const sendPasswordChangedEmail = async (email, userName) => {
  try {
    const fromEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@hypothesis.com';
    const fromName = process.env.EMAIL_FROM_NAME || 'Hypothesis Manager';
    const frontendURL = process.env.FRONTEND_URL || 'https://hypothesis-manager-ksjs.vercel.app';

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
          }
          .container {
            background-color: #ffffff;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 2px solid #198754;
          }
          .header h1 {
            color: #198754;
            margin: 0;
            font-size: 24px;
          }
          .content {
            margin: 30px 0;
          }
          .success-icon {
            text-align: center;
            font-size: 48px;
            margin: 20px 0;
          }
          .alert {
            background-color: #d1ecf1;
            border-left: 4px solid #0dcaf0;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #198754;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            margin: 20px 0;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #dee2e6;
            font-size: 12px;
            color: #6c757d;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Contraseña Actualizada</h1>
          </div>

          <div class="content">
            <div class="success-icon">🎉</div>

            <p>Hola <strong>${userName}</strong>,</p>

            <p>Te confirmamos que tu contraseña ha sido <strong>actualizada exitosamente</strong>.</p>

            <p>Ahora puedes iniciar sesión con tu nueva contraseña.</p>

            <div style="text-align: center;">
              <a href="${frontendURL}/login" class="button">Iniciar Sesión</a>
            </div>

            <div class="alert">
              <strong>🔒 Seguridad:</strong> Si no realizaste este cambio, por favor contacta al soporte inmediatamente.
            </div>

            <p><strong>Consejos de seguridad:</strong></p>
            <ul>
              <li>No compartas tu contraseña con nadie</li>
              <li>Utiliza una contraseña única para cada servicio</li>
              <li>Considera usar un gestor de contraseñas</li>
            </ul>
          </div>

          <div class="footer">
            <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
            <p>&copy; ${new Date().getFullYear()} Hypothesis Manager. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const textContent = `
Hola ${userName},

Te confirmamos que tu contraseña ha sido actualizada exitosamente.

Ahora puedes iniciar sesión con tu nueva contraseña en: ${frontendURL}/login

SEGURIDAD: Si no realizaste este cambio, por favor contacta al soporte inmediatamente.

Consejos de seguridad:
- No compartas tu contraseña con nadie
- Utiliza una contraseña única para cada servicio
- Considera usar un gestor de contraseñas

---
Este es un correo automático, por favor no respondas a este mensaje.
© ${new Date().getFullYear()} Hypothesis Manager. Todos los derechos reservados.
    `;

    // Enviar email usando SendGrid API REST (más confiable)
    if (process.env.SENDGRID_API_KEY) {
      try {
        await sendEmailViaSendGridAPI(
          email,
          '✅ Contraseña actualizada exitosamente - Hypothesis Manager',
          htmlContent,
          textContent
        );

        console.log('✅ Email de confirmación enviado via SendGrid API');

        return {
          success: true,
          messageId: 'sendgrid-api'
        };
      } catch (apiError) {
        console.error('❌ Error con SendGrid API (confirmación):', apiError.response?.data || apiError.message);
        // No fallar si el email de confirmación falla
        return {
          success: false,
          error: apiError.message
        };
      }
    }

    // Fallback: usar SMTP si no hay API key
    const transporter = createTransporter();
    const mailOptions = {
      from: `"${fromName}" <${fromEmail}>`,
      to: email,
      subject: '✅ Contraseña actualizada exitosamente - Hypothesis Manager',
      text: textContent,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email de confirmación enviado via SMTP:', info.messageId);

    return {
      success: true,
      messageId: info.messageId
    };

  } catch (error) {
    console.error('❌ Error al enviar email de confirmación:', error);
    // No lanzar error aquí, ya que el cambio de contraseña fue exitoso
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  sendPasswordResetEmail,
  sendPasswordChangedEmail
};
