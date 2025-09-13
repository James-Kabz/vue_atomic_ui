<template>
  <div :class="tableClasses">
    <div v-if="$slots.toolbar" class="mb-4">
      <slot name="toolbar" />
    </div>
    
    <div v-if="$slots.filters" class="mb-4">
      <slot name="filters" />
    </div>
    
    <div class="rounded-md border">
      <table class="w-full caption-bottom text-sm">
        <slot name="header" />
        <tbody class="[&_tr:last-child]:border-0">
          <slot />
        </tbody>
      </table>
    </div>
    
    <div v-if="$slots.pagination" class="mt-4">
      <slot name="pagination" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { cva } from 'class-variance-authority'
import { cn } from '../utils/cn.js'

const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'striped', 'bordered'].includes(value)
  }
})

const tableVariants = cva('w-full', {
  variants: {
    variant: {
      default: '',
      striped: '[&_tbody_tr:nth-child(odd)]:bg-muted/50',
      bordered: '[&_td]:border [&_th]:border'
    }
  }
})

const tableClasses = computed(() => 
  cn(tableVariants({ variant: props.variant }))
)
</script>
