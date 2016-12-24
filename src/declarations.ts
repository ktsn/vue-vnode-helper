import * as Vue from 'vue'

export type Props = { [key: string]: any }
export type On = { [key: string]: Function }

export type VNodeThunk = (h: Vue.CreateElement) => Vue.VNode

export interface VNodeData<P extends Props, E extends On> extends Vue.VNodeData {
  props?: P
  on?: E
}

export type VNodeChildren = any[] | string
export type VNodeChild = VNodeThunk | string | VNodeChildren

export interface VNodeHelper<P extends Props, E extends On> {
  (): VNodeThunk
  (children: VNodeChildren): VNodeThunk
  (data: VNodeData<P, E>, children?: VNodeChildren): VNodeThunk
  (selector: string, children: VNodeChildren): VNodeThunk
  (selector: string, data?: VNodeData<P, E>, children?: VNodeChildren): VNodeThunk
}

export interface CreateVNodeHelper {
  (tagName: string): VNodeHelper<Props, On>
}