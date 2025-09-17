<template>
  <font-awesome-icon
    :icon="[prefix, icon]"
    :size="faSize"
    :class="iconClasses"
    :aria-hidden="!ariaLabel"
    :aria-label="ariaLabel"
    :role="ariaLabel ? 'img' : undefined"
  />
</template>

<script setup>
import { computed } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const props = defineProps({
  icon: {
    type: String,
    required: true
  },
  prefix: {
    type: String,
    default: 'fas'
  },
  size: {
    type: String,
    default: 'md'
  },
  color: String,
  ariaLabel: String
})

const faSize = computed(() => {
  const sizes = {
    xs: 'xs',
    sm: 'sm', 
    md: 'lg',      // FontAwesome sizes: xs, sm, lg, xl, 2x, 3x, etc.
    lg: 'xl',
    xl: '2x',
    xxl: '3x'
  }
  return sizes[props.size] || 'lg'
})

const colorClasses = computed(() =>
  props.color ? `text-${props.color}` : 'text-current'
)

const iconClasses = computed(() => [
  colorClasses.value,
  'inline-block'
])
</script>
