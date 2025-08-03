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
    exit
fi

# Verificar que npm esté instalado
if ! command -v npm &> /dev/null
then
    echo "❌ npm no está instalado. Instálalo con:"
    echo "   pkg install npm"
    exit
fi

# Verificar que haya node_modules
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
fi

# Iniciar el bot
echo "✅ Ejecutando el bot..."
node index.js
