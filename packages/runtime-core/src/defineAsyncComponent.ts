import { ref } from '@vue/reactivity'
import { isFunction } from '@vue/shared'
import { h } from './h'

export function defineAsyncComponent(options) {
  if (isFunction(options)) {
    options = { loader: options }
  }
  return {
    setup() {
      const { loader, errorComponent, timeout, loadingComponent, delay, onError } = options
      const loaded = ref(false)
      const error = ref(false) //
      const loading = ref(false)

      let loadingTimer = null
      if (delay) {
        loadingTimer = setTimeout(() => {
          loading.value = true
        }, delay)
      }

      let Comp = null

      let attempts = 0

      function loadFunc() {
        attempts++
        return loader().catch((err) => {
          if (onError) {
            return new Promise((resolve, reject) => {
              const retry = () => resolve(loadFunc())
              const fail = () => reject(err)
              onError(err, retry, fail, ++attempts)
            })
          }
          else {
            throw err
          }
        })
      }

      loadFunc().then((comp) => {
        Comp = comp
        loaded.value = true
      }).catch((e) => {
        error.value = e
      }).finally(() => {
        loading.value = false
        clearTimeout(loadingTimer)
      })

      if (timeout) {
        setTimeout(() => {
          error.value = true
          throw new Error('组件加载失败')
        }, timeout)
      }

      const placeholder = h('div')

      return () => {
        if (loaded.value) {
          return h(Comp)
        }
        else if (error.value && errorComponent) {
          return h(errorComponent)
        }
        else if (loading.value && loadingComponent) {
          return h(loadingComponent)
        }
        else {
          return placeholder
        }
      }
    },
  }
}
