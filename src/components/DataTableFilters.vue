<template>
  <div>
    <!-- Main Filters Bar -->
    <div :class="filtersClasses">
      <!-- Search Input -->
      <div class="flex-1 min-w-64">
        <div class="relative">
          <font-awesome-icon icon="magnifying-glass" :class="searchIconClasses" />
          <input :model-value="searchQuery" @input="$emit('update:searchQuery', $event.target.value)"
            :placeholder="searchPlaceholder" :class="searchInputClasses" />
          <button v-if="searchQuery" @click="$emit('update:searchQuery', '')" :class="clearSearchButtonClasses">
            <font-awesome-icon icon="xmark" class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Status Filter -->
      <div v-if="statusOptions.length > 0" class="min-w-32">
        <Select :model-value="selectedStatus" @change="$emit('update:selectedStatus', $event.target.value)"
          :class="selectClasses">
          <option value="">All Status</option>
          <option v-for="option in statusOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </Select>
      </div>

      <!-- Dynamic Date Filters -->
      <div v-if="dateFilters.length > 0" class="flex items-center gap-2 flex-wrap">
        <div v-for="dateFilter in dateFilters" :key="dateFilter.key" class="flex items-center gap-2">
          <label :class="dateFilterLabelClasses">{{ dateFilter.label }}:</label>
          <div class="flex items-center gap-1">
            <input 
              type="date" 
              :model-value="dateFilter.from" 
              @input="updateDateFilter(dateFilter.key, 'from', $event.target.value)"
              :class="dateInputClasses" 
              :placeholder="`From ${dateFilter.label}`"
            />
            <span :class="dateRangeSeparatorClasses">to</span>
            <input 
              type="date" 
              :model-value="dateFilter.to" 
              @input="updateDateFilter(dateFilter.key, 'to', $event.target.value)"
              :class="dateInputClasses" 
              :placeholder="`To ${dateFilter.label}`"
            />
          </div>
        </div>
      </div>

      <!-- Legacy Date Range Filter (for backward compatibility) -->
      <div v-if="showDateFilter && dateFilters.length === 0" class="flex items-center gap-2">
        <input type="date" :model-value="dateFrom" @input="$emit('update:dateFrom', $event.target.value)"
          :class="dateInputClasses" />
        <span :class="dateRangeSeparatorClasses">to</span>
        <input type="date" :model-value="dateTo" @input="$emit('update:dateTo', $event.target.value)"
          :class="dateInputClasses" />
      </div>

      <!-- Custom Filters Slot -->
      <div v-if="$slots.filters" class="flex items-center gap-2">
        <slot name="filters" />
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-2 ml-auto">
        <!-- Clear Filters -->
        <Button v-if="hasActiveFilters" @click="clearFilters" :class="clearFiltersButtonClasses">
          Clear Filters
        </Button>

        <!-- Export Button -->
        <Button v-if="showExport" @click="$emit('export')" :class="exportButtonClasses">
          <font-awesome-icon icon="download" />
          Export
        </Button>

        <!-- Add Button -->
        <slot name="actions">
          <Button v-if="showAdd" variant="success" size="sm" @click="$emit('add')">
            <Icon icon="plus" class="mr-1" /> Add
          </Button>
        </slot>
      </div>
    </div>

    <!-- Active Filters Display -->
    <div v-if="activeFiltersDisplay.length > 0" :class="activeFiltersContainerClasses">
      <div class="flex items-center gap-2 flex-wrap">
        <span :class="activeFiltersLabelClasses">Active filters:</span>
        <div v-for="filter in activeFiltersDisplay" :key="filter.key" :class="activeFilterTagClasses">
          <span>{{ filter.label }}: {{ filter.value }}</span>
          <button @click="removeFilter(filter.key)" :class="activeFilterRemoveButtonClasses">
            <font-awesome-icon icon="xmark" class="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Button from './Button.vue'
import Input from './Input.vue'
import Select from './Select.vue'
import { computed } from 'vue'
import { cva } from 'class-variance-authority'
import { cn } from '../utils/cn.js'
import Icon from './Icon.vue'

const props = defineProps({
  searchQuery: {
    type: String,
    default: ''
  },
  searchPlaceholder: {
    type: String,
    default: 'Search...'
  },
  selectedStatus: {
    type: String,
    default: ''
  },
  statusOptions: {
    type: Array,
    default: () => []
  },
  // Legacy props for backward compatibility
  showDateFilter: {
    type: Boolean,
    default: false
  },
  dateFrom: {
    type: String,
    default: ''
  },
  dateTo: {
    type: String,
    default: ''
  },
  // New dynamic date filters prop
  dateFilters: {
    type: Array,
    default: () => [],
    validator: (filters) => {
      return filters.every(filter => 
        filter.hasOwnProperty('key') && 
        filter.hasOwnProperty('label') &&
        filter.hasOwnProperty('from') &&
        filter.hasOwnProperty('to')
      )
    }
  },
  showExport: {
    type: Boolean,
    default: false
  },
  showAdd: {
    type: Boolean,
    default: false
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

const emit = defineEmits([
  'update:searchQuery',
  'update:selectedStatus',
  'update:dateFrom',
  'update:dateTo',
  'update:dateFilters',
  'export',
  'add',
  'clear-filters'
])

// CVA Variants
const filtersVariants = cva('flex flex-wrap items-center gap-4 border-b border-slate-200', {
  variants: {
    variant: {
      default: 'bg-slate-50',
      minimal: 'bg-transparent border-slate-100',
      bordered: 'bg-slate-100 border-slate-300'
    },
    padding: {
      compact: 'p-2',
      normal: 'p-4',
      comfortable: 'p-6'
    }
  },
  defaultVariants: {
    variant: 'default',
    padding: 'normal'
  }
})

const inputVariants = cva('border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500', {
  variants: {
    size: {
      sm: 'text-sm px-2 py-1',
      md: 'text-sm px-3 py-2',
      lg: 'text-base px-4 py-3'
    }
  },
  defaultVariants: {
    size: 'md'
  }
})

const buttonVariants = cva('rounded-md flex items-center gap-2 font-medium transition-colors', {
  variants: {
    variant: {
      default: 'text-slate-600 hover:text-slate-800 border border-slate-300 hover:bg-slate-100',
      primary: 'text-white bg-blue-600 hover:bg-blue-700 border border-blue-600',
      success: 'text-white bg-green-600 hover:bg-green-700 border border-green-600',
      ghost: 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
    },
    size: {
      sm: 'px-2 py-1 text-xs',
      md: 'px-3 py-2 text-sm',
      lg: 'px-4 py-3 text-base'
    }
  },
  defaultVariants: {
    variant: 'default',
    size: 'md'
  }
})

const activeFiltersVariants = cva('border-b', {
  variants: {
    variant: {
      default: 'px-4 py-2 bg-blue-50 border-blue-200',
      minimal: 'px-2 py-1 bg-slate-50 border-slate-100',
      bordered: 'px-4 py-3 bg-blue-100 border-blue-300'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
})

// Methods
const updateDateFilter = (key, type, value) => {
  const updatedFilters = [...props.dateFilters]
  const filterIndex = updatedFilters.findIndex(f => f.key === key)
  
  if (filterIndex >= 0) {
    updatedFilters[filterIndex] = {
      ...updatedFilters[filterIndex],
      [type]: value
    }
    emit('update:dateFilters', updatedFilters)
  }
}

// Computed Properties
const hasActiveFilters = computed(() => {
  const hasSearch = props.searchQuery
  const hasStatus = props.selectedStatus
  const hasLegacyDates = props.dateFrom || props.dateTo
  const hasDynamicDates = props.dateFilters.some(filter => filter.from || filter.to)
  
  return hasSearch || hasStatus || hasLegacyDates || hasDynamicDates
})

const activeFiltersDisplay = computed(() => {
  const filters = []

  if (props.searchQuery && props.searchQuery.trim()) {
    filters.push({
      key: 'search',
      label: 'Search',
      value: props.searchQuery
    })
  }

  if (props.selectedStatus) {
    const statusOption = props.statusOptions.find(opt => opt.value === props.selectedStatus)
    filters.push({
      key: 'status',
      label: 'Status',
      value: statusOption?.label || props.selectedStatus
    })
  }

  // Legacy date filter
  if (props.dateFrom || props.dateTo) {
    let dateValue = ''
    if (props.dateFrom && props.dateTo) {
      dateValue = `${props.dateFrom} to ${props.dateTo}`
    } else if (props.dateFrom) {
      dateValue = `From ${props.dateFrom}`
    } else if (props.dateTo) {
      dateValue = `Until ${props.dateTo}`
    }

    if (dateValue) {
      filters.push({
        key: 'date',
        label: 'Date Range',
        value: dateValue
      })
    }
  }

  // Dynamic date filters
  props.dateFilters.forEach(dateFilter => {
    if (dateFilter.from || dateFilter.to) {
      let dateValue = ''
      if (dateFilter.from && dateFilter.to) {
        dateValue = `${dateFilter.from} to ${dateFilter.to}`
      } else if (dateFilter.from) {
        dateValue = `From ${dateFilter.from}`
      } else if (dateFilter.to) {
        dateValue = `Until ${dateFilter.to}`
      }

      if (dateValue) {
        filters.push({
          key: `date-${dateFilter.key}`,
          label: dateFilter.label,
          value: dateValue
        })
      }
    }
  })

  return filters
})

// Computed Classes
const filtersClasses = computed(() =>
  cn(filtersVariants({
    variant: props.variant,
    padding: props.padding
  }))
)

const searchIconClasses = computed(() =>
  'absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400'
)

const searchInputClasses = computed(() =>
  cn(
    inputVariants({ size: 'md' }),
    'w-full pl-10 focus:border-transparent'
  )
)

const clearSearchButtonClasses = computed(() =>
  'absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded'
)

const selectClasses = computed(() =>
  cn(
    inputVariants({ size: 'md' }),
    'w-full focus:border-transparent'
  )
)

const dateInputClasses = computed(() =>
  cn(inputVariants({ size: 'md' }), 'min-w-32')
)

const dateFilterLabelClasses = computed(() =>
  'text-sm font-medium text-slate-700 whitespace-nowrap'
)

const dateRangeSeparatorClasses = computed(() =>
  'text-slate-500 text-sm'
)

const clearFiltersButtonClasses = computed(() =>
  cn(buttonVariants({ variant: 'default', size: 'md' }))
)

const exportButtonClasses = computed(() =>
  cn(buttonVariants({ variant: 'primary', size: 'md' }))
)

const activeFiltersContainerClasses = computed(() =>
  cn(activeFiltersVariants({ variant: props.variant }))
)

const activeFiltersLabelClasses = computed(() =>
  'text-sm text-blue-700 font-medium'
)

const activeFilterTagClasses = computed(() =>
  'flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm'
)

const activeFilterRemoveButtonClasses = computed(() =>
  'text-blue-600 hover:text-blue-800 p-0.5 hover:bg-blue-200 rounded'
)

// Methods
const clearFilters = () => {
  emit('update:searchQuery', '')
  emit('update:selectedStatus', '')
  emit('update:dateFrom', '')
  emit('update:dateTo', '')
  
  // Clear dynamic date filters
  const clearedDateFilters = props.dateFilters.map(filter => ({
    ...filter,
    from: '',
    to: ''
  }))
  emit('update:dateFilters', clearedDateFilters)
  
  emit('clear-filters')
}

const removeFilter = (filterKey) => {
  switch (filterKey) {
    case 'search':
      emit('update:searchQuery', '')
      break
    case 'status':
      emit('update:selectedStatus', '')
      break
    case 'date':
      emit('update:dateFrom', '')
      emit('update:dateTo', '')
      break
    default:
      // Handle dynamic date filters
      if (filterKey.startsWith('date-')) {
        const dateKey = filterKey.replace('date-', '')
        const updatedFilters = props.dateFilters.map(filter => 
          filter.key === dateKey 
            ? { ...filter, from: '', to: '' }
            : filter
        )
        emit('update:dateFilters', updatedFilters)
      }
      break
  }
}
</script>