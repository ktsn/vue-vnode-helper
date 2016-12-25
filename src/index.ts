import { elementNames } from './config'
import { createHelpers } from './helper'
import { VNodeHelper } from './declarations'

export * from './declarations'

export {
  tag,
  apply,
  createHelper
} from './helper'

export const helpers = createHelpers(elementNames)
