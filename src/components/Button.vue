<template>
  <button
    :class="cn(buttonVariants({ variant, size }), $attrs.class)"
    :disabled="disabled || loading"
    :aria-disabled="disabled || loading"
    :aria-busy="loading"
    v-bind="$attrs"
  >
    <!-- Loading Spinner -->
    <svg
      v-if="loading"
      class="animate-spin mr-2 h-4 w-4 text-current"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        class="opacity-75"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-width="4"
        d="M4 12a8 8 0 018-8"
      />
    </svg>

    <!-- Icon slot (only show if not loading) -->
    <slot
      v-if="!loading"
      name="icon"
    />

    <!-- Button content -->
    <span v-if="loading && loadingText">{{ loadingText }}</span>
    <slot v-else />
  </button>
</template>

<script setup>
import { cva } from 'class-variance-authority'
import { cn } from '../utils/cn.js'

defineOptions({
  inheritAttrs: false
})

const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (value) =>
      [
        'default',
        'destructive',
        'outline',
        'secondary',
        'ghost',
        'link',
        'success',
        'warning',
        'info',
        'subtle',
        'dark',
        'light',
        'primaryOutline',
        'destructiveOutline',
        'successOutline',
        'gradient',
      ].includes(value),

  },
  size: {
    type: String,
    default: 'default',
    validator: (value) =>
      ['default', 'xs', 'sm', 'lg', 'icon'].includes(value),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  loadingText: {
    type: String,
    default: null,
  },
})

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-blue-600 text-white hover:bg-blue-700',
        destructive:
          'bg-red-600 text-white hover:bg-red-700',
        outline:
          'border border-gray-300 bg-white text-gray-900 hover:bg-gray-100',
        secondary:
          'bg-gray-600 text-white hover:bg-gray-700',
        ghost:
          'bg-transparent text-gray-700 hover:bg-gray-100',
        link:
          'text-blue-600 hover:underline',
        success:
          'bg-green-600 text-white hover:bg-green-700',
        warning:
          'bg-yellow-500 text-black hover:bg-yellow-600',
        info:
          'bg-cyan-600 text-white hover:bg-cyan-700',
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
      }
      ,
      size: {
        default: 'h-10 px-4 py-2',
        xs: 'h-7 rounded-md px-1',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)
</script>
