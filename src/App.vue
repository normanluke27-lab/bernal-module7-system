<template>
  <div class="max-w-3xl mx-auto p-4" style="font-family: var(--kimi-font-sans, sans-serif);">
    <AppHeader />

    <!-- Feedback -->
    <div
      v-if="store.feedback.message"
      class="px-4 py-3 rounded-lg mb-4 text-sm font-medium"
      :class="store.feedback.type === 'success'
        ? 'bg-green-50 text-green-600 border border-green-200'
        : 'bg-red-50 text-red-600 border border-red-200'"
    >
      {{ store.feedback.message }}
    </div>

    <!-- Form -->
    <RecordForm
      :editingProduct="store.editingProduct"
      :existingIds="store.existingProductIds"
      @add="handleAdd"
      @update="handleUpdate"
      @cancel="handleCancel"
    />

    <!-- Search -->
    <div class="mb-4">
      <input
        v-model="store.searchQuery"
        type="text"
        placeholder="Search by product name, ID, or category..."
        class="w-full px-4 py-2 border rounded-lg"
      />
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-4 gap-2 mb-4 text-sm text-center">
      <div class="p-3 bg-gray-100 rounded-lg">
        <div class="font-bold text-lg">{{ store.productCount }}</div>
        <div class="text-gray-500">Total</div>
      </div>
      <div class="p-3 bg-green-50 rounded-lg text-green-700">
        <div class="font-bold text-lg">{{ store.inStockCount }}</div>
        <div>In Stock</div>
      </div>
      <div class="p-3 bg-yellow-50 rounded-lg text-yellow-700">
        <div class="font-bold text-lg">{{ store.lowStockCount }}</div>
        <div>Low Stock</div>
      </div>
      <div class="p-3 bg-red-50 rounded-lg text-red-700">
        <div class="font-bold text-lg">{{ store.outOfStockCount }}</div>
        <div>Out of Stock</div>
      </div>
    </div>

    <!-- List -->
    <RecordList
      :products="store.filteredProducts"
      @edit="store.startEdit"
      @delete="store.deleteProduct"
    />

    <AppFooter />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRecordStore } from './stores/recordStore.js'
import AppHeader from './components/AppHeader.vue'
import RecordForm from './components/RecordForm.vue'
import RecordList from './components/RecordList.vue'
import AppFooter from './components/AppFooter.vue'

const store = useRecordStore()

// CRITICAL FIX: Map 'quantity' (from form) to 'qty' (what store expects)
function handleAdd(formData) {
  try {
    store.addProduct({
      name: formData.name,
      productId: formData.productId,
      category: formData.category,
      qty: formData.quantity,      // ← Map quantity → qty
      price: formData.price
    })
  } catch (error) {
    console.error('Add error:', error.message)
    alert(error.message)
  }
}

// CRITICAL FIX: Map 'quantity' → 'qty' for updates too
function handleUpdate(formData) {
  try {
    store.updateProduct({
      id: formData.id,
      name: formData.name,
      productId: formData.productId,
      category: formData.category,
      qty: formData.quantity,      // ← Map quantity → qty
      price: formData.price
    })
  } catch (error) {
    console.error('Update error:', error.message)
    alert(error.message)
  }
}

function handleCancel() {
  store.cancelEdit()
}

onMounted(() => {
  store.loadFromStorage()
})
</script>