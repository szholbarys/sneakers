<script setup>
import { ref } from 'vue'
import Card from './Card.vue'
import SneakerModal from './SneakerModal.vue'

defineProps({
  items: Array,
  isFavorites: Boolean
})

const emit = defineEmits(['addToFavorite', 'addToCart'])

const selectedSneaker = ref(null)
const isModalOpen = ref(false)

const openModal = (sneaker) => {
  selectedSneaker.value = sneaker
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const handleAddToFavorite = (sneaker) => {
  emit('addToFavorite', sneaker)
  if (selectedSneaker.value && selectedSneaker.value.id === sneaker.id) {
    selectedSneaker.value = { ...sneaker, isFavorite: !sneaker.isFavorite }
  }
}
</script>

<template>
  <div class="grid grid-cols-4 gap-5" v-auto-animate>
    <Card
      v-for="item in items"
      :key="item.id"
      :id="item.id"
      :title="item.title"
      :imageUrl="item.imageUrl"
      :price="item.price"
      :onClickFavorite="isFavorites ? null : () => emit('addToFavorite', item)"
      :onClickAdd="isFavorites ? null : () => emit('addToCart', item)"
      :isFavorite="item.isFavorite"
      :isAdded="item.isAdded"
      @click="openModal(item)"
    />
  </div>

  <SneakerModal
    :sneaker="selectedSneaker"
    :isOpen="isModalOpen"
    :isFavorite="selectedSneaker?.isFavorite"
    @close="closeModal"
    @addToCart="(sneaker) => emit('addToCart', sneaker)"
    @addToFavorite="handleAddToFavorite"
  />
</template>
