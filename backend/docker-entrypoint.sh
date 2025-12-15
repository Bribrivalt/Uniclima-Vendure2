#!/bin/sh
set -e

echo "🔨 Compilando dashboard de Vendure..."
npx vite build

echo "✅ Dashboard compilado exitosamente"
echo "🚀 Iniciando servidor Vendure..."

# Ejecutar el comando original
exec "$@"
