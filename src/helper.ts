import * as Vue from 'vue'

import {
  CreateVNodeHelper,
  VNodeHelper,
  VNodeThunk,
  VNodeData,
  VNodeChildren,
  VNodeChild,
  ScopedSlot
} from './declarations'

import {
  kebabToCamel,
  isThunk,
  isScopedSlot,
  isSelector,
  isObject
} from './utils'

export const createHelper: CreateVNodeHelper = tagName => {
  return (a?: any, b?: any, c?: any) => {
    const {
      selector,
      data,
      children
    } = extractArguments(a, b, c)

    if (selector) {
      insertSelectorToData(data, selector)
    }

    const thunk: any = (h: Vue.CreateElement) => h(tagName, data, applyChildren(h, children))
    thunk._thunk = true
    return thunk
  }
}

export function createHelpers(names: string[]): { [key: string]: VNodeHelper<any, any> } {
  const helpers: { [key: string]: VNodeHelper<any, any> } = {}
  names.forEach(name => {
    helpers[kebabToCamel(name)] = createHelper(name)
  })
  return helpers
}

export function tag(head: string): VNodeThunk
export function tag(head: string, children: VNodeChildren): VNodeThunk
export function tag(head: string, data: VNodeData<any, any>, children?: VNodeChildren): VNodeThunk
export function tag(head: string, selector: string, children: VNodeChildren): VNodeThunk
export function tag(head: string, selector: string, data?: VNodeData<any, any>, children?: VNodeChildren): VNodeThunk
export function tag(head: string, a?: any, b?: any, c?: any): VNodeThunk {
  return createHelper(head)(a, b, c)
}

export function apply(
  h: Vue.CreateElement,
  node: VNodeThunk | string
): Vue.VNode | string {
  return isThunk(node) ? node(h) : node
}

function applyChildren(
  h: Vue.CreateElement,
  children: VNodeChildren | undefined
): Vue.VNodeChildren | undefined {
  if (Array.isArray(children)) {
    const cs: VNodeChild[] | [ScopedSlot] = children

    if (isScopedSlot(cs)) {
      return [
        (props: any) => applyChildren(h, cs[0](props)) as Vue.VNodeChildrenArrayContents
      ]
    }

    return cs.map(c => {
      // Nested
      if (Array.isArray(c)) {
        return applyChildren(h, c)!
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
export function extractArguments(a?: any, b?: any, c?: any): {
  selector: string | null,
  data: VNodeData<any, any>,
  children: VNodeChildren | undefined
} {
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

function insertSelectorToData(data: VNodeData<any, any>, selector: string): void {
  const { id, staticClass } = parseSelector(selector)

  if (staticClass) {
    data.staticClass = staticClass
  }

  if (id) {
    if (!isObject(data.attrs)) {
      data.attrs = {}
    }
    data.attrs['id'] = id
  }
}

export function parseSelector(selector: string): {
  id: string | null,
  staticClass: string | null
} {
  const selectorRegexp = /([\.#][^\s.#]+)/
  const items = selector.split(selectorRegexp)

  const ids: string[] = []
  const staticClasses: string[] = []
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
