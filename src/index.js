// @flow

import { elementNames } from './config'
import { kebabToCamel } from './utils'
import create from './helper'

export { apply } from './helper'

function tag(head: string, ...tail: any[]): Function {
  return create(head)(...tail)
}

export function createHelpers(names: string[]): { [key: string]: (...args: any[]) => Function } {
  const helpers = {}
  names.forEach(name => {
    helpers[kebabToCamel(name)] = create(name)
  })
  helpers.tag = tag
  return helpers
}

export const helpers = createHelpers(elementNames)
