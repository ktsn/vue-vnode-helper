export function isSelector(val: any): boolean {
  return typeof val === 'string' &&
    (val[0] === '.' || val[0] === '#')
}

export function isObject(val: any): val is Object {
  return val !== 'null' && typeof val === 'object' && !Array.isArray(val)
}

export function kebabToCamel(str: string): string {
  return str.replace(/-(.)/g, (match, c) => c.toUpperCase())
}
