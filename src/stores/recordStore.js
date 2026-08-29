import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useRecordStore = defineStore('records', () => {
  // State
  const records = ref([
    { id: 1, name: 'John Doe', email: 'john@example.com', age: 20, course: 'BSIT' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 22, course: 'BSCS' },
    { id: 3, name: 'Robert Johnson', email: 'robert@example.com', age: 21, course: 'BSIS' }
  ])
  const nextId = ref(4)

  // Getters
  const allRecords = computed(() => [...records.value].sort((a, b) => a.id - b.id))
  const recordCount = computed(() => records.value.length)
  const isEmpty = computed(() => records.value.length === 0)
  
  const searchRecords = computed(() => (query) => {
    if (!query || query.trim() === '') return records.value
    const q = query.toLowerCase().trim()
    return records.value.filter(r => 
      r.name.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.course.toLowerCase().includes(q)
    )
  })

  // Actions
  function addRecord(record) {
    if (!record.name || record.name.trim() === '') {
      throw new Error('Name is required')
    }
    if (!record.email || record.email.trim() === '') {
      throw new Error('Email is required')
    }
    if (!record.course || record.course.trim() === '') {
      throw new Error('Course is required')
    }
    if (!isValidEmail(record.email)) {
      throw new Error('Invalid email format')
    }
    if (typeof record.age !== 'number' || isNaN(record.age)) {
      throw new Error('Age must be a number')
    }
    if (record.age < 0) {
      throw new Error('Age cannot be negative')
    }
    if (record.age > 120) {
      throw new Error('Age must be 120 or below')
    }
    if (record.name.trim().length < 2) {
      throw new Error('Name must be at least 2 characters')
    }
    const dup = records.value.find(r => r.email.toLowerCase() === record.email.toLowerCase())
    if (dup) {
      throw new Error('Email already exists')
    }

    const newRecord = {
      id: nextId.value++,
      name: record.name.trim(),
      email: record.email.trim().toLowerCase(),
      age: record.age,
      course: record.course.trim().toUpperCase()
    }
    records.value.push(newRecord)
    return newRecord
  }

  function updateRecord(id, updatedData) {
    const index = records.value.findIndex(r => r.id === id)
    if (index === -1) {
      throw new Error('Record not found')
    }
    if (updatedData.email !== undefined) {
      if (!updatedData.email || updatedData.email.trim() === '') {
        throw new Error('Email cannot be empty')
      }
      if (!isValidEmail(updatedData.email)) {
        throw new Error('Invalid email format')
      }
      const dup = records.value.find(r => r.id !== id && r.email.toLowerCase() === updatedData.email.toLowerCase())
      if (dup) {
        throw new Error('Email already exists')
      }
    }
    if (updatedData.age !== undefined) {
      if (typeof updatedData.age !== 'number' || isNaN(updatedData.age)) {
        throw new Error('Age must be a number')
      }
      if (updatedData.age < 0) {
        throw new Error('Age cannot be negative')
      }
      if (updatedData.age > 120) {
        throw new Error('Age must be 120 or below')
      }
    }
    if (updatedData.name !== undefined) {
      if (updatedData.name.trim().length < 2) {
        throw new Error('Name must be at least 2 characters')
      }
    }
    records.value[index] = { ...records.value[index], ...updatedData }
    return records.value[index]
  }

  // BUG-001 FIX: Added guard clause
  function deleteRecord(id) {
    const index = records.value.findIndex(r => r.id === id)
    if (index === -1) {
      throw new Error('Record not found')
    }
    records.value.splice(index, 1)
  }

  function getRecordById(id) {
    return records.value.find(r => r.id === id)
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  function resetStore() {
    records.value = [
      { id: 1, name: 'John Doe', email: 'john@example.com', age: 20, course: 'BSIT' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 22, course: 'BSCS' },
      { id: 3, name: 'Robert Johnson', email: 'robert@example.com', age: 21, course: 'BSIS' }
    ]
    nextId.value = 4
  }

  return {
    records,
    allRecords,
    recordCount,
    isEmpty,
    searchRecords,
    addRecord,
    updateRecord,
    deleteRecord,
    getRecordById,
    isValidEmail,
    resetStore
  }
})