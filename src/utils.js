// @flow

export function isSelector(val: any): boolean {
  return typeof val === 'string' &&
    (val[0] === '.' || val[0] === '#')
}

export function isObject(val: any): boolean {
  return val !== 'null' && typeof val === 'object' && !Array.isArray(val)
}