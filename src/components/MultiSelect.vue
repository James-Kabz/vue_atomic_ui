<script setup>
import { ref, computed, watch, nextTick, onUnmounted } from 'vue'
import Badge from './Badge.vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  options: {
    type: Array,
    required: true,
    validator: (options) => options.every(option => option.value !== undefined && option.label)
  },
  id: {
    type: String,
    default: null
  },
  disabled: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: 'Select options'
  },
  hasError: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const searchQuery = ref('')
const searchInput = ref(null)
const filteredOptions = ref([...props.options])

const selectedLabels = computed(() => {
  return props.options
    .filter(option => props.modelValue.includes(option.value))
    .map(option => option.label)
})

const toggleDropdown = () => {
  if (!props.disabled) {
    isOpen.value = !isOpen.value
    if (isOpen.value) {
      nextTick(() => {
        searchInput.value?.focus()
      })
    }
  }
}

const toggleOption = (value) => {
  let newValue
  if (props.modelValue.includes(value)) {
    newValue = props.modelValue.filter(v => v !== value)
  } else {
    newValue = [...props.modelValue, value]
  }
  emit('update:modelValue', newValue)
}

const filterOptions = () => {
  if (!searchQuery.value.trim()) {
    filteredOptions.value = [...props.options]
  } else {
    const query = searchQuery.value.toLowerCase()
    filteredOptions.value = props.options.filter(option =>
      option.label.toLowerCase().includes(query)
    )
  }
}

const handleKeydown = (event) => {
  if (event.key === 'Escape') {
    isOpen.value = false
    searchQuery.value = ''
    filteredOptions.value = [...props.options]
  }
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  const target = event.target
  if (target && !target.closest('.relative')) {
    isOpen.value = false
    searchQuery.value = ''
    filteredOptions.value = [...props.options]
  }
}

document.addEventListener('click', handleClickOutside)

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Watch for options changes
watch(() => props.options, (newOptions) => {
  filteredOptions.value = [...newOptions]
}, { immediate: true })
</script>

<template>
  <div class="relative">
    <button type="button" :id="id" :disabled="disabled" :class="[
      'w-full px-3 py-2 text-left border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white',
      hasError ? 'border-red-500' : 'border-slate-300',
      disabled ? 'bg-gray-100 cursor-not-allowed opacity-50' : 'hover:border-slate-400'
    ]" @click="toggleDropdown" @keydown="handleKeydown">
      <div v-if="selectedLabels.length === 0" class="text-gray-500">{{ placeholder || 'Select options' }}</div>
      <div v-else class="flex flex-wrap gap-1">
        <Badge v-for="label in selectedLabels" :key="label" variant="primary" size="sm" class="mr-1 mb-1">
          {{ label }}
        </Badge>
      </div>
      <svg class="absolute right-2 top-2.5 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clip-rule="evenodd" />
      </svg>
    </button>

    <div v-if="isOpen"
      class="absolute z-[60] mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none">
      <!-- Search input -->
      <div class="px-3 py-2 border-b border-gray-200">
        <input ref="searchInput" v-model="searchQuery" type="text" placeholder="Search options..."
          class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          @input="filterOptions" @keydown.stop>
      </div>

      <!-- Options list -->
      <div v-if="filteredOptions.length > 0" class="max-h-48 overflow-y-auto">
        <div v-for="option in filteredOptions" :key="option.value"
          class="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-50 transition-colors duration-150"
          :class="{ 'bg-blue-50': modelValue.includes(option.value) }" @click="toggleOption(option.value)">
          <div class="flex items-center">
            <input type="checkbox" :checked="modelValue.includes(option.value)"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" @change.stop />
            <span class="ml-3 block font-normal truncate"
              :class="{ 'text-blue-900': modelValue.includes(option.value) }">{{ option.label }}</span>
          </div>
        </div>
      </div>

      <!-- No results -->
      <div v-else class="px-4 py-3 text-sm text-gray-500 text-center">
        No options found
      </div>
    </div>
  </div>
</template>
