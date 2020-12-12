import mocha from 'mocha'
import assert from 'assert'
import { init, calculate, pointToIndex, indexToPoint } from './life.mjs'

//  0  1  2  3  4
//  5  6  7  8  9
// 10 11 12 13 14
// 15 16 17 18 19
// 20 21 22 23 24

//  0  1  2  3  4
//  5  6  7  8  9
// 10 11 12 13 14
// 15 16 17 18 19
// 20 21 22 23 24
// 25 26 27 28 29
// 30 31 32 33 34
// 35 36 37 38 39

//  0  1  2  3  4  5  6  7  8  9
// 10 11 12 13 14 15 16 17 18 19
// 20 21 22 23 24 25 26 27 28 29

const tests = [
  {
    grid: [38, 11],
    fn: pointToIndex,
    spec: [[[35, 3], 149]],
  },
  {
    grid: [5, 8],
    fn: pointToIndex,
    spec: [
      [[-1, -1], 39],
      [[0, -1], 35],
      [[1, -1], 36],
      [[-1, 0], 4],
      [[0, 0], 0],
      [[1, 0], 1],
      [[-1, 1], 9],
      [[0, 1], 5],
      [[1, 1], 6],
    ],
  },
  {
    grid: [10, 3],
    fn: indexToPoint,
    spec: [
      [[9], [9, 0]],
      [[19], [9, 1]],
      [[20], [0, 2]],
    ],
  },
  {
    grid: [10, 3],
    fn: pointToIndex,
    spec: [
      [[0, 0], 0],
      [[-1, -1], 29],
    ],
  },
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
  tests.forEach(({ grid, fn, spec, only: describeOnly }) => {
    const des = describeOnly ? mocha.describe.only : mocha.describe
    des(`${fn.name} {${grid.join(',')}}`, () => {
      spec.forEach(([args, expected, only = false]) => {
        const name = `[${args.join(',')}] => ${JSON.stringify(expected)}`
        const test = only ? mocha.it.only : mocha.it
        test(name, () => assert.deepStrictEqual(fn(...grid, ...args), expected))
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

const patternTest = {
  ocilators: {
    toad: {
      rows: 6,
      cols: 8,
      // prettier-ignore
      states: [
        [
          0,0,0,0,0,0,0,0,
          0,0,0,0,1,0,0,0,
          0,0,1,0,0,1,0,0,
          0,0,1,0,0,1,0,0,
          0,0,0,1,0,0,0,0,
          0,0,0,0,0,0,0,0,
        ],
        [
          0,0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,0,
          0,0,0,1,1,1,0,0,
          0,0,1,1,1,0,0,0,
          0,0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,0,
        ]
      ],
    },
    toad2: {
      rows: 8,
      cols: 6,
      // prettier-ignore
      states: [
        [
          0,0,0,0,0,0,
          0,0,0,0,0,0,
          0,0,0,1,0,0,
          0,1,0,0,1,0,
          0,1,0,0,1,0,
          0,0,1,0,0,0,
          0,0,0,0,0,0,
          0,0,0,0,0,0,
        ],
        [
          0,0,0,0,0,0,
          0,0,0,0,0,0,
          0,0,0,0,0,0,
          0,0,1,1,1,0,
          0,1,1,1,0,0,
          0,0,0,0,0,0,
          0,0,0,0,0,0,
          0,0,0,0,0,0,
        ]
      ],
    },
    blinker: {
      rows: 5,
      cols: 5,
      // prettier-ignore
      states: [
        [
          0,0,0,0,0,
          0,0,1,0,0,
          0,0,1,0,0,
          0,0,1,0,0,
          0,0,0,0,0,
        ],
        [
          0,0,0,0,0,
          0,0,0,0,0,
          0,1,1,1,0,
          0,0,0,0,0,
          0,0,0,0,0,
        ]
      ],
    },
  },
}

mocha.describe('patterns', () => {
  Object.entries(patternTest).forEach(([name, specs]) => {
    mocha.describe(name, () => {
      Object.entries(specs).forEach(([spec, { states, cols, rows, only }]) => {
        const test = only ? mocha.it.only : mocha.it
        test(spec, () => {
          let grid = init(cols, rows, (index) => states[0][index])
          for (let i = 0; i < states.length * 5; i += 1) {
            grid = calculate(cols, rows, grid)
            assert.deepStrictEqual(grid, states[(i + 1) % states.length])
          }
        })
      })
    })
  })
})
