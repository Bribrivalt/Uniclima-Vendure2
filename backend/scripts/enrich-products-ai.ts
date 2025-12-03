/**
 * ═══════════════════════════════════════════════════════════════════════
 * SCRIPT: Enriquecimiento de Productos con IA
 * ═══════════════════════════════════════════════════════════════════════
 *
 * Prueba de Concepto (POC) para enriquecer productos usando Claude API.
 *
 * Funcionalidad:
 * - Recibe SKU + Nombre básico del producto
 * - Genera: descripción, características técnicas, categorización, EAN sugerido
 * - Prepara los datos para importar a Vendure
 *
 * Requisitos:
 * - API Key de Anthropic (Claude) en variable de entorno ANTHROPIC_API_KEY
 *
 * Ejecutar con: npx tsx scripts/enrich-products-ai.ts
 * ═══════════════════════════════════════════════════════════════════════
 */

import 'dotenv/config';

// ─────────────────────────────────────────────────────────────────────────
// CONFIGURACIÓN
// ─────────────────────────────────────────────────────────────────────────

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

// ─────────────────────────────────────────────────────────────────────────
// INTERFACES
// ─────────────────────────────────────────────────────────────────────────

interface ProductInput {
    sku: string;
    nombre: string;
}

interface EnrichedProduct {
    sku: string;
    nombre_original: string;
    nombre_mejorado: string;
    descripcion_html: string;
    marca: string;
    categoria: string;
    subcategoria: string;
    tipo_producto: string;
    posible_ean: string;
    custom_fields: {
        potenciaKw?: number;
        alimentacion?: string;
        garantiaAnos?: number;
        [key: string]: any;
    };
    palabras_clave: string[];
    compatibilidad?: string;
    notas_tecnicas?: string;
}

// ─────────────────────────────────────────────────────────────────────────
// PRODUCTOS DE PRUEBA (POC)
// ─────────────────────────────────────────────────────────────────────────

const PRODUCTOS_TEST: ProductInput[] = [
    {
        sku: 'BCTSF24E',
        nombre: 'Bomba Circuladora Thematek SF 24'
    },
    {
        sku: 'CFCE-20EN',
        nombre: 'Caudalímetro Caldera Fagor CE-20E N'
    }
];

// ─────────────────────────────────────────────────────────────────────────
// PROMPT PARA ENRIQUECIMIENTO
// ─────────────────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `Eres un experto en productos de climatización, calefacción y HVAC (Heating, Ventilation, and Air Conditioning). Tu trabajo es enriquecer la información de productos a partir de datos básicos (SKU y nombre).

Para cada producto, debes generar un JSON con la siguiente estructura:
{
  "nombre_mejorado": "Nombre del producto mejorado y más descriptivo",
  "descripcion_html": "<p>Descripción en HTML con formato rico...</p>",
  "marca": "Marca del producto",
  "categoria": "Categoría principal",
  "subcategoria": "Subcategoría específica",
  "tipo_producto": "Repuesto/Equipo Completo/Accesorio",
  "posible_ean": "EAN si lo conoces o 'Verificar con proveedor'",
  "custom_fields": {
    "potenciaKw": null,
    "alimentacion": null,
    "garantiaAnos": null
  },
  "palabras_clave": ["palabra1", "palabra2"],
  "compatibilidad": "Equipos/modelos compatibles",
  "notas_tecnicas": "Notas adicionales importantes"
}

Reglas:
1. La descripción debe ser profesional y técnica
2. Incluir información de aplicación y uso
3. Si es un repuesto, indicar claramente el modelo compatible
4. Las palabras clave deben ser relevantes para búsqueda
5. Solo incluir custom_fields que sean relevantes para el tipo de producto
6. Responder SOLO con el JSON, sin texto adicional`;

// ─────────────────────────────────────────────────────────────────────────
// FUNCIÓN DE LLAMADA A CLAUDE API
// ─────────────────────────────────────────────────────────────────────────

async function callClaudeAPI(producto: ProductInput): Promise<EnrichedProduct | null> {
    if (!ANTHROPIC_API_KEY) {
        console.error('❌ Error: ANTHROPIC_API_KEY no está configurada');
        console.log('   Añade ANTHROPIC_API_KEY=tu-api-key a tu archivo .env');
        return null;
    }

    const userMessage = `Enriquece este producto de HVAC/Calefacción:
SKU: ${producto.sku}
Nombre: ${producto.nombre}`;

    try {
        const response = await fetch(ANTHROPIC_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-haiku-20240307', // Modelo más económico para POC
                max_tokens: 1024,
                system: SYSTEM_PROMPT,
                messages: [
                    { role: 'user', content: userMessage }
                ]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API Error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        const content = data.content[0]?.text;

        if (!content) {
            throw new Error('Respuesta vacía de Claude');
        }

        // Parsear el JSON de la respuesta
        const enrichedData = JSON.parse(content);

        return {
            sku: producto.sku,
            nombre_original: producto.nombre,
            ...enrichedData
        };

    } catch (error: any) {
        console.error(`   ❌ Error enriqueciendo ${producto.sku}:`, error.message);
        return null;
    }
}

// ─────────────────────────────────────────────────────────────────────────
// FUNCIÓN DE SIMULACIÓN (SIN API KEY)
// ─────────────────────────────────────────────────────────────────────────

function simulateEnrichment(producto: ProductInput): EnrichedProduct {
    // Detectar tipo de producto por palabras clave en el nombre
    const nombreLower = producto.nombre.toLowerCase();
    
    let enriched: Partial<EnrichedProduct> = {
        sku: producto.sku,
        nombre_original: producto.nombre,
    };

    if (nombreLower.includes('bomba') || nombreLower.includes('circuladora')) {
        enriched = {
            ...enriched,
            nombre_mejorado: `${producto.nombre} - Calefacción y ACS`,
            descripcion_html: `<p><strong>${producto.nombre}</strong> para sistemas de calefacción central y agua caliente sanitaria (ACS).</p><p>Bomba de circulación de alta eficiencia diseñada para garantizar el correcto flujo de agua en circuitos de calefacción.</p><h3>Aplicaciones:</h3><ul><li>Circuitos de calefacción por radiadores</li><li>Sistemas de agua caliente sanitaria</li><li>Calderas murales de gas</li></ul>`,
            marca: extractBrand(producto.nombre),
            categoria: 'Bombas y Circuladores',
            subcategoria: 'Bombas Circuladoras',
            tipo_producto: 'Repuesto/Componente',
            posible_ean: 'Verificar con proveedor',
            custom_fields: {
                potenciaKw: 0.045,
                alimentacion: 'Monofásico 230V',
                garantiaAnos: 2
            },
            palabras_clave: ['bomba circuladora', 'calefacción', 'ACS', 'circulador'],
            compatibilidad: 'Calderas murales domésticas, sistemas de calefacción central'
        };
    } else if (nombreLower.includes('caudalímetro') || nombreLower.includes('caudalimetro')) {
        enriched = {
            ...enriched,
            nombre_mejorado: `${producto.nombre} - Repuesto Original`,
            descripcion_html: `<p><strong>Caudalímetro de repuesto</strong> para ${extractModelFromName(producto.nombre)}.</p><p>El caudalímetro (o flujómetro) es un componente esencial que mide el caudal de agua que circula por la caldera, activando el encendido cuando detecta demanda de ACS.</p><h3>Función:</h3><ul><li>Detecta el flujo de agua en el circuito de ACS</li><li>Activa el encendido de la caldera</li><li>Regula la modulación según demanda</li></ul>`,
            marca: extractBrand(producto.nombre),
            categoria: 'Repuestos Calderas',
            subcategoria: 'Sensores y Caudalímetros',
            tipo_producto: 'Repuesto Original',
            posible_ean: 'Verificar con proveedor',
            custom_fields: {
                garantiaAnos: 1
            },
            palabras_clave: ['caudalímetro', 'repuesto caldera', 'flujómetro', 'sensor caudal'],
            notas_tecnicas: 'Verificar modelo exacto de caldera antes de comprar.'
        };
    } else {
        // Genérico
        enriched = {
            ...enriched,
            nombre_mejorado: producto.nombre,
            descripcion_html: `<p><strong>${producto.nombre}</strong></p><p>Producto de climatización/calefacción. Contacte con nosotros para más información técnica.</p>`,
            marca: extractBrand(producto.nombre),
            categoria: 'Climatización',
            subcategoria: 'General',
            tipo_producto: 'Componente',
            posible_ean: 'Verificar con proveedor',
            custom_fields: {},
            palabras_clave: producto.nombre.toLowerCase().split(' ').filter(w => w.length > 3)
        };
    }

    return enriched as EnrichedProduct;
}

function extractBrand(nombre: string): string {
    const marcas = ['Daikin', 'Mitsubishi', 'LG', 'Fujitsu', 'Samsung', 'Panasonic', 'Toshiba', 'Fagor', 'Thematek', 'Junkers', 'Vaillant', 'Baxi', 'Saunier Duval'];
    for (const marca of marcas) {
        if (nombre.toLowerCase().includes(marca.toLowerCase())) {
            return marca;
        }
    }
    // Intentar extraer primera palabra como marca
    const words = nombre.split(' ');
    for (const word of words) {
        if (word.length > 2 && !['Bomba', 'Caldera', 'Split', 'Caudalímetro', 'Circuladora'].includes(word)) {
            return word;
        }
    }
    return 'Genérico';
}

function extractModelFromName(nombre: string): string {
    // Buscar patrones tipo "Caldera XXX YYY"
    const match = nombre.match(/caldera\s+(\w+\s+[\w-]+)/i);
    if (match) {
        return `Caldera ${match[1]}`;
    }
    return nombre;
}

// ─────────────────────────────────────────────────────────────────────────
// FUNCIÓN PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('    🤖 ENRIQUECIMIENTO DE PRODUCTOS CON IA - POC               ');
    console.log('═══════════════════════════════════════════════════════════════\n');

    const useRealAPI = !!ANTHROPIC_API_KEY;
    
    if (useRealAPI) {
        console.log('✅ API Key de Anthropic detectada - Usando Claude API\n');
    } else {
        console.log('⚠️  Sin API Key - Usando modo simulación');
        console.log('   Para usar Claude API, añade ANTHROPIC_API_KEY a .env\n');
    }

    console.log(`📦 Procesando ${PRODUCTOS_TEST.length} productos...\n`);
    console.log('─'.repeat(60));

    const results: EnrichedProduct[] = [];

    for (const producto of PRODUCTOS_TEST) {
        console.log(`\n🔍 Procesando: ${producto.sku} - "${producto.nombre}"`);
        
        let enriched: EnrichedProduct | null;
        
        if (useRealAPI) {
            enriched = await callClaudeAPI(producto);
        } else {
            enriched = simulateEnrichment(producto);
        }

        if (enriched) {
            results.push(enriched);
            console.log(`   ✅ Enriquecido correctamente`);
            console.log(`   📝 Marca detectada: ${enriched.marca}`);
            console.log(`   📁 Categoría: ${enriched.categoria} > ${enriched.subcategoria}`);
        }
    }

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('                    📊 RESULTADOS                               ');
    console.log('═══════════════════════════════════════════════════════════════\n');

    for (const result of results) {
        console.log('─'.repeat(60));
        console.log(`\n📦 ${result.sku}: ${result.nombre_original}`);
        console.log(`   → ${result.nombre_mejorado}\n`);
        console.log(`   Marca: ${result.marca}`);
        console.log(`   Categoría: ${result.categoria} > ${result.subcategoria}`);
        console.log(`   Tipo: ${result.tipo_producto}`);
        console.log(`   Keywords: ${result.palabras_clave.join(', ')}`);
        if (result.compatibilidad) {
            console.log(`   Compatibilidad: ${result.compatibilidad}`);
        }
        if (result.notas_tecnicas) {
            console.log(`   ⚠️ Notas: ${result.notas_tecnicas}`);
        }
    }

    // Guardar resultados en JSON
    const outputPath = './enriched-products-poc.json';
    const fs = await import('fs');
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), 'utf-8');
    
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log(`✅ Resultados guardados en: ${outputPath}`);
    console.log('═══════════════════════════════════════════════════════════════\n');

    console.log('📋 Próximos pasos:');
    console.log('   1. Revisar los resultados generados');
    console.log('   2. Ajustar el prompt si es necesario');
    console.log('   3. Cuando tengas ANTHROPIC_API_KEY, ejecutar con API real');
    console.log('   4. Integrar con script de importación a Vendure\n');
}

// Ejecutar
main().catch(console.error);