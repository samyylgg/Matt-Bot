#!/bin/bash

# Matt-Bot - Script de inicio
# by Sam

echo "Iniciando Matt-Bot 🚬..."
echo "Verificando dependencias..."

# Verificar que node esté instalado
if ! command -v node &> /dev/null
then
    echo "❌ Node.js no está instalado. Instálalo con:"
    echo "   pkg install nodejs"
    exit 1
fi

# Verificar que npm esté instalado
if ! command -v npm &> /dev/null
then
    echo "❌ npm no está instalado. Instálalo con:"
    echo "   pkg install npm"
    exit 1
fi

# Verificar que termux-setup-storage se haya ejecutado
if [ ! -d "$HOME/storage" ]; then
  echo "⚠️ No se detectó permiso de almacenamiento (termux-setup-storage)."
  echo "Ejecuta 'termux-setup-storage' y reinicia Termux antes de continuar."
  exit 1
fi

# Verificar que haya node_modules
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
fi

# Iniciar el bot
echo "✅ Ejecutando el bot..."
node index.js