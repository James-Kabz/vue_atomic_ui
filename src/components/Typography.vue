<template>
  <component
    :is="tag"
    :class="typographyClasses"
    v-bind="$attrs"
  >
    <slot />
    <span
      v-if="required"
      class="text-red-600 ml-1"
      aria-hidden="true"
    >*</span>
  </component>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'body-md',
    validator: (value) =>
      [
        'body-xs', 'body-sm', 'body-md', 'body-lg',
        'text-xs', 'text-sm', 'text-md', 'text-lg',
        'display-sm', 'display-md', 'display-lg',
        'caption', 'overline'
      ].includes(value)
  },
  color: {
    type: String,
    default: 'default',
    validator: (value) => [
      'default', 'primary', 'secondary',
      'success', 'warning', 'danger', 'muted'
    ].includes(value)
  },
  align: {
    type: String,
    default: 'left',
    validator: (value) =>
      ['left', 'center', 'right', 'justify'].includes(value)
  },
  italic: Boolean,
  underline: Boolean,
  truncate: Boolean,
  noWrap: Boolean,

  /** 👇 New */
  required: {
    type: Boolean,
    default: false
  }
})

const tag = computed(() => {
  const tagMap = {
    'body-xs': 'p',
    'body-sm': 'p',
    'body-md': 'p',
    'body-lg': 'p',
    'text-xs': 'h6',
    'text-sm': 'h5',
    'text-md': 'h4',
    'text-lg': 'h3',
    'display-sm': 'h2',
    'display-md': 'h1',
    'display-lg': 'h1',
    caption: 'span',
    overline: 'span'
  }
  return tagMap[props.variant] || 'p'
})

const variantClasses = computed(() => {
  const variants = {
    'body-xs': 'text-xs leading-normal',
    'body-sm': 'text-sm leading-relaxed',
    'body-md': 'text-base leading-relaxed',
    'body-lg': 'text-lg leading-relaxed',
    'text-xs': 'text-md font-semibold leading-snug',
    'text-sm': 'text-xl font-semibold leading-snug',
    'text-md': 'text-2xl font-semibold leading-snug',
    'text-lg': 'text-3xl font-bold leading-snug',
    'display-sm': 'text-4xl font-bold leading-tight tracking-tight',
    'display-md': 'text-5xl font-bold leading-tight tracking-tight',
    'display-lg': 'text-6xl font-bold leading-tight tracking-tight',
    caption: 'text-xs leading-normal',
    overline: 'text-xs font-medium uppercase tracking-wider leading-normal'
  }
  return variants[props.variant]
})

const colorClasses = computed(() => {
  const colors = {
    default: 'text-slate-900',
    primary: 'text-blue-600',
    secondary: 'text-slate-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    danger: 'text-red-600',
    muted: 'text-slate-500'
  }
  return colors[props.color]
})

const alignClasses = computed(() => ({
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify'
}[props.align]))

const typographyClasses = computed(() => [
  variantClasses.value,
  colorClasses.value,
  alignClasses.value,
  {
    italic: props.italic,
    underline: props.underline,
    truncate: props.truncate,
    'whitespace-nowrap': props.noWrap
  }
])
</script>
