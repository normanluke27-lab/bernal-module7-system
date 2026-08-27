<template>
  <div class="p-5 rounded-xl border border-gray-200 mb-5">
    <h2 class="text-lg font-medium text-black mb-4">
      {{ editingId ? 'edit product' : 'add new product' }}
    </h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
      <div>
        <label class="block text-xs text-gray-500 mb-1">product name *</label>
        <input v-model="form.name" type="text" placeholder="e.g. Wireless Mouse"
          class="w-full px-3 py-2.5 border rounded-lg text-sm bg-white text-black focus:outline-2 focus:outline-black" />
      </div>
      <div>
        <label class="block text-xs text-gray-500 mb-1">product id *</label>
        <input v-model="form.productId" type="text" placeholder="e.g. PRD-001"
          class="w-full px-3 py-2.5 border rounded-lg text-sm bg-white text-black focus:outline-2 focus:outline-black" />
      </div>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
      <div>
        <label class="block text-xs text-gray-500 mb-1">category *</label>
        <select v-model="form.category"
          class="w-full px-3 py-2.5 border rounded-lg text-sm bg-white text-black focus:outline-2 focus:outline-black">
          <option value="">Select category</option>
          <option value="Electronics">Electronics</option>
          <option value="Office Supplies">Office Supplies</option>
          <option value="Furniture">Furniture</option>
          <option value="Tools">Tools</option>
          <option value="Accessories">Accessories</option>
        </select>
      </div>
      <div>
        <label class="block text-xs text-gray-500 mb-1">quantity *</label>
        <input v-model.number="form.quantity" type="number" min="0" placeholder="0"
          class="w-full px-3 py-2.5 border rounded-lg text-sm bg-white text-black focus:outline-2 focus:outline-black" />
      </div>
      <div>
        <label class="block text-xs text-gray-500 mb-1">price (₱) *</label>
        <input v-model.number="form.price" type="number" min="0" step="0.01" placeholder="0.00"
          class="w-full px-3 py-2.5 border rounded-lg text-sm bg-white text-black focus:outline-2 focus:outline-black" />
      </div>
    </div>
    
    <div class="flex gap-2">
      <button @click="submitForm"
        class="px-6 py-2.5 rounded-lg bg-black text-white text-sm font-medium hover:opacity-85 transition-opacity">
        {{ editingId ? 'update product' : 'add product' }}
      </button>
      <button v-if="editingId" @click="cancelEdit"
        class="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-500 text-sm hover:bg-gray-50">
        cancel
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps(['editingProduct', 'existingIds'])
const emit = defineEmits(['add', 'update', 'cancel'])

const editingId = ref(null)
const form = ref({ name: '', productId: '', category: '', quantity: 0, price: 0 })

watch(() => props.editingProduct, (product) => {
  if (product) {
    editingId.value = product.id
    form.value = { ...product }
  }
}, { deep: true })

function submitForm() {
  // Validation
  if (!form.value.name || !form.value.productId || !form.value.category) {
    alert('please fill in all required fields')
    return
  }
  if (form.value.quantity === '' || form.value.quantity === null || isNaN(form.value.quantity) || form.value.quantity < 0) {
    alert('please enter a valid quantity')
    return
  }
  if (form.value.price === '' || form.value.price === null || isNaN(form.value.price) || form.value.price < 0) {
    alert('please enter a valid price')
    return
  }

  // Check duplicate Product ID on create
  if (!editingId.value && props.existingIds.includes(form.value.productId.toLowerCase())) {
    alert('product id already exists')
    return
  }

  if (editingId.value) {
    emit('update', { ...form.value, id: editingId.value })
  } else {
    emit('add', { ...form.value })
  }
  
  resetForm()
}

function cancelEdit() {
  resetForm()
  emit('cancel')
}

function resetForm() {
  editingId.value = null
  form.value = { name: '', productId: '', category: '', quantity: 0, price: 0 }
}
</script>