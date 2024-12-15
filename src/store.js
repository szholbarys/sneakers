import { ref, provide, inject } from 'vue'

const stateSymbol = Symbol()

export const createStore = () => {
  const isOrderInProgress = ref(false)

  const setOrderInProgress = (value) => {
    isOrderInProgress.value = value
  }

  const store = {
    isOrderInProgress,
    setOrderInProgress
  }

  provide(stateSymbol, store)
}

export const useStore = () => {
  const store = inject(stateSymbol)
  if (!store) {
    throw new Error('Store not provided')
  }
  return store
}
