<template>
  <div :class="tableContainerClasses">
    <!-- Header Component -->
    <DataTableHeader
      v-if="title || description || $slots.header"
      :title="title"
      :description="description"
      :variant="headerVariant"
      :padding="headerPadding"
    >
      <template #header>
        <slot name="header" />
      </template>
      <template #filters>
        <slot name="filters" />
      </template>
    </DataTableHeader>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table :class="tableClasses">
        <!-- Table Head -->
        <thead :class="headClasses">
          <tr>
            <!-- Selection Column Header -->
            <th v-if="selectable" :class="checkboxCellClasses">
              <Checkbox
                :modelValue="isAllSelected"
                :indeterminate="isIndeterminate"
                @update:modelValue="toggleSelectAll"
              />
            </th>

            <!-- Data Column Headers -->
            <th
              v-for="column in columns"
              :key="column.key"
              :class="getHeaderCellClasses(column)"
              @click="handleSort(column)"
            >
              <div class="flex items-center gap-2">
                <span>{{ column.label }}</span>

                <div v-if="column.sortable" class="flex flex-col">
                  <ChevronUpIcon
                    :class="getSortIconClasses(column, 'asc')"
                  />
                  <ChevronDownIcon
                    :class="getSortIconClasses(column, 'desc')"
                  />
                </div>
              </div>
            </th>

            <!-- Actions Column Header -->
            <th v-if="$slots.actions" :class="actionsCellClasses">
              Actions
            </th>
          </tr>
        </thead>

        <!-- Table Body -->
        <tbody :class="bodyClasses">
          <!-- Data Rows -->
          <DataTableRow
            v-for="(item, index) in paginatedData"
            :key="getRowKey(item, index)"
            :item="item"
            :columns="columns"
            :index="index"
            :selectable="selectable"
            :is-selected="isRowSelected(item)"
            :striped="striped"
            :hoverable="hoverable"
            :clickable-rows="clickableRows"
            :density="density"
            @toggle-selection="toggleRowSelection"
            @row-click="handleRowClick"
          >
            <!-- Pass through cell slots -->
            <template
              v-for="column in columns"
              :key="column.key"
              #[`cell-${column.key}`]="slotProps"
            >
              <slot
                :name="`cell-${column.key}`"
                v-bind="slotProps"
              />
            </template>

            <!-- Pass through actions slot -->
            <template #actions="slotProps">
              <slot name="actions" v-bind="slotProps" />
            </template>
          </DataTableRow>

          <!-- Empty State Row -->
          <tr v-if="paginatedData.length === 0">
            <td :colspan="totalColumns" :class="emptyCellClasses">
              <slot name="empty">
                <div class="text-center py-8">
                  <div class="text-slate-400 mb-2">
                    <TableIcon class="w-12 h-12 mx-auto" />
                  </div>
                  <p class="text-slate-500">{{ emptyText }}</p>
                </div>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Footer/Pagination Component -->
    <DataTablePagination
      v-if="showPagination || $slots.footer"
      :current-page="currentPage"
      :total-pages="totalPages"
      :total="filteredData.length"
      :page-size="pageSize"
      :show-pagination="showPagination"
      :selectable="selectable"
      :selected-count="selectedItems.length"
      :variant="paginationVariant"
      :padding="paginationPadding"
      @update:current-page="currentPage = $event"
      @update:page-size="pageSize = $event"
    >
      <template #footer>
        <slot name="footer" />
      </template>
    </DataTablePagination>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { cva } from 'class-variance-authority'
import { cn } from '../utils/cn.js'
import Checkbox from './Checkbox.vue'
import DataTableHeader from './DataTableHeader.vue'
import DataTableRow from './DataTableRow.vue'
import DataTablePagination from './DataTablePagination.vue'

// Icon components
const ChevronUpIcon = {
  template: `<svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" /></svg>`
}

const ChevronDownIcon = {
  template: `<svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>`
}

const TableIcon = {
  template: `<svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 0A2.25 2.25 0 0 1 5.625 3.375h4.125c.621 0 1.125.504 1.125 1.125v15.75m-9.75 0h9.75" /></svg>`
}

const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  columns: {
    type: Array,
    required: true
  },
  title: {
    type: String,
    default: null
  },
  description: {
    type: String,
    default: null
  },
  selectable: {
    type: Boolean,
    default: false
  },
  selectedItems: {
    type: Array,
    default: () => []
  },
  sortBy: {
    type: String,
    default: null
  },
  sortOrder: {
    type: String,
    default: 'asc',
    validator: (value) => ['asc', 'desc'].includes(value)
  },
  pageSize: {
    type: Number,
    default: 10
  },
  showPagination: {
    type: Boolean,
    default: true
  },
  striped: {
    type: Boolean,
    default: false
  },
  hoverable: {
    type: Boolean,
    default: true
  },
  clickableRows: {
    type: Boolean,
    default: false
  },
  emptyText: {
    type: String,
    default: 'No data available'
  },
  rowKey: {
    type: String,
    default: 'id'
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'bordered', 'minimal'].includes(value)
  },
  density: {
    type: String,
    default: 'normal',
    validator: (value) => ['compact', 'normal', 'comfortable'].includes(value)
  },
  headerVariant: {
    type: String,
    default: 'default'
  },
  headerPadding: {
    type: String,
    default: 'normal'
  },
  paginationVariant: {
    type: String,
    default: 'default'
  },
  paginationPadding: {
    type: String,
    default: 'normal'
  }
})

const emit = defineEmits(['selection-change', 'sort-change', 'row-click'])

const currentPage = ref(1)
const sortColumn = ref(props.sortBy)
const sortDirection = ref(props.sortOrder)

// CVA variants
const tableContainerVariants = cva('bg-white border border-slate-200 rounded-lg overflow-hidden', {
  variants: {
    variant: {
      default: 'shadow-sm',
      bordered: 'border-2 border-slate-300',
      minimal: 'border-none shadow-none bg-transparent'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
})

const tableVariants = cva('min-w-full', {
  variants: {
    variant: {
      default: 'divide-y divide-slate-200',
      bordered: 'border-collapse [&_td]:border [&_th]:border',
      minimal: 'divide-y divide-slate-100'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
})

const headVariants = cva('', {
  variants: {
    variant: {
      default: 'bg-slate-50',
      bordered: 'bg-slate-100 border-b-2 border-slate-300',
      minimal: 'bg-transparent border-b border-slate-200'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
})

const bodyVariants = cva('divide-y', {
  variants: {
    variant: {
      default: 'bg-white divide-slate-200',
      bordered: 'bg-white divide-slate-300',
      minimal: 'bg-transparent divide-slate-100'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
})

// Computed properties
const filteredData = computed(() => {
  let data = [...props.data]

  // Apply sorting
  if (sortColumn.value) {
    const column = props.columns.find(col => col.key === sortColumn.value)
    if (column) {
      data.sort((a, b) => {
        const aVal = getCellValue(a, column)
        const bVal = getCellValue(b, column)

        if (aVal < bVal) return sortDirection.value === 'asc' ? -1 : 1
        if (aVal > bVal) return sortDirection.value === 'asc' ? 1 : -1
        return 0
      })
    }
  }

  return data
})

const totalPages = computed(() => {
  return Math.ceil(filteredData.value.length / props.pageSize)
})

const paginatedData = computed(() => {
  if (!props.showPagination) return filteredData.value

  const start = (currentPage.value - 1) * props.pageSize
  const end = start + props.pageSize
  return filteredData.value.slice(start, end)
})

const totalColumns = computed(() => {
  let count = props.columns.length
  if (props.selectable) count++
  if (props.$slots?.actions) count++
  return count
})

const isAllSelected = computed(() => {
  return filteredData.value.length > 0 &&
         filteredData.value.every(item => isRowSelected(item))
})

const isIndeterminate = computed(() => {
  const selectedCount = filteredData.value.filter(item => isRowSelected(item)).length
  return selectedCount > 0 && selectedCount < filteredData.value.length
})

// Methods
const getCellValue = (item, column) => {
  if (column.accessor) {
    return column.accessor(item)
  }

  return column.key.split('.').reduce((obj, key) => obj?.[key], item)
}

const getRowKey = (item, index) => {
  return item[props.rowKey] || index
}

const isRowSelected = (item) => {
  return props.selectedItems.some(selected =>
    getRowKey(selected) === getRowKey(item)
  )
}

const toggleRowSelection = (item) => {
  const newSelection = [...props.selectedItems]
  const index = newSelection.findIndex(selected =>
    getRowKey(selected) === getRowKey(item)
  )

  if (index > -1) {
    newSelection.splice(index, 1)
  } else {
    newSelection.push(item)
  }

  emit('selection-change', newSelection)
}

const toggleSelectAll = () => {
  const newSelection = isAllSelected.value ? [] : [...filteredData.value]
  emit('selection-change', newSelection)
}

const handleSort = (column) => {
  if (!column.sortable) return

  if (sortColumn.value === column.key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value = column.key
    sortDirection.value = 'asc'
  }

  emit('sort-change', { column: column.key, direction: sortDirection.value })
}

const handleRowClick = (payload) => {
  emit('row-click', payload)
}

// Style classes using CVA
const tableContainerClasses = computed(() => 
  cn(tableContainerVariants({ variant: props.variant }))
)

const tableClasses = computed(() => 
  cn(tableVariants({ variant: props.variant }))
)

const headClasses = computed(() => 
  cn(headVariants({ variant: props.variant }))
)

const bodyClasses = computed(() => 
  cn(bodyVariants({ variant: props.variant }))
)

const getHeaderCellClasses = (column) => {
  const densityPadding = {
    compact: 'px-4 py-2',
    normal: 'px-6 py-3',
    comfortable: 'px-8 py-4'
  }

  return cn(
    densityPadding[props.density],
    'text-left text-xs font-medium text-slate-500 uppercase tracking-wider',
    {
      'cursor-pointer hover:bg-slate-100': column.sortable
    }
  )
}

const checkboxCellClasses = computed(() => {
  const densityPadding = {
    compact: 'px-4 py-2',
    normal: 'px-6 py-4',
    comfortable: 'px-8 py-6'
  }

  return cn(
    densityPadding[props.density],
    'whitespace-nowrap text-sm text-slate-900 w-12'
  )
})

const actionsCellClasses = computed(() => {
  const densityPadding = {
    compact: 'px-4 py-2',
    normal: 'px-6 py-4',
    comfortable: 'px-8 py-6'
  }

  return cn(
    densityPadding[props.density],
    'whitespace-nowrap text-sm font-medium'
  )
})

const emptyCellClasses = computed(() => {
  const densityPadding = {
    compact: 'px-4 py-4',
    normal: 'px-6 py-6',
    comfortable: 'px-8 py-8'
  }

  return cn(
    densityPadding[props.density],
    'text-center'
  )
})

const getSortIconClasses = (column, direction) => cn(
  'w-3 h-3 transition-colors',
  {
    'text-blue-600': sortColumn.value === column.key && sortDirection.value === direction,
    'text-slate-300': sortColumn.value !== column.key || sortDirection.value !== direction
  }
)

// Watch for external changes
watch(() => props.selectedItems, (newSelection) => {
  // Handle external selection changes if needed
}, { deep: true })
</script>