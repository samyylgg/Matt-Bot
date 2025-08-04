import { create } from '@whiskeysockets/baileys';
import admin from './src/admin.js';
import acciones from './src/acciones.js';
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

      const text =
        msg.message.conversation ||
        msg.message.extendedTextMessage?.text ||
        '';

      const texto = text.toLowerCase();

      // 🟢 Respuestas automáticas sin prefijo
      for (const clave in respuestas) {
        if (texto.includes(clave)) {
          const reply = getRandom(respuestas[clave]);
          await client.sendMessage(msg.key.remoteJid, { text: reply }, { quoted: msg });
          return;
        }
      }

      if (!texto.startsWith(prefix)) return;

      const sinPrefijo = texto.slice(prefix.length).trim();
      const args = sinPrefijo.split(/ +/);
      
      // 🔄 Tomar uno o dos términos como comando
      const command = args.length > 1 
        ? `${args[0]} ${args[1]}` 
        : args[0];

      const finalArgs = args.slice(command.includes(' ') ? 2 : 1);

      // ✅ Lista de comandos admin con espacio
      const adminCommands = [
        'tag',
        'grupo abrir',
        'grupo cerrar',
        'setreglas',
        'reglas',
        'ban',
        'anclar',
        'desanclar',
        'modo lento'
      ];

      if (adminCommands.includes(command)) {
        await admin(client, msg, command, finalArgs);
        return;
      }

      // Aquí puedes añadir llamadas a juegos, acciones, extras, premium, etc.

      await client.sendMessage(
        msg.key.remoteJid,
        { text: 'Comando no reconocido, usa .menu para ver la lista.' },
        { quoted: msg }
      );

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
      console.log('✅ Conectado a WhatsApp');
    }
  });

  client.ev.on('creds.update', () => {
    // Aquí puedes guardar las credenciales si usas persistencia
  });
}

startBot();