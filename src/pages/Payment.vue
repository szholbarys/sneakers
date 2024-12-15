<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import SuccessModal from './../components/SuccessModal.vue'

const router = useRouter()

const fullName = ref('')
const phoneNumber = ref('')
const address = ref('')
const cardNumber = ref('')
const expiryDate = ref('')
const cvv = ref('')

const showSuccessModal = ref(false)

const submitPayment = () => {
  // Получить товары из корзины из localStorage
  const cartItems = JSON.parse(localStorage.getItem('cart') || '[]')

  // Создать объект заказа
  const order = {
    id: Date.now(), // Уникальный ID заказа
    date: new Date().toISOString().split('T')[0],
    items: cartItems,
    total: cartItems.reduce((total, item) => total + item.price, 0),
    customerDetails: {
      fullName: fullName.value,
      phoneNumber: phoneNumber.value,
      address: address.value
    }
  }

  // Сохранить заказ в localStorage
  const orders = JSON.parse(localStorage.getItem('orders') || '[]')
  orders.push(order)
  localStorage.setItem('orders', JSON.stringify(orders))

  // Очистить корзину
  localStorage.removeItem('cart')

  console.log('Оплата завершена')
  showSuccessModal.value = true

  setTimeout(() => {
    showSuccessModal.value = false
    router.push('/profile')
  }, 1000)
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div class="px-4 py-5 sm:p-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Детали оплаты</h2>
        <form @submit.prevent="submitPayment" class="space-y-6">
          <div>
            <label for="fullName" class="block text-sm font-medium text-gray-700">Полное имя</label>
            <input
              type="text"
              id="fullName"
              v-model="fullName"
              required
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label for="phoneNumber" class="block text-sm font-medium text-gray-700"
              >Номер телефона</label
            >
            <input
              type="tel"
              id="phoneNumber"
              v-model="phoneNumber"
              required
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label for="address" class="block text-sm font-medium text-gray-700">Адрес</label>
            <textarea
              id="address"
              v-model="address"
              rows="3"
              required
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            ></textarea>
          </div>
          <div>
            <label for="cardNumber" class="block text-sm font-medium text-gray-700"
              >Номер карты</label
            >
            <input
              type="text"
              id="cardNumber"
              v-model="cardNumber"
              required
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="expiryDate" class="block text-sm font-medium text-gray-700"
                >Срок действия</label
              >
              <input
                type="text"
                id="expiryDate"
                v-model="expiryDate"
                placeholder="MM/YY"
                required
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label for="cvv" class="block text-sm font-medium text-gray-700">CVV</label>
              <input
                type="text"
                id="cvv"
                v-model="cvv"
                required
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Завершить оплату
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <SuccessModal :show="showSuccessModal" @close="showSuccessModal = false" />
</template>
