<template>
  <span
    v-html="iconTemplate"
    :class="iconClasses"
    :aria-hidden="!ariaLabel"
    :aria-label="ariaLabel"
    :role="ariaLabel ? 'img' : undefined"
  />
</template>

<script setup>
import { computed } from 'vue'

import { icons } from './icon.js' 

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  size: {
    type: String,
    default: 'md'
  },
  color: String,
  ariaLabel: String
})

const iconTemplate = computed(() => {
  const icon = icons[props.name]
  if (!icon) {
    console.warn(`Icon "${props.name}" not found`)
    return ''
  }
  return icon.template
})

const sizeClasses = computed(() => {
  const sizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8'
  }
  return sizes[props.size] || sizes.md
})

const colorClasses = computed(() =>
  props.color ? `text-${props.color}` : 'text-current'
)

const iconClasses = computed(() => [
  sizeClasses.value,
  colorClasses.value,
  'inline-block'
])
</script>
