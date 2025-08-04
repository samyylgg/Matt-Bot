import { create, useSingleFileAuthState } from '@whiskeysockets/baileys'

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
const { state, saveState } = useSingleFileAuthState('./auth_info_multi.json')

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

async function startBot() {
  const client = await create({
    auth: state,
    printQRInTerminal: true
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

      // Sistema automático XP, monedas y niveles
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
            text: `🎉 ¡Felicidades @${user.split('@')[0]}! Has subido al nivel ${
              currentLevel + 1
            } 🥳`
          },
          { mentions: [user], quoted: msg }
        )
      }

      // Respuestas automáticas sin prefijo
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

      // Comandos monedas
      if (command === 'coins') {
        await coinsCommand(client, msg)
        return
      } else if (command === 'trabajar') {
        await trabajarCommand(client, msg)
        return
      } else if (command === 'addcoins') {
        const amount = parseInt(finalArgs[0]) || 0
        if (amount > 0) await addCoinsCommand(client, msg, amount)
        return
      }

      // Comandos niveles
      if (command === 'nivel') {
        await nivelCommand(client, msg)
        return
      } else if (command === 'addnivel') {
        const amount = parseInt(finalArgs[0]) || 0
        if (amount > 0) await addNivelCommand(client, msg, amount)
        return
      }

      // Otros comandos (juegos, acciones, etc.) aquí...

      await client.sendMessage(
        msg.key.remoteJid,
        { text: 'Comando no reconocido, usa .menu para ver la lista.' },
        { quoted: msg }
      )
    } catch (error) {
      console.error('Error en messages.upsert:', error)
    }
  })

  client.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update
    if (connection === 'close') {
      console.log('Conexión cerrada, intentando reconectar...')
      if (lastDisconnect?.error?.output?.statusCode !== 401) {
        startBot()
      } else {
        console.log('Error de autenticación, elimina auth_info_multi.json y vuelve a escanear QR.')
      }
    } else if (connection === 'open') {
      console.log('✅ Conectado a WhatsApp con sesión guardada')
    }
  })
}

startBot()