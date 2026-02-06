<template>
  <div :class="containerClasses">
    <div 
      :class="progressClasses"
      :style="{ width: `${clampedValue}%` }"
      role="progressbar"
      :aria-valuenow="clampedValue"
      :aria-valuemin="0"
      :aria-valuemax="100"
    />
    <span
      v-if="showLabel"
      :class="labelClasses"
    >
      {{ clampedValue }}%
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { cva } from 'class-variance-authority'
import { cn } from '../utils/cn.js'

const props = defineProps({
  value: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 100
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'success', 'warning', 'danger'].includes(value)
  },
  showLabel: Boolean,
  class: String
})

const clampedValue = computed(() => {
  const percentage = (props.value / props.max) * 100
  return Math.min(Math.max(percentage, 0), 100)
})

const containerVariants = cva(
  'relative w-full overflow-hidden rounded-full bg-secondary',
  {
    variants: {
      size: {
        sm: 'h-2',
        md: 'h-3',
        lg: 'h-4'
      }
    }
  }
)

const progressVariants = cva(
  'h-full w-full flex-1 transition-all duration-300 ease-in-out',
  {
    variants: {
      variant: {
        default: 'bg-primary',
        success: 'ui-success-bg',
        warning: 'ui-warning-bg',
        danger: 'bg-danger'
      }
    }
  }
)

const containerClasses = computed(() => 
  cn(containerVariants({ size: props.size }), props.class)
)

const progressClasses = computed(() => 
  progressVariants({ variant: props.variant })
)

const labelClasses = computed(() => 
  'absolute inset-0 flex items-center justify-center text-xs font-medium ui-text'
)
</script>
