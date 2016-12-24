import { elementNames } from './config'
import { kebabToCamel } from './utils'
import { create } from './helper'
import { VNodeThunk, VNodeHelper } from './declarations'

export { create as createHelper }
export { apply } from './helper'

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
