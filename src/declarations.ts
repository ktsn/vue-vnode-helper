import * as Vue from 'vue'

export type VNodeThunk = {
  (h: Vue.CreateElement): Vue.VNode
  _thunk: true
}

export type VNodeData<P, E> = Vue.VNodeData & {
  props?: P
  on?: E
}

export type VNodeChildren = any[] | [ScopedSlot] | string
export type VNodeChild = VNodeThunk | string | VNodeChildren

export type ScopedSlot = (props: any) => VNodeChildren | string

export interface VNodeHelper<P, E> {
  (): VNodeThunk
  (children: VNodeChildren): VNodeThunk
  (data: VNodeData<P, E>, children?: VNodeChildren): VNodeThunk
  (selector: string, children: VNodeChildren): VNodeThunk
  (selector: string, data?: VNodeData<P, E>, children?: VNodeChildren): VNodeThunk
}

export interface CreateVNodeHelper {
  (tagName: string): VNodeHelper<any, any>
}
