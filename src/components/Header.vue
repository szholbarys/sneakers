<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

defineProps({
  totalPrice: Number
})

const emit = defineEmits(['openDrawer'])
const router = useRouter()
const route = useRoute() // Access the current route
const isLoggedIn = ref(false)

onMounted(() => {
  isLoggedIn.value = localStorage.getItem('isLoggedIn') === 'true'
})

const handleProfileClick = () => {
  if (isLoggedIn.value) {
    router.push('/profile')
  } else {
    router.push('/login')
  }
}

// Dynamically compute if the header should be visible based on the route
const shouldShowHeader = computed(() => !['/login', '/register'].includes(route.path))
</script>

<template>
  <header
    v-if="shouldShowHeader"
    class="flex justify-between border-b border-slate-200 px-10 py-8"
  >
    <router-link to="/">
      <div class="flex items-center gap-4">
        <img src="/sneakers.webp" alt="Logo" class="w-20" />
        <div>
          <h2 class="text-xl font-bold uppercase">Sneakers</h2>
          <p class="text-slate-400">Магазин лучших кроссовок</p>
        </div>
      </div>
    </router-link>

    <ul class="flex items-center gap-10">
      <li
        @click="() => emit('openDrawer')"
        class="flex items-center cursor-pointer gap-3 text-gray-500 hover:text-black"
      >
        <img src="/cart.svg" alt="Cart" />
        <b>{{ totalPrice }} тг.</b>
      </li>

      <router-link to="/favorites">
        <li class="flex items-center cursor-pointer gap-3 text-gray-500 hover:text-black">
          <img src="/heart.svg" alt="Favorites" />
          <span>Избранное</span>
        </li>
      </router-link>

      <li
        @click="handleProfileClick"
        class="flex items-center cursor-pointer gap-3 text-gray-500 hover:text-black"
      >
        <img src="/profile.svg" alt="Profile" />
        <span>Профиль</span>
      </li>
    </ul>
  </header>
</template>
