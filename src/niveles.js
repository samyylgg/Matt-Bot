import fs from 'fs';
const path = './data/niveles.json';

// Asegura que el archivo exista
if (!fs.existsSync(path)) fs.writeFileSync(path, '{}');

function getNivel(user) {
  const data = JSON.parse(fs.readFileSync(path));
  return data[user] || 1; // Nivel inicial 1
}

function addNivel(user, amount) {
  const data = JSON.parse(fs.readFileSync(path));
  data[user] = (data[user] || 1) + amount;
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

// Comando para mostrar nivel
export async function nivelCommand(client, msg) {
  const user = msg.key.participant || msg.key.remoteJid;
  const nivel = getNivel(user);
  await client.sendMessage(msg.key.remoteJid, { text: `Tu nivel actual es: ⭐ ${nivel}` }, { quoted: msg });
}

// Comando para subir nivel manualmente
export async function addNivelCommand(client, msg, amount) {
  const user = msg.key.participant || msg.key.remoteJid;
  addNivel(user, amount);
  await client.sendMessage(msg.key.remoteJid, { text: `Se te agregó ⭐ ${amount} nivel(es)` }, { quoted: msg });
}