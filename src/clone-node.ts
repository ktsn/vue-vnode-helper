import * as Vue from 'vue'
import { VNodeThunk } from './declarations'

export default function cloneNode(
  vnode: Vue.VNode,
  data?: Vue.VNodeData,
  children?: Vue.VNodeChildren
): VNodeThunk {
  console.warn(
    '[vue-vnode-helper] cloneNode is deprecated and will be removed in the later version.'
  )

  if (data) {
    data = merge(vnode.data || {}, data)
  } else {
    data = vnode.data
  }

  let tag: string | typeof Vue
  if (vnode.componentOptions) {
    tag = vnode.componentOptions.Ctor
    children = children || vnode.componentOptions.children
  } else {
    tag = vnode.tag!
    children = children || vnode.children
  }

  const thunk: any = (h: Vue.CreateElement) => h(tag, data, children)
  thunk._thunk = true
  return thunk
}

function merge(...args: any[]): any {
  const res: any = {}
  args.forEach(obj => {
    Object.keys(obj).forEach(key => {
      res[key] = obj[key]
    })
  })
  return res
}
