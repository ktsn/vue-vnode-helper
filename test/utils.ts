import * as assert from 'power-assert'
import { kebabToCamel } from '../src/utils'

describe('utils', () => {

  it('kebabToCamel', () => {
    assert(kebabToCamel('transition-group') === 'transitionGroup')
    assert(kebabToCamel('article') === 'article')
    assert(kebabToCamel('test123-test-123') === 'test123Test123')
  })

})
