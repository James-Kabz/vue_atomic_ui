<template>
  <div :class="cn(fieldVariants({ size }), $attrs.class)">
    <!-- Label -->
    <label
      v-if="label"
      :for="fieldId"
      :class="cn(labelVariants({ size }))"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1" aria-label="required">*</span>
    </label>

    <!-- Description -->
    <p v-if="description" :class="cn(descriptionVariants({ size }))">
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
        :class="cn(messageVariants({ size, intent: 'error' }))"
        role="alert"
        aria-live="polite"
      >
        <ExclamationCircleIcon class="w-4 h-4 flex-shrink-0 mt-0.5" />
        <span>{{ error }}</span>
      </div>
    </Transition>

    <!-- Help Text -->
    <p
      v-if="helpText && !hasError"
      :id="`${fieldId}-help`"
      :class="cn(helpVariants({ size }))"
    >
      {{ helpText }}
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
        :class="cn(messageVariants({ size, intent: 'success' }))"
      >
        <CheckCircleIcon class="w-4 h-4 flex-shrink-0 mt-0.5" />
        <span>{{ success }}</span>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed, useId } from "vue"
import { cva } from "class-variance-authority"
import { cn } from "../utils/cn.js"

// Icons
const ExclamationCircleIcon = {
  template: `
    <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
    </svg>
  `,
}
const CheckCircleIcon = {
  template: `
    <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  `,
}

const props = defineProps({
  label: String,
  description: String,
  error: String,
  success: String,
  helpText: String,
  required: { type: Boolean, default: false },
  size: {
    type: String,
    default: "md",
    validator: (v) => ["sm", "md", "lg"].includes(v),
  },
  id: String,
})

const fieldId = useId()
const hasError = computed(() => !!props.error)

const ariaDescribedBy = computed(() => {
  const ids = []
  if (props.error) ids.push(`${fieldId}-error`)
  else if (props.helpText) ids.push(`${fieldId}-help`)
  return ids.length > 0 ? ids.join(" ") : undefined
})

/* ------------------ CVA Variants ------------------ */

const fieldVariants = cva("", {
  variants: {
    size: {
      sm: "space-y-1",
      md: "space-y-2",
      lg: "space-y-3",
    },
  },
  defaultVariants: { size: "md" },
})

const labelVariants = cva("block text-slate-900", {
  variants: {
    size: {
      sm: "text-xs font-medium",
      md: "text-sm font-medium",
      lg: "text-base font-medium",
    },
  },
  defaultVariants: { size: "md" },
})

const descriptionVariants = cva("text-slate-600", {
  variants: {
    size: {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
    },
  },
  defaultVariants: { size: "md" },
})

const messageVariants = cva("flex items-start gap-2", {
  variants: {
    size: {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-sm", // same as before
    },
    intent: {
      error: "text-red-600",
      success: "text-green-600",
    },
  },
  defaultVariants: { size: "md", intent: "error" },
})

const helpVariants = cva("text-slate-500", {
  variants: {
    size: {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-sm",
    },
  },
  defaultVariants: { size: "md" },
})
</script>
