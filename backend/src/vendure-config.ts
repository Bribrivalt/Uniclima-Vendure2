import {
    dummyPaymentHandler,
    DefaultJobQueuePlugin,
    DefaultSchedulerPlugin,
    DefaultSearchPlugin,
    VendureConfig,
    LanguageCode,
    Injector,
    RequestContext,
    Order,
} from '@vendure/core';
import { defaultEmailHandlers, EmailPlugin, FileBasedTemplateLoader } from '@vendure/email-plugin';
import { AssetServerPlugin } from '@vendure/asset-server-plugin';
import { DashboardPlugin } from '@vendure/dashboard/plugin';
import { GraphiqlPlugin } from '@vendure/graphiql-plugin';
// import { stripePaymentMethodHandler } from '@vendure/payments-plugin/package/stripe';
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
        port: +(process.env.DB_PORT || 5432),
        database: process.env.DB_NAME || 'vendure',
        username: process.env.DB_USERNAME || 'vendure',
        password: process.env.DB_PASSWORD || 'vendure',
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
    // CUSTOM FIELDS PARA PRODUCTOS UNICLIMA
    // ═══════════════════════════════════════════════════════════════════════
    // Estos campos aparecen automáticamente en el Dashboard Admin al editar
    // productos y están disponibles en las APIs GraphQL (shop-api y admin-api).
    //
    // CAMPOS NATIVOS DE VENDURE (no necesitan customFields):
    // - SKU: sku del ProductVariant
    // - Categoria: Collections
    // - Marca: Facets
    // - precio: price del ProductVariant
    // - inventario: stockOnHand del ProductVariant
    // - nombre_corregido_nuevo: name del Product
    // - imagenes: Assets del Product
    //
    // En desarrollo (synchronize: true), los cambios se aplican automáticamente.
    // En producción, ejecutar: npx vendure migrate
    // ═══════════════════════════════════════════════════════════════════════
    customFields: {
        // Campos personalizados para la entidad Product (Producto)
        // NOTA: descripcion_tecnica usa el campo nativo Product.description
        Product: [
            {
                // Compatibilidades del producto - mostrar en detalles
                name: 'compatibilidades',
                type: 'text',
                label: [{ languageCode: LanguageCode.es, value: 'Compatibilidades' }],
                description: [{ languageCode: LanguageCode.es, value: 'Lista de compatibilidades del producto' }],
                nullable: true,
                public: true,
            },
            {
                // Errores y síntomas - para diagnóstico
                name: 'erroresSintomas',
                type: 'text',
                label: [{ languageCode: LanguageCode.es, value: 'Errores y Síntomas' }],
                description: [{ languageCode: LanguageCode.es, value: 'Errores y síntomas que soluciona este producto' }],
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
