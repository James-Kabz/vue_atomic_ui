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

    <!-- Loading Overlay for entire table -->
    <div class="relative">
      <Loader
        v-if="loading"
        :loading="true"
        :type="loadingType"
        :size="loadingSize"
        :color="loadingColor"
        :overlay="true"
        :text="loadingText"
        :text-position="loadingTextPosition"
        :background-color="loadingBackground"
        class="table-loading-overlay"
      />

      <!-- Table -->
      <div
        class="overflow-x-auto"
        :class="{ 'opacity-50': loading }"
      >
        <table :class="tableClasses">
          <!-- Table Head -->
          <thead :class="headClasses">
            <tr>
              <!-- Selection Column Header -->
              <th
                v-if="selectable"
                :class="checkboxCellClasses"
              >
                <div class="flex items-center justify-center">
                  <!-- Header loading for bulk operations -->
                  <Loader
                    v-if="bulkLoading"
                    :loading="true"
                    type="spin"
                    size="small"
                    :color="loadingColor"
                  />
                  <Checkbox
                    v-else
                    :model-value="isAllSelected"
                    :indeterminate="isIndeterminate"
                    :disabled="loading || dataLoading"
                    @update:model-value="toggleSelectAll"
                  />
                </div>
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

                  <!-- Sort loading indicator -->
                  <Loader
                    v-if="sortLoading && sortColumn === column.key"
                    :loading="true"
                    type="spin"
                    size="small"
                    :color="loadingColor"
                  />
                  
                  <!-- Sort icons -->
                  <div
                    v-else-if="column.sortable"
                    class="flex flex-col"
                  >
                    <svg
                      :class="getSortIconClasses(column, 'asc')"
                      class="w-3 h-3 transition-colors"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m4.5 15.75 7.5-7.5 7.5 7.5"
                      />
                    </svg>
                    <svg
                      :class="getSortIconClasses(column, 'desc')"
                      class="w-3 h-3 transition-colors"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m19.5 8.25-7.5 7.5-7.5-7.5"
                      />
                    </svg>
                  </div>
                </div>
              </th>

              <!-- Actions Column Header -->
              <th
                v-if="$slots.actions"
                :class="actionsCellClasses"
              >
                Actions
              </th>
            </tr>
          </thead>

          <!-- Table Body -->
          <tbody :class="bodyClasses">
            <!-- Data Loading State -->
            <tr v-if="dataLoading && !loading">
              <td
                :colspan="totalColumns"
                :class="emptyCellClasses"
              >
                <div class="flex justify-center items-center">
                  <Loader
                    :loading="true"
                    type="dots"
                    size="medium"
                    :color="loadingColor"
                  />
                </div>
              </td>
            </tr>

            <!-- Data Rows -->
            <DataTableRow
              v-for="(item, index) in paginatedData"
              v-else-if="paginatedData.length > 0 && !loading"
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
              :row-loading="rowLoading[getRowKey(item, index)]"
              :loading-color="loadingColor"
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
                <slot
                  name="actions"
                  v-bind="slotProps"
                />
              </template>
            </DataTableRow>

            <!-- Empty State Row -->
            <tr v-else-if="!loading && !dataLoading && hasLoaded">
              <td
                :colspan="totalColumns"
                :class="emptyCellClasses"
              >
                <slot name="empty">
                  <div class="text-center">
                    <div class="text-slate-400 mb-4">
                      <Icon
                        name="search"
                        class="w-12 h-12"
                      />
                    </div>
                    <p class="text-slate-600 text-lg font-medium mb-2">
                      {{ emptyText }}
                    </p>
                    <p class="text-slate-500 text-sm">
                      {{ emptySubtitle }}
                    </p>
                  </div>
                </slot>
              </td>
            </tr>

            <!-- Skeleton Loading Rows -->
            <template v-if="showSkeleton && (loading || dataLoading)">
              <tr
                v-for="n in skeletonRows"
                :key="`skeleton-${n}`"
                class="animate-pulse"
              >
                <!-- Selection checkbox skeleton -->
                <td
                  v-if="selectable"
                  :class="checkboxCellClasses"
                >
                  <div class="w-4 h-4 bg-slate-200 rounded" />
                </td>
                
                <!-- Data columns skeleton -->
                <td
                  v-for="column in columns"
                  :key="column.key"
                  :class="getDataCellClasses()"
                >
                  <div class="h-4 bg-slate-200 rounded w-3/4" />
                </td>
                
                <!-- Actions column skeleton -->
                <td
                  v-if="$slots.actions"
                  :class="actionsCellClasses"
                >
                  <div class="flex gap-2 justify-center">
                    <div class="w-6 h-6 bg-slate-200 rounded" />
                    <div class="w-6 h-6 bg-slate-200 rounded" />
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
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
      :loading="paginationLoading"
      :disabled="loading || dataLoading"
      @update:current-page="handlePageChange"
      @update:page-size="handlePageSizeChange"
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
import Icon from './Icon.vue'
import Loader from './Loader.vue'

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
  emptySubtitle: {
    type: String,
    default: 'Try adjusting your search or filter criteria'
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
  },
  // Loading Props
  loading: {
    type: Boolean,
    default: false
  },
  dataLoading: {
    type: Boolean,
    default: false
  },
  sortLoading: {
    type: Boolean,
    default: false
  },
  paginationLoading: {
    type: Boolean,
    default: false
  },
  bulkLoading: {
    type: Boolean,
    default: false
  },
  rowLoading: {
    type: Object,
    default: () => ({})
  },
  loadingType: {
    type: String,
    default: 'dots',
    validator: (value) => ['spin', 'pulse', 'bounce', 'ripple', 'bars', 'dots', 'ring'].includes(value)
  },
  loadingSize: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large', 'xl'].includes(value)
  },
  loadingColor: {
    type: String,
    default: '#3b82f6'
  },
  loadingText: {
    type: String,
    default: 'Loading...'
  },
  loadingTextPosition: {
    type: String,
    default: 'bottom',
    validator: (value) => ['top', 'bottom'].includes(value)
  },
  loadingBackground: {
    type: String,
    default: 'rgba(255, 255, 255, 0.95)'
  },
  showSkeleton: {
    type: Boolean,
    default: true
  },
  skeletonRows: {
    type: Number,
    default: 5
  },
  hasLoaded: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['selection-change', 'sort-change', 'row-click', 'page-change', 'page-size-change', 'refresh'])

const currentPage = ref(1)
const pageSize = ref(props.pageSize)
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
  return Math.ceil(filteredData.value.length / pageSize.value)
})

const paginatedData = computed(() => {
  if (!props.showPagination) return filteredData.value

  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
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
  if (props.loading || props.dataLoading) return
  
  const newSelection = isAllSelected.value ? [] : [...filteredData.value]
  emit('selection-change', newSelection)
}

const handleSort = async (column) => {
  if (!column.sortable || props.loading || props.sortLoading) return

  if (sortColumn.value === column.key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value = column.key
    sortDirection.value = 'asc'
  }

  emit('sort-change', { column: column.key, direction: sortDirection.value })
}

const handleRowClick = (payload) => {
  if (props.loading) return
  emit('row-click', payload)
}

const handlePageChange = async (page) => {
  if (props.paginationLoading || props.loading) return
  
  currentPage.value = page
  emit('page-change', page)
}

const handlePageSizeChange = async (size) => {
  if (props.paginationLoading || props.loading) return
  
  pageSize.value = size
  currentPage.value = 1 // Reset to first page
  emit('page-size-change', size)
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
      'cursor-pointer hover:bg-slate-100 transition-colors': column.sortable && !props.loading && !props.sortLoading,
      'cursor-not-allowed opacity-50': props.loading || (props.sortLoading && sortColumn.value === column.key)
    }
  )
}

const getDataCellClasses = () => {
  const densityPadding = {
    compact: 'px-4 py-2',
    normal: 'px-6 py-4',
    comfortable: 'px-8 py-6'
  }

  return cn(
    densityPadding[props.density],
    'whitespace-nowrap text-sm text-slate-900'
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
    'whitespace-nowrap text-sm font-medium text-center'
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
  {
    'text-blue-600': sortColumn.value === column.key && sortDirection.value === direction,
    'text-slate-300': sortColumn.value !== column.key || sortDirection.value !== direction
  }
)

// Watch for external changes
watch(() => props.selectedItems, () => {
  // Handle external selection changes if needed
}, { deep: true })

// Watch for prop changes
watch(() => props.pageSize, (newPageSize) => {
  pageSize.value = newPageSize
})

// Expose methods for parent components
defineExpose({
  refresh: () => {
    // Emit event to refresh data
    emit('refresh')
  },
  goToPage: (page) => {
    handlePageChange(page)
  },
  selectAll: () => {
    toggleSelectAll()
  },
  clearSelection: () => {
    emit('selection-change', [])
  },
  getCurrentPage: () => currentPage.value,
  getTotalPages: () => totalPages.value,
  getSelectedItems: () => props.selectedItems
})
</script>

<style scoped>
.table-loading-overlay {
  border-radius: 0.5rem;
  z-index: 10;
}

/* Custom skeleton animation */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>