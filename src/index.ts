import { elementNames } from './config'
import { kebabToCamel } from './utils'
import { create } from './helper'
import {
  VNodeData,
  VNodeChildren,
  VNodeThunk,
  VNodeHelper,
  Props,
  On
} from './declarations'

export { create as createHelper }
export { apply } from './helper'

export function tag(head: string): VNodeThunk
export function tag(head: string, children: VNodeChildren): VNodeThunk
export function tag(head: string, data: VNodeData<Props, On>, children?: VNodeChildren): VNodeThunk
export function tag(head: string, selector: string, children: VNodeChildren): VNodeThunk
export function tag(head: string, selector: string, data?: VNodeData<Props, On>, children?: VNodeChildren): VNodeThunk
export function tag(head: string, a?: any, b?: any, c?: any): VNodeThunk {
  return create(head)(a, b, c)
}

export function createHelpers(names: string[]): { [key: string]: VNodeHelper<any, any> } {
  const helpers: { [key: string]: VNodeHelper<any, any> } = {}
  names.forEach(name => {
    helpers[kebabToCamel(name)] = create(name)
  })
  return helpers
}

export const helpers = createHelpers(elementNames)
