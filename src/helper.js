// @flow

export default function create(tagName: string): (...args: any[]) => Function {
  return (a, b, c) => {
    const {
      selector,
      data,
      children
    } = extractArguments(a, b, c)

    if (selector) {
      insertSelectorToData(data, selector)
    }

    return h => h(tagName, data, applyChildren(h, children))
  }
}

/**
 * node: Function | primitive
 */
export function apply(h: Function, node: any): any {
  return typeof node === 'function' ? node(h) : node
}

/**
 * children: Array | Function | primitive
 */
function applyChildren(h: Function, children: any): any {
  if (typeof children === 'function') {
    return () => applyChildren(h, children())
  }

  if (Array.isArray(children)) {
    return children.map(c => {
      // Nested
      if (Array.isArray(c)) {
        return applyChildren(h, c)
      }
      return apply(h, c)
    })
  }

  return children
}

/**
 * It is not care about null or undefined value
 *
 *    selector -> data -> children
 * or selector -> data
 * or selector -> children
 * or data     -> children
 * or selector
 * or data
 * or children
 */
export function extractArguments(a: any, b: any, c: any): { selector: ?string, data: Object, children: ?any } {
  if (!isSelector(a)) {
    c = b
    b = a
    a = null
  }

  if (!isObject(b)) {
    c = b
    b = null
  }

  return {
    selector: a,
    data: b || {},
    children: c
  }
}

function insertSelectorToData(data: Object, selector: string): void {
  const { id, staticClass } = parseSelector(selector)

  if (staticClass) {
    data.staticClass = staticClass
  }

  if (id) {
    if (!isObject(data.attrs)) {
      data.attrs = {}
    }
    data.attrs.id = id
  }
}

export function parseSelector(selector: string): { id: string | null, staticClass: string | null } {
  const selectorRegexp = /([\.#][^\s.#]+)/
  const items = selector.split(selectorRegexp)

  const ids = []
  const staticClasses = []
  items.forEach(item => {
    if (item[0] === '.') {
      staticClasses.push(item.slice(1))
    } else if (item[0] === '#') {
      ids.push(item.slice(1))
    }
  })

  return {
    id: ids[0] || null,
    staticClass: staticClasses.join(' ') || null
  }
}

function isSelector(val: any): boolean {
  return typeof val === 'string' &&
    (val[0] === '.' || val[0] === '#')
}

function isObject(val: any): boolean {
  return val !== 'null' && typeof val === 'object' && !Array.isArray(val)
}
