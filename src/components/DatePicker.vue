<template>
  <div class="relative">
    <input
      :id="id"
      :value="modelValue"
      type="date"
      :class="inputClasses"
      :disabled="disabled"
      :required="required"
      :min="min"
      :max="max"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <Icon 
      name="calendar" 
      class="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-400"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { cva } from 'class-variance-authority'
import { cn } from '../utils/cn.js'
import Icon from './Icon.vue'

const props = defineProps({
  modelValue: String,
  id: String,
  disabled: Boolean,
  required: Boolean,
  min: String,
  max: String,
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'outline', 'ghost'].includes(value)
  },
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['sm', 'default', 'lg'].includes(value)
  }
})

defineEmits(['update:modelValue'])

const inputVariants = cva(
  'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pr-10',
  {
    variants: {
      variant: {
        default: 'border-input',
        outline: 'border-2 border-primary',
        ghost: 'border-transparent bg-transparent'
      },
      size: {
        sm: 'h-9 px-2 text-xs',
        default: 'h-10 px-3',
        lg: 'h-11 px-4 text-base'
      }
    }
  }
)

const inputClasses = computed(() => 
  cn(inputVariants({ variant: props.variant, size: props.size }))
)
</script>
