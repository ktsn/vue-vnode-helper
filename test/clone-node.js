import assert from 'power-assert'
import { apply } from '../src'
import cloneNode from '../src/clone-node'
import Vue from 'vue'

describe('cloneNode', () => {
  function createCheckFn(tag, originalData, originalChildren) {
    return (data, children, assertFn) => {
      const options = {
        render(h) {
          const vnode = h(tag, originalData, originalChildren)
          const clone = apply(h, cloneNode(vnode, data, children))
          assertFn(vnode, clone)
        }
      }
      new Vue(options).$mount()
    }
  }

  const Component = {
    props: ['value'],
    render(h) {
      return (
        h('div', { attrs: { 'data-value': this.value }}, [
          h('slot')
        ])
      )
    }
  }

  const checkTag = createCheckFn('span', { class: 'test' }, ['children'])
  const checkComponent = createCheckFn(Component, { props: { value: 'test' }}, ['children'])

  it('clones vnode', done => {
    checkTag(null, null, (vnode, clone) => {
      assert(vnode !== clone)
      assert(vnode.tag === clone.tag)
      assert.deepStrictEqual(vnode.data, clone.data)
      assert.deepStrictEqual(vnode.children, vnode.children)
      done()
    })
  })

  it('clones vnode with merging data', done => {
    const data = {
      attrs: { 'data-test': 'foo' }
    }

    checkTag(data, null, (vnode, clone) => {
      assert.deepStrictEqual(clone.data, merge(vnode.data, {
        attrs: { 'data-test': 'foo' }
      }))
      done()
    })
  })

  it('clones vnode with overwriting children', done => {
    const children = ['foo', 'bar']

    checkTag(null, children, (vnode, clone) => {
      assert(vnode.children.length === 1)
      assert(vnode.children[0].text === 'children')
      assert(clone.children.length === 1)
      assert(clone.children[0].text, children.join(''))
      done()
    })
  })

  it('clones component vnode', done => {
    checkComponent(null, null, (vnode, clone) => {
      assert.deepStrictEqual(vnode.componentOptions, clone.componentOptions)
      done()
    })
  })

  it('clones component vnode with merging data', done => {
    const data = {
      attrs: { 'data-test': 'foo' }
    }

    checkComponent(data, null, (vnode, clone) => {
      assert.deepStrictEqual(clone.data, merge(vnode.data, {
        attrs: { 'data-test': 'foo' }
      }))
      done()
    })
  })

  it('clones component vnode with overwriting children', done => {
    const children = ['foo', 'bar']

    checkComponent(null, children, (vnode, clone) => {
      assert.deepStrictEqual(vnode.componentOptions.children, ['children'])
      assert.deepStrictEqual(clone.componentOptions.children, children)
      done()
    })
  })
})

function merge(...args) {
  const res = {}
  args.forEach(obj => {
    Object.keys(obj).forEach(key => {
      res[key] = obj[key]
    })
  })
  return res
}
