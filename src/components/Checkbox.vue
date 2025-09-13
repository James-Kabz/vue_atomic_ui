<template>
  <div class="flex items-center space-x-2">
    <button
      type="button"
      role="checkbox"
      :aria-checked="isChecked"
      :disabled="disabled"
      :class="checkboxClasses"
      @click="toggle"
    >
      <Icon 
        v-if="isChecked" 
        name="Check" 
        class="h-4 w-4 text-primary-foreground" 
      />
    </button>
    <label 
      v-if="label" 
      :class="labelClasses"
      @click="toggle"
    >
      {{ label }}
    </label>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { cva } from 'class-variance-authority'
import { cn } from '../utils/cn.js'
import Icon from './Icon.vue'

const props = defineProps({
  modelValue: Boolean,
  label: String,
  disabled: Boolean,
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  class: String
})

const emit = defineEmits(['update:modelValue'])

const isChecked = computed(() => props.modelValue)

const checkboxVariants = cva(
  'peer shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
  {
    variants: {
      size: {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6'
      }
    }
  }
)

const checkboxClasses = computed(() => 
  cn(
    checkboxVariants({ size: props.size }),
    isChecked.value && 'bg-primary text-primary-foreground',
    props.disabled && 'cursor-not-allowed opacity-50',
    props.class
  )
)

const labelClasses = computed(() => 
  cn(
    'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
    !props.disabled && 'cursor-pointer'
  )
)

const toggle = () => {
  if (!props.disabled) {
    emit('update:modelValue', !props.modelValue)
  }
}
</script>
