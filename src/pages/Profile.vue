<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const user = ref({
  name: '',
  email: ''
})
const orders = ref([])

onMounted(() => {
  // Проверка статуса входа
  const isLoggedIn = localStorage.getItem('isLoggedIn')
  if (isLoggedIn !== 'true') {
    router.push('/login')
    return
  }

  // Загрузка данных пользователя из localStorage
  const savedUserData = localStorage.getItem('userData')
  if (savedUserData) {
    const parsedUserData = JSON.parse(savedUserData)
    user.value.name = parsedUserData.name
    user.value.email = parsedUserData.email
  }

  // Загрузка заказов из localStorage
  const savedOrders = localStorage.getItem('orders')
  if (savedOrders) {
    orders.value = JSON.parse(savedOrders)
  }
})

const logout = () => {
  localStorage.removeItem('isLoggedIn')
  router.push('/login')
}

const cancelOrder = (orderId) => {
  // Удаление заказа из orders
  orders.value = orders.value.filter(order => order.id !== orderId)
  
  // Обновление заказов в localStorage
  localStorage.setItem('orders', JSON.stringify(orders.value))
}
</script>
<template>
  <div class="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Профиль</h1>

      <div class="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div class="px-4 py-5 sm:px-6">
          <h2 class="text-lg leading-6 font-medium text-gray-900">Информация о пользователе</h2>
        </div>
        <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl class="sm:divide-y sm:divide-gray-200">
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Полное имя</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ user.name }}</dd>
            </div>
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Электронная почта</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ user.email }}</dd>
            </div>
          </dl>
        </div>
      </div>

      <h2 class="text-2xl font-bold text-gray-900 mb-4">Заказы</h2>
      <div v-if="orders.length === 0" class="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
        Пока нет заказов
      </div>
      <div v-else class="bg-white shadow overflow-hidden sm:rounded-lg">
        <ul class="divide-y divide-gray-200">
          <li v-for="order in orders" :key="order.id" class="px-4 py-4 sm:px-6">
            <div class="flex items-center justify-between">
              <p class="text-sm font-medium text-indigo-600 truncate">Заказ #{{ order.id }}</p>
              <div class="ml-2 flex-shrink-0 flex">
                <!-- Change the label based on delivery progress -->
                <p v-if="order.deliveryProgress === 100" 
                   class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                  Доставлен
                </p>
                <p v-else
                   class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Завершён
                </p>
                <button 
                  @click="cancelOrder(order.id)" 
                  class="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800"
                >
                  Отменить
                </button>
              </div>
            </div>
            
            <!-- Delivery Process -->
            <div class="relative mt-4">
              <div class="w-full h-2 bg-gray-200 rounded-full">
                <div 
                  class="h-2 bg-blue-500 rounded-full progress-bar" 
                  :style="{ width: order.deliveryProgress + '%' }"
                ></div>
              </div>
              <div 
                class="absolute top-0 left-0 transform -translate-x-1/2 translate-y-1/2 animate-move-airplane"
                :style="{ left: `calc(${order.deliveryProgress}% - 15px)` }"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 text-blue-500 -rotate-90 mt-[-18px]">
                  <path fill-rule="evenodd" d="M9 2a1 1 0 011 1v6.793l2.708-2.707a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 9.793V3a1 1 0 011-1z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>

            <div class="mt-2 sm:flex sm:justify-between">
              <div class="sm:flex">
                <p class="flex items-center text-sm text-gray-500">Дата: {{ order.date }}</p>
              </div>
              <div class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                <p>Итого: {{ order.total }} тг</p>
              </div>
            </div>
            <div class="mt-4">
              <h3 class="text-sm font-medium text-gray-900 mb-2">Заказанные товары:</h3>
              <ul class="space-y-2">
                <li 
                  v-for="item in order.items" 
                  :key="item.id" 
                  class="flex justify-between text-sm"
                >
                  <span>{{ item.title }}</span>
                  <span>{{ item.price }} тг</span>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>

      <div class="mt-8">
        <button
          @click="logout"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Выйти
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes move-airplane {
  0% {
    left: 0;
  }
  100% {
    left: 100%;
  }
}

.progress-bar {
  transition: width 1s ease-out;
}

.animate-move-airplane {
  animation: move-airplane 100s infinite linear;
}
</style>
