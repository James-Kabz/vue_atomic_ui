<template>
  <component 
    :is="tag"
    :class="cellClasses"
    :style="{ width: width }"
  >
    <slot />
  </component>
</template>

<script setup>
import { computed } from 'vue'
import { cva } from 'class-variance-authority'
import { cn } from '../utils/cn.js'

const props = defineProps({
  tag: {
    type: String,
    default: 'td',
    validator: (value) => ['td', 'th'].includes(value)
  },
  align: {
    type: String,
    default: 'left',
    validator: (value) => ['left', 'center', 'right'].includes(value)
  },
  width: String,
  sortable: Boolean
})

const cellVariants = cva('p-4', {
  variants: {
    tag: {
      td: 'align-middle',
      th: 'h-12 px-4 text-left align-middle font-medium text-muted-foreground'
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right'
    },
    sortable: {
      true: 'cursor-pointer hover:bg-muted/50',
      false: ''
    }
  }
})

const cellClasses = computed(() => 
  cn(cellVariants({ 
    tag: props.tag, 
    align: props.align,
    sortable: props.sortable 
  }))
)
</script>
