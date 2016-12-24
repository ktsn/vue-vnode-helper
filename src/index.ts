import { elementNames } from './config'
import { createHelpers } from './helper'
import { VNodeHelper } from './declarations'

export {
  tag,
  apply,
  createHelper,
  createHelpers
} from './helper'

export const helpers = createHelpers(elementNames)
