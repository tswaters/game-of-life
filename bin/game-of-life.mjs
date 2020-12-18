#!/usr/bin/node

import readline from 'readline'
import life from '../src/life.mjs'

if (!process.stdin.isTTY) {
  console.log('not a tty')
  process.exit(0)
}

let inputs = ['columns', 'rows']
let defaults = [process.stdout.columns, process.stdout.rows - 1]
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

let gen = life(cols, rows)

readline.emitKeypressEvents(process.stdin)

process.stdin.setRawMode(true)
process.stdin.on('keypress', (ch, key) => {
  if (key && key.ctrl && key.name === 'c') {
    end()
  } else {
    gen = life(cols, rows)
  }
})

const tid = setInterval(() => {
  const { done, value } = gen.next()
  if (done) return end()

  const { changes, generation } = value
  process.stdout.write('\x1b[1;1H') // cursor 0,0
  process.stdout.write(`Conway's Game of Life. Generation ${generation}`)

  changes.forEach(({ x, y, value }) => {
    readline.cursorTo(process.stdout, x, y + 1)
    process.stdout.write(value ? '\u2588' : ' ')
  })
})

process.stdin.resume()
process.stdout.write('\x1b[2J') // clear screen
process.stdout.write('\x1b[?25l') // hide cursor

function end() {
  process.stdout.write('\x1b[1;1H') // cursor 0,0
  process.stdout.write('\x1b[2J') // clear screen
  process.stdout.write('\x1b[?25h') // show cursor
  process.stdin.unref()
  clearTimeout(tid)
}
