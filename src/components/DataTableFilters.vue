<template>
  <div>
    <!-- Main Filters Bar -->
    <div :class="filtersClasses">
      <!-- Search Input -->
      <div class="flex-1 min-w-64">
        <div class="relative">
          <SearchIcon :class="searchIconClasses" />
          <Input
            :model-value="searchQuery"
            @input="$emit('update:searchQuery', $event.target.value)"
            :placeholder="searchPlaceholder"
            :class="searchInputClasses"
          />
          <Button
            v-if="searchQuery"
            @click="$emit('update:searchQuery', '')"
            :class="clearSearchButtonClasses"
          >
            <XMarkIcon class="w-4 h-4" />
          </Button>
        </div>
      </div>

      <!-- Status Filter -->
      <div v-if="statusOptions.length > 0" class="min-w-32">
        <Select
          :model-value="selectedStatus"
          @change="$emit('update:selectedStatus', $event.target.value)"
          :class="selectClasses"
        >
          <option value="">All Status</option>
          <option
            v-for="option in statusOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </Select>
      </div>

      <!-- Date Range Filter -->
      <div v-if="showDateFilter" class="flex items-center gap-2">
        <Input
          type="date"
          :model-value="dateFrom"
          @input="$emit('update:dateFrom', $event.target.value)"
          :class="dateInputClasses"
        />
        <span :class="dateRangeSeparatorClasses">to</span>
        <Input
          type="date"
          :model-value="dateTo"
          @input="$emit('update:dateTo', $event.target.value)"
          :class="dateInputClasses"
        />
      </div>

      <!-- Custom Filters Slot -->
      <div v-if="$slots.filters" class="flex items-center gap-2">
        <slot name="filters" />
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-2 ml-auto">
        <!-- Clear Filters -->
        <Button
          v-if="hasActiveFilters"
          @click="clearFilters"
          :class="clearFiltersButtonClasses"
        >
          Clear Filters
        </Button>

        <!-- Export Button -->
        <Button
          v-if="showExport"
          @click="$emit('export')"
          :class="exportButtonClasses"
        >
          <ArrowDownTrayIcon class="w-4 h-4" />
          Export
        </Button>

        <!-- Add Button -->
        <Button
          v-if="showAdd"
          @click="$emit('add')"
          :class="addButtonClasses"
        >
          <PlusIcon class="w-4 h-4" />
          Add New
        </Button>
      </div>
    </div>

    <!-- Active Filters Display -->
    <div v-if="activeFiltersDisplay.length > 0" :class="activeFiltersContainerClasses">
      <div class="flex items-center gap-2 flex-wrap">
        <span :class="activeFiltersLabelClasses">Active filters:</span>
        <div
          v-for="filter in activeFiltersDisplay"
          :key="filter.key"
          :class="activeFilterTagClasses"
        >
          <span>{{ filter.label }}: {{ filter.value }}</span>
          <Button
            @click="removeFilter(filter.key)"
            :class="activeFilterRemoveButtonClasses"
          >
            <XMarkIcon class="w-3 h-3" />
          </Button>
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

// Icons
const SearchIcon = {
  template: `<svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>`
}

const XMarkIcon = {
  template: `<svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>`
}

const ArrowDownTrayIcon = {
  template: `<svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>`
}

const PlusIcon = {
  template: `<svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>`
}

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
      default: 'text-slate-600 hover:text-slate-800 border border-slate-300 hover:bg-slate-50',
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

// Computed Properties
const hasActiveFilters = computed(() => {
  return props.searchQuery ||
         props.selectedStatus ||
         props.dateFrom ||
         props.dateTo
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
  'absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1'
)

const selectClasses = computed(() => 
  cn(
    inputVariants({ size: 'md' }),
    'w-full focus:border-transparent'
  )
)

const dateInputClasses = computed(() => 
  cn(inputVariants({ size: 'md' }))
)

const dateRangeSeparatorClasses = computed(() => 
  'text-slate-500'
)

const clearFiltersButtonClasses = computed(() => 
  cn(buttonVariants({ variant: 'default', size: 'md' }))
)

const exportButtonClasses = computed(() => 
  cn(buttonVariants({ variant: 'primary', size: 'md' }))
)

const addButtonClasses = computed(() => 
  cn(buttonVariants({ variant: 'success', size: 'md' }))
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
  'text-blue-600 hover:text-blue-800 p-0.5'
)

// Methods
const clearFilters = () => {
  emit('update:searchQuery', '')
  emit('update:selectedStatus', '')
  emit('update:dateFrom', '')
  emit('update:dateTo', '')
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
  }
}
</script>