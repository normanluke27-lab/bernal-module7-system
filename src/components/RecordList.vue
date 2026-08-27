<template>
  <div>
    <!-- Search -->
    <div class="mb-4">
      <input v-model="searchQuery" type="text" placeholder="Search by product name, ID, or category..."
        class="w-full px-3 py-2.5 border rounded-lg text-sm bg-white text-black focus:outline-2 focus:outline-black" />
    </div>
    
    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-4">
      <div class="p-4 rounded-lg border border-gray-200 text-center">
        <p class="text-2xl font-medium text-black tabular-nums">{{ filteredProducts.length }}</p>
        <p class="text-xs text-gray-500 mt-1">total products</p>
      </div>
      <div class="p-4 rounded-lg border border-gray-200 text-center">
        <p class="text-2xl font-medium text-green-600 tabular-nums">{{ inStockCount }}</p>
        <p class="text-xs text-gray-500 mt-1">in stock</p>
      </div>
      <div class="p-4 rounded-lg border border-gray-200 text-center">
        <p class="text-2xl font-medium text-yellow-600 tabular-nums">{{ lowStockCount }}</p>
        <p class="text-xs text-gray-500 mt-1">low stock</p>
      </div>
      <div class="p-4 rounded-lg border border-gray-200 text-center">
        <p class="text-2xl font-medium text-red-600 tabular-nums">{{ outOfStockCount }}</p>
        <p class="text-xs text-gray-500 mt-1">out of stock</p>
      </div>
    </div>
    
    <!-- List -->
    <div v-if="filteredProducts.length > 0" class="flex flex-col gap-2">
      <div v-for="product in filteredProducts" :key="product.id"
        class="product-row p-4 rounded-lg border border-gray-200 flex justify-between items-start gap-3 hover:bg-gray-50 transition-colors">
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1 flex-wrap">
            <h3 class="text-[15px] font-medium text-black break-words">{{ product.name }}</h3>
            <span class="text-[11px] text-gray-400 font-mono">{{ product.productId }}</span>
            <span class="text-xs px-2.5 py-0.5 rounded-md font-medium whitespace-nowrap"
              :style="{ background: statusBg(product), color: statusColor(product) }">
              {{ stockStatus(product) }}
            </span>
          </div>
          <div class="flex gap-4 flex-wrap">
            <p class="text-[13px] text-gray-500">category: <span class="text-black font-medium">{{ product.category }}</span></p>
            <p class="text-[13px] text-gray-500">qty: <span class="text-black font-medium tabular-nums">{{ product.quantity }}</span></p>
            <p class="text-[13px] text-gray-500">price: <span class="text-black font-medium">{{ formatPrice(product.price) }}</span></p>
          </div>
        </div>
        <div class="row-actions flex gap-1.5 opacity-0 transition-opacity duration-150">
          <button @click="$emit('edit', product)"
            class="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-500 text-xs hover:bg-gray-50">
            edit
          </button>
          <button @click="confirmDelete(product)"
            class="px-3 py-1.5 rounded-lg border border-red-200 text-red-500 text-xs hover:bg-red-50">
            delete
          </button>
        </div>
      </div>
    </div>
    
    <!-- Empty State -->
    <div v-else class="text-center py-10 rounded-xl border border-dashed border-gray-300">
      <p class="text-sm text-gray-500">no products found</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps(['products'])
const emit = defineEmits(['edit', 'delete'])

const LOW_STOCK_THRESHOLD = 10
const searchQuery = ref('')

const filteredProducts = computed(() => {
  const keyword = searchQuery.value.toLowerCase()
  if (!keyword) return props.products
  return props.products.filter(p => 
    p.name.toLowerCase().includes(keyword) || 
    p.productId.toLowerCase().includes(keyword) ||
    p.category.toLowerCase().includes(keyword)
  )
})

const inStockCount = computed(() => 
  filteredProducts.value.filter(p => p.quantity > LOW_STOCK_THRESHOLD).length
)
const lowStockCount = computed(() => 
  filteredProducts.value.filter(p => p.quantity > 0 && p.quantity <= LOW_STOCK_THRESHOLD).length
)
const outOfStockCount = computed(() => 
  filteredProducts.value.filter(p => p.quantity <= 0).length
)

function stockStatus(product) {
  if (product.quantity <= 0) return 'Out of Stock'
  if (product.quantity <= LOW_STOCK_THRESHOLD) return 'Low Stock'
  return 'In Stock'
}

function statusColor(product) {
  const s = stockStatus(product)
  if (s === 'In Stock') return '#16a34a'
  if (s === 'Low Stock') return '#ca8a04'
  return '#dc2626'
}

function statusBg(product) {
  const s = stockStatus(product)
  if (s === 'In Stock') return 'rgba(22, 163, 74, 0.12)'
  if (s === 'Low Stock') return 'rgba(202, 138, 4, 0.12)'
  return 'rgba(220, 38, 38, 0.12)'
}

function formatPrice(price) {
  return '₱' + parseFloat(price).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

function confirmDelete(product) {
  const confirmed = window.confirm(`are you sure you want to delete "${product.name}"?`)
  if (confirmed) emit('delete', product.id)
}
</script>

<style scoped>
.product-row:hover .row-actions {
  opacity: 1;
}
@media (max-width: 640px) {
  .product-row { flex-direction: column; }
  .row-actions { opacity: 1; margin-top: 8px; }
}
</style>