<template>
  <div
    :class="cn(cardVariants({ variant, padding, hoverable, clickable, loading }))"
    @click="handleClick"
  >
    <!-- Header -->
    <div
      v-if="$slots.header || title || subtitle"
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
              v-if="subtitle"
              :class="subtitleClasses"
            >
              {{ subtitle }}
            </p>
          </div>

          <div
            v-if="$slots.actions"
            class="flex-shrink-0 ml-4"
          >
            <slot name="actions" />
          </div>
        </div>
      </slot>
    </div>

    <!-- Image -->
    <div
      v-if="$slots.image || image"
      :class="cn(imageContainerVariants({ padding }))"
    >
      <slot name="image">
        <img
          v-if="image"
          :src="image"
          :alt="imageAlt"
          :class="imageClasses"
        >
      </slot>
    </div>

    <!-- Content -->
    <div
      v-if="$slots.default"
      :class="cn(contentVariants({ padding }))"
    >
      <slot />
    </div>

    <!-- Footer -->
    <div
      v-if="$slots.footer"
      :class="cn(footerVariants({ padding }))"
    >
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
import { cva } from 'class-variance-authority'
import { cn } from '../utils/cn.js'

const props = defineProps({
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
  subtitle: String,
  image: String,
  imageAlt: {
    type: String,
    default: 'Card image'
  },
  hoverable: Boolean,
  clickable: Boolean,
  loading: Boolean
})

const emit = defineEmits(['click'])

const handleClick = (event) => {
  if (props.clickable) emit('click', event)
}

/* --- Variants --- */
const cardVariants = cva(
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
      },
      hoverable: {
        true: 'hover:shadow-md'
      },
      clickable: {
        true: 'cursor-pointer'
      },
      loading: {
        true: 'opacity-60 pointer-events-none'
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

const imageContainerVariants = cva('', {
  variants: {
    padding: {
      none: '',
      sm: '-mx-3 -mt-3 mb-3',
      md: '-mx-4 -mt-4 mb-4',
      lg: '-mx-6 -mt-6 mb-6',
      xl: '-mx-8 -mt-8 mb-8'
    }
  }
})

/* --- Static classes --- */
const imageClasses = 'w-full h-auto object-cover'
const titleClasses = 'text-lg font-semibold text-slate-900 truncate'
const subtitleClasses = 'text-sm text-slate-600 mt-1'
</script>
