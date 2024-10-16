import schema from '../../data/json-schema.json'
import { generateRandomObject } from '../generator'
import { ObjectSchema } from '../types'

// Завантажте тестове на Github та направте посилання
// JSON-schema to Random Object

// Необхідно створити функцію, яка приймає вказану JSON-схему в якості аргументу та повертає відповідний об'єкт даних.
// Значення полів об'єктів генеруються випадковим чином на основі обмежень, описаних в JSON-схемі.
// Забороняється використовувати зовнішні бібліотеки для реалізації.
// Також необхідно написати модульні тести для вашої функції.

// Посилання на JSON-схему, на основі якої вам потрібно генерувати об'єкти.
// https://drive.google.com/file/d/1crLJ-PPCuLFmMjWA6vTp8A9jsZKz-NKR/view?usp=sharing

// Examples of JSON-schema and the resulting object
// https://docs.google.com/document/d/1EuZVoVOeEx8H05OrpI9u8uKKI0mz9A6JPjz-6b5lqfo/edit?usp=sharing

// Рішення потрібно скинути в комменти.

const nonRequiredFieldsChanceParamIndex = process.argv.indexOf('--nonRequiredFieldsChance')

let nonRequiredFieldsChance = 0.5

if (nonRequiredFieldsChanceParamIndex !== -1 && typeof process.argv[nonRequiredFieldsChanceParamIndex + 1]) {
    nonRequiredFieldsChance = Number(process.argv[nonRequiredFieldsChanceParamIndex + 1])

    if (Number.isNaN(nonRequiredFieldsChance) || nonRequiredFieldsChance > 1 || nonRequiredFieldsChance < 0) {
        console.error('Invalid --nonRequiredFieldsChance parameter')
        process.exit(0)
    }
}

const randomObject = generateRandomObject(schema as ObjectSchema, nonRequiredFieldsChance)

console.log('Chance of spawning non-required field: ' + (nonRequiredFieldsChance * 100).toFixed() + '%')
console.log('Randomly generated object according to the schema:')
console.log(randomObject)
