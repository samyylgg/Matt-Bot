module.exports = {
  onParticipantAdded: async (participant, group) => {
    const nombre = participant.pushname || 'Usuario'
    const bienvenida = `👋 ¡Bienvenido/a ${nombre} al grupo *${group.subject}*!`
    await group.sendMessage(bienvenida)
  },

  onParticipantRemoved: async (participant, group) => {
    const nombre = participant.pushname || 'Usuario'
    const despedida = `👋 ${nombre} salió del grupo. ¡Le deseamos lo mejor!`
    await group.sendMessage(despedida)
  },
}
