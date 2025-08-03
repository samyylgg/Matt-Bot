const fs = require('fs')
const path = './data/monedas.json'

// Asegura que el archivo exista
if (!fs.existsSync(path)) fs.writeFileSync(path, '{}')

// Función para leer y escribir
function getCoins(user) {
  const data = JSON.parse(fs.readFileSync(path))
  return data[user] || 0
}

function addCoins(user, amount) {
  const data = JSON.parse(fs.readFileSync(path))
  data[user] = (data[user] || 0) + amount
  fs.writeFileSync(path, JSON.stringify(data, null, 2))
}

module.exports = {
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
  },
}
