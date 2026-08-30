/**
 * SmartStock Inventory Store (Pinia - Composition API)
 * Module 8: Software Testing
 *
 * Features:
 *   - Add Product
 *   - Display Products
 *   - Edit/Update Product
 *   - Delete Product
 *   - Search/Filter Products
 *   - Stock status auto-calculation
 *
 * BUG-001 FIX: deleteProduct() now validates existence before deletion.
 * Before fix: Used filter() which silently did nothing for bad IDs,
 *             then showed false "deleted successfully" message.
 * After fix:  Uses findIndex() + guard clause. Throws error if not found.
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'smartstock-products'

export const useRecordStore = defineStore('inventory', () => {
  // ═══════════════════════════════════════════════════════
  // STATE
  // ═══════════════════════════════════════════════════════
  const products = ref([])
  const editingId = ref(null)
  const feedback = ref({ message: '', type: '' })
  const searchQuery = ref('')

  // ═══════════════════════════════════════════════════════
  // GETTERS (Computed)
  // ═══════════════════════════════════════════════════════
  const allProducts = computed(() => products.value)

  const productCount = computed(() => products.value.length)

  const isEmpty = computed(() => products.value.length === 0)

  const editingProduct = computed(() => {
    return editingId.value
      ? products.value.find(p => p.id === editingId.value)
      : null
  })

  const existingProductIds = computed(() => {
    return products.value.map(p => p.productId.toLowerCase())
  })

  const filteredProducts = computed(() => {
    if (!searchQuery.value || searchQuery.value.trim() === '') {
      return products.value
    }
    const q = searchQuery.value.toLowerCase().trim()
    return products.value.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.productId.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    )
  })

  const inStockCount = computed(() =>
    products.value.filter(p => p.status === 'In Stock').length
  )

  const lowStockCount = computed(() =>
    products.value.filter(p => p.status === 'Low Stock').length
  )

  const outOfStockCount = computed(() =>
    products.value.filter(p => p.status === 'Out of Stock').length
  )

  // ═══════════════════════════════════════════════════════
  // PERSISTENCE
  // ═══════════════════════════════════════════════════════
  function loadFromStorage() {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        products.value = JSON.parse(saved)
      } catch (e) {
        products.value = []
      }
    }
  }

  function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products.value))
  }

  // ═══════════════════════════════════════════════════════
  // FEEDBACK
  // ═══════════════════════════════════════════════════════
  function showFeedback(message, type) {
    feedback.value = { message, type }
    setTimeout(() => {
      feedback.value = { message: '', type: '' }
    }, 3000)
  }

  // ═══════════════════════════════════════════════════════
  // VALIDATION
  // ═══════════════════════════════════════════════════════
  function validateProduct(product, isUpdate = false) {
    if (!product.name || product.name.trim() === '') {
      throw new Error('Product name is required')
    }
    if (product.name.trim().length < 2) {
      throw new Error('Product name must be at least 2 characters')
    }
    if (!product.productId || product.productId.trim() === '') {
      throw new Error('Product ID is required')
    }
    if (!product.category || product.category.trim() === '') {
      throw new Error('Category is required')
    }
    if (typeof product.qty !== 'number' || isNaN(product.qty)) {
      throw new Error('Quantity must be a number')
    }
    if (product.qty < 0) {
      throw new Error('Quantity cannot be negative')
    }
    if (typeof product.price !== 'number' || isNaN(product.price)) {
      throw new Error('Price must be a number')
    }
    if (product.price < 0) {
      throw new Error('Price cannot be negative')
    }
    // Check duplicate productId
    const dup = products.value.find(p =>
      p.productId.toLowerCase() === product.productId.toLowerCase() &&
      p.id !== product.id
    )
    if (dup) {
      throw new Error('Product ID already exists')
    }
  }

  // ═══════════════════════════════════════════════════════
  // HELPER: Compute stock status
  // ═══════════════════════════════════════════════════════
  function computeStatus(qty) {
    if (qty === 0) return 'Out of Stock'
    if (qty <= 5) return 'Low Stock'
    return 'In Stock'
  }

  // ═══════════════════════════════════════════════════════
  // ACTION: ADD PRODUCT
  // ═══════════════════════════════════════════════════════
  function addProduct(newProduct) {
    validateProduct(newProduct)

    const product = {
      id: Date.now().toString(),
      name: newProduct.name.trim(),
      productId: newProduct.productId.trim(),
      category: newProduct.category.trim(),
      qty: newProduct.qty,
      price: newProduct.price,
      status: computeStatus(newProduct.qty)
    }

    products.value.push(product)
    saveToStorage()
    showFeedback('Product added successfully', 'success')
    return product
  }

  // ═══════════════════════════════════════════════════════
  // ACTION: START EDIT
  // ═══════════════════════════════════════════════════════
  function startEdit(product) {
    editingId.value = product.id
  }

  // ═══════════════════════════════════════════════════════
  // ACTION: CANCEL EDIT
  // ═══════════════════════════════════════════════════════
  function cancelEdit() {
    editingId.value = null
  }

  // ═══════════════════════════════════════════════════════
  // ACTION: UPDATE PRODUCT
  // ═══════════════════════════════════════════════════════
  function updateProduct(updatedProduct) {
    const idx = products.value.findIndex(p => p.id === updatedProduct.id)
    if (idx === -1) {
      throw new Error('Product not found')
    }

    validateProduct(updatedProduct, true)

    products.value[idx] = {
      ...updatedProduct,
      status: computeStatus(updatedProduct.qty)
    }

    saveToStorage()
    showFeedback('Product updated successfully', 'success')
    editingId.value = null
    return products.value[idx]
  }

  // ═══════════════════════════════════════════════════════
  // ACTION: DELETE PRODUCT
  // ═══════════════════════════════════════════════════════
  // BUG-001 FIX:
  // Before: filter() silently returned same array for bad IDs,
  //         then showed false success message.
  // After:  findIndex() checks existence. Throws if not found.
  // ═══════════════════════════════════════════════════════
  function deleteProduct(id) {
    const idx = products.value.findIndex(p => p.id === id)
    if (idx === -1) {
      throw new Error('Product not found')
    }
    products.value.splice(idx, 1)
    saveToStorage()
    showFeedback('Product deleted successfully', 'success')
  }

  // ═══════════════════════════════════════════════════════
  // ACTION: SEARCH
  // ═══════════════════════════════════════════════════════
  function setSearchQuery(query) {
    searchQuery.value = query
  }

  // ═══════════════════════════════════════════════════════
  // RESET (for testing)
  // ═══════════════════════════════════════════════════════
  function resetStore(testData = []) {
    products.value = testData
    editingId.value = null
    feedback.value = { message: '', type: '' }
    searchQuery.value = ''
  }

  // ═══════════════════════════════════════════════════════
  // RETURN EVERYTHING
  // ═══════════════════════════════════════════════════════
  return {
    // State
    products,
    editingId,
    feedback,
    searchQuery,
    // Getters
    allProducts,
    productCount,
    isEmpty,
    editingProduct,
    existingProductIds,
    filteredProducts,
    inStockCount,
    lowStockCount,
    outOfStockCount,
    // Persistence
    loadFromStorage,
    // Actions
    addProduct,
    startEdit,
    cancelEdit,
    updateProduct,
    deleteProduct,
    setSearchQuery,
    // Test utility
    resetStore
  }
})