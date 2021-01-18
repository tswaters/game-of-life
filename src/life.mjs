/* Conway's game of life

In an arbitrary grid, each tick should calculate the following for nodes that are alive and their immediete neighbors
=> Any live cell with < 2 neighbours dies.
=> Any live cell with {2, 3} neighbours lives.
=> Any live cell with > 3 neighbours dies.
=> Any dead cell with three live neighbours becomes live.
=> If any cell wasn't modified last round, and none of it's neightbors change, it won't change this round.

usage:

const seed = (i) => Math.round(Math.random())
const gen = life(cols, rows, seed)
const cancel = () => gen.return()

for await (const {generation, changes} of gen}) {
  for (const { index, x, y, value } of changes) {
    print(x, y, value)
  }
}

*/

export const pointToIndex = (cols, rows, dx, dy) => {
  const xmod = dx % cols
  const ymod = dy % rows
  const x = xmod === 0 ? 0 : (dx < 0 ? cols : 0) + xmod
  const y = ymod === 0 ? 0 : (dy < 0 ? rows : 0) + ymod
  return x + y * cols
}

export const indexToPoint = (cols, rows, index) => [index % cols, Math.floor(index / cols)]

/* global setImmediate, requestAnimationFrame */
const next = typeof requestAnimationFrame !== 'undefined' ? requestAnimationFrame : setImmediate

export default async function* (cols, rows, cb = () => Math.round(Math.random()), historyToKeep = 6) {
  const history = new Array(historyToKeep)

  const cells = Array.from({ length: cols * rows }).map((_, index) => ({ index }))

  let inspections = new Set([
    // this map requires mutation and returning the original cell, for the set additions to work properly.
    ...cells.map((cell, index, array) => {
      const [x, y] = indexToPoint(cols, rows, index)
      cell.x = x
      cell.y = y
      cell.value = cb(index)
      cell.neighbours = [
        pointToIndex(cols, rows, x - 1, y - 1),
        pointToIndex(cols, rows, x - 1, y),
        pointToIndex(cols, rows, x - 1, y + 1),
        pointToIndex(cols, rows, x, y - 1),
        pointToIndex(cols, rows, x, y + 1),
        pointToIndex(cols, rows, x + 1, y - 1),
        pointToIndex(cols, rows, x + 1, y),
        pointToIndex(cols, rows, x + 1, y + 1),

        // same idea, `array[index]` points at the original reference
      ].map((neightbourIndex) => array[neightbourIndex])
      return cell
    }),
  ])

  let generation = 0

  yield { changes: inspections, generation }

  while (true) {
    generation++
    const changes = new Set()
    const newInspections = new Set()

    inspections.forEach((cell) => {
      const sum = cell.neighbours.reduce((acc, neighbour) => acc + neighbour.value, cell.value)
      let retval = 0
      if (sum === 3) retval = 1
      if (sum === 4) retval = cell.value
      if (retval !== cell.value) {
        cell.newValue = retval
        changes.add(cell)
        newInspections.add(cell)
        cell.neighbours.forEach((neighbour) => newInspections.add(neighbour))
      }
    })

    inspections = newInspections

    changes.forEach((cell) => {
      cell.value = cell.newValue
      delete cell.newValue
    })

    // my very naive approach to determining if the pattern is repeating: if same generation shows up again, it's repeating.
    // don't really want to compare each value of the entire array * number of histories to keep, with each iteration of the generator
    // so, the bit array is chunked into a BigInt (each element taking 64 bits), and those are compared.
    // they are still compared, (i.e., I'm sure there's a better way to do this), but this results in 64x less array iterations.

    let newHistory = []

    for (let i = 0; i < cells.length; i += 64) {
      newHistory.push(
        BigInt(
          `0b${cells
            .slice(i, i + 64)
            .map((x) => x.value)
            .join('')}`
        )
      )
    }

    if (history.some((h) => h.every((x, i) => newHistory[i] === x))) {
      break // we're done here.
    }

    history.unshift(newHistory)
    if (history.length > historyToKeep) history.pop()

    yield { generation, changes }
    await new Promise((resolve) => next(() => resolve()))
  }
}
