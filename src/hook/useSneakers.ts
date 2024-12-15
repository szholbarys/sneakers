import { ref, reactive, watch, onMounted } from 'vue'
import axios from 'axios'
import debounce from 'lodash.debounce'

type Item = {
  id: number
  title: string
  description?: string
  price: number
  isFavorite: boolean
  favoriteId: number | null
  isAdded: boolean
}

interface Filters {
  sortBy: string
  searchQuery: string
}

export const useSneakers = (cart: any) => {
  const items = ref<Item[]>([])
  const favorites = ref<Item[]>([])
  const filters = reactive<Filters>({
    sortBy: 'title',
    searchQuery: ''
  })

  const fetchItems = async () => {
    try {
      const params: Record<string, string> = {
        sortBy: filters.sortBy
      }
      if (filters.searchQuery) {
        params.title = `*${filters.searchQuery}*`
      }

      const { data } = await axios.get<Item[]>('https://abe73b250f6e119f.mokky.dev/items', { params })

      items.value = data.map((obj) => ({
        ...obj,
        description: obj.description || `This is a ${obj.title} sneaker.`,
        isFavorite: false,
        favoriteId: null,
        isAdded: false
      }))

      initializeFavorites()
    } catch (err) {
      console.error('Error fetching items:', err)
    }
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

  const addToFavorite = (item: Item) => {
    if (!item.isFavorite) {
      const favoriteItem = { ...item, favoriteId: Date.now() }
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

  const onClickAddPlus = (item: Item) => {
    if (!item.isAdded) {
      cart.value.push(item)
    } else {
      const index = cart.value.findIndex((cartItem: Item) => cartItem.id === item.id)
      if (index !== -1) cart.value.splice(index, 1)
    }

    localStorage.setItem('cart', JSON.stringify(cart.value))
  }

  const onChangeSelect = (sortBy: string) => {
    filters.sortBy = sortBy
  }

  const onChangeSearchInput = debounce((searchQuery: string) => {
    filters.searchQuery = searchQuery
  }, 300)

  watch(filters, fetchItems)
  watch(cart, () => {
    items.value = items.value.map((item) => ({
      ...item,
      isAdded: cart.value.some((cartItem: Item) => cartItem.id === item.id)
    }))
  })

  onMounted(async () => {
    const localCart = localStorage.getItem('cart')
    cart.value = localCart ? JSON.parse(localCart) : []

    await fetchItems()

    items.value = items.value.map((item) => ({
      ...item,
      isAdded: cart.value.some((cartItem: Item) => cartItem.id === item.id)
    }))
  })

  return {
    items,
    favorites,
    filters,
    fetchItems,
    addToFavorite,
    onClickAddPlus,
    onChangeSelect,
    onChangeSearchInput
  }
}
