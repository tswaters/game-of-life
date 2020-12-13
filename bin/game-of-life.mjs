#!/usr/bin/node

import readline from 'readline'
import { init, calculate } from '../src/life.mjs'

if (!process.stdin.isTTY) {
  console.log('not a tty')
  process.exit(0)
}

let inputs = ['columns', 'rows']
let defaults = [process.stdout.columns, process.stdout.rows]
let values = []

const rl = readline.createInterface({ input: process.stdin, output: process.stdout, escapeCodeTimeout: 0 })

const prompt = (i) => process.stdout.write(`Enter input for ${inputs[i]} [${defaults[i]}]:`)

prompt(0)

for await (const line of rl) {
  const newValue = parseInt(line || defaults[values.length], 10)
  if (Number.isNaN(newValue)) {
    process.stdout.write('Bad string, try again?\n')
    continue
  }
  values.push(newValue)
  if (values.length === inputs.length) rl.close()
  else prompt(values.length)
}

const [cols, rows] = values

let grid = init(cols, rows)

const output = (x, y, value) => {
  readline.cursorTo(process.stdout, x, y + 2)
  process.stdout.write(value === 0 ? ' ' : 'X')
}

const repaint = () => {
  grid = calculate(...values, grid, output)
}

let tid

readline.emitKeypressEvents(process.stdin)

process.stdin.setRawMode(true)
process.stdin.on('keypress', (key, data) => {
  if ((data.ctrl && ['c', 'd'].includes(data.name)) || data.name === 'escape') {
    clearTimeout(tid)
    process.exit(0)
  }
  if (data.name === 'space') {
    if (tid) {
      clearInterval(tid)
      tid = null
    } else {
      tid = setInterval(repaint, 16)
    }
  }
  if (data.name === 'return') {
    if (tid) {
      clearInterval(tid)
      tid = null
    }
    repaint()
  }
})

process.stdin.resume()

readline.cursorTo(process.stdout, 0, 0)
process.stdout.write("Conway's Game of Life. [return] step [space] pause/resume [esc/ctrl-c/d] exit")
readline.clearScreenDown(process.stdout)
