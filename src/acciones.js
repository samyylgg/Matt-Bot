const acciones = {
  abrazar: [
    'https://media.giphy.com/media/l2QDM9Jnim1YVILXa/giphy.gif',
    'https://media.tenor.com/images/8ecf5ae8f7b9d969e07075ff92b4ab43/tenor.gif',
  ],
  besar: [
    'https://media.giphy.com/media/G3va31oEEnIkM/giphy.gif',
    'https://media.tenor.com/images/bc82ac78d1d6d21590eb3e4775c9a383/tenor.gif',
  ],
  saludar: [
    'https://media.giphy.com/media/hvRJCLFzcasrR4ia7z/giphy.gif',
    'https://media.tenor.com/images/01f9e5bb7a775ab7643aa37d3c5949fa/tenor.gif',
  ],
  acariciar: [
    'https://media.giphy.com/media/109ltuoSQT212w/giphy.gif',
    'https://media.tenor.com/images/8f15d3f0b528191468562dc080e9a8e1/tenor.gif',
  ],
  reir: [
    'https://media.giphy.com/media/11sBLVxNs7v6WA/giphy.gif',
    'https://media.tenor.com/images/7ecb0b1155376b3dd6a03e969d0a55f8/tenor.gif',
  ],
  llorar: [
    'https://media.giphy.com/media/ROF8OQvDmxytW/giphy.gif',
    'https://media.tenor.com/images/2c2f058d7d5a47a1b0914c39ed239f1d/tenor.gif',
  ],
  dormir: [
    'https://media.giphy.com/media/3o7aTskHEUdgCQAXde/giphy.gif',
    'https://media.tenor.com/images/9e1b3a19ffb7f83e7d63b5b7d9314dcb/tenor.gif',
  ],
  bailar: [
    'https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif',
    'https://media.tenor.com/images/0b8bfb66d1a6f23a9b42a9a57b83865b/tenor.gif',
  ],
  cantar: [
    'https://media.giphy.com/media/3o6Zt8MgUuvSbkZYWc/giphy.gif',
    'https://media.tenor.com/images/6de6eaf7871b169b4f04aef4aa6a2a30/tenor.gif',
  ],
  enojar: [
    'https://media.giphy.com/media/jLeyZWgtwgr2U/giphy.gif',
    'https://media.tenor.com/images/4ed8929f2a4220857729b3f6e3e812c5/tenor.gif',
  ],
  pensar: [
    'https://media.giphy.com/media/3o6ZtaO9BZHcOjmErm/giphy.gif',
    'https://media.tenor.com/images/af04abfb821d0e1112c3c65f5fdf11e3/tenor.gif',
  ],
  saludarmanos: [
    'https://media.giphy.com/media/l0MYB8Ory7Hqefo9a/giphy.gif',
    'https://media.tenor.com/images/f4f93a2f5b645eec61a9aa3f780a317c/tenor.gif',
  ],
  saltar: [
    'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif',
    'https://media.tenor.com/images/f60acba15e124fcb4dc65db6a3d289d3/tenor.gif',
  ],
  comer: [
    'https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif',
    'https://media.tenor.com/images/2ee0a5d0ec885db2ce8108e3542f4c8c/tenor.gif',
  ],
  beber: [
    'https://media.giphy.com/media/l4EoVld31e6NAbDOw/giphy.gif',
    'https://media.tenor.com/images/245d8af334e19e96e7ca6f1ccac234f6/tenor.gif',
  ],
  patear: [
    'https://media.giphy.com/media/3oz8xH9Qtv3wmKZB8Y/giphy.gif',
    'https://media.tenor.com/images/ccae97621c702dcf94f0e997ed418937/tenor.gif',
  ],
  chocar: [
    'https://media.giphy.com/media/l0MYvYc1n3Kx0Kpqw/giphy.gif',
    'https://media.tenor.com/images/d519b404a2365c54a9d94acb682d8a93/tenor.gif',
  ],
  empujar: [
    'https://media.giphy.com/media/xT0xeJpnrWC4XWblEk/giphy.gif',
    'https://media.tenor.com/images/5078aa27e9d1a7d779bc166204f65d32/tenor.gif',
  ],
  saludarHola: [
    'https://media.giphy.com/media/ASd0Ukj0y3qMM/giphy.gif',
    'https://media.tenor.com/images/13e10b138c465f8c7a879ae3a218f0f6/tenor.gif',
  ],
};

function getRandomGif(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default async function acciones(client, msg, command) {
  if (!acciones[command]) {
    await msg.reply('Comando de acción no encontrado.');
    return;
  }
  const gif = getRandomGif(acciones[command]);
  await client.sendMessage(msg.from, {
    video: { url: gif },
    gifPlayback: true,
    caption: `*${command.charAt(0).toUpperCase() + command.slice(1)}*`,
  });
}
