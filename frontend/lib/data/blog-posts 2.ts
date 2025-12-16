/**
 * Blog Posts Data - Uniclima Solutions
 * 
 * Base de datos de artículos del blog.
 * En producción, esto vendría de un CMS o API.
 */

export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    category: BlogCategory;
    image?: string;
    author: BlogAuthor;
    date: string;
    readTime: number;
    featured: boolean;
    tags: string[];
}

export interface BlogCategory {
    slug: string;
    name: string;
}

export interface BlogAuthor {
    name: string;
    role: string;
    avatar?: string;
}

// ========================================
// CATEGORÍAS
// ========================================

export const blogCategories: BlogCategory[] = [
    { slug: 'todos', name: 'Todos' },
    { slug: 'consejos', name: 'Consejos' },
    { slug: 'noticias', name: 'Noticias' },
    { slug: 'guias', name: 'Guías' },
    { slug: 'novedades', name: 'Novedades' },
];

// ========================================
// AUTORES
// ========================================

export const blogAuthors: Record<string, BlogAuthor> = {
    equipo: {
        name: 'Equipo Uniclima',
        role: 'Expertos en Climatización',
    },
    tecnico: {
        name: 'Departamento Técnico',
        role: 'Ingenieros HVAC',
    },
};

// ========================================
// ARTÍCULOS
// ========================================

export const blogPosts: BlogPost[] = [
    {
        id: '1',
        slug: 'como-funciona-aerotermia',
        title: '¿Cómo Funciona la Aerotermia y por Qué es una Opción Sostenible?',
        excerpt: 'Descubre los beneficios de la aerotermia como sistema de climatización eficiente y respetuoso con el medio ambiente.',
        content: `
## ¿Qué es la aerotermia?

La **aerotermia** es una tecnología que extrae energía del aire exterior para proporcionar calefacción, refrigeración y agua caliente sanitaria. Utiliza una bomba de calor aire-agua que aprovecha la energía térmica contenida en el aire, incluso a bajas temperaturas.

## ¿Cómo funciona?

El sistema de aerotermia funciona mediante un ciclo termodinámico:

1. **Evaporación**: El refrigerante absorbe calor del aire exterior y se evapora
2. **Compresión**: El compresor aumenta la presión y temperatura del gas
3. **Condensación**: El gas cede calor al sistema de calefacción o ACS
4. **Expansión**: El refrigerante se enfría para reiniciar el ciclo

## Ventajas de la aerotermia

### Eficiencia energética
Por cada kWh eléctrico consumido, la aerotermia puede generar entre 3 y 5 kWh térmicos. Esto se traduce en un **COP (Coeficiente de Rendimiento)** muy elevado.

### Sostenibilidad
- Reduce hasta un **70% las emisiones de CO2** respecto a calderas de gas
- Utiliza energía renovable del aire
- Compatible con instalaciones fotovoltaicas

### Versatilidad
- Calefacción en invierno
- Refrigeración en verano
- Agua caliente sanitaria todo el año

## ¿Es rentable instalar aerotermia?

Aunque la inversión inicial es mayor que otros sistemas, la aerotermia ofrece:

- **Ahorro** de hasta 50% en la factura energética
- **Subvenciones** disponibles (hasta 3.000€ en algunas comunidades)
- **Vida útil** de más de 20 años
- **Mantenimiento** mínimo

## Conclusión

La aerotermia es una de las mejores opciones para climatización sostenible y eficiente. En Uniclima somos especialistas en instalación de sistemas aerotérmicos de las mejores marcas del mercado.

¿Quieres saber más? **Contáctanos** para un estudio personalizado sin compromiso.
        `,
        category: { slug: 'consejos', name: 'Consejos' },
        author: blogAuthors.tecnico,
        date: '2024-12-05',
        readTime: 6,
        featured: true,
        tags: ['aerotermia', 'eficiencia energética', 'sostenibilidad', 'bomba de calor'],
    },
    {
        id: '2',
        slug: 'innovaciones-calderas-condensacion',
        title: 'Innovaciones en Calderas de Condensación: Lo Último del Mercado',
        excerpt: 'Las últimas novedades tecnológicas en calderas de condensación para mayor eficiencia energética.',
        content: `
## La evolución de las calderas de condensación

Las **calderas de condensación** han experimentado grandes avances tecnológicos en los últimos años. Estos equipos, ya de por sí eficientes, incorporan ahora funcionalidades que maximizan el ahorro energético.

## Principales innovaciones 2024

### 1. Modulación extendida

Las nuevas calderas ofrecen rangos de modulación de hasta **1:10**, lo que significa que pueden reducir su potencia hasta un 10% de la nominal. Esto se traduce en:

- Menos arranques y paradas
- Mayor vida útil del equipo
- Mejor confort térmico

### 2. Conectividad y control remoto

La **domótica** ha llegado a las calderas:

- Control desde smartphone
- Integración con asistentes de voz
- Programación inteligente según tus hábitos
- Diagnóstico remoto de averías

### 3. Preparación para hidrógeno

Muchos fabricantes ya ofrecen calderas **"H2 Ready"**, preparadas para funcionar con mezclas de hasta 20% de hidrógeno, anticipándose a la transición energética.

### 4. Intercambiadores mejorados

Los nuevos intercambiadores de calor ofrecen:

- Mayor superficie de contacto
- Materiales más resistentes a la corrosión
- Mejor aprovechamiento del calor latente

## Mejores marcas de calderas 2024

En Uniclima trabajamos con las marcas líderes del mercado:

- **Vaillant**: Pioneros en tecnología de condensación
- **Junkers Bosch**: Fiabilidad alemana
- **Saunier Duval**: Excelente relación calidad-precio
- **Ferroli**: Innovación constante

## ¿Cuándo cambiar la caldera?

Considera renovar tu caldera si:

- Tiene más de **15 años**
- Los costes de reparación son frecuentes
- Notas una pérdida de eficiencia
- Quieres reducir tu huella de carbono

## Ayudas disponibles

En 2024 hay múltiples subvenciones para renovación de calderas:

- **Plan Renove**: Hasta 500€ de descuento directo
- **Fondos Next Generation**: Rehabilitación energética
- **Deducciones IRPF**: Por mejora de eficiencia energética

---

¿Necesitas asesoramiento? En Uniclima te ayudamos a elegir la caldera perfecta para tu hogar.
        `,
        category: { slug: 'noticias', name: 'Noticias' },
        author: blogAuthors.equipo,
        date: '2024-11-28',
        readTime: 5,
        featured: true,
        tags: ['calderas', 'condensación', 'eficiencia energética', 'innovación'],
    },
    {
        id: '3',
        slug: 'mejores-aires-acondicionados-2024',
        title: 'Los Mejores aparatos de Aire Acondicionados para el Verano 2024',
        excerpt: 'Guía completa para elegir el mejor aire acondicionado según tus necesidades y espacio.',
        content: `
## Guía de compra: Aire acondicionado 2024

Elegir el **aire acondicionado** adecuado puede marcar la diferencia entre un verano confortable y uno insufrible. En esta guía te ayudamos a tomar la mejor decisión.

## Tipos de aire acondicionado

### Split
El más común en viviendas. Consiste en:
- Unidad interior (evaporador)
- Unidad exterior (compresor)

**Ventajas**: Silencioso, eficiente, diseño discreto

### Multisplit
Un compresor exterior para varias unidades interiores. Ideal para:
- Pisos grandes
- Varias habitaciones
- Espacios comerciales

### Conductos
Sistema oculto en falso techo con distribución por conductos.
**Ideal para**: Viviendas de nueva construcción, oficinas

## Factores a considerar

### 1. Potencia frigorífica
Regla general: **100 frigorías por m²**

| Superficie | Frigorías necesarias |
|------------|---------------------|
| 20 m² | 2.000 fg |
| 30 m² | 3.000 fg |
| 40 m² | 4.000 fg |

### 2. Eficiencia energética
Busca equipos con clasificación **A++ o superior**. El índice SEER indica la eficiencia en frío:
- SEER > 8: Excelente
- SEER 6-8: Muy bueno
- SEER < 6: Mejorable

### 3. Nivel sonoro
Para dormitorios, busca equipos con menos de **24 dB** en unidad interior.

### 4. Funcionalidades extra
- **Inverter**: Ahorra hasta 40% de energía
- **WiFi**: Control desde el móvil
- **Filtros HEPA**: Mejoran la calidad del aire
- **Bomba de calor**: Frío y calor en un solo equipo

## Top 5 Aires Acondicionados 2024

1. **Daikin FTXM**: Máxima eficiencia y silencio
2. **Mitsubishi MSZ-LN**: Diseño premium
3. **Fujitsu ASY**: Mejor relación calidad-precio
4. **Samsung WindFree**: Sin corrientes directas
5. **LG Dual Cool**: WiFi integrado

## Instalación profesional

La instalación es **clave** para el rendimiento. En Uniclima:

- Instaladores certificados
- Garantía de 3 años en mano de obra
- Puesta en marcha incluida
- Asesoramiento post-venta

---

¿Preparado para el verano? Solicita presupuesto sin compromiso.
        `,
        category: { slug: 'consejos', name: 'Consejos' },
        author: blogAuthors.tecnico,
        date: '2024-11-15',
        readTime: 7,
        featured: false,
        tags: ['aire acondicionado', 'split', 'verano', 'guía de compra'],
    },
    {
        id: '4',
        slug: 'mantenimiento-preventivo-caldera',
        title: 'Mantenimiento Preventivo de tu Caldera: Guía Completa',
        excerpt: 'Todo lo que necesitas saber para mantener tu caldera en perfecto estado durante todo el año.',
        content: `
## La importancia del mantenimiento de la caldera

Un correcto mantenimiento de la caldera no solo alarga su vida útil, sino que también:

- **Garantiza la seguridad** de tu hogar
- **Reduce el consumo** energético
- **Previene averías** costosas
- **Mantiene la garantía** del fabricante

## ¿Cada cuánto revisar la caldera?

La normativa recomienda una **revisión anual** obligatoria para instalaciones de gas. El mejor momento: **antes de la temporada de frío**.

## Qué incluye una revisión profesional

### 1. Inspección de la combustión
- Análisis de gases de escape
- Verificación del rendimiento
- Ajuste de la mezcla aire-gas

### 2. Limpieza de componentes
- Quemador
- Intercambiador de calor
- Sifón de condensados
- Filtros

### 3. Comprobación de seguridades
- Válvulas de seguridad
- Sensores de temperatura
- Detectores de monóxido

### 4. Verificación del circuito hidráulico
- Presión del sistema
- Estado del vaso de expansión
- Funcionamiento de la bomba

## Mantenimiento que puedes hacer tú

### Semanalmente
- Comprobar que la presión está entre 1 y 1,5 bar
- Verificar que no hay fugas visibles

### Mensualmente
- Limpiar el exterior de la caldera
- Comprobar que la llama es azul y estable

### Antes del invierno
- Purgar los radiadores
- Encender la caldera unos días antes del uso continuado

## Señales de que algo va mal

⚠️ Acude a un técnico si notas:
- Ruidos extraños (golpeteos, silbidos)
- Llama amarilla o anaranjada
- Olor a gas
- Pérdida de presión frecuente
- Agua sucia en los radiadores

## Coste del mantenimiento

| Servicio | Precio orientativo |
|----------|-------------------|
| Revisión anual | 80-120€ |
| Contrato mantenimiento | 150-200€/año |
| Limpieza completa | 100-150€ |

## Contratos de mantenimiento Uniclima

Ofrecemos contratos de mantenimiento con:

✓ Revisión anual completa
✓ Prioridad en avisos urgentes
✓ 10% descuento en reparaciones
✓ Asistencia telefónica 24h

---

No esperes a que llegue el frío. ¡Agenda tu revisión ahora!
        `,
        category: { slug: 'guias', name: 'Guías' },
        author: blogAuthors.equipo,
        date: '2024-11-10',
        readTime: 6,
        featured: false,
        tags: ['mantenimiento', 'calderas', 'seguridad', 'eficiencia'],
    },
    {
        id: '5',
        slug: 'subvenciones-aerotermia-madrid-2024',
        title: 'Subvenciones para Aerotermia en Madrid 2024',
        excerpt: 'Conoce las ayudas disponibles para instalar sistemas de aerotermia en tu hogar.',
        content: `
## Ayudas para aerotermia en la Comunidad de Madrid

Si estás pensando en instalar un sistema de **aerotermia** en Madrid, 2024 es un excelente momento. Hay múltiples líneas de ayudas que pueden reducir significativamente tu inversión.

## Programa PREE 5000

El Plan de Recuperación, Transformación y Resiliencia incluye ayudas para rehabilitación energética.

### Cuantías
- **Vivienda unifamiliar**: Hasta 3.000€
- **Vivienda en edificio**: Hasta 2.500€
- **Edificio completo**: Hasta 40% del coste

### Requisitos
- Mejora mínima de una letra en certificado energético
- Instalador autorizado
- Equipo con eficiencia mínima A++

## Plan Renove Comunidad de Madrid

La Comunidad de Madrid ofrece ayudas adicionales:

### Para particulares
- Hasta **50% del coste** de la instalación
- Máximo 3.000€ por vivienda
- Compatible con ayudas estatales

### Para comunidades de vecinos
- Hasta **70% de subvención**
- Incluye sustitución de calderas centrales
- Bonificación extra por eliminación de gas

## Deducciones IRPF

Además de las ayudas directas, puedes deducir:

- **20%** por obras de mejora energética (base máx. 5.000€)
- **40%** si reduces la demanda de calefacción un 30%
- **60%** si alcanzas clase energética A o B

## Cómo solicitar las ayudas

### Paso 1: Estudio previo
Solicita un estudio energético de tu vivienda. En Uniclima lo hacemos gratuitamente.

### Paso 2: Presupuesto detallado
Necesitarás un presupuesto que incluya:
- Marca y modelo del equipo
- Potencia y eficiencia
- Coste de instalación desglosado

### Paso 3: Documentación
- DNI/NIE
- Certificado energético actual
- Escrituras o contrato de alquiler
- Licencia de obras (si procede)

### Paso 4: Solicitud
Presentar en la oficina virtual de la Comunidad de Madrid o presencialmente.

### Paso 5: Instalación
Una vez aprobada, tienes 12 meses para realizar la instalación.

## Plazos 2024

| Programa | Fecha límite |
|----------|-------------|
| PREE 5000 | 31/12/2024 |
| Plan Renove Madrid | Hasta agotar fondos |
| Deducción IRPF | Declaración 2024 |

## ¿Te ayudamos?

En Uniclima:

✓ Gestionamos las ayudas por ti
✓ Adelantamos el importe de la subvención
✓ Garantía de aprobación o no cobramos gestión

---

¡No dejes escapar estas ayudas! Contáctanos para más información.
        `,
        category: { slug: 'noticias', name: 'Noticias' },
        author: blogAuthors.equipo,
        date: '2024-10-28',
        readTime: 5,
        featured: false,
        tags: ['subvenciones', 'ayudas', 'aerotermia', 'Madrid'],
    },
    {
        id: '6',
        slug: 'diferencias-bomba-calor-aire-acondicionado',
        title: 'Diferencias entre Bomba de Calor y Aire Acondicionado',
        excerpt: 'Aprende a distinguir estos sistemas de climatización y cuál es mejor para tu hogar.',
        content: `
## ¿Bomba de calor o aire acondicionado?

Es una de las preguntas más frecuentes de nuestros clientes. Aunque comparten tecnología, existen diferencias importantes que debes conocer.

## ¿Qué tienen en común?

Ambos sistemas utilizan el **ciclo de refrigeración** para mover calor:
- Tienen compresor
- Usan refrigerante
- Tienen unidad interior y exterior

## La diferencia clave

### Aire acondicionado clásico
Solo **enfría**. Extrae calor del interior y lo expulsa al exterior.

### Bomba de calor
Es **reversible**: puede calentar y enfriar. En invierno, extrae calor del exterior y lo introduce en la vivienda.

## Comparativa detallada

| Característica | A/A tradicional | Bomba de calor |
|----------------|-----------------|----------------|
| Refrigeración | ✓ | ✓ |
| Calefacción | ✗ | ✓ |
| Eficiencia frío | Alta | Alta |
| Eficiencia calor | - | Muy alta |
| Precio | Menor | Mayor |
| Consumo anual | Medio | Bajo |

## ¿Cuándo elegir cada opción?

### Elige aire acondicionado tradicional si:
- Solo necesitas refrigeración en verano
- Ya tienes calefacción eficiente (gas, aerotermia)
- Buscas el menor coste inicial
- Vives en zona de clima cálido

### Elige bomba de calor si:
- Quieres frío y calor en un solo equipo
- No tienes gas natural
- Buscas máxima eficiencia energética
- Quieres reducir tu huella de carbono
- Vives en zona de clima moderado

## Rendimiento en frío extremo

Una preocupación habitual: ¿funciona la bomba de calor con mucho frío?

**Respuesta**: Los equipos modernos funcionan hasta **-15°C o -20°C** con buen rendimiento. Las marcas premium como Daikin o Mitsubishi mantienen el 100% de capacidad hasta -5°C.

## Coste de funcionamiento

Ejemplo para vivienda de 90m² en Madrid:

| Sistema | Coste calefacción/año |
|---------|----------------------|
| Caldera gas | 600-800€ |
| Radiadores eléctricos | 1.200-1.500€ |
| Bomba de calor | 400-500€ |

## Nuestra recomendación

Para la mayoría de viviendas en España, recomendamos **bomba de calor** porque:

1. El clima permite usarla todo el año
2. El ahorro amortiza la diferencia de precio
3. Aumenta el valor de la vivienda
4. Es más sostenible

## Los mejores equipos con bomba de calor

En Uniclima instalamos las mejores marcas:

- **Daikin FTXM/P**: COP hasta 5.1
- **Mitsubishi MSZ-AY**: WiFi integrado
- **Fujitsu ASY**: Excelente relación precio/prestaciones

---

¿Necesitas ayuda para decidir? Solicita una visita gratuita de nuestro equipo técnico.
        `,
        category: { slug: 'consejos', name: 'Consejos' },
        author: blogAuthors.tecnico,
        date: '2024-10-15',
        readTime: 6,
        featured: false,
        tags: ['bomba de calor', 'aire acondicionado', 'comparativa', 'eficiencia'],
    },
];

// ========================================
// UTILIDADES
// ========================================

/**
 * Obtener artículo por slug
 */
export function getPostBySlug(slug: string): BlogPost | undefined {
    return blogPosts.find(post => post.slug === slug);
}

/**
 * Obtener artículos por categoría
 */
export function getPostsByCategory(categorySlug: string): BlogPost[] {
    if (categorySlug === 'todos') return blogPosts;
    return blogPosts.filter(post => post.category.slug === categorySlug);
}

/**
 * Obtener artículos destacados
 */
export function getFeaturedPosts(): BlogPost[] {
    return blogPosts.filter(post => post.featured);
}

/**
 * Obtener artículos relacionados
 */
export function getRelatedPosts(currentSlug: string, limit: number = 3): BlogPost[] {
    const current = getPostBySlug(currentSlug);
    if (!current) return blogPosts.slice(0, limit);
    
    // Buscar por tags comunes
    const scored = blogPosts
        .filter(post => post.slug !== currentSlug)
        .map(post => ({
            post,
            score: post.tags.filter(tag => current.tags.includes(tag)).length +
                   (post.category.slug === current.category.slug ? 2 : 0)
        }))
        .sort((a, b) => b.score - a.score);
    
    return scored.slice(0, limit).map(s => s.post);
}

/**
 * Obtener todos los slugs (para generateStaticParams)
 */
export function getAllPostSlugs(): string[] {
    return blogPosts.map(post => post.slug);
}