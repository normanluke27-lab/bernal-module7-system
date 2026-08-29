import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useRecordStore = defineStore('records', () => {
  // State
  const records = ref([
    { id: 1, name: 'John Doe', email: 'john@example.com', age: 20, course: 'BSIT' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 22, course: 'BSCS' }
  ])
  const nextId = ref(3)

  // Getters
  const allRecords = computed(() => records.value)
  const recordCount = computed(() => records.value.length)
  const searchRecords = computed(() => (query) => {
    if (!query) return records.value
    const lowerQuery = query.toLowerCase()
    return records.value.filter(r => 
      r.name.toLowerCase().includes(lowerQuery) ||
      r.email.toLowerCase().includes(lowerQuery) ||
      r.course.toLowerCase().includes(lowerQuery)
    )
  })

  // Actions
  function addRecord(record) {
    if (!record.name || !record.email || !record.course) {
      throw new Error('Name, email, and course are required')
    }
    if (!isValidEmail(record.email)) {
      throw new Error('Invalid email format')
    }
    if (record.age < 0 || record.age > 120) {
      throw new Error('Age must be between 0 and 120')
    }
    
    const newRecord = {
      id: nextId.value++,
      ...record
    }
    records.value.push(newRecord)
    return newRecord
  }

  function updateRecord(id, updatedData) {
    const index = records.value.findIndex(r => r.id === id)
    if (index === -1) {
      throw new Error('Record not found')
    }
    if (updatedData.email && !isValidEmail(updatedData.email)) {
      throw new Error('Invalid email format')
    }
    if (updatedData.age !== undefined && (updatedData.age < 0 || updatedData.age > 120)) {
      throw new Error('Age must be between 0 and 120')
    }
    records.value[index] = { ...records.value[index], ...updatedData }
    return records.value[index]
  }

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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  return {
    records,
    allRecords,
    recordCount,
    searchRecords,
    addRecord,
    updateRecord,
    deleteRecord,
    getRecordById,
    isValidEmail
  }
})