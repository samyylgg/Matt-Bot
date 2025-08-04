export default async function admin(client, msg, command, args) {
  const isGroup = msg.key.remoteJid.endsWith('@g.us');
  if (!isGroup) {
    await client.sendMessage(msg.key.remoteJid, { text: 'Este comando solo funciona en grupos.' }, { quoted: msg });
    return;
  }

  if (command === 'tag') {
    const chat = await client.groupMetadata(msg.key.remoteJid);
    let mentions = [];
    let text = 'Etiquetando a todos:\n';
    for (const participant of chat.participants) {
      mentions.push(participant.id);
      text += `@${participant.id.split('@')[0]} `;
    }
    await client.sendMessage(msg.key.remoteJid, { text, mentions }, { quoted: msg });
    return;
  }

  // Aquí puedes agregar más comandos admin
  if (command === 'grupo abrir') {
    await client.groupSettingUpdate(msg.key.remoteJid, 'not_announcement');
    await client.sendMessage(msg.key.remoteJid, { text: 'Grupo abierto para todos' }, { quoted: msg });
    return;
  }

  if (command === 'grupo cerrar') {
    await client.groupSettingUpdate(msg.key.remoteJid, 'announcement');
    await client.sendMessage(msg.key.remoteJid, { text: 'Grupo cerrado, solo admins pueden enviar mensajes' }, { quoted: msg });
    return;
  }

  await client.sendMessage(msg.key.remoteJid, { text: `Comando admin "${command}" no implementado aún.` }, { quoted: msg });
}