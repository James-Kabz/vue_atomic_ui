<template>
  <div class="relative">
    <select
      :id="id || selectId"
      ref="selectRef"
      :value="modelValue"
      :disabled="disabled"
      :required="required"
      :class="selectClasses"
      :aria-describedby="ariaDescribedBy"
      :aria-invalid="hasError"
      @change="handleChange"
      @blur="handleBlur"
      @focus="handleFocus"
    >
      <option v-if="placeholder" value="" disabled>
        {{ placeholder }}
      </option>

      <slot />
    </select>

    <!-- Custom dropdown arrow -->
    <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
      <ChevronDownIcon :class="iconClasses" />
    </div>
  </div>
</template>

<script setup>
import { computed, ref, useId } from 'vue'
import { cva } from 'class-variance-authority'
import { cn } from '../utils/cn.js'

// ChevronDown as inline component
const ChevronDownIcon = {
  template: `
    <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  `
}

const props = defineProps({
  modelValue: [String, Number, Boolean],
  placeholder: String,
  disabled: Boolean,
  required: Boolean,
  error: String,
  id: String,
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v)
  },
  variant: {
    type: String,
    default: 'default',
    validator: (v) => ['default', 'error', 'success'].includes(v)
  }
})

const emit = defineEmits(['update:modelValue', 'change', 'blur', 'focus'])
const selectRef = ref(null)
const selectId = useId()

// events
const handleChange = (event) => {
  const value = event.target.value
  emit('update:modelValue', value)
  emit('change', value)
}
const handleBlur = (event) => emit('blur', event)
const handleFocus = (event) => emit('focus', event)

// accessibility
const hasError = computed(() => !!props.error || props.variant === 'error')
const ariaDescribedBy = computed(() =>
  props.error ? `${selectId}-error` : undefined
)

// variants with cva
const selectVariants = cva(
  'block w-full rounded-lg border bg-background pr-10 appearance-none transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed',
  {
    variants: {
      size: {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-3 py-2 text-sm',
        lg: 'px-4 py-3 text-base'
      },
      variant: {
        default: 'border-slate-300 focus:border-blue-500 focus:ring-blue-500',
        error: 'border-red-300 focus:border-red-500 focus:ring-red-500',
        success:
          'border-green-300 focus:border-green-500 focus:ring-green-500'
      }
    },
    defaultVariants: {
      size: 'md',
      variant: 'default'
    }
  }
)

const selectClasses = computed(() =>
  cn(selectVariants({ size: props.size, variant: props.variant }))
)

const iconClasses = computed(() =>
  cn({
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }[props.size])
)

// expose focus/blur
defineExpose({
  focus: () => selectRef.value?.focus(),
  blur: () => selectRef.value?.blur()
})
</script>
