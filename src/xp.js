import fs from 'fs'
const path = './data/xp.json'

if (!fs.existsSync(path)) fs.writeFileSync(path, '{}')

function getXP(user) {
  const data = JSON.parse(fs.readFileSync(path))
  return data[user] || 0
}

function addXP(user, amount) {
  const data = JSON.parse(fs.readFileSync(path))
  data[user] = (data[user] || 0) + amount
  fs.writeFileSync(path, JSON.stringify(data, null, 2))
}

function resetXP(user) {
  const data = JSON.parse(fs.readFileSync(path))
  data[user] = 0
  fs.writeFileSync(path, JSON.stringify(data, null, 2))
}

export { getXP, addXP, resetXP }