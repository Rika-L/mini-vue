import { h } from '../h'

function nextFrame(fn) {
  requestAnimationFrame(() => {
    requestAnimationFrame(fn) // 一定能保证在下一帧执行
  })
}

export function resolveTransitionProps(props) {
  /* enterFrom enterActive enterTo leaveFrom leaveActive leaveTo */
  const {
    name = 'v',
    enterFromClass = `${name}-enter-from`,
    enterActiveClass = `${name}-enter-active`,
    enterToClass = `${name}-enter-to`,
    leaveFromClass = `${name}-leave-from`,
    leaveActiveClass = `${name}-leave-active`,
    leaveToClass = `${name}-leave-to`,
    onBeforeEnter,
    onEnter,
    onLeave,
  } = props

  return {
    onBeforeEnter(el) {
      onBeforeEnter && onBeforeEnter(el)
      el.classList.add(enterFromClass)
      el.classList.add(enterActiveClass)
    },
    onEnter(el, done) {
      const resolve = () => {
        el.classList.remove(enterToClass)
        el.classList.remove(enterActiveClass)
        done && done()
      }

      onEnter && onEnter(el, resolve)
      nextFrame(() => {
        // 保证动画的产生
        el.classList.remove(enterFromClass)
        el.classList.remove(enterToClass)

        if (!onEnter || onEnter.length <= 1) {
          // 如果用户没传
          el.addEventListener('transitionend', resolve)
        }
      })

      // 添加后 再移除 而不是马上移除
    },
    onLeave(el, done) {
      const resolve = () => {
        el.classList.remove(leaveToClass)
        el.classList.remove(leaveActiveClass)
        done && done()
      }

      onLeave && onLeave(el, resolve)

      el.classList.add(leaveFromClass) // 当前状态

      // eslint-disable-next-line ts/no-unused-expressions
      document.body.offsetHeight // 强制重绘

      el.classList.add(leaveActiveClass)

      nextFrame(() => {
        el.classList.remove(leaveFromClass)
        el.classList.add(leaveToClass)

        if (!onLeave || onLeave.length <= 1) {
          el.addEventListener('transitionend', resolve)
        }
      })
    },
  }
}
export function Transition(props, { slots }) {
  return h(BaseTransitionImpl, resolveTransitionProps(props), slots)

  // 函数式组件的功能比较少 为了方便函数式组件处理了属性
  // 处理属性后传递给状态组件
  // setup
}

const BaseTransitionImpl = {
  // 真正的组件 只需要渲染的时候调用封装过的钩子即可
  props: {
    onBeforeEnter: Function,
    onEnter: Function,
    onLeave: Function,
  },
  setup(props, { slots }) {
    return () => {
      const vnode = slots.default && slots.default()

      if (!vnode)
        return

      // 渲染前 渲染后
      vnode.transition = { beforeEnter: props.onBeforeEnter, enter: props.onEnter, leave: props.onLeave }
      return vnode
    }
  },
}
