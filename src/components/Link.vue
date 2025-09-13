<template>
  <component
    :is="tag"
    :href="href"
    :to="to"
    :class="linkClasses"
    v-bind="$attrs"
  >
    <slot />
  </component>
</template>

<script setup>
import { computed } from 'vue'
import { cva } from 'class-variance-authority'
import { cn } from '../utils/cn.js'

const props = defineProps({
  href: String,
  to: [String, Object],
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'muted', 'destructive'].includes(value)
  },
  underline: {
    type: String,
    default: 'hover',
    validator: (value) => ['none', 'hover', 'always'].includes(value)
  },
  external: Boolean,
  class: String
})

const tag = computed(() => {
  if (props.to) return 'router-link'
  return 'a'
})

const linkVariants = cva(
  'inline-flex items-center gap-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'text-primary hover:text-primary/80',
        muted: 'text-muted-foreground hover:text-foreground',
        destructive: 'text-destructive hover:text-destructive/80'
      },
      underline: {
        none: 'no-underline',
        hover: 'no-underline hover:underline',
        always: 'underline'
      }
    }
  }
)

const linkClasses = computed(() => 
  cn(linkVariants({ 
    variant: props.variant, 
    underline: props.underline 
  }), props.class)
)
</script>
