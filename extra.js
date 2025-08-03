import fetch from 'node-fetch';

const memes = [
  'https://i.imgflip.com/30b1gx.jpg',
  'https://i.imgflip.com/26am.jpg',
  'https://i.imgflip.com/1bij.jpg',
  'https://i.imgflip.com/1otk96.jpg',
];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default async function extras(client, msg, command) {
  switch (command) {
    case 'meme':
      await client.sendMessage(msg.from, { image: { url: getRandomItem(memes) }, caption: '😂 Meme para ti' });
      break;

    case 'hora':
      const hora = new Date().toLocaleTimeString('es-MX', { timeZone: 'America/Mexico_City' });
      await msg.reply(`🕒 Hora CDMX: ${hora}`);
      break;

    case 'fecha':
      const fecha = new Date().toLocaleDateString('es-MX', { timeZone: 'America/Mexico_City' });
      await msg.reply(`📅 Fecha CDMX: ${fecha}`);
      break;

    case 'frase':
      const frases = [
        'La vida es bella 🌟',
        'Sigue tus sueños 🚀',
        'Nunca es tarde para aprender 📚',
        'Sonríe, hoy es un gran día 😊',
      ];
      await msg.reply(getRandomItem(frases));
      break;

    case 'say':
      const texto = msg.body.slice(msg.body.indexOf(' ') + 1).trim();
      if (!texto) {
        await msg.reply('Escribe un texto para que repita.');
        return;
      }
      await msg.reply(texto);
      break;

    case 'dog':
      try {
        const res = await fetch('https://dog.ceo/api/breeds/image/random');
        const json = await res.json();
        if (json.status === 'success') {
          await client.sendMessage(msg.from, { image: { url: json.message }, caption: '🐶 Perro random' });
        } else {
          await msg.reply('No pude obtener una imagen de perro 😢');
        }
      } catch {
        await msg.reply('Error al consultar la API de perros.');
      }
      break;

    case 'info':
      await msg.reply(
        `🤖 *Matt-Bot*\nVersión: 1.0.0\nAutor: Sam\nRepositorio: https://github.com/samyylgg/Matt-Bot`
      );
      break;

    case 'ping':
      await msg.reply('Pong 🏓');
      break;

    case 'chiste':
      const chistes = [
        '¿Por qué el libro de matemáticas estaba triste? Porque tenía muchos problemas.',
        '¿Qué hace una abeja en el gimnasio? ¡Zum-ba!',
        '¿Qué le dice un pez a otro? ¡Nada!',
      ];
      await msg.reply(getRandomItem(chistes));
      break;

    case 'gif':
      await client.sendMessage(msg.from, {
        video: { url: 'https://media.tenor.com/91ZV7vXgwG4AAAAC/hi-anime.gif' },
        gifPlayback: true,
      });
      break;

    default:
      break;
  }
}
