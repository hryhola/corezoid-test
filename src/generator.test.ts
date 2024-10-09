import { describe, it } from './test-framework'
import { getRandomString, getRandomNumber, generatePropertyValue, generateRandomObject } from './generator'
import { ObjectSchema } from './types'

describe('getRandomString', () => {
    it('should return a string', () => {
        const result = getRandomString()

        if (typeof result !== 'string') throw new Error(`Expected to get string, got ${result}`)
    })
})

describe('getRandomNumber', () => {
    it('should return a number', () => {
        const result = getRandomNumber()

        if (typeof result !== 'number') throw new Error(`Expected to get number, got ${result}`)
    })

    it("should return a number within the specified range", () => {
        const min = 10;
        const max = 20;
        const result = getRandomNumber(min, max);
        if (result < min || result > max) {
            throw new Error(`Result ${result} is out of range [${min}, ${max}]`);
        }
    });

    it("should return an integer when type is 'int'", () => {
        const result = getRandomNumber(0, 10, 'int');
        if (!Number.isInteger(result)) {
            throw new Error(`Result ${result} is not an integer`);
        }
    });

    it("should return a float when type is 'floor'", () => {
        const result = getRandomNumber(0, 10, 'floor');
        if (Number.isInteger(result)) {
            throw new Error(`Result ${result} is an integer, expected a float`);
        }
    });

    it("should use provided min and max values", () => {
        const min = 50;
        const max = 100;
        const result = getRandomNumber(min, max);
        if (result < min || result > max) {
            throw new Error(`Result ${result} is out of range [${min}, ${max}]`);
        }
    });
})

describe("generatePropertyValue", () => {
    it("should return a random enum value when provided", () => {
        const description = {
            type: 'string',
            enum: ['value1', 'value2', 'value3']
        };

        const result = generatePropertyValue(description, {}) as any;

        if (!description.enum.includes(result)) {
            throw new Error(`Expected to get 'value1', 'value2' or'value3', got ${result}`);
        }
    });

    it("should generate an object for object type", () => {
        const result = generatePropertyValue({ type: 'object' }, {});

        if (typeof result !== 'object' || result === null) {
            throw new Error(`Expected to get object, got ${result}`);
        }
    });

    it("should generate an array of random strings when type is array without specific items", () => {
        const result = generatePropertyValue({ type: 'array' }, {});

        if (!Array.isArray(result) || result.some(e => typeof e !== 'string')) {
            throw new Error(`Expected to get array of strings object, got ${result}`);
        }
    });

    it("should throw an error for invalid schema reference", () => {
        let thrown = false

        try {
            generatePropertyValue({
                type: 'array',
                items: { $ref: '#invalidReference' },
                default: []
            }, {})
        } catch (e) {
            thrown = true
        }

        if (!thrown) throw new Error('Expected to got an error')
    });

    it("should generate a random string when type is string", () => {
        const result = generatePropertyValue({ type: 'string' }, {});

        if (typeof result !== 'string') throw new Error(`${result} is not a string`)
    });

    it("should generate a boolean value", () => {
        const result = generatePropertyValue({ type: 'boolean' }, {});

        if (typeof result !== 'boolean') throw new Error(`${result} is not a boolean`)
    });

    it("should return null when type is null", () => {
        const result = generatePropertyValue({ type: 'null' }, {});

        if (result !== null) throw new Error(`${result} is not a boolean`)
    });

    it("should generate a random number when type is number", () => {
        const result = generatePropertyValue({ type: 'number' }, {});

        if (typeof result !== 'number') throw new Error(`${result} is not a boolean`)
    });

    it("should generate a random integer within specified bounds", () => {
        const result = generatePropertyValue({ type: 'integer', minimum: 1, maximum: 10 }, {}) as any;

        if (!(Number.isInteger(result) && result >= 1 && result <= 10)) throw new Error(`${result} is not an integer within 1 and 10`)
    });

    it("should throw an error for unknown property types", () => {
        let thrown = false

        try {
            generatePropertyValue({ type: 'unknownType' } as any, {})
        } catch (e) {
            thrown = true
        }

        if (!thrown) throw new Error(`Expected to get an error`);
    });
});

describe("generateRandomObject", () => {
    const mockSchema: ObjectSchema = {
        type: 'object',
        properties: {
            name: { type: 'array' },
            age: { type: 'integer' },
            email: { type: 'string' },
        },
        required: ['name', 'age'],
    }

    it("should return an empty object for a schema with no properties", () => {
        const schema: ObjectSchema = { type: 'object', properties: {} };

        const result = generateRandomObject(schema);

        if (JSON.stringify(result) !== '{}') throw new Error(`${result} is not an empty object`)
    });

    it("should generate required properties", () => {
        const result = generateRandomObject(mockSchema);

        if (!Object.prototype.hasOwnProperty.call(result, 'name')) throw new Error(`Object has no "name" property`)
        if (!Object.prototype.hasOwnProperty.call(result, 'age')) throw new Error(`Object has no "age" property`)
    });

    it("should generate non-required properties based on chance", () => {
        const withEmail = generateRandomObject(mockSchema, 1)
        
        if (!Object.prototype.hasOwnProperty.call(withEmail, 'email')) throw new Error(`Object has no "email" property`)
    });

    it("should skip non-required properties based on chance", () => {
        const withoutEmail = generateRandomObject(mockSchema, 0)

        if (Object.prototype.hasOwnProperty.call(withoutEmail, 'email')) throw new Error(`Object has "email" property`)
    });

    it("should generate properties when definitions are provided", () => {
        const schemaWithDefinitions: ObjectSchema = {
            type: 'object',
            properties: {
                name: { type: 'string' },
                age: { type: 'integer' },
            },
            required: ['name'],
            definitions: {}
        };

        const result = generateRandomObject(schemaWithDefinitions, 1) as any;

        if (typeof result !== 'object'
            || result === null
            || !Object.prototype.hasOwnProperty.call(result, 'name')
            || !Object.prototype.hasOwnProperty.call(result, 'age')
            || !Number.isInteger(result.age)
            || typeof result.name !== 'string' 
        ) throw new Error('Invalid object generated')
    });

    it("should correctly handle schemas with no required properties", () => {
        const schemaWithoutRequired: ObjectSchema = {
            type: 'object',
            properties: {
                name: { type: 'string' },
                age: { type: 'integer' },
            }
        };

        const result = generateRandomObject(schemaWithoutRequired, 0);

        if (!Object.prototype.hasOwnProperty.call(result, 'name') || !Object.prototype.hasOwnProperty.call(result, 'age'))
            throw new Error('Expected to get both "name" and "age" when schema has not "required" field')
    });
});