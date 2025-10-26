<template>
  <div :class="cn('relative inline-flex items-center justify-center', $attrs.class)">
    <svg
      :width="sizeValue"
      :height="sizeValue"
      :viewBox="`0 0 ${sizeValue} ${sizeValue}`"
      class="transform -rotate-90"
    >
      <!-- Background circle -->
      <circle
        :cx="center"
        :cy="center"
        :r="radius"
        :stroke="backgroundColor"
        :stroke-width="strokeWidth"
        fill="none"
      />
      <!-- Progress circle -->
      <circle
        :cx="center"
        :cy="center"
        :r="radius"
        :stroke="progressColor"
        :stroke-width="strokeWidth"
        fill="none"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="strokeDashoffset"
        :stroke-linecap="strokeLinecap"
        class="transition-all duration-300 ease-in-out"
      />
    </svg>
    <!-- Optional text in center -->
    <div v-if="showValue" class="absolute inset-0 flex items-center justify-center">
      <span :class="cn('text-sm font-medium', textColor)">
        {{ Math.round(clampedValue) }}%
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
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
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'success', 'warning', 'danger'].includes(value)
  },
  showValue: {
    type: Boolean,
    default: true
  },
  strokeLinecap: {
    type: String,
    default: 'round',
    validator: (value) => ['butt', 'round', 'square'].includes(value)
  }
})

const clampedValue = computed(() => {
  const percentage = (props.value / props.max) * 100
  return Math.min(Math.max(percentage, 0), 100)
})

const sizeValue = computed(() => {
  const sizes = {
    xs: 32,
    sm: 48,
    md: 64,
    lg: 80,
    xl: 96
  }
  return sizes[props.size] || 64
})

const strokeWidth = computed(() => {
  const widths = {
    xs: 3,
    sm: 4,
    md: 5,
    lg: 6,
    xl: 7
  }
  return widths[props.size] || 5
})

const center = computed(() => sizeValue.value / 2)
const radius = computed(() => center.value - strokeWidth.value / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)

const strokeDashoffset = computed(() => {
  return circumference.value - (clampedValue.value / 100) * circumference.value
})

const progressColor = computed(() => {
  const colors = {
    default: '#3b82f6',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444'
  }
  return colors[props.variant] || colors.default
})

const backgroundColor = computed(() => {
  return '#e5e7eb' // gray-200
})

const textColor = computed(() => {
  const colors = {
    default: 'text-blue-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    danger: 'text-red-600'
  }
  return colors[props.variant] || colors.default
})
</script>