<script setup>
import { reactive, watch, ref, onMounted } from 'vue'
import axios from 'axios'
import debounce from 'lodash.debounce'
import { inject } from 'vue'
import CardList from '../components/CardList.vue'

const { cart, addToCart, removeFromCart } = inject('cart')

const favorites = ref([])
const items = ref([])

const filters = reactive({
  sortBy: 'title',
  searchQuery: ''
})

const onClickAddPlus = (item) => {
  if (!item.isAdded) {
    addToCart(item)
  } else {
    removeFromCart(item)
  }
}

const onChangeSelect = (event) => {
  filters.sortBy = event.target.value
}

const onChangeSearchInput = debounce((event) => {
  filters.searchQuery = event.target.value
}, 300)

const addToFavorite = (item) => {
  if (!item.isFavorite) {
    const favoriteItem = {
      ...item,
      favoriteId: Date.now()
    }
    favorites.value.push(favoriteItem)
    item.isFavorite = true
    item.favoriteId = favoriteItem.favoriteId
  } else {
    const index = favorites.value.findIndex((fav) => fav.id === item.id)
    if (index !== -1) {
      favorites.value.splice(index, 1)
    }
    item.isFavorite = false
    item.favoriteId = null
  }

  localStorage.setItem('favorites', JSON.stringify(favorites.value))
}

const initializeFavorites = () => {
  const storedFavorites = localStorage.getItem('favorites')
  favorites.value = storedFavorites ? JSON.parse(storedFavorites) : []

  items.value = items.value.map((item) => {
    const favorite = favorites.value.find((fav) => fav.id === item.id)
    return {
      ...item,
      isFavorite: !!favorite,
      favoriteId: favorite?.favoriteId || null
    }
  })
}

const fetchItems = async () => {
  try {
    const params = {
      sortBy: filters.sortBy
    }

    if (filters.searchQuery) {
      params.title = `*${filters.searchQuery}*`
    }

    const { data } = await axios.get(`https://abe73b250f6e119f.mokky.dev/items`, {
      params
    })

    items.value = data.map((obj) => ({
      ...obj,
      description: obj.description || `This is a ${obj.title} sneaker.`, // Add a default description if none exists
      isFavorite: false,
      favoriteId: null,
      isAdded: false
    }))

    initializeFavorites()
  } catch (err) {
    console.error('Error fetching items:', err)
  }
}

onMounted(async () => {
  const localCart = localStorage.getItem('cart')
  cart.value = localCart ? JSON.parse(localCart) : []

  await fetchItems()

  items.value = items.value.map((item) => ({
    ...item,
    isAdded: cart.value.some((cartItem) => cartItem.id === item.id)
  }))
})

watch(cart, () => {
  items.value = items.value.map((item) => ({
    ...item,
    isAdded: cart.value.some((cartItem) => cartItem.id === item.id)
  }))
})

watch(filters, fetchItems)
</script>

<template>
  <div class="flex justify-between items-center">
    <h2 class="text-3xl font-bold mb-8">Все кроссовки</h2>

    <div class="flex gap-4">
      <select @change="onChangeSelect" class="py-2 px-3 border rounded-md outline-none">
        <option value="name">По названию</option>
        <option value="price">По цене (дешевые)</option>
        <option value="-price">По цене (дорогие)</option>
      </select>

      <div class="relative">
        <img class="absolute left-4 top-3" src="/search.svg" />
        <input
          @input="onChangeSearchInput"
          class="border rounded-md py-2 pl-11 pr-4 outline-none focus:border-gray-400"
          type="text"
          placeholder="Поиск..."
        />
      </div>
    </div>
  </div>

  <div class="mt-10">
    <CardList :items="items" @add-to-favorite="addToFavorite" @add-to-cart="onClickAddPlus" />
  </div>
</template>
