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
      <Icon
        icon="xmark"
        class="w-3 h-3"
      />
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
      ['default', 'secondary', 'danger', 'primary', 'outline', 'success', 'warning', 'info', 'ghost', 'link', 'subtle', 'dark', 'light', 'primaryOutline', 'dangerOutline', 'successOutline', 'gradient'].includes(value)
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
          'border border-blue-200 bg-blue-50 text-blue-800 hover:bg-blue-100 dark:border-blue-200 dark:bg-blue-50 dark:text-blue-900',
        secondary:
          'border border-gray-200 bg-gray-50 text-gray-800 hover:bg-gray-100 dark:border-gray-200 dark:bg-gray-50 dark:text-gray-900',
        danger:
          'border border-red-200 bg-red-50 text-red-800 hover:bg-red-100 dark:border-red-200 dark:bg-red-50 dark:text-red-900',
        primary:
          'border border-blue-200 bg-blue-50 text-blue-800 hover:bg-blue-100 dark:border-blue-200 dark:bg-blue-50 dark:text-blue-900',
        outline: 'text-foreground border',
        success:
          'border border-green-200 bg-green-50 text-green-800 dark:border-green-200 dark:bg-green-50 dark:text-green-900',
        warning:
          'border border-yellow-200 bg-yellow-50 text-yellow-800 hover:bg-yellow-100 dark:border-yellow-200 dark:bg-yellow-50 dark:text-yellow-900',
        info:
          'border border-blue-200 bg-blue-50 text-blue-800 hover:bg-blue-100 dark:border-blue-200 dark:bg-blue-50 dark:text-blue-900',
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
          'border border-blue-500 text-blue-500 bg-transparent hover:bg-blue-50',
        dangerOutline:
          'border border-red-500 text-red-500 bg-transparent hover:bg-red-50',
        successOutline:
          'border border-green-500 text-green-500 bg-transparent hover:bg-green-50',
        gradient:
          'bg-linear-to-r from-blue-400 to-purple-500 text-white hover:from-blue-500 hover:to-purple-600',
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
