<template>
  <component
    :is="tag"
    :class="cn(
      buttonVariants({ variant, size }),
      { 'opacity-70 pointer-events-none': loading }
    )"
    :disabled="isButton && (disabled || loading)"
    :type="isButton ? type : undefined"
    :href="isLink ? href : undefined"
    :to="isRouter ? to : undefined"
    :aria-disabled="disabled || loading"
    :aria-busy="loading"
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
        cx="12" cy="12" r="10"
        stroke="currentColor" stroke-width="4"
      />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>

    <!-- Icon slot -->
    <slot name="icon" />

    <!-- Button text -->
    <slot />
  </component>
</template>

<script setup>
import { cva } from 'class-variance-authority'
import { cn } from '../utils/cn.js'
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: v => ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'].includes(v)
  },
  size: {
    type: String,
    default: 'default',
    validator: v => ['default', 'sm', 'lg', 'icon'].includes(v)
  },
  tag: {
    type: String,
    default: 'button', // "button" | "a" | "router-link"
  },
  type: {
    type: String,
    default: 'button', // only relevant when tag === "button"
  },
  href: {
    type: String,
    default: null,
  },
  to: {
    type: [String, Object],
    default: null, // for <router-link>
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  }
})

const isButton = computed(() => props.tag === 'button')
const isLink   = computed(() => props.tag === 'a')
const isRouter = computed(() => props.tag === 'router-link')

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline'
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)
</script>
