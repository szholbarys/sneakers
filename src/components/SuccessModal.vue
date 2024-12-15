<script setup>
import { onMounted, ref } from 'vue'

defineProps({
  show: Boolean
})

const emit = defineEmits(['close'])

const modalRef = ref(null)

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

const handleClickOutside = (event) => {
  if (modalRef.value && !modalRef.value.contains(event.target)) {
    emit('close')
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div ref="modalRef" class="bg-white rounded-lg p-8 max-w-sm w-full text-center">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Оплата прошла успешно!</h2>
        <p class="text-gray-600 mb-6">Ваш заказ был успешно размещен.</p>
        <div class="flex justify-center">
          <svg
            class="w-16 h-16 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>
      </div>
    </div>
  </Teleport>
</template>
