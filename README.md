# vue-vnode-helper

[![npm version](https://badge.fury.io/js/vue-vnode-helper.svg)](https://badge.fury.io/js/vue-vnode-helper)
[![Build Status](https://travis-ci.org/ktsn/vue-vnode-helper.svg?branch=master)](https://travis-ci.org/ktsn/vue-vnode-helper)

Helpers for Vue's createElement inspired by [hyperscript-helpers](https://github.com/ohanhi/hyperscript-helpers).

## Example

```js
// component.js
import { tag, helpers, apply } from 'vue-vnode-helper'
const { article, h1, p } = helpers // Get element helpers you want to use

import OtherComponent from './other-component'

export default {
  props: ['message'],

  render(createElement) {
    // Apply createElement to vue-vnode-helper
    // and you can use more terse syntax for the render.
    return apply(createElement,

      // Allow css selector for the 1st argument.
      // the 2nd argument expects vdom data
      // the 3rd argument expects children
      // same as Vue's createElement.
      // All arguments can be omitted.
      article('#content', [
        h1('.title', 'This is page title'),
        p('.message', { props: { title: this.message } }, this.message),

        // use Vue component by tag helper
        tag('other-component', { props: 'some value' })
      ])
    )
  },

  components: {
    OtherComponent
  }
}
```

## API Reference

- `helpers: { [key: string]: (selector?: string, data?: VNodeData, children?: VNodeChildren): VNodeThunk }`

  Built-in helpers. All HTML5 elements and special elements of Vue.js are available. The helpers generates `VNodeThunk` that must be transformed by `apply` function.

- `tag(tag?: string | Component, selector?: string, data?: VNodeData, children?: VNodeChildren): VNodeThunk`

  A fallback helper that can be specified any element/component name or component options object/constructor.

- `apply(createElement: CreateElement, thunk: VNodeThunk): VNode`

  Transform `VNodeThunk` to actual VNode.

- `createHelper(tag?: string | Component): (selector?: string, data?: VNodeData, children: VNodeChildren) => VNodeThunk`

  Create a new vnode helper.

  ```js
  // Some Vue component
  const MyComp = {
    props: ['message'],
    template: '<div>{{ message }}'
  }

  // Create MyComp helper
  const myComp = createHelper(MyComp)

  // Use MyComp helper in another component
  render (h) {
    return apply(h,
      div('.wrapper', [
        myComp({ props: { message: this.value }})
      ]
    ))
  }
  ```

## License

MIT
