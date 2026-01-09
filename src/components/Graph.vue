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
        default: 'bg-white border border-slate-200',
        outlined: 'bg-white border-2 border-slate-300',
        elevated: 'bg-white shadow-lg border border-slate-100',
        filled: 'bg-slate-50 border border-slate-200'
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
  'border-b border-slate-100 last:border-b-0',
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
  'border-b border-slate-100',
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
  'border-t border-slate-100 bg-slate-50/50',
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
  'border-t border-slate-100 bg-slate-50/50',
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
const titleClasses = 'text-lg font-semibold text-slate-900 truncate'
const subtitleClasses = 'text-sm text-slate-600 mt-1'
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
