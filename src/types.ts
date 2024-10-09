
export type SimplePropertyType = 'array' | 'boolean' | 'null' | 'number'

export type PropertyDescription = { enum: string[] }
    | { type: SimplePropertyType }
    | ObjectSchema
    | {
        type: 'array'
        items: {
            $ref: `#${string}`
        },
        default: any
    } | {
        type: 'integer',
        minimum?: number,
        maximum?: number
    } | {
        type: 'string',
        pattern?: string
    }

export type ObjectSchema =
    {
        $schema?: string
        $id?: `#${string}`
        definitions?: Record<string, ObjectSchema>
        type: 'object'
        properties?: Record<string, PropertyDescription | { anyOf: PropertyDescription[] }>
        required?: string[]
    }