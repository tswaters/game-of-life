/**
 * Conway's game of life
 *
 * In an arbitrary grid, each tick should calculate the following for nodes that are alive and their immediete neighbors
 * => Any live cell with < 2 neighbours dies.
 * => Any live cell with {2, 3} neighbours lives.
 * => Any live cell with > 3 neighbours dies.
 * => Any dead cell with three live neighbours becomes live.
 *
 * todo:
 * => if any cell wasn't modified last round, and none of it's neightbors change, it won't change this round.
 *
 * usage:
 *
 * let grid = init(cols, rows)
 * let recalc = calculate(cols, rows, grid)
 * while(condition) {
 *   print(cols, rows, grid, (x, y, value) => {
 *     // print value at {x, y}
 *   })
 *   grid = recalc(cols, rows, grid)
 * }
 */

export const pointToIndex = (cols, rows, dx, dy) => {
  const xmod = dx % rows
  const ymod = dy % cols
  const x = xmod === 0 ? 0 : (dx < 0 ? rows : 0) + xmod
  const y = ymod === 0 ? 0 : (dy < 0 ? cols : 0) + ymod
  return x + y * rows
}

export const indexToPoint = (cols, rows, index) => [index % cols, Math.floor(index / cols)]

export const init = (cols, rows) => Array.from({ length: cols * rows }).map(() => Math.round(Math.random()))

export const calculate = (cols, rows, grid, cb) =>
  grid.map((value, index) => {
    const [x, y] = indexToPoint(cols, rows, index)
    const sum = [
      grid[pointToIndex(cols, rows, x - 1, y - 1)],
      grid[pointToIndex(cols, rows, x - 1, y)],
      grid[pointToIndex(cols, rows, x - 1, y + 1)],
      grid[pointToIndex(cols, rows, x, y - 1)],
      value,
      grid[pointToIndex(cols, rows, x, y + 1)],
      grid[pointToIndex(cols, rows, x + 1, y - 1)],
      grid[pointToIndex(cols, rows, x + 1, y)],
      grid[pointToIndex(cols, rows, x + 1, y + 1)],
    ].reduce((acc, item) => acc + item)
    let retval = 0
    if (sum === 3) retval = 1
    if (sum === 4) retval = value
    cb(x, y, retval)
    return retval
  })
