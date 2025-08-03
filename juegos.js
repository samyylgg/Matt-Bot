const opciones = ['piedra', 'papel', 'tijera'];

const partidas1v1 = new Map();

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default async function juegos(client, msg, command) {
  const chatId = msg.from;
  const senderId = msg.author || msg.from;

  if (command === 'piedrapapeltijera') {
    partidas1v1.set(chatId, { jugadores: [], turno: 0, jugadas: {} });
    await msg.reply('Juego piedra-papel-tijera iniciado! Esperando a 2 jugadores, escribe ".unirse" para participar.');
    return;
  }

  if (command === 'unirse') {
    if (!partidas1v1.has(chatId)) {
      await msg.reply('No hay juegos activos para unirse.');
      return;
    }
    const partida = partidas1v1.get(chatId);
    if (partida.jugadores.includes(senderId)) {
      await msg.reply('Ya estás en la partida.');
      return;
    }
    partida.jugadores.push(senderId);
    partidas1v1.set(chatId, partida);

    await msg.reply(`Jugador ${partida.jugadores.length} se unió.`);

    if (partida.jugadores.length === 2) {
      await msg.reply('Los dos jugadores están listos. Cada uno envía ".piedra", ".papel" o ".tijera" para jugar.');
    }
    return;
  }

  if (['piedra', 'papel', 'tijera'].includes(command)) {
    if (!partidas1v1.has(chatId)) {
      const botEleccion = getRandomItem(opciones);
      let resultado = 'Empate';
      if (
        (command === 'piedra' && botEleccion === 'tijera') ||
        (command === 'papel' && botEleccion === 'piedra') ||
        (command === 'tijera' && botEleccion === 'papel')
      ) resultado = 'Ganaste!';
      else if (command !== botEleccion) resultado = 'Perdiste!';
      await msg.reply(`Yo elegí: ${botEleccion}. ${resultado}`);
      return;
    }
    const partida = partidas1v1.get(chatId);
    if (!partida.jugadores.includes(senderId)) {
      await msg.reply('No estás en la partida.');
      return;
    }
    if (partida.jugadas[senderId]) {
      await msg.reply('Ya hiciste tu jugada.');
      return;
    }
    partida.jugadas[senderId] = command;
    partidas1v1.set(chatId, partida);
    await msg.reply(`Jugada recibida de <@${senderId.split('@')[0]}>`);

    if (Object.keys(partida.jugadas).length === 2) {
      const [jugador1, jugador2] = partida.jugadores;
      const jug1 = partida.jugadas[jugador1];
      const jug2 = partida.jugadas[jugador2];

      let resultado = 'Empate!';
      if (
        (jug1 === 'piedra' && jug2 === 'tijera') ||
        (jug1 === 'papel' && jug2 === 'piedra') ||
        (jug1 === 'tijera' && jug2 === 'papel')
      ) resultado = `<@${jugador1.split('@')[0]}> gana! 🎉`;
      else if (
        (jug2 === 'piedra' && jug1 === 'tijera') ||
        (jug2 === 'papel' && jug1 === 'piedra') ||
        (jug2 === 'tijera' && jug1 === 'papel')
      ) resultado = `<@${jugador2.split('@')[0]}> gana! 🎉`;

      await client.sendMessage(chatId, { text: `Resultados:\n<@${jugador1.split('@')[0]}>: ${jug1}\n<@${jugador2.split('@')[0]}>: ${jug2}\n${resultado}`, mentions: [await client.getContactById(jugador1), await client.getContactById(jugador2)] });

      partidas1v1.delete(chatId);
    }
  }
}
