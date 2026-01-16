<script setup>
import { ref, computed } from 'vue'
import Modal from './Modal.vue'

const emit = defineEmits(['update:modelValue', 'save'])

const props = defineProps({
  modelValue: Boolean,
  availableRecipients: {
    type: Array,
    default: () => []
  },
  sendTypeOptions: {
    type: Array,
    default: () => []
  },
  modelName: {
    type: String,
    default: ''
  }
})

/**
 * v-model proxy (prevents prop mutation)
 */
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const days = ref(0)
const sendType = ref('Email')
const recipients = ref([])

const toggleRecipient = (recipient) => {
  const index = recipients.value.indexOf(recipient)
  index > -1
    ? recipients.value.splice(index, 1)
    : recipients.value.push(recipient)
}

const reset = () => {
  days.value = 0
  sendType.value = 'Email'
  recipients.value = []
}

const save = () => {
  emit('save', {
    days: Number(days.value) || 0,
    sendType: sendType.value,
    recipients: [...recipients.value]
  })
  isOpen.value = false
  reset()
}

const cancel = () => {
  isOpen.value = false
  reset()
}
</script>

<template>
  <Modal
    v-model="isOpen"
    size="md"
  >
    <div class="p-6">
      <h3 class="text-xl font-bold mb-4">
        Add Reminder for {{ modelName }}
      </h3>

      <!-- Days -->
      <div class="mb-4">
        <label class="block text-sm font-medium mb-2">Days Before</label>
        <input
          v-model="days"
          type="number"
          min="0"
          class="w-full px-3 py-2 border rounded"
        >
      </div>

      <!-- Send Type -->
      <div class="mb-4">
        <label class="block text-sm font-medium mb-2">Send Type</label>
        <div class="flex gap-2">
          <button
            v-for="option in sendTypeOptions"
            :key="option.value"
            :class="sendType === option.value
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200'"
            class="px-4 py-2 rounded"
            @click="sendType = option.value"
          >
            {{ option.label }}
          </button>
        </div>
      </div>

      <!-- Recipients -->
      <div class="mb-4">
        <label class="block text-sm font-medium mb-2">Recipients</label>
        <div class="space-y-2 max-h-40 overflow-y-auto">
          <label
            v-for="recipient in availableRecipients"
            :key="recipient"
            class="flex items-center gap-2"
          >
            <input
              type="checkbox"
              :checked="recipients.includes(recipient)"
              @change="toggleRecipient(recipient)"
            >
            {{ recipient }}
          </label>
        </div>
      </div>

      <div class="flex gap-2">
        <button
          class="px-4 py-2 bg-gray-200 rounded"
          @click="cancel"
        >
          Cancel
        </button>
        <button
          class="px-4 py-2 bg-blue-500 text-white rounded"
          @click="save"
        >
          Add Reminder
        </button>
      </div>
    </div>
  </Modal>
</template>
