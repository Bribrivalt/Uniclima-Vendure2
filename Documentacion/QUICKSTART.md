# 🚀 Guía de Inicio Rápido - Uniclima Vendure

## Prerrequisitos

- Docker y Docker Compose instalados
- Node.js 18+ (opcional, para desarrollo local sin Docker)

---

## ⚡ Levantar el Proyecto (3 pasos)

### 1. Iniciar Base de Datos PostgreSQL

```bash
docker-compose up db -d
```

Espera ~10 segundos a que PostgreSQL esté listo.

### 2. Iniciar Backend Vendure

```bash
docker-compose up backend -d
```

El backend estará disponible en: **http://localhost:3001**

### 3. Iniciar Frontend Next.js

```bash
cd frontend
npm install
npm run dev
```

El frontend estará disponible en: **http://localhost:3000**

---

## 🔗 URLs Importantes

| Servicio | URL | Descripción |
|----------|-----|-------------|
| **Frontend** | http://localhost:3000 | Tienda online |
| **Dashboard Admin** | http://localhost:3001/dashboard | Panel de administración |
| **Shop API** | http://localhost:3001/shop-api | GraphQL para frontend |
| **Admin API** | http://localhost:3001/admin-api | GraphQL para admin |
| **Mailbox** | http://localhost:3001/mailbox | Ver emails en desarrollo |

### Credenciales Admin
- **Usuario:** `superadmin`
- **Password:** `superadmin`

---

## 🛠️ Comandos Útiles

```bash
# Ver logs del backend
docker-compose logs -f backend

# Ver logs de la base de datos
docker-compose logs -f db

# Reiniciar servicios
docker-compose restart

# Detener todo
docker-compose down

# Detener y eliminar datos (⚠️ borra la BD)
docker-compose down -v

# Reconstruir imágenes
docker-compose build --no-cache
```

---

## 🐛 Solución de Problemas

### El backend no conecta a la BD
```bash
# Verificar que PostgreSQL esté corriendo
docker-compose ps

# Ver logs de la BD
docker-compose logs db
```

### Puerto 3001 ya en uso
```bash
# Cambiar puerto en docker-compose.yml y backend/.env
```

### Frontend no conecta al backend
- Verificar que backend esté corriendo en puerto 3001
- Verificar variable `NEXT_PUBLIC_VENDURE_API_URL` en frontend

---

## 📚 Documentación Adicional

- [Arquitectura del Proyecto](./ARQUITECTURA.md)
- [Guía Backend](./backend/GUIA_BACKEND.md)
- [Guía Frontend](./frontend/GUIA_FRONTEND.md)

---

*Última actualización: 03/12/2025*