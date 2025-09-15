<!-- components/Toaster.vue -->
<template>
  <Teleport to="body">
    <div :class="cn(
      containerClasses,
      'fixed z-[100] flex max-h-screen w-full p-4 md:max-w-[420px]'
    )">

      <TransitionGroup enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="transform translate-x-full opacity-0 scale-95"
        enter-to-class="transform translate-x-0 opacity-100 scale-100"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="transform translate-x-0 opacity-100 scale-100"
        leave-to-class="transform translate-x-full opacity-0 scale-95" move-class="transition-all duration-200"
        tag="div" class="space-y-2">
        <div v-for="toast in toasts" :key="toast.id" :class="toastClasses(toast)" role="alert"
          :aria-live="toast.variant === 'destructive' ? 'assertive' : 'polite'"
          class="group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all">
          <!-- Icon -->
          <Icon v-if="showIcon(toast)" :name="getIconName(toast)" :class="getIconClasses(toast)"
            class="h-4 w-4 shrink-0" />

          <!-- Content -->
          <div class="flex-1 grid gap-1">
            <div v-if="toast.title" class="text-sm font-semibold">
              {{ toast.title }}
            </div>
            <div v-if="toast.message" class="text-sm opacity-90">
              {{ toast.message }}
            </div>
            <div v-if="toast.description" class="text-sm opacity-90">
              {{ toast.description }}
            </div>

            <!-- Custom component slot -->
            <component v-if="toast.component" :is="toast.component" v-bind="toast.componentProps" />
          </div>

          <!-- Action Button -->
          <button v-if="toast.action" @click="toast.action.onClick"
            class="inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-xs font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
            {{ toast.action.label }}
          </button>

          <!-- Close Button -->
          <button v-if="isDismissible(toast)" @click="dismiss(toast.id)"
            class="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100">
            <Icon name="x" class="h-4 w-4" />
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

// Toast styling
const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all',
  {
    variants: {
      variant: {
        default: 'border bg-background text-foreground',
        destructive: 'destructive group border-destructive bg-destructive text-destructive-foreground',
        success: 'border-green-500/20 bg-green-50 text-green-900 dark:border-green-500/30 dark:bg-green-950 dark:text-green-50',
        warning: 'border-yellow-500/20 bg-yellow-50 text-yellow-900 dark:border-yellow-500/30 dark:bg-yellow-950 dark:text-yellow-50'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

const toastClasses = (toast) => cn(toastVariants({ variant: toast.variant }))

// Icon handling
const iconMap = {
  default: 'info',
  success: 'check-circle',
  warning: 'alert-triangle',
  destructive: 'alert-circle'
}

const iconColorMap = {
  default: 'text-muted-foreground',
  success: 'text-green-600 dark:text-green-400',
  warning: 'text-yellow-600 dark:text-yellow-400',
  destructive: 'text-destructive'
}

const getIconName = (toast) => toast.icon || iconMap[toast.variant] || iconMap.default
const getIconClasses = (toast) => iconColorMap[toast.variant] || iconColorMap.default
const showIcon = (toast) => toast.icon !== false && (toast.icon || toast.variant !== 'default' || props.richColors)
const isDismissible = (toast) => toast.dismissible !== false && (toast.closeButton || props.closeButton || toast.dismissible)
</script>