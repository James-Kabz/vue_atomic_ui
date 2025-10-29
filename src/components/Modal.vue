<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center"
        @click="handleBackdropClick"
      >
        <div
          :class="cn(modalVariants({ size, height }), resizable ? 'resize' : '')"
          :style="resizable ? 'min-width: 400px; min-height: 200px;' : ''"
        >
          <button
            v-if="showClose"
            aria-label="Close"
            class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            @click="closeModal"
          >
            <Icon
              icon="x"
              class="h-4 w-4"
            />
            <span class="sr-only">Close</span>
          </button>

          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { watch, onUnmounted } from 'vue'
import { cva } from 'class-variance-authority'
import { cn } from '@/utils/cn'
import Icon from './Icon.vue'

const modalVariants = cva(
  'relative w-full overflow-y-auto border bg-white p-6 shadow-lg duration-200 sm:rounded-lg',
  {
    variants: {
      size: {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        '3xl': 'max-w-3xl',
        '4xl': 'max-w-4xl',
        '5xl': 'max-w-5xl',
        '6xl': 'max-w-6xl',
        '7xl': 'max-w-7xl',
        '8xl': 'max-w-8xl',
        full: 'max-w-full',
      },
      height: {
        auto: '',
        sm: 'max-h-[50vh]',
        md: 'max-h-[70vh]',
        lg: 'max-h-[80vh]',
        xl: 'max-h-[90vh]',
        '2xl': 'max-h-[90vh]',
        '3xl': 'max-h-[90vh]',
        '4xl': 'max-h-[100vh]',
        '5xl': 'max-h-[100vh]',
        '6xl': 'max-h-[100vh]',
        '7xl': 'max-h-[100vh]',
        '8xl': 'max-h-[100vh]',
        full: 'max-h-[100vh]',
      },
    },
    defaultVariants: {
      size: '4xl',
      height: 'auto',
    },
  }
)

const props = defineProps({
  modelValue: Boolean,
  showClose: {
    type: Boolean,
    default: true
  },
  closeOnBackdrop: {
    type: Boolean,
    default: true
  },
  size: {
    type: String,
    default: '4xl',
    validator: (value) => ['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl', 'full'].includes(value)
  },
  height: {
    type: String,
    default: 'auto',
    validator: (value) => ['auto', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl', 'full'].includes(value)
  },
  resizable: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'close'])

const closeModal = () => {
  emit('update:modelValue', false)
  emit('close')
}

const handleBackdropClick = (event) => {
  if (props.closeOnBackdrop && event.target === event.currentTarget) {
    closeModal()
  }
}

// Handle escape key - FIXED VERSION
let handleEscape = null

watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    handleEscape = (event) => {
      if (event.key === 'Escape') {
        closeModal()
      }
    }
    document.addEventListener('keydown', handleEscape)
  } else {
    if (handleEscape) {
      document.removeEventListener('keydown', handleEscape)
      handleEscape = null
    }
  }
}, { immediate: true })

onUnmounted(() => {
  if (handleEscape) {
    document.removeEventListener('keydown', handleEscape)
    handleEscape = null
  }
})
</script>