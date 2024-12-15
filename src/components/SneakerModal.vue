<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  sneaker: Object,
  isOpen: Boolean,
  isFavorite: Boolean
})

const emit = defineEmits(['close', 'addToCart', 'addToFavorite'])

const closeModal = () => {
  emit('close')
}

const closeOnOverlayClick = (event) => {
  if (event.target === event.currentTarget) {
    closeModal()
  }
}
</script>

<template>
  <div
    v-if="isOpen"
    @click="closeOnOverlayClick"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-lg p-8 max-w-2xl w-full" @click.stop>
      <div class="flex justify-between items-start mb-4">
        <h2 class="text-2xl font-bold">{{ sneaker.title }}</h2>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div class="flex">
        <img :src="sneaker.imageUrl" :alt="sneaker.title" class="w-1/2 object-cover rounded-lg" />
        <div class="ml-8 flex flex-col justify-between">
          <div>
            <p class="text-lg mb-4">{{ sneaker.title }}</p>
            <p class="text-gray-600 mb-4">Цена: {{ sneaker.price }} тг.</p>
            <p class="text-gray-700 mb-4">
              {{ sneaker.description || 'Описание отсутствует.' }}
            </p>
          </div>
          <div class="flex space-x-4">
            <button
              @click="$emit('addToCart', sneaker)"
              class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Добавить в корзину
            </button>
            <button
              @click="$emit('addToFavorite', sneaker)"
              class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              {{ isFavorite ? 'Удалить из избранного' : 'Добавить в избранное' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
