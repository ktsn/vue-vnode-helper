import * as assert from 'power-assert'
import { elementNames } from '../src/config'
import { helpers } from '../src/index'
import { kebabToCamel } from '../src/utils'

describe('build-in helpers', () => {
  it('should expose helpers', () => {
    const keys = Object.keys(helpers)

    assert(elementNames.length + 1 === keys.length) // include tag helper
    elementNames.forEach(name => {
      assert(typeof helpers[kebabToCamel(name)] === 'function')
    })
  })
})
