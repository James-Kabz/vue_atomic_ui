<template>
  <div :class="toolbarClasses">
    <!-- Left side - Selection actions -->
    <div class="flex items-center gap-3">
      <div
        v-if="selectedCount > 0"
        class="flex items-center gap-3"
      >
        <span class="text-sm text-(--ui-text-muted)">
          {{ selectedCount }} selected
        </span>

        <!-- Bulk actions -->
        <div class="flex items-center gap-2">
          <Button
            v-for="action in bulkActions"
            :key="action.key"
            :class="getBulkActionClasses(action)"
            @click="$emit('bulk-action', { action: action.key, items: selectedItems })"
          >
            <font-awesome-icon
              v-if="action.icon"
              :icon="action.icon"
              class="w-4 h-4"
            />
            {{ action.label }}
          </Button>
        </div>
      </div>

      <!-- Default info when no selection -->
      <div
        v-else-if="totalItems > 0"
        :class="itemCountClasses"
      >
        {{ totalItems }} {{ totalItems === 1 ? 'item' : 'items' }}
      </div>
    </div>

    <!-- Right side - View controls and actions -->
    <div class="flex items-center gap-3">
      <!-- View density toggle -->
      <div
        v-if="showDensityToggle"
        :class="densityToggleClasses"
      >
        <button
          v-for="option in densityOptions"
          :key="option.value"
          :class="getDensityButtonClasses(option.value)"
          :title="option.label"
          type="button"
          @click="$emit('update:density', option.value)"
        >
          <font-awesome-icon
            :icon="option.icon"
            class="w-4 h-4"
          />
        </button>
      </div>

      <!-- Column visibility toggle -->
      <div
        v-if="showColumnToggle"
        class="relative"
      >
        <button
          ref="columnToggleButton"
          :class="columnToggleButtonClasses"
          type="button"
          @click.stop="toggleColumnMenu"
        >
          <font-awesome-icon
            icon="columns"
            class="w-4 h-4"
          />
          <span>Columns</span>
        </button>

        <!-- Column menu -->
        <div
          v-show="showColumnMenu"
          ref="columnMenu"
          :class="columnMenuClasses"
          @click.stop
        >
          <div class="p-3">
            <div :class="columnMenuHeaderClasses">
              Show Columns
            </div>
            <div class="space-y-1">
              <div
                v-for="column in toggleableColumns"
                :key="column.key"
                :class="columnMenuItemClasses"
              >
                <label class="flex items-center gap-2 cursor-pointer w-full">
                  <input
                    type="checkbox"
                    :checked="isColumnVisible(column.key)"
                    :class="checkboxClasses"
                    @change="toggleColumn(column.key, $event.target.checked)"
                  >
                  <span :class="labelClasses">
                    {{ column.label }}
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Refresh button -->
      <button
        v-if="showRefresh"
        :disabled="isRefreshing"
        :class="getRefreshButtonClasses()"
        type="button"
        @click="$emit('refresh')"
      >
        <font-awesome-icon
          icon="sync"
          :class="getRefreshIconClasses()"
        />
        <span>Refresh</span>
      </button>

      <!-- Custom actions -->
      <div
        v-if="$slots.actions"
        class="flex items-center gap-2"
      >
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

<script>

// Default bulk actions
const defaultBulkActions = [
  {
    key: 'delete',
    label: 'Delete',
    icon: {
      render() {
        return h('svg', {
          fill: 'none',
          viewBox: '0 0 24 24',
          'stroke-width': '1.5',
          stroke: 'currentColor'
        }, [
          h('path', {
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            d: 'm14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0'
          })
        ])
      }
    },
    variant: 'danger'
  },
  {
    key: 'edit',
    label: 'Edit',
    icon: {
      render() {
        return h('svg', {
          fill: 'none',
          viewBox: '0 0 24 24',
          'stroke-width': '1.5',
          stroke: 'currentColor'
        }, [
          h('path', {
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            d: 'm16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10'
          })
        ])
      }
    },
    variant: 'primary'
  }
]

export default {
  name: 'DataTableToolBar'
}
</script>

<script setup>
import Button from './Button.vue'
import { ref, computed, onMounted, onUnmounted, h } from 'vue'
import { cva } from 'class-variance-authority'
import { cn } from '../utils/cn.js'

const props = defineProps({
  selectedItems: { type: Array, default: () => [] },
  totalItems: { type: Number, default: 0 },
  bulkActions: { type: Array, default: () => defaultBulkActions },
  showDensityToggle: { type: Boolean, default: true },
  showColumnToggle: { type: Boolean, default: true },
  showRefresh: { type: Boolean, default: true },
  isRefreshing: { type: Boolean, default: false },
  density: {
    type: String,
    default: 'normal',
    validator: (v) => ['compact', 'normal', 'comfortable'].includes(v)
  },
  toggleableColumns: { type: Array, default: () => [] },
  visibleColumns: { type: Array, default: () => [] },
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

const emit = defineEmits(['bulk-action', 'update:density', 'toggle-column', 'refresh'])

// Refs
const showColumnMenu = ref(false)
const columnToggleButton = ref(null)
const columnMenu = ref(null)

const selectedCount = computed(() => props.selectedItems.length)

const densityOptions = [
  { value: 'compact', label: 'Compact', icon: ['fas', 'minus'] },
  { value: 'normal', label: 'Normal', icon: ['fas', 'bars'] },
  { value: 'comfortable', label: 'Comfortable', icon: ['fas', 'bars-staggered'] }
]


// CVA Variants
const toolbarVariants = cva('flex items-center justify-between border-b border-(--ui-border)', {
  variants: {
    variant: {
      default: 'bg-(--ui-surface)',
      minimal: 'bg-transparent border-(--ui-border)',
      bordered: 'bg-(--ui-surface-muted) border-(--ui-border)'
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

const bulkActionVariants = cva('px-3 py-1.5 text-sm font-medium rounded-md flex items-center gap-1 transition-colors', {
  variants: {
    variant: {
      danger: 'text-(--ui-danger) bg-(--ui-danger) hover:bg-(--ui-danger-soft) border border-(--ui-danger-soft)',
      primary: 'text-(--ui-primary) bg-(--ui-primary-soft) hover:bg-(--ui-primary-soft) border border-(--ui-primary-soft)',
      secondary: 'text-(--ui-text-muted) bg-(--ui-surface-soft) hover:bg-(--ui-surface-soft) border border-(--ui-border)'
    }
  },
  defaultVariants: {
    variant: 'secondary'
  }
});

const densityButtonVariants = cva('p-2 border border-(--ui-border) transition-colors', {
  variants: {
    active: {
      true: 'bg-(--ui-primary-soft) text-(--ui-primary) border-(--ui-primary-soft)',
      false: 'bg-(--ui-surface) text-(--ui-text-muted) hover:bg-(--ui-surface-muted)'
    },
    position: {
      first: 'rounded-l-md border-r-0',
      middle: 'border-x-0',
      last: 'rounded-r-md border-l-0'
    }
  },
  defaultVariants: {
    active: false,
    position: 'middle'
  }
})

const refreshButtonVariants = cva('px-3 py-2 text-sm border border-(--ui-border) rounded-md flex items-center gap-2 transition-colors', {
  variants: {
    state: {
      normal: 'text-(--ui-text-muted) hover:text-(--ui-text) hover:bg-(--ui-surface-muted)',
      refreshing: 'text-(--ui-text-muted) opacity-75 cursor-not-allowed'
    }
  },
  defaultVariants: {
    state: 'normal'
  }
})

// Computed Classes
const toolbarClasses = computed(() => 
  cn(toolbarVariants({ 
    variant: props.variant, 
    padding: props.padding 
  }))
)

const itemCountClasses = computed(() => 'text-sm text-(--ui-text-muted)')
const densityToggleClasses = computed(() => 'flex items-center')

const columnToggleButtonClasses = computed(() => 
  'flex items-center gap-2 px-3 py-2 text-sm text-(--ui-text-muted) hover:text-(--ui-text) border border-(--ui-border) rounded-md hover:bg-(--ui-surface-muted) transition-colors focus:outline-none focus:ring-2 focus:ring-(--ui-primary) focus:ring-offset-1'
)

const columnMenuClasses = computed(() => 
  'absolute right-0 top-full mt-1 w-56 bg-(--ui-surface) border border-(--ui-border) rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto'
)

const columnMenuHeaderClasses = computed(() => 
  'text-xs font-medium text-(--ui-text-soft) uppercase tracking-wider mb-2 border-b border-(--ui-border) pb-2'
)

const columnMenuItemClasses = computed(() => 
  'py-1 hover:bg-(--ui-surface-muted) rounded transition-colors'
)

const checkboxClasses = computed(() => 
  'w-4 h-4 rounded border-(--ui-border) text-(--ui-primary) focus:ring-(--ui-primary) focus:ring-2 focus:ring-offset-1'
)

const labelClasses = computed(() => 
  'text-sm text-(--ui-text-muted) flex-1 select-none'
)

// Click outside handler
const handleClickOutside = (event) => {
  if (
    columnToggleButton.value &&
    columnMenu.value &&
    !columnToggleButton.value.contains(event.target) &&
    !columnMenu.value.contains(event.target)
  ) {
    showColumnMenu.value = false
  }
}

// Methods
const toggleColumnMenu = () => {
  showColumnMenu.value = !showColumnMenu.value
}

const getBulkActionClasses = (action) => 
  cn(bulkActionVariants({ variant: action.variant || 'secondary' }))

const getDensityButtonClasses = (densityValue) => {
  let position = 'middle'
  if (densityValue === 'compact') position = 'first'
  else if (densityValue === 'comfortable') position = 'last'

  return cn(densityButtonVariants({
    active: props.density === densityValue,
    position
  }))
}

const getRefreshButtonClasses = () => 
  cn(refreshButtonVariants({ 
    state: props.isRefreshing ? 'refreshing' : 'normal' 
  }))

const getRefreshIconClasses = () => 
  cn('w-4 h-4', {
    'animate-spin': props.isRefreshing
  })

const isColumnVisible = (columnKey) => props.visibleColumns.includes(columnKey)

const toggleColumn = (columnKey, visible) => {
  emit('toggle-column', { column: columnKey, visible })
}

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>