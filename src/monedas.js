// src/monedas.js
import fs from 'fs';

const path = './data/monedas.json';

if (!fs.existsSync(path)) fs.writeFileSync(path, '{}');

export function getCoins(user) {
  const data = JSON.parse(fs.readFileSync(path));
  return data[user] || 0;
}

export function addCoins(user, amount) {
  const data = JSON.parse(fs.readFileSync(path));
  data[user] = (data[user] || 0) + amount;
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

export async function coinsCommand(client, msg) {
  const user = msg.key.participant || msg.key.remoteJid;
  const coins = getCoins(user);
  await client.sendMessage(msg.key.remoteJid, { text: `Tienes 💰 ${coins} monedas` }, { quoted: msg });
}

export async function trabajarCommand(client, msg) {
  const user = msg.key.participant || msg.key.remoteJid;
  const ganancias = Math.floor(Math.random() * 100);
  addCoins(user, ganancias);
  await client.sendMessage(msg.key.remoteJid, { text: `Trabajaste duro y ganaste 💰 ${ganancias} monedas!` }, { quoted: msg });
}

export async function addCoinsCommand(client, msg, amount) {
  const user = msg.key.participant || msg.key.remoteJid;
  addCoins(user, amount);
  await client.sendMessage(msg.key.remoteJid, { text: `Se añadieron ${amount} monedas a tu cuenta.` }, { quoted: msg });
}