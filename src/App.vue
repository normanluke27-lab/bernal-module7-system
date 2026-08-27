<template>
  <div class="max-w-3xl mx-auto p-4" style="font-family: var(--kimi-font-sans, sans-serif);">
    <AppHeader />
    
    <!-- Feedback -->
    <div v-if="feedback.message" 
      class="px-4 py-3 rounded-lg mb-4 text-sm font-medium"
      :class="feedback.type === 'success' ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'">
      {{ feedback.message }}
    </div>
    
    <RecordForm 
      :editingProduct="editingProduct" 
      :existingIds="existingProductIds"
      @add="addProduct" 
      @update="updateProduct" 
      @cancel="cancelEdit" />
    
    <RecordList 
      :products="products" 
      @edit="startEdit" 
      @delete="deleteProduct" />
    
    <AppFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AppHeader from './components/AppHeader.vue'
import RecordForm from './components/RecordForm.vue'
import RecordList from './components/RecordList.vue'
import AppFooter from './components/AppFooter.vue'

const products = ref([])
const editingId = ref(null)
const feedback = ref({ message: '', type: '' })

const editingProduct = computed(() => {
  return editingId.value ? products.value.find(p => p.id === editingId.value) : null
})

const existingProductIds = computed(() => {
  return products.value.map(p => p.productId.toLowerCase())
})

// Load from localStorage on mount
onMounted(() => {
  const saved = localStorage.getItem('smartstock-products')
  if (saved) {
    products.value = JSON.parse(saved)
  }
})

// Save to localStorage
function saveToStorage() {
  localStorage.setItem('smartstock-products', JSON.stringify(products.value))
}

function showFeedback(message, type) {
  feedback.value = { message, type }
  setTimeout(() => { feedback.value = { message: '', type: '' } }, 3000)
}

// CREATE
function addProduct(newProduct) {
  const product = {
    id: Date.now().toString(),
    ...newProduct
  }
  products.value.push(product)
  saveToStorage()
  showFeedback('product added successfully', 'success')
}

// EDIT setup
function startEdit(product) {
  editingId.value = product.id
}

function cancelEdit() {
  editingId.value = null
}

// UPDATE
function updateProduct(updatedProduct) {
  const idx = products.value.findIndex(p => p.id === updatedProduct.id)
  if (idx !== -1) {
    products.value[idx] = updatedProduct
    saveToStorage()
    showFeedback('product updated successfully', 'success')
  }
  editingId.value = null
}

// DELETE
function deleteProduct(id) {
  products.value = products.value.filter(p => p.id !== id)
  saveToStorage()
  showFeedback('product deleted successfully', 'success')
}
</script>