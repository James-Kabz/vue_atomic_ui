<script setup>
import { ref, computed, watch, nextTick, onUnmounted } from 'vue'
import { cva } from 'class-variance-authority'
import { cn } from '../utils/cn.js'

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean],
    default: ''
  },
  options: {
    type: Array,
    default: () => []
  },
  placeholder: {
    type: String,
    default: null
  },
  hasError: {
    type: Boolean,
    default: false
  },
  id: {
    type: String,
    default: null
  },
  name: {
    type: String,
    default: null
  },
  disabled: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  },
  class: String
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const searchQuery = ref('')
const searchInput = ref(null)
const filteredOptions = ref([...props.options])

const selectedOption = computed(() => {
  return props.options.find(option => option.value === props.modelValue)
})

const selectVariants = cva(
  'border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm min-w-[60px] focus:border-transparent',
  {
    variants: {
      disabled: {
        true: 'bg-gray-100 cursor-not-allowed opacity-50',
        false: 'bg-white hover:border-slate-400'
      }
    }
  }
)

const selectClasses = computed(() =>
  cn(
    selectVariants({ disabled: props.disabled }),
    'px-3 py-2',
    props.class
  )
)

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

const selectOption = (value) => {
  emit('update:modelValue', value)
  isOpen.value = false
  searchQuery.value = ''
  filteredOptions.value = [...props.options]
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


onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

document.addEventListener('click', handleClickOutside)

// Watch for options changes
watch(() => props.options, (newOptions) => {
  filteredOptions.value = [...newOptions]
}, { immediate: true })
</script>


<template>
  <!-- Native select when no options provided -->
  <select v-if="!options || options.length === 0" :id="id" :name="name" :value="modelValue" :disabled="disabled"
    :required="required" :class="selectClasses" v-bind="$attrs"
    @change="$emit('update:modelValue', $event.target.value)">
    <slot />
  </select>

  <!-- Searchable dropdown when options provided -->
  <div v-else class="relative">
    <button type="button" :id="id" :disabled="disabled" :class="[
      'w-full px-3 py-2 text-left border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white',
      hasError ? 'border-red-500' : 'border-slate-300',
      disabled ? 'bg-gray-100 cursor-not-allowed opacity-50' : 'hover:border-slate-400'
    ]" @click="toggleDropdown" @keydown="handleKeydown">
      <div v-if="!selectedOption" class="text-gray-500">{{ placeholder || 'Select an option' }}</div>
      <div v-else class="text-gray-900">{{ selectedOption.label }}</div>
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
        <button v-for="option in filteredOptions" :key="option.value"
          class="cursor-pointer select-none relative py-2 pl-3 pr-9 w-full text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors duration-150"
          :class="{ 'bg-blue-50 text-blue-900': modelValue === option.value }" @click="selectOption(option.value)">
          <span class="block font-normal truncate">{{ option.label }}</span>
          <span v-if="modelValue === option.value"
            class="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd" />
            </svg>
          </span>
        </button>
      </div>

      <!-- No results -->
      <div v-else class="px-4 py-3 text-sm text-gray-500 text-center">
        No options found
      </div>
    </div>
  </div>
</template>
