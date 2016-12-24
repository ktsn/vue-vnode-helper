import * as Vue from 'vue'
import {
  CreateVNodeHelper,
  VNodeThunk,
  VNodeData,
  VNodeChildren,
  VNodeChild
} from './declarations'
import { isSelector, isObject } from './utils'

export const create: CreateVNodeHelper = tagName => {
  return (a?: any, b?: any, c?: any) => {
    const {
      selector,
      data,
      children
    } = extractArguments(a, b, c)

    if (selector) {
      insertSelectorToData(data, selector)
    }

    return (h: Vue.CreateElement) => h(tagName, data, applyChildren(h, children))
  }
}

/**
 * node: Function | primitive
 */
export function apply(
  h: Vue.CreateElement,
  node: VNodeThunk | string
): Vue.VNode | string {
  return typeof node === 'function' ? node(h) : node
}

/**
 * children: Array | primitive
 */
function applyChildren(
  h: Vue.CreateElement,
  children: VNodeChildren | undefined
): Vue.VNodeChildren | undefined {
  if (Array.isArray(children)) {
    const cs: VNodeChild[] = children
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
