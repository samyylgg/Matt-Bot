export default async function admin(client, msg, command, args) {
  const jid = msg.key.remoteJid;
  const sender = msg.key.participant || msg.key.remoteJid;
  const textArgs = args.join(' ');

  switch (command) {
    case 'tag':
      const groupMetadata = await client.groupMetadata(jid);
      const mentions = groupMetadata.participants.map(p => p.id);
      await client.sendMessage(jid, {
        text: textArgs || '¡Todos!',
        mentions
      }, { quoted: msg });
      break;

    case 'grupo abrir':
      await client.groupSettingUpdate(jid, 'not_announcement');
      await client.sendMessage(jid, { text: '✅ Grupo abierto para todos.' }, { quoted: msg });
      break;

    case 'grupo cerrar':
      await client.groupSettingUpdate(jid, 'announcement');
      await client.sendMessage(jid, { text: '🔒 Grupo cerrado solo para admins.' }, { quoted: msg });
      break;

    case 'setreglas':
      if (!textArgs) {
        await client.sendMessage(jid, { text: 'Debes escribir las reglas. Ejemplo:\n.setreglas No spam, no insultos.' }, { quoted: msg });
        return;
      }
      global.reglas = textArgs;
      await client.sendMessage(jid, { text: '✅ Reglas actualizadas.' }, { quoted: msg });
      break;

    case 'reglas':
      const reglas = global.reglas || '⚠️ No se han establecido reglas aún.';
      await client.sendMessage(jid, { text: `📜 *Reglas del grupo:*\n${reglas}` }, { quoted: msg });
      break;

    case 'ban':
      if (!msg.message.extendedTextMessage?.contextInfo?.participant) {
        await client.sendMessage(jid, { text: 'Responde al mensaje del usuario que deseas banear.' }, { quoted: msg });
        return;
      }
      const banId = msg.message.extendedTextMessage.contextInfo.participant;
      await client.groupParticipantsUpdate(jid, [banId], 'remove');
      await client.sendMessage(jid, { text: `👢 Usuario eliminado.` }, { quoted: msg });
      break;

    case 'anclar':
      if (!textArgs) {
        await client.sendMessage(jid, { text: 'Debes escribir el mensaje a anclar.' }, { quoted: msg });
        return;
      }
      global.anclado = textArgs;
      await client.sendMessage(jid, { text: `📌 Mensaje anclado:\n${textArgs}` }, { quoted: msg });
      break;

    case 'desanclar':
      global.anclado = null;
      await client.sendMessage(jid, { text: '📍 Mensaje desanclado.' }, { quoted: msg });
      break;

    case 'modo lento':
      await client.sendMessage(jid, { text: '🕐 Modo lento activado (simbólico).' }, { quoted: msg });
      break;

    default:
      await client.sendMessage(jid, { text: '⚠️ Comando de administración no reconocido.' }, { quoted: msg });
      break;
  }
}