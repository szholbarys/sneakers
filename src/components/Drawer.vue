<script setup>
import { computed, inject } from 'vue'
import { useRouter } from 'vue-router'

import DrawerHead from './DrawerHead.vue'
import CartItemList from './CartItemList.vue'
import InfoBlock from './InfoBlock.vue'

defineProps({
  totalPrice: Number,
  vatPrice: Number
})

const { cart } = inject('cart')
const router = useRouter()

const createOrder = () => {
  // Save cart to localStorage before navigating
  localStorage.setItem('cart', JSON.stringify(cart.value))
  router.push('/payment')
}

const cartIsEmpty = computed(() => cart.value.length === 0)
const buttonDisabled = computed(() => cartIsEmpty.value)

const closeDrawer = (event) => {
  if (event.target === event.currentTarget) {
    // Trigger close event, you can emit it to the parent or handle it directly.
    // Example: emit('close') if emitting the event to a parent.
    // emit('close') // Add this if you're emitting the close event
  }
}
</script>

<template>
  <div 
    class="fixed top-0 left-0 h-full w-full bg-black z-10 opacity-70" 
    @click="closeDrawer" 
  ></div>
  <div class="bg-white w-96 h-full fixed right-0 top-0 z-20 p-8">
    <DrawerHead />

    <div v-if="!totalPrice" class="flex h-full items-center">
      <InfoBlock
        v-if="!totalPrice"
        title="Корзина пустая"
        description="Добавьте хотя бы одну пару кроссовок, чтобы сделать заказ."
        image-url="/package-icon.png"
      />
    </div>

    <div v-else>
      <CartItemList />

      <div class="flex flex-col gap-4 mt-7">
        <div class="flex gap-2">
          <span>Итого:</span>
          <div class="flex-1 border-b border-dashed"></div>
          <b>{{ totalPrice }} тг</b>
        </div>

        <div class="flex gap-2">
          <span>Налог 5%:</span>
          <div class="flex-1 border-b border-dashed"></div>
          <b>{{ vatPrice }} тг</b>
        </div>

        <button
          :disabled="buttonDisabled"
          @click="createOrder"
          class="mt-4 transition bg-lime-500 w-full rounded-xl py-3 text-white disabled:bg-slate-300 hover:bg-lime-600 active:bg-lime-700 cursor-pointer"
        >
          Оформить заказ
        </button>
      </div>
    </div>
  </div>
</template>
