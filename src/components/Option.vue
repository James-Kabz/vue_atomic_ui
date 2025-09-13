<template>
  <div 
    :class="optionClasses"
    @click="handleClick"
    @keydown.enter="handleClick"
    @keydown.space.prevent="handleClick"
    tabindex="0"
    role="option"
    :aria-selected="selected"
  >
    <div class="flex items-center gap-2">
      <Icon v-if="icon" :name="icon" class="h-4 w-4" />
      <span>{{ label }}</span>
    </div>
    <Icon v-if="selected" name="Check" class="h-4 w-4 text-primary" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { cva } from 'class-variance-authority'
import { cn } from '../utils/cn.js'
import Icon from './Icon.vue'

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  value: {
    required: true
  },
  icon: String,
  selected: Boolean,
  disabled: Boolean,
  class: String
})

const emit = defineEmits(['select'])

const optionVariants = cva(
  'flex items-center justify-between px-3 py-2 text-sm cursor-pointer transition-colors focus:outline-none focus:bg-accent focus:text-accent-foreground',
  {
    variants: {
      selected: {
        true: 'bg-accent text-accent-foreground',
        false: 'hover:bg-accent hover:text-accent-foreground'
      },
      disabled: {
        true: 'cursor-not-allowed opacity-50 hover:bg-transparent',
        false: ''
      }
    }
  }
)

const optionClasses = computed(() => 
  cn(
    optionVariants({ 
      selected: props.selected, 
      disabled: props.disabled 
    }), 
    props.class
  )
)

const handleClick = () => {
  if (!props.disabled) {
    emit('select', props.value)
  }
}
</script>
