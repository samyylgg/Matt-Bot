# Matt-Bot 🚬

![Matt-Bot Image](img/logo.png)

Bot de WhatsApp multi-dispositivo basado en `@whiskeysockets/baileys`.  
Desarrollado por Sam.

---

## Características

- Comandos de administración (tag, abrir/cerrar grupo, ban, etc).  
- Comandos de acciones con gifs y texto.  
- Juegos 1v1 o contra el bot (piedra-papel-tijera, ahorcado, etc).  
- Comandos extras: memes, hora, chistes, perfil, menú, etc.  
- Comandos premium sin contenido NSFW.  
- Respuestas automáticas a palabras clave sin prefijo.  
- Sistema de monedas, bienvenida, niveles y más.

---

## Requisitos

- Node.js >= 16  
- Termux (en Android) o PC con Windows/Linux/Mac  
- Conexión a Internet



## Instalación en Termux (Android)

1. Abre Termux y actualiza paquetes:

   ```bash
   pkg update && pkg upgrade
   
   pkg install nodejs git ffmpe
 
   git clone https://github.com/samyylgg/Matt-Bot.git
   cd Matt-Bot

   npm install

   npm start


## Uso

Todos los comandos usan el prefijo . (punto).

Puedes usar .menu para ver la lista completa de comandos disponibles.


## Estructura del proyecto

Matt-Bot/
├─ src/
│  ├─ acciones.js
│  ├─ admin.js
│  ├─ juegos.js
│  ├─ extras.js
│  ├─ premium.js
│  ├─ respuestas.js
├─ data/ (aquí puedes guardar JSON para monedas, niveles, config)
├─ index.js
├─ package.json
└─ README.md



## Créditos

Creado por Sam (https://github.com/samyylgg)
Basado en @whiskeysockets/baileys


## Soporte

Para bugs o sugerencias abre un issue en el repositorio.

## ¡Disfruta tu Matt-Bot! 🤖✨
