import assert from 'power-assert'
import {
  extractArguments,
  parseSelector
} from '../src/helper'

describe('extractArguments', () => {
  it('selector', () => {
    const selector = '.selector'
    const a = extractArguments(selector)
    assert.deepStrictEqual(a, {
      selector,
      data: {},
      children: null
    })
  })

  it('data', () => {
    const data = { props: { key: 'id' } }
    const a = extractArguments(data)
    assert.deepStrictEqual(a, {
      selector: null,
      data,
      children: null
    })
  })

  it('children', () => {
    const children = ['a', 'b', 'c']
    const a = extractArguments(children)
    assert.deepStrictEqual(a, {
      selector: null,
      data: {},
      children
    })
  })

  it('selector, data', () => {
    const selector = '#header'
    const data = { props: { a: 'a', b: 1 } }
    const a = extractArguments(selector, data)
    assert.deepStrictEqual(a, {
      selector,
      data,
      children: null
    })
  })

  it('selector, children', () => {
    const selector = '#header.box'
    const children = 'Children'
    const a = extractArguments(selector, children)
    assert.deepStrictEqual(a, {
      selector,
      data: {},
      children
    })
  })

  it('data, children', () => {
    const data = { transition: 'fade', staticClass: 'a b c' }
    const children = [1, 2, 3]
    const a = extractArguments(data, children)
    assert.deepStrictEqual(a, {
      selector: null,
      data,
      children
    })
  })

  it('selector, data, children', () => {
    const selector = '#document'
    const data = { attrs: { name: 'test' }, props: { 'aria-hidden': false } }
    const children = 'Test Children'
    const a = extractArguments(selector, data, children)
    assert.deepStrictEqual(a, {
      selector,
      data,
      children
    })
  })
})

describe('parseSelector', () => {
  it('.selector', () => {
    const a = parseSelector('.selector')
    assert.deepStrictEqual(a, {
      staticClass: 'selector',
      id: null
    })
  })

  it('#selector', () => {
    const a = parseSelector('#selector')
    assert.deepStrictEqual(a, {
      staticClass: null,
      id: 'selector'
    })
  })

  it('#id.class', () => {
    const a = parseSelector('#id.class')
    assert.deepStrictEqual(a, {
      staticClass: 'class',
      id: 'id'
    })
  })

  it('.multiple.class.selector', () => {
    const a = parseSelector('.multiple.class.selector')
    assert.deepStrictEqual(a, {
      staticClass: 'multiple class selector',
      id: null
    })
  })

  it('.a#id.c', () => {
    const a = parseSelector('.a#id.c')
    assert.deepStrictEqual(a, {
      staticClass: 'a c',
      id: 'id'
    })
  })

  it('#multi#id', () => {
    const a = parseSelector('#multi#id')
    assert.deepStrictEqual(a, {
      staticClass: null,
      id: 'multi'
    })
  })
})
