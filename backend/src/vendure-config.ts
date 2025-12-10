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
        type: 'better-sqlite3',
        database: path.join(__dirname, '../vendure.sqlite'),
        // See the README.md "Migrations" section for an explanation of
        // the `synchronize` and `migrations` options.
        synchronize: IS_DEV, // Auto-sync in dev, use migrations in production
        migrations: [path.join(__dirname, './migrations/*.+(js|ts)')],
        logging: false,
    },
    paymentOptions: {
        paymentMethodHandlers: [dummyPaymentHandler],
    },
    // ═══════════════════════════════════════════════════════════════════════
    // CUSTOM FIELDS PARA PRODUCTOS HVAC (Climatización)
    // ═══════════════════════════════════════════════════════════════════════
    // Estos campos aparecen automáticamente en el Dashboard Admin al editar
    // productos y están disponibles en las APIs GraphQL (shop-api y admin-api).
    //
    // En desarrollo (synchronize: true), los cambios se aplican automáticamente.
    // En producción, ejecutar: npx vendure migrate
    // ═══════════════════════════════════════════════════════════════════════
    customFields: {
        // Campos personalizados para la entidad Product (Producto)
        Product: [
            {
                // Potencia del equipo en kilowatios (kW)
                name: 'potenciaKw',
                type: 'float',
                label: [{ languageCode: LanguageCode.es, value: 'Potencia (kW)' }],
                description: [{ languageCode: LanguageCode.es, value: 'Potencia nominal del equipo en kilowatios' }],
                nullable: true,
                public: true,
            },
            {
                // Capacidad de refrigeración en frigorías por hora
                name: 'frigorias',
                type: 'int',
                label: [{ languageCode: LanguageCode.es, value: 'Frigorías/hora' }],
                description: [{ languageCode: LanguageCode.es, value: 'Capacidad frigorífica en frigorías por hora' }],
                nullable: true,
                public: true,
            },
            {
                // Clasificación energética según normativa europea
                name: 'claseEnergetica',
                type: 'string',
                label: [{ languageCode: LanguageCode.es, value: 'Clase Energética' }],
                description: [{ languageCode: LanguageCode.es, value: 'Clasificación de eficiencia energética (A+++ a G)' }],
                nullable: true,
                public: true,
            },
            {
                // Tipo de gas refrigerante del equipo
                name: 'refrigerante',
                type: 'string',
                label: [{ languageCode: LanguageCode.es, value: 'Refrigerante' }],
                description: [{ languageCode: LanguageCode.es, value: 'Tipo de gas refrigerante (R32, R410A, R290)' }],
                nullable: true,
                public: true,
            },
            {
                // WiFi integrado para control remoto
                name: 'wifi',
                type: 'boolean',
                label: [{ languageCode: LanguageCode.es, value: 'WiFi Integrado' }],
                description: [{ languageCode: LanguageCode.es, value: 'Indica si el equipo tiene WiFi integrado para control remoto' }],
                nullable: true,
                public: true,
            },
            {
                // Años de garantía del fabricante
                name: 'garantiaAnos',
                type: 'int',
                label: [{ languageCode: LanguageCode.es, value: 'Garantía (años)' }],
                description: [{ languageCode: LanguageCode.es, value: 'Años de garantía del fabricante' }],
                nullable: true,
                ui: { component: 'number-form-input', min: 0, max: 10 },
                public: true,
            },
            {
                // SEER: Eficiencia energética estacional en refrigeración
                name: 'seer',
                type: 'float',
                label: [{ languageCode: LanguageCode.es, value: 'SEER' }],
                description: [{ languageCode: LanguageCode.es, value: 'Eficiencia energética estacional en refrigeración' }],
                nullable: true,
                public: true,
            },
            {
                // SCOP: Eficiencia energética estacional en calefacción
                name: 'scop',
                type: 'float',
                label: [{ languageCode: LanguageCode.es, value: 'SCOP' }],
                description: [{ languageCode: LanguageCode.es, value: 'Eficiencia energética estacional en calefacción' }],
                nullable: true,
                public: true,
            },
            {
                // Nivel sonoro de la unidad interior en dB(A)
                // Valores típicos: 19-45 dB(A)
                name: 'nivelSonoroInterior',
                type: 'int',
                label: [{ languageCode: LanguageCode.es, value: 'Nivel Sonoro Interior dB(A)' }],
                description: [{ languageCode: LanguageCode.es, value: 'Nivel de ruido de la unidad interior en decibelios' }],
                nullable: true,
                ui: { component: 'number-form-input', min: 0, max: 100 },
                public: true,
            },
            {
                // Nivel sonoro de la unidad exterior en dB(A)
                name: 'nivelSonoroExterior',
                type: 'int',
                label: [{ languageCode: LanguageCode.es, value: 'Nivel Sonoro Exterior dB(A)' }],
                description: [{ languageCode: LanguageCode.es, value: 'Nivel de ruido de la unidad exterior en decibelios' }],
                nullable: true,
                ui: { component: 'number-form-input', min: 0, max: 100 },
                public: true,
            },
            {
                // Superficie recomendada en m²
                name: 'superficieRecomendada',
                type: 'string',
                label: [{ languageCode: LanguageCode.es, value: 'Superficie Recomendada' }],
                description: [{ languageCode: LanguageCode.es, value: 'Metros cuadrados recomendados para climatizar' }],
                nullable: true,
                public: true,
            },
            {
                // Dimensiones de la unidad interior
                // Formato: "Alto x Ancho x Profundo" en mm
                name: 'dimensionesInterior',
                type: 'string',
                label: [{ languageCode: LanguageCode.es, value: 'Dimensiones Unidad Interior' }],
                description: [{ languageCode: LanguageCode.es, value: 'Dimensiones Alto x Ancho x Profundo en mm' }],
                nullable: true,
                public: true,
            },
            {
                // Dimensiones de la unidad exterior
                // Formato: "Alto x Ancho x Profundo" en mm
                name: 'dimensionesExterior',
                type: 'string',
                label: [{ languageCode: LanguageCode.es, value: 'Dimensiones Unidad Exterior' }],
                description: [{ languageCode: LanguageCode.es, value: 'Dimensiones Alto x Ancho x Profundo en mm' }],
                nullable: true,
                public: true,
            },
            {
                // Peso de la unidad interior en kg
                name: 'pesoUnidadInterior',
                type: 'float',
                label: [{ languageCode: LanguageCode.es, value: 'Peso Unidad Interior (kg)' }],
                description: [{ languageCode: LanguageCode.es, value: 'Peso de la unidad interior en kilogramos' }],
                nullable: true,
                public: true,
            },
            {
                // Peso de la unidad exterior en kg
                name: 'pesoUnidadExterior',
                type: 'float',
                label: [{ languageCode: LanguageCode.es, value: 'Peso Unidad Exterior (kg)' }],
                description: [{ languageCode: LanguageCode.es, value: 'Peso de la unidad exterior en kilogramos' }],
                nullable: true,
                public: true,
            },
            {
                // Tipo de alimentación eléctrica
                name: 'alimentacion',
                type: 'string',
                label: [{ languageCode: LanguageCode.es, value: 'Alimentación Eléctrica' }],
                description: [{ languageCode: LanguageCode.es, value: 'Tipo de alimentación eléctrica (Monofásico/Trifásico)' }],
                nullable: true,
                public: true,
            },
            {
                // Carga de refrigerante de fábrica en kg
                name: 'cargaRefrigerante',
                type: 'float',
                label: [{ languageCode: LanguageCode.es, value: 'Carga Refrigerante (kg)' }],
                description: [{ languageCode: LanguageCode.es, value: 'Cantidad de gas refrigerante precargado en kg' }],
                nullable: true,
                public: true,
            },
            {
                // Longitud máxima de tubería en metros
                name: 'longitudMaximaTuberia',
                type: 'int',
                label: [{ languageCode: LanguageCode.es, value: 'Longitud Máx. Tubería (m)' }],
                description: [{ languageCode: LanguageCode.es, value: 'Longitud máxima de tubería frigorífica en metros' }],
                nullable: true,
                public: true,
            },
            {
                // Desnivel máximo permitido entre unidades en metros
                name: 'desnivelMaximo',
                type: 'int',
                label: [{ languageCode: LanguageCode.es, value: 'Desnivel Máximo (m)' }],
                description: [{ languageCode: LanguageCode.es, value: 'Desnivel máximo permitido entre unidad interior y exterior' }],
                nullable: true,
                public: true,
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
