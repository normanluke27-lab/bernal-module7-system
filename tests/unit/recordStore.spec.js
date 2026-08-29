import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useRecordStore } from '@/stores/recordStore'

describe('Record Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  // ADD RECORD - Positive
  it('should add a new record with valid data', () => {
    const store = useRecordStore()
    const result = store.addRecord({
      name: 'Maria Garcia',
      email: 'maria@university.edu',
      age: 19,
      course: 'BSIT'
    })
    expect(result.name).toBe('Maria Garcia')
    expect(store.recordCount).toBe(4)
  })

  // ADD RECORD - Negative (invalid email)
  it('should reject invalid email format', () => {
    const store = useRecordStore()
    expect(() => store.addRecord({
      name: 'Bad Email',
      email: 'not-an-email',
      age: 20,
      course: 'BSIT'
    })).toThrow('Invalid email format')
  })

  // DISPLAY - Positive
  it('should return all records', () => {
    const store = useRecordStore()
    expect(store.allRecords).toHaveLength(3)
  })

  // DISPLAY - Edge (empty)
  it('should detect empty state', () => {
    const store = useRecordStore()
    store.deleteRecord(1)
    store.deleteRecord(2)
    store.deleteRecord(3)
    expect(store.isEmpty).toBe(true)
  })

  // EDIT - Positive
  it('should update an existing record', () => {
    const store = useRecordStore()
    const updated = store.updateRecord(1, { name: 'John Updated' })
    expect(updated.name).toBe('John Updated')
  })

  // EDIT - Negative
  it('should throw error for non-existent record', () => {
    const store = useRecordStore()
    expect(() => store.updateRecord(999, { name: 'Ghost' }))
      .toThrow('Record not found')
  })

  // DELETE - Positive
  it('should delete an existing record', () => {
    const store = useRecordStore()
    store.deleteRecord(1)
    expect(store.recordCount).toBe(2)
    expect(store.getRecordById(1)).toBeUndefined()
  })

  // DELETE - Negative (BUG-001)
  it('should throw error when deleting non-existent record', () => {
    const store = useRecordStore()
    const initialCount = store.recordCount
    expect(() => store.deleteRecord(999)).toThrow('Record not found')
    expect(store.recordCount).toBe(initialCount)
  })

  // SEARCH - Positive
  it('should search by name', () => {
    const store = useRecordStore()
    const results = store.searchRecords('Jane')
    expect(results).toHaveLength(1)
    expect(results[0].name).toBe('Jane Smith')
  })

  // SEARCH - Edge
  it('should return all for empty search', () => {
    const store = useRecordStore()
    expect(store.searchRecords('')).toHaveLength(3)
  })
})