/**
 * Conway's game of life
 *
 * In an arbitrary grid, each tick should calculate the following for nodes that are alive and their immediete neighbors
 * => Any live cell with < 2 neighbours dies.
 * => Any live cell with {2, 3} neighbours lives.
 * => Any live cell with > 3 neighbours dies.
 * => Any dead cell with three live neighbours becomes live.
 * => If any cell wasn't modified last round, and none of it's neightbors change, it won't change this round.
 *
 * usage:
 *
 * const gen = life(cols, rows, () => Math.round(Math.random()))
 * // initial value will have all cells
 * gen.next().value.forEach(({ index, x, y, value }) => {
 *   print(x, y, value)
 * })
 *
 * const tid = setInterval(() => {
 *   const {done, value} = gen.next()
 *   if (done) clearInterval(tid)
 *   const {changes, generation} = value
 *   // changes is a Set, generation is an int
 *   changes.forEach(({ index, x, y, value }) => {
 *     print(x, y, value)
 *   })
 * }, 0)
 *
 */

export const pointToIndex = (cols, rows, dx, dy) => {
  const xmod = dx % cols
  const ymod = dy % rows
  const x = xmod === 0 ? 0 : (dx < 0 ? cols : 0) + xmod
  const y = ymod === 0 ? 0 : (dy < 0 ? rows : 0) + ymod
  return x + y * cols
}

const chunkBitArray = (array) => {
  let newArray = []
  for (let i = 0; i < array.length; i += 64) {
    const bin = array
      .slice(i, i + 64)
      .map((x) => x.value)
      .join('')
    newArray.push(BigInt(`0b${bin}`))
  }
  return newArray
}

export const indexToPoint = (cols, rows, index) => [index % cols, Math.floor(index / cols)]

export default function* (cols, rows, cb = () => Math.round(Math.random()), historyToKeep = 6) {
  const cells = Array.from({ length: cols * rows }).map((_, index) => ({ index }))
  let inspections = new Set([
    ...cells.map((cell, index, array) => {
      const x = (cell.x = index % cols)
      const y = (cell.y = Math.floor(index / cols))
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
      ].map((neightbourIndex) => array[neightbourIndex])
      return cell
    }),
  ])

  let generation = 0
  const history = [chunkBitArray(cells)]

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

    const newHistory = chunkBitArray(cells)

    if (history.some((h) => h.every((x, i) => newHistory[i] === x))) {
      break // we're done here.
    }

    history.unshift(newHistory)
    if (history.length > historyToKeep) {
      history.pop()
    }

    yield { generation, changes }
  }
}
