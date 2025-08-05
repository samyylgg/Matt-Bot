import makeWASocket, {
  DisconnectReason,
  useSingleFileAuthState,
  fetchLatestBaileysVersion
} from '@whiskeysockets/baileys'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import cfonts from 'cfonts'

// Importar comandos
import admin from './src/admin.js'
import acciones from './src/acciones.js'
import juegos from './src/juegos.js'
import extras from './src/extras.js'
import premium from './src/premium.js'
import { respuestas } from './src/respuestas.js'
import {
  coinsCommand,
  trabajarCommand,
  addCoinsCommand,
  getCoins,
  addCoins
} from './src/monedas.js'
import {
  nivelCommand,
  addNivelCommand,
  getNivel,
  addNivel
} from './src/niveles.js'
import { getXP, addXP, resetXP } from './src/xp.js'

const prefix = '.'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const { state, saveState } = useSingleFileAuthState('./auth_info_multi.json')

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

async function startBot() {
  const { version } = await fetchLatestBaileysVersion()

  cfonts.say('Matt-Bot', {
    font: 'block',
    align: 'center',
    colors: ['cyan', 'magenta']
  })

  const client = makeWASocket({
    version,
    printQRInTerminal: true,
    auth: state
  })

  client.ev.on('creds.update', saveState)

  client.ev.on('messages.upsert', async (m) => {
    try {
      if (!m.messages || m.type !== 'notify') return

      const msg = m.messages[0]
      if (!msg.message || msg.key.fromMe) return

      const text =
        msg.message.conversation ||
        msg.message.extendedTextMessage?.text ||
        ''
      const texto = text.toLowerCase()
      const user = msg.key.participant || msg.key.remoteJid

      // XP, monedas, niveles
      addXP(user, 5)
      addCoins(user, 1)

      const currentXP = getXP(user)
      const currentLevel = getNivel(user)
      const requiredXP = 50 * currentLevel * currentLevel

      if (currentXP >= requiredXP) {
        addNivel(user, 1)
        resetXP(user)
        await client.sendMessage(
          msg.key.remoteJid,
          {
            text: `🎉 ¡Felicidades @${user.split('@')[0]}! Has subido al nivel ${currentLevel + 1} 🥳`
          },
          { mentions: [user], quoted: msg }
        )
      }

      for (const clave in respuestas) {
        if (texto.includes(clave)) {
          const reply = getRandom(respuestas[clave])
          await client.sendMessage(msg.key.remoteJid, { text: reply }, { quoted: msg })
          return
        }
      }

      if (!texto.startsWith(prefix)) return

      const sinPrefijo = texto.slice(prefix.length).trim()
      const args = sinPrefijo.split(/ +/)
      const command = args.length > 1 ? `${args[0]} ${args[1]}` : args[0]
      const finalArgs = args.slice(command.includes(' ') ? 2 : 1)

      const adminCommands = [
        'tag',
        'grupo abrir',
        'grupo cerrar',
        'setreglas',
        'reglas',
        'ban',
        'anclar',
        'desanclar',
        'modo lento'
      ]

      if (adminCommands.includes(command)) {
        await admin(client, msg, command, finalArgs)
        return
      }

      if (command === 'coins') return await coinsCommand(client, msg)
      if (command === 'trabajar') return await trabajarCommand(client, msg)
      if (command === 'addcoins') {
        const amount = parseInt(finalArgs[0]) || 0
        if (amount > 0) await addCoinsCommand(client, msg, amount)
        return
      }

      if (command === 'nivel') return await nivelCommand(client, msg)
      if (command === 'addnivel') {
        const amount = parseInt(finalArgs[0]) || 0
        if (amount > 0) await addNivelCommand(client, msg, amount)
        return
      }

      await acciones(client, msg, command, finalArgs)
      await juegos(client, msg, command, finalArgs)
      await extras(client, msg, command, finalArgs)
      await premium(client, msg, command, finalArgs)
    } catch (e) {
      console.error('Error en mensaje:', e)
    }
  })

  client.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update
    if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== 401
      console.log('Conexión cerrada', shouldReconnect ? 'reconectando...' : 'sesión inválida')
      if (shouldReconnect) startBot()
    } else if (connection === 'open') {
      console.log('✅ Conectado a WhatsApp')
    }
  })
}

startBot()
