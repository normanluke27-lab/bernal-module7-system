import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { useRecordStore } from '@/stores/recordStore'

// Mock component
const RecordList = {
  template: `
    <div>
      <div v-for="record in store.allRecords" :key="record.id" class="record-item">
        {{ record.name }} - {{ record.course }}
      </div>
      <div class="count">{{ store.recordCount }} records found</div>
    </div>
  `,
  setup() {
    const store = useRecordStore()
    return { store }
  }
}

describe('RecordList Component', () => {
  it('should display all records', () => {
    setActivePinia(createPinia())
    
    const wrapper = mount(RecordList)
    
    const items = wrapper.findAll('.record-item')
    expect(items).toHaveLength(2)
    expect(wrapper.find('.count').text()).toContain('2')
  })
})