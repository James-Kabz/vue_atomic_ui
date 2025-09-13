<template>
  <tr 
    :class="rowClasses"
    @click="handleClick"
    :data-state="selected ? 'selected' : undefined"
  >
    <slot />
  </tr>
</template>

<script setup>
import { computed } from 'vue'
import { cva } from 'class-variance-authority'
import { cn } from '../utils/cn.js'

const props = defineProps({
  selected: Boolean,
  clickable: Boolean,
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'hover'].includes(value)
  }
})

const emit = defineEmits(['click'])

const rowVariants = cva('border-b transition-colors', {
  variants: {
    variant: {
      default: 'hover:bg-muted/50',
      hover: 'hover:bg-muted/50 data-[state=selected]:bg-muted'
    },
    clickable: {
      true: 'cursor-pointer',
      false: ''
    },
    selected: {
      true: 'bg-muted',
      false: ''
    }
  }
})

const rowClasses = computed(() => 
  cn(rowVariants({ 
    variant: props.variant, 
    clickable: props.clickable,
    selected: props.selected 
  }))
)

const handleClick = (event) => {
  if (props.clickable) {
    emit('click', event)
  }
}
</script>
