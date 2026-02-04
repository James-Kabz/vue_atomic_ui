<!-- components/Toaster.vue -->
<template>
  <Teleport to="body">
    <div
      :class="cn(
        containerClasses,
        'fixed z-[100] flex max-h-screen w-full p-4 md:max-w-[420px]'
      )"
    >
      <TransitionGroup
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="transform translate-x-full opacity-0 scale-95"
        enter-to-class="transform translate-x-0 opacity-100 scale-100"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="transform translate-x-0 opacity-100 scale-100"
        leave-to-class="transform translate-x-full opacity-0 scale-95"
        move-class="transition-all duration-200"
        tag="div"
        class="space-y-2"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="toastClasses(toast)"
          role="alert"
          :aria-live="toast.variant === 'error' ? 'assertive' : 'polite'"
          class="group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all"
        >
          <!-- Icon -->
          <Icon
            v-if="showIcon(toast)"
            :icon="getIconName(toast)"
            :class="getIconClasses(toast)"
            class="h-4 w-4 shrink-0"
          />

          <!-- Content -->
          <div class="flex-1 grid gap-1">
            <div
              v-if="toast.title"
              class="text-lg font-extrabold"
            >
              {{ toast.title }}
            </div>
            <div
              v-if="toast.message"
              class="text-md opacity-90"
            >
              {{ toast.message }}
            </div>
            <div
              v-if="toast.description"
              class="text-md opacity-90"
            >
              {{ toast.description }}
            </div>

            <!-- Custom component slot -->
            <component
              :is="toast.component"
              v-if="toast.component"
              v-bind="toast.componentProps"
            />
          </div>

          <!-- Action Button -->
          <button
            v-if="toast.action"
            class="inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-xs font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            @click="toast.action.onClick"
          >
            {{ toast.action.label }}
          </button>

          <!-- Close Button -->
          <button
            v-if="isDismissible(toast)"
            class="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
            @click="dismiss(toast.id)"
          >
            <Icon
              icon="x"
              class="h-4 w-4"
            />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { cva } from 'class-variance-authority'
import { cn } from '../utils/cn.js'
import { useToaster } from '../lib/toast.js'
import Icon from './Icon.vue'

const props = defineProps({
  position: {
    type: String,
    default: 'top-center',
    validator: (value) => [
      'top-left', 'top-center', 'top-right',
      'bottom-left', 'bottom-center', 'bottom-right'
    ].includes(value)
  },
  hotkey: {
    type: Array,
    default: () => ['altKey', 'KeyT']
  },
  richColors: {
    type: Boolean,
    default: false
  },
  expand: {
    type: Boolean,
    default: false
  },
  visibleToasts: {
    type: Number,
    default: 3
  },
  closeButton: {
    type: Boolean,
    default: false
  }
})

const { toasts, dismiss } = useToaster()

// Position classes
const positionClasses = {
  'top-left': 'top-0 left-0 flex-col',
  'top-center': 'top-0 left-1/2 -translate-x-1/2 flex-col',
  'top-right': 'top-0 right-0 flex-col',
  'bottom-left': 'bottom-0 left-0 flex-col-reverse',
  'bottom-center': 'bottom-0 left-1/2 -translate-x-1/2 flex-col-reverse',
  'bottom-right': 'bottom-0 right-0 flex-col-reverse'
}

const containerClasses = computed(() =>
  cn(positionClasses[props.position])
)

// Toast styling with improved error/danger variant
const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all',
  {
    variants: {
      variant: {
        default: 'border border-(--ui-border) bg-(--ui-surface-muted) text-(--ui-text) dark:border-(--ui-border-strong) dark:bg-(--ui-surface-soft) dark:text-(--ui-text-soft)',
        info: 'border-[color:color-mix(in oklab, var(--ui-primary), transparent 80%)] bg-(--ui-primary-soft) text-(--ui-primary) dark:border-[color:color-mix(in oklab, var(--ui-primary), transparent 70%)] dark:bg-(--ui-primary-strong) dark:text-(--ui-primary-soft)',
        success: 'border border-(--ui-success-soft) bg-(--ui-success-soft) text-(--ui-success) dark:border-(--ui-success-soft) dark:bg-(--ui-success-soft) dark:text-(--ui-success)',
        warning: 'border-[color:color-mix(in oklab, var(--ui-warning), transparent 80%)] bg-(--ui-warning-soft) text-(--ui-warning) dark:border-[color:color-mix(in oklab, var(--ui-warning), transparent 70%)] dark:bg-(--ui-warning-strong) dark:text-(--ui-warning-soft)',
        error: 'border-[color:color-mix(in oklab, var(--ui-danger), transparent 70%)] bg-(--ui-danger-soft) text-(--ui-danger) dark:border-[color:color-mix(in oklab, var(--ui-danger), transparent 60%)] dark:bg-(--ui-danger-strong) dark:text-(--ui-danger-soft) ring-1 ring-[color:color-mix(in oklab, var(--ui-danger), transparent 80%)] dark:ring-[color:color-mix(in oklab, var(--ui-danger), transparent 70%)]',
        loading: 'border border-border animate-pulse bg-(--ui-surface-strong) text-(--ui-text) dark:border-(--ui-border-strong) dark:bg-(--ui-surface-soft) dark:text-(--ui-text-soft)'
      }
    },
    defaultVariants: { variant: 'default' }
  }
)

const toastClasses = (toast) => cn(toastVariants({ variant: toast.variant }))

// Comprehensive icon mapping for all toast types
const iconMap = {
  default: 'bell',
  info: 'info',
  success: 'check-circle',
  warning: 'triangle-exclamation',
  error: 'circle-exclamation',
  loading: 'loader'
}

// Icon color mapping with proper error styling
const iconColorMap = {
  default: 'text-muted-foreground',
  info: 'text-(--ui-primary) dark:text-(--ui-primary-soft)',
  success: 'text-(--ui-success) dark:text-(--ui-success-soft)',
  warning: 'text-(--ui-warning) dark:text-(--ui-warning-soft)',
  error: 'text-(--ui-danger) dark:text-(--ui-danger-soft)',
  loading: 'text-muted-foreground animate-spin'
}

const getIconName = (toast) => toast.icon || iconMap[toast.variant] || iconMap.default
const getIconClasses = (toast) => {
  const baseClasses = iconColorMap[toast.variant] || iconColorMap.default
  // Add spinning animation for loading icon
  return toast.variant === 'loading' ? `${baseClasses} animate-spin` : baseClasses
}

// Always show icons for all variants to provide visual distinction
const showIcon = (toast) => toast.icon !== false

// Handle dismissible logic
const isDismissible = (toast) => toast.dismissible !== false && (toast.closeButton || props.closeButton || toast.dismissible)
</script>
