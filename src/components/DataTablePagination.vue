<template>
  <div
    v-if="showPagination || $slots.footer"
    :class="footerClasses"
  >
    <div class="flex items-center justify-between">
      <!-- Selection Info -->
      <div
        v-if="selectable && selectedCount > 0"
        class="text-sm text-slate-600"
      >
        {{ selectedCount }} of {{ total }} selected
      </div>
      <div
        v-else
        class="text-sm text-slate-600"
      >
        Showing {{ startItem }} to {{ endItem }} of {{ total }} entries
      </div>

      <!-- Custom Footer Slot -->
      <div
        v-if="$slots.footer"
        class="flex items-center gap-4"
      >
        <slot name="footer" />
      </div>

      <!-- Pagination Controls -->
      <div
        v-if="showPagination"
        class="flex items-center gap-4"
      >
        <!-- Page Size Selector -->
        <div class="flex items-center gap-2">
          <Label
            for="pageSize"
            :class="labelClasses"
            :inline="true"
          >Show:</Label>
          <Select
            id="pageSize"
            :model-value="pageSize.toString()"
            :class="selectClasses"
            @update:model-value="val => $emit('update:pageSize', parseInt(val))"
          >
            <Option
              v-for="size in pageSizeOptions"
              :key="size"
              :value="size.toString()"
              :label="size.toString()"
            />
          </Select>
        </div>

        <!-- Page Navigation -->
        <div class="flex items-center gap-1">
          <!-- First Page -->
          <button
            :disabled="currentPage === 1"
            :class="getPageButtonClasses(false, currentPage === 1)"
            title="First page"
            @click="$emit('update:currentPage', 1)"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5"
              />
            </svg>
          </button>

          <!-- Previous Page -->
          <button
            :disabled="currentPage === 1"
            :class="getPageButtonClasses(false, currentPage === 1)"
            title="Previous page"
            @click="$emit('update:currentPage', currentPage - 1)"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>

          <!-- Page Numbers -->
          <div class="flex items-center gap-1">
            <button
              v-for="page in visiblePages"
              :key="page"
              :class="getPageButtonClasses(page === currentPage, false)"
              @click="$emit('update:currentPage', page)"
            >
              {{ page }}
            </button>
          </div>

          <!-- Next Page -->
          <button
            :disabled="currentPage === totalPages"
            :class="getPageButtonClasses(false, currentPage === totalPages)"
            title="Next page"
            @click="$emit('update:currentPage', currentPage + 1)"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>

          <!-- Last Page -->
          <button
            :disabled="currentPage === totalPages"
            :class="getPageButtonClasses(false, currentPage === totalPages)"
            title="Last page"
            @click="$emit('update:currentPage', totalPages)"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </div>

        <!-- Page Info -->
        <div class="text-sm text-slate-600 ml-4">
          Page {{ currentPage }} of {{ totalPages }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Label from './Label.vue'
import Option from './Option.vue'
import Select from './Select.vue'
import { computed } from 'vue'
import { cva } from 'class-variance-authority'
import { cn } from '../utils/cn.js'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  pageSize: {
    type: Number,
    required: true
  },
  showPagination: {
    type: Boolean,
    default: true
  },
  selectable: {
    type: Boolean,
    default: false
  },
  selectedCount: {
    type: Number,
    default: 0
  },
  pageSizeOptions: {
    type: Array,
    default: () => [5, 10, 25, 50, 100]
  },
  maxVisiblePages: {
    type: Number,
    default: 7
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'minimal', 'bordered'].includes(value)
  },
  padding: {
    type: String,
    default: 'normal',
    validator: (value) => ['compact', 'normal', 'comfortable'].includes(value)
  }
})

defineEmits(['update:currentPage', 'update:pageSize'])

// CVA variants
const footerVariants = cva('border-t border-slate-200', {
  variants: {
    variant: {
      default: 'bg-slate-50',
      minimal: 'bg-transparent border-slate-100',
      bordered: 'bg-slate-100 border-t-2 border-slate-300'
    },
    padding: {
      compact: 'px-4 py-2',
      normal: 'px-6 py-4',
      comfortable: 'px-8 py-6'
    }
  },
  defaultVariants: {
    variant: 'default',
    padding: 'normal'
  }
})

const pageButtonVariants = cva('text-sm font-medium border rounded-md transition-colors duration-200', {
  variants: {
    state: {
      active: 'bg-blue-600 text-white border-blue-600',
      inactive: 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50',
      disabled: 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
    },
    size: {
      sm: 'px-2 py-1',
      md: 'px-3 py-2',
      lg: 'px-4 py-3'
    }
  },
  defaultVariants: {
    state: 'inactive',
    size: 'md'
  }
})

const labelVariants = cva('text-slate-700', {
  variants: {
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg'
    }
  },
  defaultVariants: {
    size: 'md'
  }
})

const selectVariants = cva('border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm min-w-[60px] focus:border-transparent', {
  variants: {
    size: {
      sm: 'px-2 py-1',
      md: 'px-3 py-2',
      lg: 'px-4 py-3'
    }
  },
  defaultVariants: {
    size: 'sm'
  }
})

// Computed properties
const startItem = computed(() => {
  return (props.currentPage - 1) * props.pageSize + 1
})

const endItem = computed(() => {
  return Math.min(props.currentPage * props.pageSize, props.total)
})

const visiblePages = computed(() => {
  const pages = []
  const total = props.totalPages
  const current = props.currentPage
  const maxVisible = props.maxVisiblePages

  if (total <= maxVisible) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    const halfVisible = Math.floor(maxVisible / 2)
    let start = Math.max(1, current - halfVisible)
    let end = Math.min(total, start + maxVisible - 1)

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1)
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
  }

  return pages
})

// Computed classes using CVA
const footerClasses = computed(() => 
  cn(footerVariants({ 
    variant: props.variant, 
    padding: props.padding 
  }))
)

const labelClasses = computed(() => 
  cn(labelVariants({ size: 'md' }))
)

const selectClasses = computed(() => 
  cn(selectVariants({ size: 'sm' }))
)

const getPageButtonClasses = (isActive, isDisabled) => {
  let state = 'inactive'
  if (isDisabled) state = 'disabled'
  else if (isActive) state = 'active'
  
  return cn(pageButtonVariants({ 
    state, 
    size: 'md' 
  }))
}
</script>