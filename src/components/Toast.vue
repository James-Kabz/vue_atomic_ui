<!-- components/Toaster.vue -->
<template>
  <Teleport to="body">
    <div
      :class="cn(
        containerClasses,
        'fixed z-100 flex max-h-screen w-full p-4 md:max-w-[420px] pointer-events-none'
      )"
    >
      <TransitionGroup
        enter-active-class="transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
        enter-from-class="transform translate-x-full opacity-0 scale-90"
        enter-to-class="transform translate-x-0 opacity-100 scale-100"
        leave-active-class="transition-all duration-300 ease-[cubic-bezier(0.4,0,1,1)]"
        leave-from-class="transform translate-x-0 opacity-100 scale-100"
        leave-to-class="transform translate-x-full opacity-0 scale-90"
        move-class="transition-all duration-300 ease-out"
        tag="div"
        class="w-full space-y-3"
      >
        <div
          v-for="toast in visibleToastsList"
          :key="toast.id"
          :class="toastClasses(toast)"
          role="alert"
          :aria-live="toast.variant === 'error' ? 'assertive' : 'polite'"
          class="group pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-xl border p-4 shadow-lg transition-all hover:shadow-xl"
        >
          <!-- Icon with animated background glow -->
          <div
            v-if="showIcon(toast)"
            :class="cn(
              'relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-all duration-300',
              getIconBackgroundClasses(toast)
            )"
          >
            <Icon
              :icon="getIconName(toast)"
              :class="cn(
                'h-5 w-5 transition-transform duration-300 group-hover:scale-110',
                getIconClasses(toast)
              )"
            />
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0 pt-0.5">
            <div
              v-if="toast.title"
              class="text-sm font-semibold leading-tight text-(--ui-text) mb-1"
            >
              {{ toast.title }}
            </div>
            <div
              v-if="toast.message || toast.description"
              class="text-sm leading-relaxed text-(--ui-text-muted)"
            >
              {{ toast.message || toast.description }}
            </div>

            <!-- Custom component slot -->
            <component
              :is="toast.component"
              v-if="toast.component"
              v-bind="toast.componentProps"
              class="mt-3"
            />

            <!-- Action Button -->
            <button
              v-if="toast.action"
              class="mt-3 inline-flex items-center gap-1.5 text-xs font-medium transition-colors"
              :class="getActionButtonClasses(toast)"
              @click="toast.action.onClick"
            >
              {{ toast.action.label }}
              <Icon
                icon="arrow-right"
                class="h-3 w-3"
              />
            </button>
          </div>

          <!-- Close Button -->
          <button
            v-if="isDismissible(toast)"
            class="absolute right-2 top-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-(--ui-text-soft) opacity-0 transition-all hover:bg-black/5 dark:hover:bg-white/5 hover:text-(--ui-text) focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-(--ui-ring) focus:ring-offset-1 group-hover:opacity-100"
            aria-label="Dismiss"
            @click="dismiss(toast.id)"
          >
            <Icon
              icon="x"
              class="h-4 w-4"
            />
          </button>

          <!-- Progress bar for auto-dismiss -->
          <div
            v-if="toast.duration && toast.duration > 0"
            class="absolute bottom-0 left-0 right-0 h-0.5 overflow-hidden"
          >
            <div
              :class="cn(
                'h-full origin-left animate-toast-progress',
                getProgressBarClasses(toast)
              )"
              :style="{ animationDuration: `${toast.duration}ms` }"
            />
          </div>
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
    default: 'top-right',
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
    default: true
  },
  expand: {
    type: Boolean,
    default: false
  },
  visibleToasts: {
    type: Number,
    default: 4
  },
  closeButton: {
    type: Boolean,
    default: true
  }
})

const { toasts, dismiss } = useToaster()

// Limit visible toasts
const visibleToastsList = computed(() => 
  toasts.value.slice(0, props.visibleToasts)
)

// Position classes
const positionClasses = {
  'top-left': 'top-0 left-0 flex-col items-start',
  'top-center': 'top-0 left-1/2 -translate-x-1/2 flex-col items-center',
  'top-right': 'top-0 right-0 flex-col items-end',
  'bottom-left': 'bottom-0 left-0 flex-col-reverse items-start',
  'bottom-center': 'bottom-0 left-1/2 -translate-x-1/2 flex-col-reverse items-center',
  'bottom-right': 'bottom-0 right-0 flex-col-reverse items-end'
}

const containerClasses = computed(() =>
  cn(positionClasses[props.position])
)

// Toast styling with refined variants
const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-xl border backdrop-blur-xl bg-white/95 dark:bg-(--ui-surface)/95 text-(--ui-text) transition-all',
  {
    variants: {
      variant: {
        default: 'border-(--ui-border) shadow-sm',
        info: 'border-blue-200 dark:border-blue-900/50 bg-blue-50/80 dark:bg-blue-950/30',
        success: 'border-green-200 dark:border-green-900/50 bg-green-50/80 dark:bg-green-950/30',
        warning: 'border-amber-200 dark:border-amber-900/50 bg-amber-50/80 dark:bg-amber-950/30',
        error: 'border-red-200 dark:border-red-900/50 bg-red-50/80 dark:bg-red-950/30',
        loading: 'border-(--ui-border) shadow-sm'
      }
    },
    defaultVariants: { variant: 'default' }
  }
)

const toastClasses = (toast) => cn(toastVariants({ variant: toast.variant }))

// Icon mapping
const iconMap = {
  default: 'bell',
  info: 'info',
  success: 'check-circle',
  warning: 'triangle-exclamation',
  error: 'circle-xmark',
  loading: 'loader-circle'
}

// Icon color classes with refined palette
const iconColorMap = {
  default: 'text-(--ui-text-muted)',
  info: 'text-blue-600 dark:text-blue-400',
  success: 'text-green-600 dark:text-green-400',
  warning: 'text-amber-600 dark:text-amber-400',
  error: 'text-red-600 dark:text-red-400',
  loading: 'text-(--ui-text-muted)'
}

// Icon background classes for better visual hierarchy
const iconBackgroundMap = {
  default: 'bg-(--ui-surface-soft)',
  info: 'bg-blue-100 dark:bg-blue-900/30',
  success: 'bg-green-100 dark:bg-green-900/30',
  warning: 'bg-amber-100 dark:bg-amber-900/30',
  error: 'bg-red-100 dark:bg-red-900/30',
  loading: 'bg-(--ui-surface-soft)'
}

// Progress bar colors
const progressBarMap = {
  default: 'bg-(--ui-border-strong)',
  info: 'bg-blue-500',
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  error: 'bg-red-500',
  loading: 'bg-(--ui-border-strong)'
}

// Action button colors
const actionButtonMap = {
  default: 'text-(--ui-primary) hover:text-(--ui-primary-strong)',
  info: 'text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300',
  success: 'text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300',
  warning: 'text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300',
  error: 'text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300',
  loading: 'text-(--ui-primary) hover:text-(--ui-primary-strong)'
}

const getIconName = (toast) => toast.icon || iconMap[toast.variant] || iconMap.default
const getIconClasses = (toast) => {
  const baseClasses = iconColorMap[toast.variant] || iconColorMap.default
  return toast.variant === 'loading' ? `${baseClasses} animate-spin` : baseClasses
}
const getIconBackgroundClasses = (toast) => iconBackgroundMap[toast.variant] || iconBackgroundMap.default
const getProgressBarClasses = (toast) => progressBarMap[toast.variant] || progressBarMap.default
const getActionButtonClasses = (toast) => actionButtonMap[toast.variant] || actionButtonMap.default

const showIcon = (toast) => toast.icon !== false
const isDismissible = (toast) => toast.dismissible !== false && (toast.closeButton || props.closeButton || toast.dismissible)
</script>

<style scoped>
@keyframes toast-progress {
  from {
    transform: scaleX(1);
  }
  to {
    transform: scaleX(0);
  }
}

.animate-toast-progress {
  animation: toast-progress linear forwards;
}
</style>