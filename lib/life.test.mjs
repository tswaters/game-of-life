import mocha from 'mocha'
import assert from 'assert'
import { init, pointToIndex, indexToPoint } from './life.mjs'

//  0  1  2  3  4
//  5  6  7  8  9
// 10 11 12 13 14
// 15 16 17 18 19
// 20 21 22 23 24

const tests = [
  {
    grid: [5, 5],
    fn: indexToPoint,
    spec: [
      [[0], [0, 0]],
      [[1], [1, 0]],
      [[2], [2, 0]],
      [[3], [3, 0]],
      [[4], [4, 0]],
      [[5], [0, 1]],
      [[6], [1, 1]],
      [[7], [2, 1]],
      [[8], [3, 1]],
      [[9], [4, 1]],
      [[10], [0, 2]],
      [[11], [1, 2]],
      [[12], [2, 2]],
      [[13], [3, 2]],
      [[14], [4, 2]],
      [[15], [0, 3]],
      [[16], [1, 3]],
      [[17], [2, 3]],
      [[18], [3, 3]],
      [[19], [4, 3]],
      [[20], [0, 4]],
      [[21], [1, 4]],
      [[22], [2, 4]],
      [[23], [3, 4]],
      [[24], [4, 4]],
    ],
  },
  {
    grid: [5, 5],
    fn: pointToIndex,
    spec: [
      // wrapping around x, positive
      [[0, 0], 0],
      [[1, 0], 1],
      [[2, 0], 2],
      [[3, 0], 3],
      [[4, 0], 4],
      [[5, 0], 0],
      [[6, 0], 1],
      [[7, 0], 2],
      [[8, 0], 3],
      [[9, 0], 4],
      [[10, 0], 0],

      // wrapping around x, negative
      [[-1, 0], 4],
      [[-2, 0], 3],
      [[-3, 0], 2],
      [[-4, 0], 1],
      [[-5, 0], 0],
      [[-6, 0], 4],
      [[-7, 0], 3],
      [[-8, 0], 2],
      [[-9, 0], 1],
      [[-10, 0], 0],

      // wrapping around y, positive
      [[0, 0], 0],
      [[0, 1], 5],
      [[0, 2], 10],
      [[0, 3], 15],
      [[0, 4], 20],
      [[0, 5], 0],
      [[0, 6], 5],
      [[0, 7], 10],
      [[0, 8], 15],
      [[0, 9], 20],
      [[0, 10], 0],

      // wrapping around y, negative
      [[0, -1], 20],
      [[0, -2], 15],
      [[0, -3], 10],
      [[0, -4], 5],
      [[0, -5], 0],
      [[0, -6], 20],
      [[0, -7], 15],
      [[0, -8], 10],
      [[0, -9], 5],
      [[0, -10], 0],
    ],
  },
]

mocha.describe('toroidal-index', () => {
  tests.forEach(({ grid, fn, spec }) => {
    mocha.describe(`${fn.name} {${grid.join(',')}}`, () => {
      spec.forEach(([args, expected, only = false]) => {
        const name = `[${args.join(',')}] => ${JSON.stringify(expected)}`
        const cb = () => assert.deepStrictEqual(fn(...grid, ...args), expected)
        only ? mocha.it.only(name, cb) : mocha.it(name, cb)
      })
    })
  })
})

mocha.describe('init', () => {
  mocha.it('initializes properly', () => {
    const grid = init(5, 5)
    assert.deepStrictEqual(grid.length, 25)
  })
})

// how does one test game of life?
// assert some known patterns?
