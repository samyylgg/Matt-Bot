import { create, Client } from '@whiskeysockets/baileys';
import acciones from './src/acciones.js';
import admin from './src/admin.js';
import juegos from './src/juegos.js';
import extras from './src/extras.js';
import premium from './src/premium.js';
import { respuestas } from './src/respuestas.js';

const prefix = '.';

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function startBot() {
  const client = await create({});

  client.ev.on('messages.upsert', async (m) => {
    try {
      if (!m.messages || m.type !== 'notify') return;
      const msg = m.messages[0];
      if (!msg.message || msg.key.fromMe) return;

      const text = msg.message.conversation ||
                   msg.message.extendedTextMessage?.text ||
                   '';

      const texto = text.toLowerCase();

      // Respuestas automáticas a palabras clave sin prefijo
      for (const clave in respuestas) {
        if (texto.includes(clave)) {
          const reply = getRandom(respuestas[clave]);
          await client.sendMessage(msg.key.remoteJid, { text: reply });
          return; // No procesar más si respondió aquí
        }
      }

      // Solo procesar comandos que inician con prefix
      if (!text.startsWith(prefix)) return;

      const args = text.slice(prefix.length).trim().split(/ +/);
      const command = args.shift().toLowerCase();

      const adminCommands = ['tag', 'grupo abrir', 'grupo cerrar', 'setreglas', 'reglas', 'ban', 'anclar', 'desanclar', 'modo lento'];
      const accionesList = ['abrazar', 'besar', 'saludar', 'acariciar', 'reir', 'llorar', 'dormir', 'bailar', 'cantar', 'enojar', 'pensar', 'saludarmanos', 'saltar', 'comer', 'beber', 'patear', 'chocar', 'empujar', 'saludarHola'];
      const juegosList = ['piedrapapeltijera', 'unirse', 'piedra', 'papel', 'tijera'];
      const extrasList = ['meme', 'hora', 'fecha', 'frase', 'say', 'dog', 'info', 'ping', 'chiste', 'gif'];
      const premiumList = ['trivia', 'play', 'sorteo', 'clima', 'traducir'];

      if (adminCommands.includes(command)) {
        await admin(client, msg, command);
        return;
      }

      if (accionesList.includes(command)) {
        await acciones(client, msg, command);
        return;
      }

      if (juegosList.includes(command)) {
        await juegos(client, msg, command);
        return;
      }

      if (extrasList.includes(command)) {
        await extras(client, msg, command);
        return;
      }

      if (premiumList.includes(command)) {
        await premium(client, msg, command);
        return;
      }

      // Comando no reconocido
      await msg.reply('Comando no reconocido, usa .help para ver la lista.');

    } catch (error) {
      console.error('Error en messages.upsert:', error);
    }
  });

  client.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      console.log('Conexión cerrada, intentando reconectar...');
      if (lastDisconnect?.error?.output?.statusCode !== 401) {
        startBot();
      }
    } else if (connection === 'open') {
      console.log('Conectado a WhatsApp');
    }
  });

  client.ev.on('creds.update', () => {
    // Guardar credenciales si usas persistencia
  });
}

startBot();
