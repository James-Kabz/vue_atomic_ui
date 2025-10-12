<template>
  <span :class="cn(badgeVariants({ variant, size, shape }), $attrs.class)">
    <!-- Icon -->
    <component
      :is="icon"
      v-if="icon"
      :class="iconClasses"
    />

    <!-- Default slot -->
    <slot />

    <!-- Dismiss button -->
    <button
      v-if="dismissible"
      class="ml-1 hover:bg-black/10 rounded-full p-0.5 transition-colors"
      :aria-label="dismissLabel"
      @click="handleDismiss"
    >
      <Icon icon="xmark" class="w-3 h-3" />
    </button>
  </span>
</template>

<script setup>
import { computed } from 'vue'
import { cva } from 'class-variance-authority'
import { cn } from '../utils/cn.js'
import Icon from './Icon.vue'

defineOptions({
  inheritAttrs: false
})

const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (value) =>
      ['default', 'secondary', 'destructive', 'outline', 'success', 'warning', 'info', 'ghost', 'link', 'subtle', 'dark', 'light', 'primaryOutline', 'destructiveOutline', 'successOutline', 'gradient'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  shape: {
    type: String,
    default: 'rounded',
    validator: (value) => ['rounded', 'pill', 'square'].includes(value)
  },
  icon: {
    type: [String, Object],
    default: null
  },
  dismissible: {
    type: Boolean,
    default: false
  },
  dismissLabel: {
    type: String,
    default: 'Dismiss'
  }
})

const emit = defineEmits(['dismiss'])
const handleDismiss = () => emit('dismiss')

// cva-powered class variants
const badgeVariants = cva(
  'inline-flex items-center font-medium border transition-all duration-200',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground border',
        success:
          'border-transparent bg-green-600 text-white hover:bg-green-700',
        warning:
          'border-transparent bg-yellow-500 text-black hover:bg-yellow-600',
        info:
          'border-transparent bg-cyan-600 text-white hover:bg-cyan-700',
        ghost:
          'bg-transparent text-gray-700 hover:bg-gray-100',
        link:
          'text-blue-600 hover:underline',
        subtle:
          'bg-gray-100 text-gray-800 hover:bg-gray-200',
        dark:
          'bg-gray-900 text-white hover:bg-black',
        light:
          'bg-gray-50 text-gray-800 border border-gray-200 hover:bg-gray-100',
        primaryOutline:
          'border border-blue-600 text-blue-600 bg-transparent hover:bg-blue-50',
        destructiveOutline:
          'border border-red-600 text-red-600 bg-transparent hover:bg-red-50',
        successOutline:
          'border border-green-600 text-green-600 bg-transparent hover:bg-green-50',
        gradient:
          'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-sm',
        lg: 'px-3 py-1.5 text-base'
      },
      shape: {
        rounded: 'rounded-md',
        pill: 'rounded-full',
        square: 'rounded-none'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      shape: 'rounded'
    }
  }
)

// Computed icon sizing
const iconClasses = computed(() => {
  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }
  return ['mr-1', iconSizes[props.size]]
})
</script>
