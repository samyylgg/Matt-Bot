import fs from 'fs';
import { createCanvas } from 'canvas';

const nivelesPath = './data/niveles.json';
let niveles = {};
if (fs.existsSync(nivelesPath)) {
  niveles = JSON.parse(fs.readFileSync(nivelesPath));
}

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const config = {
  prefijo: '.',
};

export default async function extras(client, msg, command, args) {
  const chatId = msg.key.remoteJid;
  const senderId = msg.key.participant || msg.key.remoteJid;

  switch (command) {
    case 'ping':
      await client.sendMessage(chatId, { text: 'Pong! 🏓' });
      break;

    case 'hora': {
      const now = new Date();
      await client.sendMessage(chatId, { text: `🕒 Hora actual: ${now.toLocaleTimeString()}` });
      break;
    }

    case 'fecha': {
      const now = new Date();
      await client.sendMessage(chatId, { text: `📅 Fecha actual: ${now.toLocaleDateString()}` });
      break;
    }

    case 'meme': {
      const memes = [
        'https://i.imgflip.com/30b1gx.jpg',
        'https://i.imgflip.com/1bij.jpg',
        'https://i.imgflip.com/26am.jpg',
      ];
      const meme = getRandom(memes);
      await client.sendMessage(chatId, { image: { url: meme }, caption: '😂 Meme random' });
      break;
    }

    case 'chiste': {
      const chistes = [
        '¿Por qué el libro de matemáticas estaba triste? Porque tenía muchos problemas.',
        '¿Qué le dijo una cebolla a otra? Nos vemos en las lágrimas.',
        '¿Qué hace una abeja en el gimnasio? ¡Zum-ba!',
      ];
      const chiste = getRandom(chistes);
      await client.sendMessage(chatId, { text: `😂 Chiste:\n\n${chiste}` });
      break;
    }

    case 'say': {
      if (args.length === 0) {
        await client.sendMessage(chatId, { text: 'Usa: .say [texto]' });
        break;
      }
      const texto = args.join(' ');
      await client.sendMessage(chatId, { text: texto });
      break;
    }

    case 'profile': {
      const userData = niveles[senderId] || { nivel: 0, exp: 0 };
      const nivelActual = userData.nivel || 0;
      const expActual = userData.exp || 0;
      const expRequerida = Math.floor((nivelActual + 1) * 10);

      // Canvas para imagen de perfil
      const canvas = createCanvas(500, 250);
      const ctx = canvas.getContext('2d');

      // Fondo
      ctx.fillStyle = '#1e1e2f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Tarjeta
      ctx.fillStyle = '#282c34';
      ctx.fillRect(20, 20, 460, 210);

      // Texto
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px Sans';
      ctx.fillText('Perfil de Usuario', 40, 50);

      ctx.font = '16px Sans';
      ctx.fillText(`Nombre: @${senderId.split('@')[0]}`, 40, 90);
      ctx.fillText(`Nivel: ${nivelActual}`, 40, 130);
      ctx.fillText(`Exp: ${expActual} / ${expRequerida}`, 40, 170);

      // Barra progreso
      const barraX = 40;
      const barraY = 180;
      const barraWidth = 400;
      const barraHeight = 20;
      const progreso = Math.min(expActual / expRequerida, 1);

      ctx.fillStyle = '#555';
      ctx.fillRect(barraX, barraY, barraWidth, barraHeight);
      ctx.fillStyle = '#00ff00';
      ctx.fillRect(barraX, barraY, barraWidth * progreso, barraHeight);
      ctx.strokeStyle = '#000';
      ctx.strokeRect(barraX, barraY, barraWidth, barraHeight);

      const buffer = canvas.toBuffer();

      await client.sendMessage(chatId, {
        image: buffer,
        caption: `📄 Perfil de @${senderId.split('@')[0]}`,
        mentions: [senderId],
      }, { quoted: msg });

      break;
    }

    case 'menu': {
      const nombre = msg.pushName || msg.key.participant?.split('@')[0] || 'Usuario';

      const menuTexto = `
┌─❏ *🤖 Matt-Bot Menu* ❏─┐

👑 *Administración:*
・.tag
・.grupo abrir
・.grupo cerrar
・.setreglas
・.reglas
・.ban
・.anclar
・.desanclar
・.modo lento

🎭 *Acciones:*
・.abrazar
・.besar
・.saludar
・.acariciar
・.reir
・.llorar
・.dormir
・.bailar
・.cantar
・.enojar
・.pensar
・.saludarmanos
・.saltar
・.comer
・.beber
・.patear
・.chocar
・.empujar
・.saludarHola

🎮 *Juegos:*
・.piedrapapeltijera
・.unirse
・.piedra
・.papel
・.tijera
・.tictactoe
・.ahorcado
・.adivinanza

✨ *Extras:*
・.ping
・.hora
・.fecha
・.meme
・.chiste
・.say
・.profile
・.menu

💎 *Premium:*
・.trivia
・.play
・.sorteo
・.clima
・.traducir

🪙 *Monedas:*
・.balance
・.trabajar
・.apostar
・.transferir

👋 *Bienvenida:*
・.setbienvenida
・.bienvenida
・.setdespedida
・.despedida

└─────────────┘

*¡Hola, ${nombre}! Usa los comandos con el prefijo \`${config.prefijo}\`*
      `;

      await client.sendMessage(chatId, { text: menuTexto });
      break;
    }

    default:
      await client.sendMessage(chatId, { text: 'Comando extra no implementado.' });
  }
}
