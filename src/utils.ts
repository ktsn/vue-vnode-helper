import { VNodeThunk, ScopedSlot } from './declarations'

export function isThunk(val: any): val is VNodeThunk {
  return val._thunk
}

export function isScopedSlot(val: any): val is [ScopedSlot] {
  return val.length === 1
    && typeof val[0] === 'function'
    && !isThunk(val[0])
}

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
