import yts from 'yt-search';

const triviaPreguntas = [
  { pregunta: '¿Capital de México?', opciones: ['Guadalajara', 'Monterrey', 'Ciudad de México'], respuesta: 2 },
  { pregunta: '¿Qué planeta es el más cercano al Sol?', opciones: ['Venus', 'Mercurio', 'Marte'], respuesta: 1 },
];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default async function premium(client, msg, command) {
  switch (command) {
    case 'trivia':
      const pregunta = getRandomItem(triviaPreguntas);
      let texto = `❓ ${pregunta.pregunta}\n`;
      pregunta.opciones.forEach((opt, i) => {
        texto += `${i + 1}. ${opt}\n`;
      });
      texto += 'Responde con el número correcto.';
      await msg.reply(texto);
      break;

    case 'play':
      const busqueda = msg.body.slice(msg.body.indexOf(' ') + 1);
      if (!busqueda) {
        await msg.reply('Escribe el nombre o link de la canción.');
        return;
      }
      try {
        const resultado = await yts(busqueda);
        if (resultado && resultado.videos.length > 0) {
          const video = resultado.videos[0];
          await msg.reply(`🎵 Reproduciendo: ${video.title}\nLink: ${video.url}`);
        } else {
          await msg.reply('No encontré esa canción.');
        }
      } catch {
        await msg.reply('Error buscando la canción.');
      }
      break;

    case 'sorteo':
      await msg.reply('Función de sorteo en desarrollo.');
      break;

    case 'clima':
      await msg.reply('Función de clima en desarrollo.');
      break;

    case 'traducir':
      await msg.reply('Función de traducción en desarrollo.');
      break;

    default:
      break;
  }
}
