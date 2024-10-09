import { shuffleArray } from './array'
import { getRandomString, getRandomNumber } from './generator'

export const regexRegistry = {
    COREZOID_PUBLIC_API: {
        regex: /https:\/\/[a-z]+\.corezoid\.com\/api\/1\/json\/public\/[0-9]+\/[0-9a-zA-Z]+/,
        stringsGenerator: () => {
            const subdomain = getRandomString('')
            const id1 = getRandomNumber(1, 100, 'int')
            const id2 = shuffleArray(
                [getRandomString(''), getRandomNumber(1, 100, 'int'), getRandomString('')]
            ).join('')

            return `https://${subdomain}.corezoid.com/api/1/json/public/${id1}/${id2}/`
        }
    }
}

export const getPatterStringGenerator = (regex: RegExp) => {
    const knownRegex = Object
        .values(regexRegistry)
        .find(r => r.regex.source === regex.source && r.regex.flags === regex.flags)

    if (!knownRegex) {
        throw new Error('Unknown string pattern received!\n' + regex)
    }

    return knownRegex.stringsGenerator
}
