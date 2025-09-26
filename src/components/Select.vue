<template>
  <select
    :id="id"
    :name="name"
    :value="modelValue"
    @change="$emit('update:modelValue', $event.target.value)"
    :disabled="disabled"
    :required="required"
    :class="selectClasses"
    v-bind="$attrs"
  >
    <slot />
  </select>
</template>

<script setup>
import { computed } from 'vue'
import { cva } from 'class-variance-authority'
import { cn } from '../utils/cn.js'

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean],
    default: ''
  },
  id: {
    type: String,
    default: null
  },
  name: {
    type: String,
    default: null
  },
  disabled: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  },
  class: String
})

defineEmits(['update:modelValue'])

const selectVariants = cva(
  'border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm min-w-[60px] focus:border-transparent',
  {
    variants: {
      disabled: {
        true: 'bg-gray-100 cursor-not-allowed opacity-50',
        false: 'bg-white hover:border-slate-400'
      }
    }
  }
)

const selectClasses = computed(() =>
  cn(
    selectVariants({ disabled: props.disabled }),
    'px-3 py-2',
    props.class
  )
)
</script>
