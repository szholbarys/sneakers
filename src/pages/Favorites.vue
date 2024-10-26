<script setup>
import { ref, onMounted } from 'vue'
import CardList from '../components/CardList.vue'

const favorites = ref([])

onMounted(() => {
  const storedFavorites = localStorage.getItem('favorites')
  favorites.value = storedFavorites ? JSON.parse(storedFavorites) : []
})
</script>

<template>
  <h2 class="text-3xl font-bold mb-8">Избранное</h2>
  <CardList :items="favorites" is-favorites />
</template>
