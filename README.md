# vue-vnode-helper

[![npm version](https://badge.fury.io/js/vue-vnode-helper.svg)](https://badge.fury.io/js/vue-vnode-helper)
[![Build Status](https://travis-ci.org/ktsn/vue-vnode-helper.svg?branch=master)](https://travis-ci.org/ktsn/vue-vnode-helper)

A helper of Vue's createElement inspired by [hyperscript-helpers](https://github.com/ohanhi/hyperscript-helpers).

## Example

```js
// component.js
import helpers, { apply, tag } from 'vue-vnode-helper'
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

## License

MIT
