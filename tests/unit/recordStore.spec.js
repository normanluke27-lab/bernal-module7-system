/**
 * SmartStock Inventory System - Automated Unit Tests
 * Module 8: Software Testing
 * Tests: src/stores/recordStore.js (Pinia store)
 * Total: 12 tests across 5 features
 *
 * Run with: npm run test:run
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useRecordStore } from '@/stores/recordStore'

describe('SMARTSTOCK INVENTORY STORE', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  // ═══════════════════════════════════════════════════════
  // FEATURE 1: ADD PRODUCT (4 tests)
  // ═══════════════════════════════════════════════════════
  describe('Feature: Add Product', () => {

    it('TC-A01 [POSITIVE]: should add a new product with valid data', () => {
      const store = useRecordStore()
      const initialCount = store.productCount

      const result = store.addProduct({
        name: 'Wireless Mouse',
        productId: 'WM-001',
        category: 'Electronics',
        qty: 20,
        price: 250
      })

      expect(result).toBeDefined()
      expect(result.id).toBeDefined()
      expect(result.name).toBe('Wireless Mouse')
      expect(result.productId).toBe('WM-001')
      expect(result.category).toBe('Electronics')
      expect(result.qty).toBe(20)
      expect(result.price).toBe(250)
      expect(result.status).toBe('In Stock')
      expect(store.productCount).toBe(initialCount + 1)
    })

    it('TC-A02 [NEGATIVE]: should reject product with empty name', () => {
      const store = useRecordStore()
      expect(() => store.addProduct({
        name: '',
        productId: 'TEST-001',
        category: 'Electronics',
        qty: 10,
        price: 100
      })).toThrow('Product name is required')
      expect(store.productCount).toBe(0)
    })

    it('TC-A03 [NEGATIVE]: should reject negative quantity', () => {
      const store = useRecordStore()
      expect(() => store.addProduct({
        name: 'Bad Product',
        productId: 'BAD-001',
        category: 'Electronics',
        qty: -5,
        price: 100
      })).toThrow('Quantity cannot be negative')
    })

    it('TC-A04 [NEGATIVE]: should reject duplicate product ID', () => {
      const store = useRecordStore()
      store.addProduct({
        name: 'First Product',
        productId: 'DUP-001',
        category: 'Electronics',
        qty: 10,
        price: 100
      })
      expect(() => store.addProduct({
        name: 'Duplicate Product',
        productId: 'DUP-001',
        category: 'Electronics',
        qty: 5,
        price: 50
      })).toThrow('Product ID already exists')
    })
  })

  // ═══════════════════════════════════════════════════════
  // FEATURE 2: DISPLAY PRODUCTS (2 tests)
  // ═══════════════════════════════════════════════════════
  describe('Feature: Display Products', () => {

    it('TC-D01 [POSITIVE]: should return all products', () => {
      const store = useRecordStore()
      store.addProduct({ name: 'Keyboard', productId: 'KB-001', category: 'Electronics', qty: 15, price: 500 })
      store.addProduct({ name: 'Monitor', productId: 'MT-001', category: 'Electronics', qty: 8, price: 3000 })

      expect(store.allProducts).toHaveLength(2)
      expect(store.productCount).toBe(2)
      expect(store.inStockCount).toBe(2)
      expect(store.lowStockCount).toBe(0)
    })

    it('TC-D02 [EDGE]: should handle empty inventory', () => {
      const store = useRecordStore()
      expect(store.allProducts).toHaveLength(0)
      expect(store.productCount).toBe(0)
      expect(store.isEmpty).toBe(true)
      expect(store.inStockCount).toBe(0)
      expect(store.lowStockCount).toBe(0)
      expect(store.outOfStockCount).toBe(0)
    })
  })

  // ═══════════════════════════════════════════════════════
  // FEATURE 3: EDIT PRODUCT (2 tests)
  // ═══════════════════════════════════════════════════════
  describe('Feature: Edit Product', () => {

    it('TC-E01 [POSITIVE]: should update product and recalculate status', () => {
      const store = useRecordStore()
      const added = store.addProduct({
        name: 'Old Name',
        productId: 'EDIT-001',
        category: 'Electronics',
        qty: 20,
        price: 100
      })

      const updated = store.updateProduct({
        ...added,
        name: 'Updated Name',
        qty: 3
      })

      expect(updated.name).toBe('Updated Name')
      expect(updated.qty).toBe(3)
      expect(updated.status).toBe('Low Stock')
    })

    it('TC-E02 [NEGATIVE]: should throw error for non-existent product', () => {
      const store = useRecordStore()
      expect(() => store.updateProduct({
        id: '999',
        name: 'Ghost',
        productId: 'GHOST-001',
        category: 'Electronics',
        qty: 1,
        price: 1
      })).toThrow('Product not found')
    })
  })

  // ═══════════════════════════════════════════════════════
  // FEATURE 4: DELETE PRODUCT (2 tests) - BUG-001 FIX
  // ═══════════════════════════════════════════════════════
  describe('Feature: Delete Product', () => {

    it('TC-DE01 [POSITIVE]: should delete an existing product', () => {
      const store = useRecordStore()
      const added = store.addProduct({
        name: 'To Delete',
        productId: 'DEL-001',
        category: 'Electronics',
        qty: 10,
        price: 100
      })

      store.deleteProduct(added.id)

      expect(store.productCount).toBe(0)
      expect(store.allProducts.find(p => p.id === added.id)).toBeUndefined()
    })

    it('TC-DE02 [NEGATIVE]: should throw error when deleting non-existent product (BUG-001)', () => {
      const store = useRecordStore()
      store.addProduct({
        name: 'Safe Product',
        productId: 'SAFE-001',
        category: 'Electronics',
        qty: 10,
        price: 100
      })
      const initialCount = store.productCount

      expect(() => store.deleteProduct('fake-id-999'))
        .toThrow('Product not found')

      expect(store.productCount).toBe(initialCount)
      expect(store.allProducts[0].name).toBe('Safe Product')
    })
  })

  // ═══════════════════════════════════════════════════════
  // FEATURE 5: SEARCH / FILTER (2 tests)
  // ═══════════════════════════════════════════════════════
  describe('Feature: Search & Filter', () => {

    it('TC-S01 [POSITIVE]: should search products by name', () => {
      const store = useRecordStore()
      store.addProduct({ name: 'Gaming Mouse', productId: 'GM-001', category: 'Electronics', qty: 10, price: 500 })
      store.addProduct({ name: 'Office Chair', productId: 'OC-001', category: 'Furniture', qty: 5, price: 2000 })
      store.addProduct({ name: 'Mechanical Keyboard', productId: 'MK-001', category: 'Electronics', qty: 8, price: 1500 })

      store.setSearchQuery('Mouse')

      expect(store.filteredProducts).toHaveLength(1)
      expect(store.filteredProducts[0].name).toBe('Gaming Mouse')
    })

    it('TC-S02 [EDGE]: should return all products for empty search', () => {
      const store = useRecordStore()
      store.addProduct({ name: 'Item A', productId: 'A-001', category: 'Cat', qty: 1, price: 1 })
      store.addProduct({ name: 'Item B', productId: 'B-001', category: 'Cat', qty: 2, price: 2 })

      store.setSearchQuery('')

      expect(store.filteredProducts).toHaveLength(2)
    })
  })
})