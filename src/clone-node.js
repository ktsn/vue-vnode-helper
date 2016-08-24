// @flow

export default function cloneNode(vnode: any, data?: any, children?: any): Function {
  if (data) {
    data = merge(vnode.data || {}, data)
  } else {
    data = vnode.data
  }

  let tag
  if (vnode.componentOptions) {
    tag = vnode.componentOptions.Ctor
    children = children || vnode.componentOptions.children
  } else {
    tag = vnode.tag
    children = children || vnode.children
  }

  return h => h(tag, data, children)
}

function merge(...args: Object[]): Object {
  const res = {}
  args.forEach(obj => {
    Object.keys(obj).forEach(key => {
      res[key] = obj[key]
    })
  })
  return res
}
