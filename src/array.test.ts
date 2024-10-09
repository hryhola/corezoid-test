import { describe, it } from './test-framework'
import { pickRandomValueFromArray, shuffleArray } from './array'

describe('pickRandomValueFromArray', () => {
    it('should return an item from an array', () => {
        const array = ['a', 'b', 'c']

        const item = pickRandomValueFromArray(array)

        if (!array.includes(item)) throw new Error(`${String(array)} does not include ${item}`)
    })

    it('should return undefined from empty array', () => {
        const array = []

        const item = pickRandomValueFromArray(array)

        if (typeof item !== 'undefined') throw new Error(`Type of ${item} is not undefined`)
    })
});

describe('shuffleArray', () => {
    it('should return an array', () => {
        const array = ['a', 'b', 'c']

        const item = pickRandomValueFromArray(array)

        if (!array.includes(item)) throw new Error(`${String(array)} does not include ${item}`)
    })

    it('should return an array with same length as input', () => {
        const array = ['a', 'b', 'c']

        const result = shuffleArray(array)

        if (result.length !== array.length) throw new Error(`${result.length} is not ${array.length} is not an array`)
    })

    it('should contain all input objects only once', () => {
        const array = ['a', 'b', 'c']

        const count = {
            a: 0,
            b: 0,
            c: 0
        }

        const result = shuffleArray(array)

        for (let item of result) {
            count[item]++
        }

        if (count.a !== 1) throw new Error(`expected to see a 1 time, got ${count.a}`)
        if (count.b !== 1) throw new Error(`expected to see a 1 time, got ${count.b}`)
        if (count.c !== 1) throw new Error(`expected to see a 1 time, got ${count.c}`)
    })

    it('should change order of items', () => {
        const array = [
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13
        ]

        const result = shuffleArray(array)

        if (JSON.stringify(array) === JSON.stringify(result)) throw new Error(`Got same json arrays`)
    })
});

