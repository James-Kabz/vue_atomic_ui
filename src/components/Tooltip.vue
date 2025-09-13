<template>
  <div class="relative inline-block" @mouseenter="show" @mouseleave="hide">
    <slot />
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isVisible"
        :class="tooltipClasses"
        role="tooltip"
      >
        {{ content }}
        <div :class="arrowClasses" />
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { cva } from 'class-variance-authority'
import { cn } from '../utils/cn.js'

const props = defineProps({
  content: {
    type: String,
    required: true
  },
  placement: {
    type: String,
    default: 'top',
    validator: (value) => ['top', 'bottom', 'left', 'right'].includes(value)
  },
  delay: {
    type: Number,
    default: 0
  },
  class: String
})

const isVisible = ref(false)
let timeoutId = null

const tooltipVariants = cva(
  'absolute z-50 px-3 py-1.5 text-sm text-primary-foreground bg-primary rounded-md shadow-md pointer-events-none whitespace-nowrap',
  {
    variants: {
      placement: {
        top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
      }
    }
  }
)

const arrowVariants = cva(
  'absolute w-2 h-2 bg-primary transform rotate-45',
  {
    variants: {
      placement: {
        top: 'top-full left-1/2 transform -translate-x-1/2 -mt-1',
        bottom: 'bottom-full left-1/2 transform -translate-x-1/2 -mb-1',
        left: 'left-full top-1/2 transform -translate-y-1/2 -ml-1',
        right: 'right-full top-1/2 transform -translate-y-1/2 -mr-1'
      }
    }
  }
)

const tooltipClasses = computed(() => 
  cn(tooltipVariants({ placement: props.placement }), props.class)
)

const arrowClasses = computed(() => 
  arrowVariants({ placement: props.placement })
)

const show = () => {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
  
  timeoutId = setTimeout(() => {
    isVisible.value = true
  }, props.delay)
}

const hide = () => {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
  
  isVisible.value = false
}
</script>
