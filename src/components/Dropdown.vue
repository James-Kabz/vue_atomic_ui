<template>
  <div class="relative" ref="dropdownRef">
    <button
      :class="triggerClasses"
      @click="toggleDropdown"
      :aria-expanded="isOpen"
      :aria-haspopup="true"
    >
      <slot name="trigger">
        <span>{{ triggerText }}</span>
        <Icon name="chevron-down" class="ml-2 h-4 w-4" />
      </slot>
    </button>
    
    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        :class="dropdownClasses"
        role="menu"
        :aria-orientation="'vertical'"
      >
        <slot />
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { cva } from 'class-variance-authority'
import { cn } from '../utils/cn.js'
import Icon from './Icon.vue'

const props = defineProps({
  triggerText: {
    type: String,
    default: 'Options'
  },
  placement: {
    type: String,
    default: 'bottom-start',
    validator: (value) => ['bottom-start', 'bottom-end', 'top-start', 'top-end'].includes(value)
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'outline', 'ghost'].includes(value)
  }
})

const isOpen = ref(false)
const dropdownRef = ref(null)

const triggerVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground'
      }
    }
  }
)

const dropdownVariants = cva(
  'absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md',
  {
    variants: {
      placement: {
        'bottom-start': 'top-full left-0 mt-1',
        'bottom-end': 'top-full right-0 mt-1',
        'top-start': 'bottom-full left-0 mb-1',
        'top-end': 'bottom-full right-0 mb-1'
      }
    }
  }
)

const triggerClasses = computed(() => 
  cn(triggerVariants({ variant: props.variant }), 'h-10 px-4 py-2')
)

const dropdownClasses = computed(() => 
  cn(dropdownVariants({ placement: props.placement }))
)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const closeDropdown = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})
</script>
