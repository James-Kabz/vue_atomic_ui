<script setup>
import { computed } from 'vue'
import { cva } from 'class-variance-authority'
import { cn } from '../utils/cn.js'
import Checkbox from './Checkbox.vue'

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  columns: {
    type: Array,
    required: true
  },
  index: {
    type: Number,
    required: true
  },
  selectable: {
    type: Boolean,
    default: false
  },
  isSelected: {
    type: Boolean,
    default: false
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
  density: {
    type: String,
    default: 'normal',
    validator: (value) => ['compact', 'normal', 'comfortable'].includes(value)
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'bordered', 'minimal'].includes(value)
  }
})

const emit = defineEmits(['toggle-selection', 'row-click'])


// CVA variants
const rowVariants = cva('transition-colors', {
  variants: {
    striped: {
      true: 'odd:bg-slate-50/50',
      false: ''
    },
    hoverable: {
      true: 'hover:bg-slate-50',
      false: ''
    },
    clickable: {
      true: 'cursor-pointer hover:bg-slate-100',
      false: ''
    },
    selected: {
      true: 'bg-blue-50 border-blue-200',
      false: ''
    },
    variant: {
      default: '',
      bordered: 'border-b border-slate-200',
      minimal: 'border-b border-slate-100'
    }
  },
  compoundVariants: [
    {
      hoverable: true,
      clickable: true,
      class: 'hover:bg-slate-100'
    }
  ],
  defaultVariants: {
    striped: false,
    hoverable: true,
    clickable: false,
    selected: false,
    variant: 'default'
  }
})

const cellVariants = cva('whitespace-nowrap text-sm text-slate-900', {
  variants: {
    density: {
      compact: 'px-4 py-2',
      normal: 'px-6 py-4',
      comfortable: 'px-8 py-6'
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right'
    }
  },
  defaultVariants: {
    density: 'normal',
    align: 'left'
  }
})

// Methods
const getColumnKey = (column) => {
  if (typeof column === 'string') {
    return column
  }
  return column?.key || column?.field || 'unknown'
}

const getCellValue = (item, column) => {
  const key = getColumnKey(column)

  if (typeof column === 'object' && column.accessor) {
    return column.accessor(item)
  }

  if (key && key.includes('.')) {
    return key.split('.').reduce((obj, k) => obj?.[k], item)
  }

  return item?.[key]
}

const formatCellValue = (item, column) => {
  const value = getCellValue(item, column)

  if (typeof column === 'object' && column.formatter) {
    return column.formatter(value, item)
  }

  if (value == null) {
    return ''
  }

  if (value instanceof Date) {
    return value.toLocaleDateString()
  }

  if (Array.isArray(value)) {
    return value.join(', ')
  }

  return value
}



const handleRowClick = () => {
  if (props.clickableRows) {
    emit('row-click', { item: props.item, index: props.index })
  }
}

const getAlignmentClass = (column) => {
  if (typeof column === 'object' && column.align) {
    return column.align
  }
  return 'left'
}

// Computed classes
const rowClasses = computed(() => 
  cn(rowVariants({
    striped: props.striped,
    hoverable: props.hoverable && !props.clickableRows,
    clickable: props.clickableRows,
    selected: props.isSelected,
    variant: props.variant
  }))
)

const getCellClasses = (column) => {
  const alignmentClass = getAlignmentClass(column)
  
  return cn(
    cellVariants({
      density: props.density,
      align: alignmentClass
    }),
    column.cellClasses
  )
}

const checkboxCellClasses = computed(() => 
  cn(
    cellVariants({ density: props.density }),
    'w-12'
  )
)

const actionsCellClasses = computed(() => 
  cn(
    cellVariants({ 
      density: props.density,
      align: 'right' 
    }),
    'font-medium'
  )
)
</script>

<template>
  <tr
    :class="rowClasses"
    @click="handleRowClick"
  >
    <!-- Selection Column -->
    <td
      v-if="selectable"
      :class="checkboxCellClasses"
    >
      <Checkbox
        :model-value="isSelected"
        @update:model-value="$emit('toggle-selection', item)"
      />
    </td>

    <!-- Data Columns -->
    <td
      v-for="column in columns"
      :key="getColumnKey(column)"
      :class="getCellClasses(column)"
    >
      <slot
        :name="`cell-${getColumnKey(column)}`"
        :item="item"
        :value="getCellValue(item, column)"
        :column="column"
        :index="index"
      >
        {{ formatCellValue(item, column) }}
      </slot>
    </td>

    <!-- Actions Column -->
    <td
      v-if="$slots.actions"
      :class="actionsCellClasses"
    >
      <slot
        name="actions"
        :item="item"
        :index="index"
      />
    </td>
  </tr>
</template>