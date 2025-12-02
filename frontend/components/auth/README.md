# AuthContext y Rutas Protegidas - Documentación

## 📋 Resumen

El sistema de autenticación está completamente implementado con:
- ✅ `AuthContext` global con React Context API
- ✅ Hook `useAuth()` para acceder al contexto
- ✅ Componente `ProtectedRoute` para proteger rutas
- ✅ HOC `withAuth` para proteger componentes
- ✅ Integración completa con Vendure backend
- ✅ TypeScript completamente tipado

---

## 🔐 AuthContext

### Ubicación
[auth-context.tsx](file:///Users/brianaibrahim/Downloads/Uniclima-Vendure/frontend/lib/auth-context.tsx)

### Características Implementadas

#### ✅ Tipos TypeScript

```typescript
interface Customer {
    id: string;
    title?: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    phoneNumber?: string;
}

interface RegisterInput {
    title?: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    phoneNumber?: string;
    password: string;
}

interface AuthContextType {
    currentUser: Customer | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (email: string, password: string) => Promise<{success: boolean; error?: string}>;
    logout: () => Promise<void>;
    register: (input: RegisterInput) => Promise<{success: boolean; error?: string}>;
    checkAuth: () => Promise<void>;
}
```

#### ✅ Funciones Expuestas

**1. `login(email, password)`**
- Llama a `LOGIN_MUTATION` de Vendure
- Guarda el token automáticamente (Vendure usa cookies HttpOnly)
- Actualiza el estado del usuario
- Retorna `{success: boolean, error?: string}`

**2. `register(input)`**
- Llama a `REGISTER_MUTATION` de Vendure
- Valida datos en backend
- Retorna `{success: boolean, error?: string}`

**3. `logout()`**
- Llama a `LOGOUT_MUTATION` de Vendure
- Limpia el estado del usuario
- Limpia localStorage
- Limpia cookies de sesión

**4. `checkAuth()`**
- Verifica la sesión actual
- Refresca datos del usuario

#### ✅ Estado Expuesto

- `currentUser`: Objeto Customer o null
- `isAuthenticated`: Boolean derivado de currentUser
- `loading`: Boolean para estados de carga

---

## 🛡️ Rutas Protegidas

### Componente ProtectedRoute

**Ubicación**: [ProtectedRoute.tsx](file:///Users/brianaibrahim/Downloads/Uniclima-Vendure/frontend/components/auth/ProtectedRoute.tsx)

#### Uso Básico

```tsx
import { ProtectedRoute } from '@/components/auth';

export default function CuentaPage() {
    return (
        <ProtectedRoute>
            <h1>Mi Cuenta</h1>
            <p>Contenido protegido</p>
        </ProtectedRoute>
    );
}
```

#### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Contenido a proteger |
| `redirectTo` | `string` | `'/login'` | Ruta de redirección si no autenticado |
| `requireAuth` | `boolean` | `true` | Si requiere autenticación |

#### Características

- ✅ Redirección automática si no está autenticado
- ✅ Loading state mientras verifica autenticación
- ✅ Spinner visual durante carga
- ✅ Compatible con Next.js App Router

---

## 🎯 HOC withAuth

### Uso

```tsx
import { withAuth } from '@/components/auth';

function MiCuentaPage() {
    return (
        <div>
            <h1>Mi Cuenta</h1>
        </div>
    );
}

export default withAuth(MiCuentaPage);
```

### Con Redirección Personalizada

```tsx
export default withAuth(AdminPage, '/login?redirect=/admin');
```

---

## 📝 Ejemplos de Uso

### 1. Hook useAuth en Componente

```tsx
'use client';

import { useAuth } from '@/lib/auth-context';

export default function ProfilePage() {
    const { currentUser, isAuthenticated, logout } = useAuth();

    if (!isAuthenticated) {
        return <p>No autenticado</p>;
    }

    return (
        <div>
            <h1>Hola, {currentUser.firstName}!</h1>
            <p>Email: {currentUser.emailAddress}</p>
            <button onClick={logout}>Cerrar Sesión</button>
        </div>
    );
}
```

### 2. Página Protegida Completa

```tsx
// app/cuenta/page.tsx
'use client';

import { ProtectedRoute } from '@/components/auth';
import { useAuth } from '@/lib/auth-context';

export default function CuentaPage() {
    const { currentUser } = useAuth();

    return (
        <ProtectedRoute>
            <div className="container">
                <h1>Mi Cuenta</h1>
                <div className="profile">
                    <p><strong>Nombre:</strong> {currentUser?.firstName} {currentUser?.lastName}</p>
                    <p><strong>Email:</strong> {currentUser?.emailAddress}</p>
                    <p><strong>Teléfono:</strong> {currentUser?.phoneNumber || 'No especificado'}</p>
                </div>
            </div>
        </ProtectedRoute>
    );
}
```

### 3. Login con Redirección

```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(email, password);
        
        if (result.success) {
            router.push('/cuenta'); // Redirigir después de login
        } else {
            setError(result.error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Formulario */}
        </form>
    );
}
```

### 4. Condicional en Header

```tsx
'use client';

import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

export default function Header() {
    const { isAuthenticated, currentUser, logout } = useAuth();

    return (
        <header>
            {isAuthenticated ? (
                <div>
                    <span>Hola, {currentUser.firstName}</span>
                    <button onClick={logout}>Salir</button>
                </div>
            ) : (
                <div>
                    <Link href="/login">Iniciar Sesión</Link>
                    <Link href="/registro">Registro</Link>
                </div>
            )}
        </header>
    );
}
```

---

## 🔄 Flujo de Autenticación

### 1. Inicialización

```
App Start
    ↓
AuthProvider monta
    ↓
GET_ACTIVE_CUSTOMER query ejecuta
    ↓
Si hay sesión → setCurrentUser(data)
Si no hay sesión → setCurrentUser(null)
    ↓
loading = false
```

### 2. Login

```
Usuario envía formulario
    ↓
login(email, password)
    ↓
LOGIN_MUTATION a Vendure
    ↓
Vendure retorna token en cookie HttpOnly
    ↓
refetchCustomer() para obtener datos
    ↓
currentUser actualizado
    ↓
isAuthenticated = true
```

### 3. Logout

```
Usuario click en "Cerrar Sesión"
    ↓
logout()
    ↓
LOGOUT_MUTATION a Vendure
    ↓
Vendure limpia cookie
    ↓
setCurrentUser(null)
    ↓
localStorage.removeItem('vendure-auth-token')
    ↓
isAuthenticated = false
```

---

## 🔒 Seguridad

### Tokens y Cookies

- ✅ Vendure usa **cookies HttpOnly** para tokens
- ✅ No se exponen tokens en localStorage (solo como backup)
- ✅ CSRF protection incluido en Vendure
- ✅ Cookies con SameSite y Secure flags

### Validación

- ✅ Validación en cliente (formularios)
- ✅ Validación en servidor (Vendure)
- ✅ Manejo de errores de autenticación
- ✅ Redirección automática en rutas protegidas

---

## 📦 Archivos del Sistema

### Creados
1. `/frontend/lib/auth-context.tsx` - Context y Provider
2. `/frontend/components/auth/ProtectedRoute.tsx` - Componente de rutas protegidas
3. `/frontend/components/auth/index.ts` - Exports

### Existentes (usados)
1. `/frontend/lib/vendure/mutations/auth.ts` - Mutations de Vendure
2. `/frontend/lib/vendure/queries/auth.ts` - Queries de Vendure
3. `/frontend/lib/providers.tsx` - Wrapper de providers
4. `/frontend/app/layout.tsx` - Layout principal con AuthProvider

---

## ✅ Checklist de Implementación

- [x] AuthContext creado con TypeScript
- [x] Hook useAuth() implementado
- [x] Función login() con Vendure
- [x] Función logout() con limpieza
- [x] Función register() con Vendure
- [x] Estado isAuthenticated
- [x] Estado currentUser con datos completos
- [x] ProtectedRoute component
- [x] withAuth HOC
- [x] Loading states
- [x] Error handling
- [x] Redirección automática
- [x] Integración con Header
- [x] Integración con páginas login/registro

---

## 🚀 Próximos Pasos

1. **Crear páginas protegidas**:
   - `/cuenta` - Perfil de usuario
   - `/pedidos` - Historial de pedidos
   - `/direcciones` - Direcciones de envío

2. **Mejorar UX**:
   - Recordar última página visitada antes de login
   - Redirección inteligente post-login
   - Mensajes de sesión expirada

3. **Features adicionales**:
   - Recuperación de contraseña
   - Verificación de email
   - Cambio de contraseña
   - Actualización de perfil
