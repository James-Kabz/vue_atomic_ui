<script setup>
import { cva } from 'class-variance-authority'
import { cn } from '../utils/cn.js'

defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'outlined', 'elevated', 'filled'].includes(value)
  },
  padding: {
    type: String,
    default: 'md',
    validator: (value) => ['none', 'sm', 'md', 'lg', 'xl'].includes(value)
  },
  title: String,
  description: String
})

/* --- Variants --- */
const graphContainerVariants = cva(
  'rounded-lg overflow-hidden transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'bg-(--ui-surface) border border-(--ui-border)',
        outlined: 'bg-(--ui-surface) border-2 border-(--ui-border)',
        elevated: 'bg-(--ui-surface) shadow-lg border border-(--ui-border)',
        filled: 'bg-(--ui-surface-muted) border border-(--ui-border)'
      },
      padding: {
        none: '',
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
        xl: 'p-8'
      }
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md'
    }
  }
)

const headerVariants = cva(
  'border-b border-(--ui-border) last:border-b-0',
  {
    variants: {
      padding: {
        none: 'p-4 pb-0',
        sm: 'px-3 pt-3',
        md: 'px-4 pt-4',
        lg: 'px-6 pt-6',
        xl: 'px-8 pt-8'
      }
    }
  }
)

const filtersVariants = cva(
  'border-b border-(--ui-border)',
  {
    variants: {
      padding: {
        none: 'p-4 pb-0',
        sm: 'px-3 py-3',
        md: 'px-4 py-4',
        lg: 'px-6 py-6',
        xl: 'px-8 py-8'
      }
    }
  }
)

const contentVariants = cva('', {
  variants: {
    padding: {
      none: 'p-4',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
      xl: 'p-8'
    }
  }
})

const legendVariants = cva(
  'border-t border-(--ui-border) bg-[color:color-mix(in oklab, var(--ui-surface-muted), transparent 50%)]',
  {
    variants: {
      padding: {
        none: 'p-4 pt-0',
        sm: 'px-3 pb-3',
        md: 'px-4 pb-4',
        lg: 'px-6 pb-6',
        xl: 'px-8 pb-8'
      }
    }
  }
)

const footerVariants = cva(
  'border-t border-(--ui-border) bg-[color:color-mix(in oklab, var(--ui-surface-muted), transparent 50%)]',
  {
    variants: {
      padding: {
        none: 'p-4 pt-0',
        sm: 'px-3 pb-3',
        md: 'px-4 pb-4',
        lg: 'px-6 pb-6',
        xl: 'px-8 pb-8'
      }
    }
  }
)

/* --- Static classes --- */
const titleClasses = 'text-lg font-semibold text-(--ui-text) truncate'
const subtitleClasses = 'text-sm text-(--ui-text-muted) mt-1'
</script>

<template>
  <div :class="cn(graphContainerVariants({ variant, padding }))">
    <!-- Header Slot -->
    <div
      v-if="$slots.header || title || description"
      :class="cn(headerVariants({ padding }))"
    >
      <slot name="header">
        <div class="flex items-start justify-between">
          <div class="flex-1 min-w-0">
            <h3
              v-if="title"
              :class="titleClasses"
            >
              {{ title }}
            </h3>
            <p
              v-if="description"
              :class="subtitleClasses"
            >
              {{ description }}
            </p>
          </div>

          <div
            v-if="$slots.actions"
            class="shrink-0 ml-4"
          >
            <slot name="actions" />
          </div>
        </div>
      </slot>
    </div>

    <!-- Filters Slot -->
    <div
      v-if="$slots.filters"
      :class="cn(filtersVariants({ padding }))"
    >
      <slot name="filters" />
    </div>

    <!-- Graph Content -->
    <div
      v-if="$slots.default"
      :class="cn(contentVariants({ padding }))"
    >
      <slot />
    </div>

    <!-- Legend Slot -->
    <div
      v-if="$slots.legend"
      :class="cn(legendVariants({ padding }))"
    >
      <slot name="legend" />
    </div>

    <!-- Footer Slot -->
    <div
      v-if="$slots.footer"
      :class="cn(footerVariants({ padding }))"
    >
      <slot name="footer" />
    </div>
  </div>
</template>
