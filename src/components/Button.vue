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
      [
        'default',
        'danger',
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
        'dangerOutline',
        'successOutline',
        'gradient',
      ].includes(value),
  },
  size: {
    type: String,
    default: 'default',
    validator: (value) =>
      ['2xs', 'xs', 'sm', 'default', 'md', 'lg', 'xl', '2xl', 'icon-sm', 'icon', 'icon-lg'].includes(value),
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
  icon: {
    type: String,
    default: null,
  },
})

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ui-primary) focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'ui-glossy-button-strong text-(--ui-text) hover:brightness-110',
        danger:
          'ui-glossy-overlay text-(--ui-text) bg-(--ui-danger) hover:bg-(--ui-danger-strong)',
        outline:
          'ui-glossy-button ui-glossy-border border text-(--ui-text) bg-(--ui-surface) hover:brightness-105',
        secondary:
          'ui-glossy-button ui-glossy-border border text-(--ui-text) bg-(--ui-surface) hover:brightness-105',
        ghost:
          'bg-transparent text-(--ui-text-muted) hover:bg-[color:color-mix(in oklab, var(--ui-accent-soft), transparent 70%)] hover:backdrop-blur-sm',
        link:
          'text-(--ui-primary) hover:underline',
        success:
          'ui-glossy-overlay text-(--ui-text) bg-(--ui-success) hover:bg-(--ui-success-strong)',
        warning:
          'ui-glossy-overlay text-(--ui-text) bg-(--ui-warning) hover:bg-(--ui-warning)',
        info:
          'ui-glossy-button-strong text-(--ui-text) hover:brightness-110',
        subtle:
          'ui-glossy-button ui-glossy-border border text-(--ui-text) bg-(--ui-surface) hover:brightness-105',
        dark:
          'ui-glossy-button ui-glossy-border border text-(--ui-text) bg-(--ui-surface-strong) hover:brightness-105',
        light:
          'ui-glossy-button ui-glossy-border border text-(--ui-text) bg-(--ui-surface) hover:brightness-105',
        primaryOutline:
          'ui-glossy-button border border-(--ui-primary) text-(--ui-primary) hover:brightness-105',
        dangerOutline:
          'ui-glossy-button border border-(--ui-danger) text-(--ui-danger) hover:brightness-105',
        successOutline:
          'ui-glossy-button border border-(--ui-success) text-(--ui-success) hover:brightness-105',
        gradient:
          'ui-glossy-button-strong bg-linear-to-r from-(--ui-primary) to-(--ui-accent) text-(--ui-text) hover:from-(--ui-primary) hover:to-(--ui-accent-strong)',
      },
      size: {
        '2xs': 'h-6 px-2 py-1 text-xs rounded',
        'xs': 'h-7 px-2.5 py-1 text-xs rounded-md',
        'sm': 'h-8 px-3 py-1.5 text-sm rounded-md',
        'default': 'h-10 px-4 py-2 text-sm rounded-md',
        'md': 'h-10 px-4 py-2 text-sm rounded-md',
        'lg': 'h-11 px-6 py-2.5 text-base rounded-md',
        'xl': 'h-12 px-8 py-3 text-base rounded-lg',
        '2xl': 'h-14 px-10 py-3.5 text-lg rounded-lg',
        'icon-sm': 'h-8 w-8 p-0',
        'icon': 'h-10 w-10 p-0',
        'icon-lg': 'h-12 w-12 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

// Dynamic icon sizing based on button size
const iconSizeClass = computed(() => {
  const sizeMap = {
    '2xs': 'h-3 w-3',
    'xs': 'h-3.5 w-3.5',
    'sm': 'h-4 w-4',
    'default': 'h-4 w-4',
    'md': 'h-4 w-4',
    'lg': 'h-5 w-5',
    'xl': 'h-5 w-5',
    '2xl': 'h-6 w-6',
    'icon-sm': 'h-4 w-4',
    'icon': 'h-5 w-5',
    'icon-lg': 'h-6 w-6',
  }
  return sizeMap[props.size] || 'h-4 w-4'
})

// Dynamic spinner sizing based on button size
const spinnerSizeClass = computed(() => {
  const sizeMap = {
    '2xs': 'h-3 w-3',
    'xs': 'h-3.5 w-3.5',
    'sm': 'h-4 w-4',
    'default': 'h-4 w-4',
    'md': 'h-4 w-4',
    'lg': 'h-5 w-5',
    'xl': 'h-5 w-5',
    '2xl': 'h-6 w-6',
    'icon-sm': 'h-4 w-4',
    'icon': 'h-5 w-5',
    'icon-lg': 'h-6 w-6',
  }
  return sizeMap[props.size] || 'h-4 w-4'
})
</script>

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
      :class="spinnerSizeClass"
      class="animate-spin mr-2 text-current"
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

    <!-- Icon component (only show if not loading) -->
    <Icon
      v-if="icon && !loading"
      :icon="icon"
      :class="iconSizeClass"
    />

    <!-- Button content -->
    <span v-if="loading && loadingText">{{ loadingText }}</span>
    <slot v-else />
  </button>
</template>
