<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-50 flex flex-col space-y-2">
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="transform translate-x-full opacity-0"
        enter-to-class="transform translate-x-0 opacity-100"
        leave-active-class="transition-all duration-300 ease-in"
        leave-from-class="transform translate-x-0 opacity-100"
        leave-to-class="transform translate-x-full opacity-0"
      >
        <div
          v-if="visible"
          :class="toastClasses"
          role="alert"
          :aria-live="variant === 'destructive' ? 'assertive' : 'polite'"
        >
          <div class="flex items-center space-x-2">
            <Icon v-if="showIcon" :name="iconName" :class="iconClasses" />
            <div class="flex-1">
              <div v-if="title" class="text-sm font-medium">{{ title }}</div>
              <div v-if="message" class="text-sm" :class="{ 'mt-1': title }">{{ message }}</div>
              <slot />
            </div>
            <button
              v-if="dismissible"
              @click="dismiss"
              class="rounded-md p-1 hover:bg-black/5 focus:outline-none focus:ring-2"
            >
              <Icon name="x" class="h-4 w-4" />
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { cva } from 'class-variance-authority'
import { cn } from '../utils/cn.js'
import Icon from './Icon.vue'

const props = defineProps({
  title: String,
  message: String,
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'success', 'warning', 'destructive'].includes(value)
  },
  dismissible: {
    type: Boolean,
    default: true
  },
  showIcon: {
    type: Boolean,
    default: true
  },
  duration: {
    type: Number,
    default: 5000
  }
})

const emit = defineEmits(['dismiss'])

const visible = ref(true)

const toastVariants = cva(
  'pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-background p-4 shadow-lg ring-1 ring-black ring-opacity-5',
  {
    variants: {
      variant: {
        default: 'border border-border',
        success: 'border border-green-200 bg-green-50 text-green-800',
        warning: 'border border-yellow-200 bg-yellow-50 text-yellow-800',
        destructive: 'border border-red-200 bg-red-50 text-red-800'
      }
    }
  }
)

const iconVariants = {
  default: 'info',
  success: 'check-circle',
  warning: 'alert-triangle',
  destructive: 'alert-circle'
}

const iconColorVariants = cva('h-4 w-4', {
  variants: {
    variant: {
      default: 'text-muted-foreground',
      success: 'text-green-600',
      warning: 'text-yellow-600',
      destructive: 'text-red-600'
    }
  }
})

const toastClasses = computed(() => 
  cn(toastVariants({ variant: props.variant }))
)

const iconName = computed(() => iconVariants[props.variant])
const iconClasses = computed(() => iconColorVariants({ variant: props.variant }))

const dismiss = () => {
  visible.value = false
  emit('dismiss')
}

onMounted(() => {
  if (props.duration > 0) {
    setTimeout(() => {
      dismiss()
    }, props.duration)
  }
})
</script>
