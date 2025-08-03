export default async function admin(client, msg, command) {
  const isGroup = msg.from.endsWith('@g.us');
  if (!isGroup) return;

  const chat = await msg.getChat();
  const sender = await client.getContactById(msg.author || msg.from);

  const isAdmin = chat.participants.find((p) => p.id._serialized === sender.id._serialized)?.admin || false;
  const isOwner = chat.owner === sender.id._serialized;

  if (command === 'tag') {
    if (!isAdmin && !isOwner) {
      await msg.reply('Solo administradores pueden usar este comando.');
      return;
    }
    let mentions = [];
    let text = '';
    for (const p of chat.participants) {
      const contact = await client.getContactById(p.id._serialized);
      mentions.push(contact);
      text += `@${contact.number} `;
    }
    await chat.sendMessage(text.trim(), { mentions });
    return;
  }

  if (command === 'grupo abrir') {
    if (!isAdmin && !isOwner) {
      await msg.reply('Solo administradores pueden usar este comando.');
      return;
    }
    await chat.setMessagesAdminsOnly(false);
    await msg.reply('Grupo abierto ✅');
    return;
  }

  if (command === 'grupo cerrar') {
    if (!isAdmin && !isOwner) {
      await msg.reply('Solo administradores pueden usar este comando.');
      return;
    }
    await chat.setMessagesAdminsOnly(true);
    await msg.reply('Grupo cerrado ❌');
    return;
  }

  if (command.startsWith('setreglas')) {
    if (!isAdmin && !isOwner) {
      await msg.reply('Solo administradores pueden usar este comando.');
      return;
    }
    const reglas = msg.body.slice(msg.body.indexOf(' ') + 1).trim();
    chat.groupMetadata.rules = reglas;
    await msg.reply('Reglas guardadas.');
    return;
  }

  if (command === 'reglas') {
    await msg.reply(chat.groupMetadata.rules || 'No se han definido reglas aún.');
    return;
  }

  if (command.startsWith('ban')) {
    if (!isAdmin && !isOwner) {
      await msg.reply('Solo administradores pueden usar este comando.');
      return;
    }
    if (msg.mentionedIds.length === 0) {
      await msg.reply('Menciona a la persona que deseas banear.');
      return;
    }
    for (const id of msg.mentionedIds) {
      await chat.removeParticipants([id]);
    }
    await msg.reply('Usuario(s) baneado(s).');
    return;
  }

  if (command === 'anclar') {
    if (!isAdmin && !isOwner) {
      await msg.reply('Solo administradores pueden usar este comando.');
      return;
    }
    const msgs = await chat.fetchMessages({ limit: 1 });
    if (msgs.length > 0) {
      await chat.pinMessage(msgs[0]);
      await msg.reply('Mensaje anclado.');
    } else {
      await msg.reply('No hay mensajes para anclar.');
    }
    return;
  }

  if (command === 'desanclar') {
    if (!isAdmin && !isOwner) {
      await msg.reply('Solo administradores pueden usar este comando.');
      return;
    }
    await chat.unpinAllMessages();
    await msg.reply('Mensajes desanclados.');
    return;
  }

  if (command === 'modo lento') {
    if (!isAdmin && !isOwner) {
      await msg.reply('Solo administradores pueden usar este comando.');
      return;
    }
    await msg.reply('Modo lento activado (función demo).');
    return;
  }
}
