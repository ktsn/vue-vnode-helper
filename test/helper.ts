import * as assert from 'power-assert'
import * as sinon from 'sinon'
import {
  default as create,
  apply,
  extractArguments,
  parseSelector
} from '../src/helper'

describe('create and apply', () => {
  const SPY = 'spy'
  const t = create('t')
  const h = sinon.spy(() => SPY)

  beforeEach(() => {
    h.reset()
  })

  it('normal usage', () => {
    apply(h, t('#id.selector', { attrs: { test: 'test' }}))
    assert(h.calledWith('t', { attrs: { test: 'test', id: 'id' }, staticClass: 'selector' }))
  })

  it('with children', () => {
    apply(h,
      t([
        t('#id'),
        t('.class', { key: 'key' })
      ])
    )

    assert(h.callCount === 3)
    assert.deepStrictEqual(
      h.getCall(0).args,
      ['t', { attrs: { id: 'id' }}, undefined]
    )
    assert.deepStrictEqual(
      h.getCall(1).args,
      ['t', { key: 'key', staticClass: 'class' }, undefined]
    )
    assert.deepStrictEqual(
      h.getCall(2).args,
      ['t', {}, [SPY, SPY]]
    )
  })

  it('text node child', () => {
    apply(h,
      t('TextNode')
    )

    assert(h.calledWith('t', {}, 'TextNode'))
  })

  it('children array can be nested', () => {
    apply(h,
      t([
        [t('.child')]
      ])
    )

    assert(h.callCount === 2)
    assert.deepStrictEqual(
      h.getCall(0).args,
      ['t', { staticClass: 'child' }, undefined]
    )
    assert.deepStrictEqual(
      h.getCall(1).args,
      ['t', {}, [[SPY]]]
    )
  })

  it('text node in children array', () => {
    apply(h,
      t(['TextNode'])
    )
    assert(h.calledWith('t', {}, ['TextNode']))
  })

  it('thunk children', () => {
    apply(h,
      t(() => [
        t('.child1'),
        'Text',
        [t('.child2')]
      ])
    )

    assert(h.callCount === 1)

    const thunk = h.getCall(0).args[2]
    assert(typeof thunk === 'function')

    assert.deepStrictEqual(
      thunk(),
      [SPY, 'Text', [SPY]]
    )
    assert(h.callCount === 3)

    assert.deepStrictEqual(
      h.getCall(1).args,
      ['t', { staticClass: 'child1' }, undefined]
    )
    assert.deepStrictEqual(
      h.getCall(2).args,
      ['t', { staticClass: 'child2' }, undefined]
    )
  })
})

describe('extractArguments', () => {
  it('no arguments', () => {
    const a = extractArguments()
    assert.deepStrictEqual(a, {
      selector: null,
      data: {},
      children: void 0
    })
  })

  it('selector', () => {
    const selector = '.selector'
    const a = extractArguments(selector)
    assert.deepStrictEqual(a, {
      selector,
      data: {},
      children: void 0
    })
  })

  it('data', () => {
    const data = { props: { key: 'id' } }
    const a = extractArguments(data)
    assert.deepStrictEqual(a, {
      selector: null,
      data,
      children: void 0
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
      children: void 0
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
