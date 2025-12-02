import {
    dummyPaymentHandler,
    DefaultJobQueuePlugin,
    DefaultSchedulerPlugin,
    DefaultSearchPlugin,
    VendureConfig,
    LanguageCode,
} from '@vendure/core';
import { defaultEmailHandlers, EmailPlugin, FileBasedTemplateLoader } from '@vendure/email-plugin';
import { AssetServerPlugin } from '@vendure/asset-server-plugin';
import { DashboardPlugin } from '@vendure/dashboard/plugin';
import { GraphiqlPlugin } from '@vendure/graphiql-plugin';
import 'dotenv/config';
import path from 'path';

const IS_DEV = process.env.APP_ENV === 'dev';
const serverPort = +process.env.PORT || 3000;

export const config: VendureConfig = {
    apiOptions: {
        port: serverPort,
        adminApiPath: 'admin-api',
        shopApiPath: 'shop-api',
        trustProxy: IS_DEV ? false : 1,
        // The following options are useful in development mode,
        // but are best turned off for production for security
        // reasons.
        ...(IS_DEV ? {
            adminApiDebug: true,
            shopApiDebug: true,
        } : {}),
    },
    authOptions: {
        tokenMethod: ['bearer', 'cookie'],
        superadminCredentials: {
            identifier: process.env.SUPERADMIN_USERNAME,
            password: process.env.SUPERADMIN_PASSWORD,
        },
        cookieOptions: {
            secret: process.env.COOKIE_SECRET,
        },
    },
    dbConnectionOptions: {
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        username: process.env.DB_USERNAME || 'vendure',
        password: process.env.DB_PASSWORD || 'vendure',
        database: process.env.DB_NAME || 'vendure',
        // See the README.md "Migrations" section for an explanation of
        // the `synchronize` and `migrations` options.
        synchronize: IS_DEV, // Auto-sync in dev, use migrations in production
        migrations: [path.join(__dirname, './migrations/*.+(js|ts)')],
        logging: false,
    },
    paymentOptions: {
        paymentMethodHandlers: [dummyPaymentHandler],
    },
    // When adding or altering custom field definitions, the database will
    // need to be updated. See the "Migrations" section in README.md.
    customFields: {
        ProductVariant: [
            {
                name: 'potenciaKw',
                type: 'float',
                label: [{ languageCode: LanguageCode.es, value: 'Potencia (kW)' }],
                description: [{ languageCode: LanguageCode.es, value: 'Potencia del equipo en kilovatios' }],
                nullable: true,
                ui: { component: 'number-form-input', min: 0, max: 100, step: 0.1 },
            },
            {
                name: 'frigorias',
                type: 'int',
                label: [{ languageCode: LanguageCode.es, value: 'Frigorías/hora' }],
                description: [{ languageCode: LanguageCode.es, value: 'Capacidad de refrigeración en frigorías por hora' }],
                nullable: true,
                ui: { component: 'number-form-input', min: 0, max: 50000 },
            },
            {
                name: 'claseEnergetica',
                type: 'string',
                label: [{ languageCode: LanguageCode.es, value: 'Clase Energética' }],
                description: [{ languageCode: LanguageCode.es, value: 'Clasificación energética del equipo' }],
                nullable: true,
                options: [
                    { value: 'A+++' },
                    { value: 'A++' },
                    { value: 'A+' },
                    { value: 'A' },
                    { value: 'B' },
                    { value: 'C' },
                    { value: 'D' },
                ],
                ui: { component: 'select-form-input' },
            },
            {
                name: 'refrigerante',
                type: 'string',
                label: [{ languageCode: LanguageCode.es, value: 'Tipo de Refrigerante' }],
                description: [{ languageCode: LanguageCode.es, value: 'Gas refrigerante utilizado por el equipo' }],
                nullable: true,
                options: [
                    { value: 'R32' },
                    { value: 'R410A' },
                    { value: 'R290' },
                    { value: 'R134a' },
                    { value: 'R407C' },
                ],
                ui: { component: 'select-form-input' },
            },
            {
                name: 'wifi',
                type: 'boolean',
                label: [{ languageCode: LanguageCode.es, value: 'WiFi Integrado' }],
                description: [{ languageCode: LanguageCode.es, value: 'Indica si el equipo tiene conectividad WiFi integrada' }],
                defaultValue: false,
            },
            {
                name: 'garantiaAnos',
                type: 'int',
                label: [{ languageCode: LanguageCode.es, value: 'Garantía (años)' }],
                description: [{ languageCode: LanguageCode.es, value: 'Años de garantía del fabricante' }],
                nullable: true,
                ui: { component: 'number-form-input', min: 0, max: 10 },
            },
            {
                name: 'dimensionesUnidadInterior',
                type: 'string',
                label: [{ languageCode: LanguageCode.es, value: 'Dimensiones Unidad Interior' }],
                description: [{ languageCode: LanguageCode.es, value: 'Dimensiones de la unidad interior (Alto x Ancho x Fondo en mm)' }],
                nullable: true,
            },
            {
                name: 'dimensionesUnidadExterior',
                type: 'string',
                label: [{ languageCode: LanguageCode.es, value: 'Dimensiones Unidad Exterior' }],
                description: [{ languageCode: LanguageCode.es, value: 'Dimensiones de la unidad exterior (Alto x Ancho x Fondo en mm)' }],
                nullable: true,
            },
            {
                name: 'nivelSonoro',
                type: 'int',
                label: [{ languageCode: LanguageCode.es, value: 'Nivel Sonoro (dB)' }],
                description: [{ languageCode: LanguageCode.es, value: 'Nivel de ruido en decibelios' }],
                nullable: true,
                ui: { component: 'number-form-input', min: 0, max: 100 },
            },
        ],
    },
    plugins: [
        GraphiqlPlugin.init(),
        AssetServerPlugin.init({
            route: 'assets',
            assetUploadDir: path.join(__dirname, '../static/assets'),
            // For local dev, the correct value for assetUrlPrefix should
            // be guessed correctly, but for production it will usually need
            // to be set manually to match your production url.
            assetUrlPrefix: IS_DEV ? undefined : 'https://www.my-shop.com/assets/',
        }),
        DefaultSchedulerPlugin.init(),
        DefaultJobQueuePlugin.init({ useDatabaseForBuffer: true }),
        DefaultSearchPlugin.init({ bufferUpdates: false, indexStockStatus: true }),
        EmailPlugin.init({
            devMode: true,
            outputPath: path.join(__dirname, '../static/email/test-emails'),
            route: 'mailbox',
            handlers: defaultEmailHandlers,
            templateLoader: new FileBasedTemplateLoader(path.join(__dirname, '../static/email/templates')),
            globalTemplateVars: {
                // Configuración personalizada para Uniclima
                // Frontend en desarrollo: http://localhost:3000
                // Frontend en producción: https://uniclima.es (cambiar cuando se despliegue)
                fromAddress: '"Uniclima Solutions" <pedidos@uniclima.es>',
                verifyEmailAddressUrl: 'http://localhost:3000/cuenta/verificar-email',
                passwordResetUrl: 'http://localhost:3000/cuenta/resetear-password',
                changeEmailAddressUrl: 'http://localhost:3000/cuenta/cambiar-email'
            },
        }),
        DashboardPlugin.init({
            route: 'dashboard',
            appDir: path.join(__dirname, '../dist/dashboard'),
        }),
    ],
};
