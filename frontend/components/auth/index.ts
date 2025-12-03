/**
 * Auth Components - Barrel file
 * 
 * Exporta todos los componentes relacionados con autenticación
 * y gestión de cuenta de usuario.
 */

// Protección de rutas
export { ProtectedRoute } from './ProtectedRoute';
export type { ProtectedRouteProps } from './ProtectedRoute';

// Formulario de login
export { LoginForm } from './LoginForm';
export type { LoginFormProps } from './LoginForm';

// Formulario de registro
export { RegisterForm } from './RegisterForm';
export type { RegisterFormProps } from './RegisterForm';

// Formulario de recuperación de contraseña
export { ForgotPasswordForm } from './ForgotPasswordForm';
export type { ForgotPasswordFormProps } from './ForgotPasswordForm';

// Barra lateral de cuenta
export { AccountSidebar } from './AccountSidebar';
export type { AccountSidebarProps } from './AccountSidebar';

// Formulario de perfil
export { ProfileForm } from './ProfileForm';
export type { ProfileFormProps } from './ProfileForm';
