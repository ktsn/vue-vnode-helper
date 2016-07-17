// @flow

import { elementNames } from './config'
import create from './helper'

export { apply } from './helper'

function tag(head: string, ...tail: any[]): Function {
  return create(head)(...tail)
}

export function createHelpers(names: string[]): { [key: string]: (...args: any[]) => Function } {
  const helpers = {}
  names.forEach(name => {
    helpers[name] = create(name)
  })
  helpers.tag = tag
  return helpers
}

export default createHelpers(elementNames)
