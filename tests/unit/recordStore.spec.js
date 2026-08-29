import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useRecordStore } from '@/stores/recordStore'

describe('Record Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  // TEST 1: Add Record - Positive
  it('should add a new record successfully', () => {
    const store = useRecordStore()
    const newRecord = {
      name: 'Alice Brown',
      email: 'alice@example.com',
      age: 21,
      course: 'BSIS'
    }
    
    const result = store.addRecord(newRecord)
    
    expect(result).toHaveProperty('id')
    expect(result.name).toBe('Alice Brown')
    expect(store.recordCount).toBe(3)
  })

  // TEST 2: Add Record - Validation (Negative)
  it('should throw error when adding record with invalid email', () => {
    const store = useRecordStore()
    const invalidRecord = {
      name: 'Bob Wilson',
      email: 'invalid-email',
      age: 25,
      course: 'BSIT'
    }
    
    expect(() => store.addRecord(invalidRecord)).toThrow('Invalid email format')
  })

  // TEST 3: Display Records
  it('should return all records', () => {
    const store = useRecordStore()
    
    const all = store.allRecords
    
    expect(all).toHaveLength(2)
    expect(all[0]).toHaveProperty('name', 'John Doe')
  })

  // TEST 4: Edit Record - Positive
  it('should update an existing record', () => {
    const store = useRecordStore()
    
    const updated = store.updateRecord(1, { name: 'John Updated', age: 21 })
    
    expect(updated.name).toBe('John Updated')
    expect(updated.age).toBe(21)
    expect(store.getRecordById(1).name).toBe('John Updated')
  })

  // TEST 5: Edit Record - Negative (Record not found)
  it('should throw error when updating non-existent record', () => {
    const store = useRecordStore()
    
    expect(() => store.updateRecord(999, { name: 'Ghost' })).toThrow('Record not found')
  })

  // TEST 6: Delete Record - Positive
  it('should delete a record successfully', () => {
    const store = useRecordStore()
    
    store.deleteRecord(1)
    
    expect(store.recordCount).toBe(1)
    expect(store.getRecordById(1)).toBeUndefined()
  })

  // TEST 7: Delete Record - Negative
  it('should throw error when deleting non-existent record', () => {
    const store = useRecordStore()
    
    expect(() => store.deleteRecord(999)).toThrow('Record not found')
  })

  // TEST 8: Search Feature
  it('should search records by name', () => {
    const store = useRecordStore()
    
    const results = store.searchRecords('Jane')
    
    expect(results).toHaveLength(1)
    expect(results[0].name).toBe('Jane Smith')
  })

  // TEST 9: Validation - Age boundary
  it('should throw error for invalid age', () => {
    const store = useRecordStore()
    const record = {
      name: 'Test User',
      email: 'test@example.com',
      age: 150,
      course: 'BSIT'
    }
    
    expect(() => store.addRecord(record)).toThrow('Age must be between 0 and 120')
  })

  // TEST 10: Empty search returns all
  it('should return all records when search query is empty', () => {
    const store = useRecordStore()
    
    const results = store.searchRecords('')
    
    expect(results).toHaveLength(2)
  })
})