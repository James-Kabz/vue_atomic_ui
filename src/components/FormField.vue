<template>
  <div :class="fieldClasses">
    <!-- Label -->
    <Label v-if="label" :for="fieldId" :required="required">
      {{ label }}
    </Label>

    <!-- Optional Description -->
    <p v-if="description" class="text-sm text-slate-600">
      {{ description }}
    </p>

    <!-- Input Wrapper -->
    <div class="relative">
      <slot
        :fieldId="fieldId"
        :hasError="hasError"
        :ariaDescribedBy="ariaDescribedBy"
      />
    </div>

    <!-- Error Message -->
    <Transition
      enter-active-class="transition-all duration-200"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div
        v-if="hasError"
        :id="`${fieldId}-error`"
        class="flex items-start gap-2 text-sm text-red-600 mt-1"
        role="alert"
        aria-live="polite"
      >
        <ExclamationCircleIcon class="w-4 h-4 flex-shrink-0 mt-0.5" />
        <span>{{ error }}</span>
      </div>
    </Transition>

    <!-- Help Text -->
    <p
      v-if="hint && !hasError"
      :id="`${fieldId}-help`"
      class="mt-1 text-sm text-muted-foreground"
    >
      {{ hint }}
    </p>

    <!-- Success Message -->
    <Transition
      enter-active-class="transition-all duration-200"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div
        v-if="success && !hasError"
        class="flex items-start gap-2 text-sm text-green-600 mt-1"
      >
        <CheckCircleIcon class="w-4 h-4 flex-shrink-0 mt-0.5" />
        <span>{{ success }}</span>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed, useId } from 'vue'
import { cva } from 'class-variance-authority'
import { cn } from '../utils/cn.js'
import Label from './Label.vue'

// Icons
const ExclamationCircleIcon = {
  template: `
    <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
    </svg>
  `
}
const CheckCircleIcon = {
  template: `
    <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  `
}

const props = defineProps({
  id: String,
  label: String,
  description: String,
  error: String,
  hint: String,
  success: String,
  required: Boolean,
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'compact'].includes(value)
  }
})

const fieldId = computed(() => props.id || useId())
const hasError = computed(() => !!props.error)

const ariaDescribedBy = computed(() => {
  const ids = []
  if (props.error) {
    ids.push(`${fieldId.value}-error`)
  } else if (props.hint) {
    ids.push(`${fieldId.value}-help`)
  }
  return ids.length > 0 ? ids.join(' ') : undefined
})

// Variants
const fieldVariants = cva('space-y-2', {
  variants: {
    variant: {
      default: 'space-y-2',
      compact: 'space-y-1'
    }
  }
})
const fieldClasses = computed(() =>
  cn(fieldVariants({ variant: props.variant }))
)
</script>
