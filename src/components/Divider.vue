<template>
  <div :class="dividerClasses" :role="role">
    <span v-if="label" :class="labelClasses">
      {{ label }}
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { cva } from 'class-variance-authority'
import { cn } from '../utils/cn.js'

const props = defineProps({
  label: String,
  orientation: {
    type: String,
    default: 'horizontal',
    validator: (value) => ['horizontal', 'vertical'].includes(value)
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'dashed'].includes(value)
  },
  class: String
})

const role = computed(() => props.orientation === 'vertical' ? 'separator' : 'separator')

const dividerVariants = cva(
  'shrink-0 bg-border',
  {
    variants: {
      orientation: {
        horizontal: 'h-[1px] w-full',
        vertical: 'h-full w-[1px]'
      },
      variant: {
        default: '',
        dashed: 'border-dashed'
      }
    }
  }
)

const dividerClasses = computed(() => {
  if (props.label && props.orientation === 'horizontal') {
    return cn(
      'relative flex items-center',
      props.class
    )
  }
  
  return cn(
    dividerVariants({ 
      orientation: props.orientation, 
      variant: props.variant 
    }),
    props.variant === 'dashed' && props.orientation === 'horizontal' && 'border-t',
    props.variant === 'dashed' && props.orientation === 'vertical' && 'border-l',
    props.class
  )
})

const labelClasses = computed(() => 
  cn(
    'px-3 text-sm text-muted-foreground bg-background',
    'before:content-[""] before:flex-1 before:h-[1px] before:bg-border before:mr-3',
    'after:content-[""] after:flex-1 after:h-[1px] after:bg-border after:ml-3',
    'flex items-center w-full'
  )
)
</script>
