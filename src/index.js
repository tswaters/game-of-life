/* eslint-env browser */

import life from './life.mjs'

const generationSpan = document.getElementById('generation')
const seedSpan = document.getElementById('seed')
const trackedSpan = document.getElementById('tracked')
const canvas = document.getElementById('canvas')

const seed = parseInt(Math.random().toString().substr(2), 10)
const createRandom = (s) => () => ((2 ** 31 - 1) & (s = Math.imul(48271, s))) / 2 ** 31
const random = createRandom(seed)
seedSpan.innerHTML = seed.toString()

const width = (canvas.width = 800)
const height = (canvas.height = 800)
const ctx = canvas.getContext('2d')
const imageData = ctx.createImageData(width, height)

const gen = life(width, height, () => Math.round(random()))

document.addEventListener('keydown', (evt) => {
  if (evt.key === 'Escape') gen.return()
})

// browsers don't support top-level await yet
;(async () => {
  for await (const { generation, changes } of gen) {
    generationSpan.innerHTML = generation.toString()
    trackedSpan.innerHTML = changes.size.toString()

    for (const { x, y, value } of changes) {
      const newColor = value * 0xff
      const i = y * (imageData.width * 4) + x * 4
      imageData.data[i] = newColor
      imageData.data[i + 1] = newColor
      imageData.data[i + 2] = newColor
      imageData.data[i + 3] = 0xff
    }

    ctx.putImageData(imageData, 0, 0)
  }
})().catch(console.error)
