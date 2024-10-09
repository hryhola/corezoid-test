import randomWords from '../data/random-words.json'
import { pickRandomValueFromArray } from './array';
import { getPatterStringGenerator } from './regex-registry';
import { ObjectSchema, PropertyDescription } from "./types";

export const getRandomString = (joiner = '-') => {
    let output = ''

    output += pickRandomValueFromArray(randomWords) + joiner
    output += pickRandomValueFromArray(randomWords) + joiner
    output += pickRandomValueFromArray(randomWords)

    return output;
}

export const getRandomNumber = (min = -100_000, max = 100_000, type: 'int' | 'floor' = 'floor') => {
    const random = Math.random() * (max - min + 1) + min

    return type === 'int' ? Math.floor(random) : random
}

export const generatePropertyValue = (
    description: PropertyDescription | { anyOf: PropertyDescription[] },
    definitions: Record<string, ObjectSchema>
) => {
    const pickedDefinition = 'anyOf' in description
        ? pickRandomValueFromArray(description.anyOf)!
        : description

    if ('enum' in pickedDefinition) {
        return pickRandomValueFromArray(pickedDefinition.enum)
    }
    
    switch (pickedDefinition.type) {
        case 'object': {
            return generateRandomObject(pickedDefinition);
        }
        case 'array': {
            let array: any[] = []

            for (let i = 0; i < 5; i++) {
                if ('items' in pickedDefinition) {
                    const itemSchemaDefinition = Object
                        .values(definitions)
                        .find(d => d.$id === pickedDefinition.items.$ref)

                    if (!itemSchemaDefinition) {
                        throw new Error('Invalid reference to non-existant schema "' + pickedDefinition.items.$ref + '"')
                    }

                    array.push(generateRandomObject(itemSchemaDefinition))
                } else {
                    array.push(getRandomString())
                }
            }
            
            return array;
        }
        case 'string': {
            if (pickedDefinition.pattern) {
                const generator = getPatterStringGenerator(new RegExp(pickedDefinition.pattern))

                return generator()
            }

            return getRandomString()
        }
        case 'boolean': {
            return Math.random() > 0.5
        }
        case 'null': {
            return null
        }
        case 'number': {
            return getRandomNumber()
        }
        case 'integer': {
            return getRandomNumber(pickedDefinition.minimum, pickedDefinition.maximum, 'int')
        }
        default: {
            let type = 'undefined or null'

            if ('type' in pickedDefinition) {
                type = String((pickedDefinition as any).type)
            }
 
            throw new Error('Unknown property type "' + type + '"')
        }
    }
}

export const generateRandomObject = (schema: ObjectSchema, nowRequiredSpawnChance = 0.5): object => {
    let object = {}

    const propertiesDescription = schema.properties
        ? Object.entries(schema.properties)
        : []

    if (!propertiesDescription.length) {
        return object
    }

    for (const [name, description] of propertiesDescription) {
        // no required property on the schema means all properties are required
        if (schema.required && !schema.required.includes(name) && Math.random() > nowRequiredSpawnChance) {
            continue; // Generation of non required fields could be skipped with some chance
        }

        object[name] = generatePropertyValue(description, schema.definitions || {})
    }

    return object
}
