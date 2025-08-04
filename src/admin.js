import fs from 'fs';

const reglasPath = './data/reglas.json';

function guardarReglas(jid, textoReglas) {
  let reglasData = {};
  if (fs.existsSync(reglasPath)) {
    reglasData = JSON.parse(fs.readFileSync(reglasPath));
  }
  reglasData[jid] = textoReglas;
  fs.writeFileSync(reglasPath, JSON.stringify(reglasData, null, 2));
}

function leerReglas(jid) {
  if (!fs.existsSync(reglasPath)) return null;
  const reglasData = JSON.parse(fs.readFileSync(reglasPath));
  return reglasData[jid] || null;
}

export default async function admin(client, msg, command) {
  const jid = msg.key.remoteJid;
  if (!jid.endsWith('@g.us')) return; // Solo grupos

  const chat = await client.groupMetadata(jid);
  const senderId = msg.key.participant || msg.key.remoteJid;

  const participante = chat.participants.find(p => p.id === senderId);
  const isAdmin = participante?.admin === 'admin' || participante?.admin === 'superadmin';
  const isOwner = chat.owner === senderId;

  // Comprobar permisos
  if (
    ['tag', 'grupo abrir', 'grupo cerrar', 'setreglas', 'ban', 'anclar', 'desanclar', 'modo lento'].includes(command)
    && !isAdmin && !isOwner
  ) {
    await client.sendMessage(jid, { text: '⚠️ Solo administradores pueden usar este comando.' }, { quoted: msg });
    return;
  }

  switch (command) {
    case 'tag': {
      let mentions = [];
      let texto = '';
      for (const p of chat.participants) {
        mentions.push({ id: p.id, role: p.admin || 'user' });
        texto += `@${p.id.split('@')[0]} `;
      }
      await client.sendMessage(jid, { text: texto.trim(), mentions });
      break;
    }

    case 'grupo abrir': {
      await client.groupSettingUpdate(jid, 'announcement', false);
      await client.sendMessage(jid, { text: '✅ Grupo abierto para todos.' });
      break;
    }

    case 'grupo cerrar': {
      await client.groupSettingUpdate(jid, 'announcement', true);
      await client.sendMessage(jid, { text: '❌ Grupo cerrado solo para admins.' });
      break;
    }

    case 'setreglas': {
      const body = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
      const textoReglas = body.slice(body.indexOf(' ') + 1).trim();
      if (!textoReglas) {
        await client.sendMessage(jid, { text: 'Escribe las reglas después del comando.' }, { quoted: msg });
        break;
      }
      guardarReglas(jid, textoReglas);
      await client.sendMessage(jid, { text: '📜 Reglas guardadas correctamente.' });
      break;
    }

    case 'reglas': {
      const reglas = leerReglas(jid);
      if (!reglas) {
        await client.sendMessage(jid, { text: 'No hay reglas definidas para este grupo.' });
        break;
      }
      await client.sendMessage(jid, { text: `📜 Reglas del grupo:\n\n${reglas}` });
      break;
    }

    case 'ban': {
      if (!msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length) {
        await client.sendMessage(jid, { text: 'Menciona al usuario que deseas banear.' }, { quoted: msg });
        break;
      }
      const usuariosBan = msg.message.extendedTextMessage.contextInfo.mentionedJid;
      try {
        await client.groupParticipantsUpdate(jid, usuariosBan, 'remove');
        await client.sendMessage(jid, { text: 'Usuario(s) baneado(s) correctamente.' });
      } catch {
        await client.sendMessage(jid, { text: 'No se pudo banear a uno o más usuarios.' });
      }
      break;
    }

    case 'anclar': {
      try {
        await client.groupPinMessage(jid, msg.key.id);
        await client.sendMessage(jid, { text: 'Mensaje anclado.' });
      } catch {
        await client.sendMessage(jid, { text: 'No se pudo anclar el mensaje.' });
      }
      break;
    }

    case 'desanclar': {
      try {
        await client.groupUnpinAllMessages(jid);
        await client.sendMessage(jid, { text: 'Mensajes desanclados.' });
      } catch {
        await client.sendMessage(jid, { text: 'No se pudieron desanclar los mensajes.' });
      }
      break;
    }

    case 'modo lento': {
      try {
        // Cambia el número 10 por los segundos que quieras para slowmode
        await client.groupSettingUpdate(jid, 'slowmode', 10);
        await client.sendMessage(jid, { text: 'Modo lento activado: 10 segundos entre mensajes.' });
      } catch {
        await client.sendMessage(jid, { text: 'No se pudo activar el modo lento.' });
      }
      break;
    }

    default:
      await client.sendMessage(jid, { text: 'Comando de admin no reconocido.' }, { quoted: msg });
  }
}