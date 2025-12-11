/**
 * ═══════════════════════════════════════════════════════════════════════
 * Script para Probar Envío de Emails via SMTP
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * Este script envía un email de prueba usando la configuración SMTP
 * definida en las variables de entorno.
 * 
 * Uso:
 *   npx tsx scripts/test-email-smtp.ts [email-destino]
 * 
 * Ejemplo:
 *   npx tsx scripts/test-email-smtp.ts test@example.com
 * ═══════════════════════════════════════════════════════════════════════
 */

import * as nodemailer from 'nodemailer';
import 'dotenv/config';

// Configuración desde variables de entorno
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = +(process.env.SMTP_PORT || 587);
const SMTP_SECURE = process.env.SMTP_SECURE === 'true';
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;
const SMTP_FROM = process.env.SMTP_FROM_ADDRESS || '"Uniclima Solutions" <pedidos@uniclima.es>';

// Email destino (argumento de línea de comandos o default)
const TO_EMAIL = process.argv[2] || SMTP_USER;

async function testEmailSMTP() {
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('📧 TEST DE ENVÍO DE EMAIL SMTP - Uniclima');
    console.log('═══════════════════════════════════════════════════════════════\n');

    // Verificar configuración
    console.log('📋 Configuración SMTP:');
    console.log(`   Host: ${SMTP_HOST}`);
    console.log(`   Port: ${SMTP_PORT}`);
    console.log(`   Secure: ${SMTP_SECURE}`);
    console.log(`   User: ${SMTP_USER ? SMTP_USER.substring(0, 5) + '...' : '❌ NO CONFIGURADO'}`);
    console.log(`   Password: ${SMTP_PASSWORD ? '********' : '❌ NO CONFIGURADO'}`);
    console.log(`   From: ${SMTP_FROM}`);
    console.log(`   To: ${TO_EMAIL}\n`);

    if (!SMTP_USER || !SMTP_PASSWORD) {
        console.error('❌ Error: SMTP_USER y SMTP_PASSWORD son requeridos');
        console.log('\nAsegúrate de tener configuradas las variables de entorno:');
        console.log('  SMTP_USER=tu-email@tudominio.com');
        console.log('  SMTP_PASSWORD=tu-contraseña-de-aplicacion');
        process.exit(1);
    }

    if (!TO_EMAIL) {
        console.error('❌ Error: No se especificó email destino');
        console.log('\nUso: npx tsx scripts/test-email-smtp.ts [email-destino]');
        process.exit(1);
    }

    try {
        // Crear transporter
        console.log('🔧 Creando transporter SMTP...');
        const transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: SMTP_PORT,
            secure: SMTP_SECURE,
            auth: {
                user: SMTP_USER,
                pass: SMTP_PASSWORD,
            },
            tls: {
                rejectUnauthorized: true,
            },
        });

        // Verificar conexión
        console.log('🔌 Verificando conexión con servidor SMTP...');
        await transporter.verify();
        console.log('✅ Conexión SMTP verificada exitosamente\n');

        // Enviar email de prueba
        console.log('📤 Enviando email de prueba...');
        const info = await transporter.sendMail({
            from: SMTP_FROM,
            to: TO_EMAIL,
            subject: '✅ Test SMTP Uniclima - Conexión Exitosa',
            text: `
¡Hola!

Este es un email de prueba enviado desde Uniclima Vendure.

Si estás leyendo este mensaje, la configuración SMTP está funcionando correctamente.

Detalles técnicos:
- Servidor: ${SMTP_HOST}:${SMTP_PORT}
- Fecha: ${new Date().toLocaleString('es-ES')}
- Usuario: ${SMTP_USER}

Saludos,
El equipo de Uniclima
            `.trim(),
            html: `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #0066cc, #004499); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .success { background: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; border-radius: 4px; margin: 20px 0; }
        .details { background: white; padding: 15px; border-radius: 4px; margin-top: 20px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔧 Uniclima</h1>
            <p>Test de Configuración SMTP</p>
        </div>
        <div class="content">
            <div class="success">
                <strong>✅ ¡Conexión SMTP Exitosa!</strong><br>
                La configuración de email está funcionando correctamente.
            </div>
            
            <p>Este es un email de prueba enviado desde el sistema Uniclima Vendure.</p>
            
            <div class="details">
                <strong>📋 Detalles técnicos:</strong>
                <ul>
                    <li><strong>Servidor:</strong> ${SMTP_HOST}:${SMTP_PORT}</li>
                    <li><strong>Fecha:</strong> ${new Date().toLocaleString('es-ES')}</li>
                    <li><strong>Usuario:</strong> ${SMTP_USER}</li>
                </ul>
            </div>
        </div>
        <div class="footer">
            <p>Uniclima Solutions - Especialistas en Climatización</p>
        </div>
    </div>
</body>
</html>
            `.trim(),
        });

        console.log('\n═══════════════════════════════════════════════════════════════');
        console.log('✅ EMAIL ENVIADO EXITOSAMENTE');
        console.log('═══════════════════════════════════════════════════════════════');
        console.log(`   Message ID: ${info.messageId}`);
        console.log(`   Destinatario: ${TO_EMAIL}`);
        console.log(`   Respuesta: ${info.response}`);
        console.log('\n📬 Revisa la bandeja de entrada (y spam) de ' + TO_EMAIL);

    } catch (error: any) {
        console.error('\n═══════════════════════════════════════════════════════════════');
        console.error('❌ ERROR AL ENVIAR EMAIL');
        console.error('═══════════════════════════════════════════════════════════════');
        console.error(`   Error: ${error.message}`);
        
        if (error.code === 'EAUTH') {
            console.log('\n💡 Sugerencia: Error de autenticación');
            console.log('   - Verifica que SMTP_USER sea correcto');
            console.log('   - Usa una "Contraseña de aplicación" de Google, NO tu contraseña normal');
            console.log('   - Genera una en: Google Account > Security > 2-Step Verification > App passwords');
        } else if (error.code === 'ECONNREFUSED') {
            console.log('\n💡 Sugerencia: Conexión rechazada');
            console.log('   - Verifica que el firewall permite conexiones salientes al puerto ' + SMTP_PORT);
            console.log('   - Prueba con SMTP_PORT=465 y SMTP_SECURE=true');
        }
        
        process.exit(1);
    }
}

// Ejecutar
testEmailSMTP();