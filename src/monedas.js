import fs from 'fs'

const path = './data/monedas.json'

// Asegura que el archivo exista
if (!fs.existsSync(path)) fs.writeFileSync(path, '{}')

// Función para obtener monedas de un usuario
export function getCoins(user) {
  const data = JSON.parse(fs.readFileSync(path))
  return data[user] || 0
}

// Función para añadir monedas a un usuario
export function addCoins(user, amount) {
  const data = JSON.parse(fs.readFileSync(path))
  data[user] = (data[user] || 0) + amount
  fs.writeFileSync(path, JSON.stringify(data, null, 2))
}

// Comandos del sistema de monedas
export const comandosMonedas = {
  '.coins': async (msg) => {
    const user = msg.author || msg.sender.id
    const coins = getCoins(user)
    await msg.reply(`Tienes 💰 ${coins} monedas`)
  },

  '.trabajar': async (msg) => {
    const user = msg.author || msg.sender.id
    const ganancias = Math.floor(Math.random() * 100)
    addCoins(user, ganancias)
    await msg.reply(`Trabajaste duro y ganaste 💰 ${ganancias} monedas!`)
  }
}