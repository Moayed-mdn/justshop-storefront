import { readFileSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const root = path.resolve(process.cwd())
const contractsRoot = path.join(root, 'src/core/runtime/contracts')

const suite = [
  {
    schema: 'schemas/route-resolution-request.schema.json',
    valid: [
      'examples/route-resolution-request.valid.json',
    ],
    invalid: [
      'examples/invalid/route-resolution-request.missing-path.json',
    ],
  },
  {
    schema: 'schemas/route-resolution-response.schema.json',
    valid: [
      'examples/route-resolution-response.matched.json',
      'examples/route-resolution-response.redirect.json',
      'examples/route-resolution-response.not-found.json',
    ],
    invalid: [
      'examples/invalid/route-resolution-response.missing-route-type.json',
    ],
  },
  {
    schema: 'schemas/page-payload-request.schema.json',
    valid: [
      'examples/page-payload-request.valid.json',
    ],
    invalid: [],
  },
  {
    schema: 'schemas/page-payload-response.schema.json',
    valid: [
      'examples/page-payload-response.marketing.json',
    ],
    invalid: [
      'examples/invalid/page-payload-response.missing-section-props.json',
    ],
  },
  {
    schema: 'schemas/navigation-payload-request.schema.json',
    valid: [
      'examples/navigation-payload-request.valid.json',
    ],
    invalid: [],
  },
  {
    schema: 'schemas/navigation-payload-response.schema.json',
    valid: [
      'examples/navigation-payload-response.default.json',
    ],
    invalid: [],
  },
  {
    schema: 'schemas/theme-payload-request.schema.json',
    valid: [
      'examples/theme-payload-request.valid.json',
    ],
    invalid: [],
  },
  {
    schema: 'schemas/theme-payload-response.schema.json',
    valid: [
      'examples/theme-payload-response.default.json',
    ],
    invalid: [],
  },
  {
    schema: 'schemas/preview-validation-request.schema.json',
    valid: [
      'examples/preview-validation-request.valid.json',
    ],
    invalid: [
      'examples/invalid/preview-validation-request.missing-token.json',
    ],
  },
  {
    schema: 'schemas/preview-validation-response.schema.json',
    valid: [
      'examples/preview-validation-response.valid.json',
    ],
    invalid: [
      'examples/invalid/preview-validation-response.bad-state.json',
    ],
  },
  {
    schema: 'schemas/runtime-error-response.schema.json',
    valid: [
      'examples/runtime-error-response.invalid-preview.json',
    ],
    invalid: [
      'examples/invalid/runtime-error-response.missing-request-id.json',
    ],
  },
]

const readJson = (relativePath) => {
  const absolutePath = path.join(contractsRoot, relativePath)
  return JSON.parse(readFileSync(absolutePath, 'utf8'))
}

const valueType = (value) => {
  if (value === null) return 'null'
  if (Array.isArray(value)) return 'array'
  if (Number.isInteger(value)) return 'integer'
  return typeof value
}

const resolveRef = (rootSchema, ref) => {
  if (!ref.startsWith('#/')) {
    return null
  }

  return ref
    .slice(2)
    .split('/')
    .reduce((current, segment) => current?.[segment], rootSchema)
}

const validate = (schema, value, currentPath = '$', rootSchema = schema) => {
  if (!schema) {
    return [`${currentPath}: schema definition is missing`]
  }

  if (schema.$ref) {
    const resolvedSchema = resolveRef(rootSchema, schema.$ref)

    if (!resolvedSchema) {
      return [`${currentPath}: unresolved schema ref ${schema.$ref}`]
    }

    return validate(resolvedSchema, value, currentPath, rootSchema)
  }

  const errors = []
  const types = Array.isArray(schema.type)
    ? schema.type
    : schema.type
      ? [schema.type]
      : []

  if (types.length > 0) {
    const typeMatches = types.some((candidate) => {
      if (candidate === 'number') return typeof value === 'number'
      return valueType(value) === candidate
    })

    if (!typeMatches) {
      return [`${currentPath}: expected ${types.join('|')}, received ${valueType(value)}`]
    }
  }

  if (schema.enum && !schema.enum.includes(value)) {
    return [`${currentPath}: value ${JSON.stringify(value)} is not in enum ${JSON.stringify(schema.enum)}`]
  }

  if (valueType(value) === 'object') {
    const props = schema.properties || {}
    const required = schema.required || []

    for (const key of required) {
      if (!(key in value)) {
        errors.push(`${currentPath}.${key}: required property is missing`)
      }
    }

    if (schema.additionalProperties === false) {
      for (const key of Object.keys(value)) {
        if (!(key in props)) {
          errors.push(`${currentPath}.${key}: additional property is not allowed`)
        }
      }
    }

    for (const [key, propSchema] of Object.entries(props)) {
      if (!(key in value)) continue
      errors.push(...validate(propSchema, value[key], `${currentPath}.${key}`, rootSchema))
    }
  }

  if (valueType(value) === 'array' && schema.items) {
    for (let index = 0; index < value.length; index += 1) {
      errors.push(...validate(schema.items, value[index], `${currentPath}[${index}]`, rootSchema))
    }
  }

  return errors
}

const failures = []

for (const contract of suite) {
  const schema = readJson(contract.schema)

  for (const examplePath of contract.valid) {
    const example = readJson(examplePath)
    const errors = validate(schema, example)
    if (errors.length > 0) {
      failures.push(`VALID example failed for ${examplePath}\n- ${errors.join('\n- ')}`)
    }
  }

  for (const examplePath of contract.invalid) {
    const example = readJson(examplePath)
    const errors = validate(schema, example)
    if (errors.length === 0) {
      failures.push(`INVALID example unexpectedly passed for ${examplePath}`)
    }
  }
}

if (failures.length > 0) {
  console.error('Runtime contract validation failed:')
  for (const failure of failures) {
    console.error(`\n${failure}`)
  }
  process.exit(1)
}

console.log('Runtime contract validation passed for all schemas and examples.')
