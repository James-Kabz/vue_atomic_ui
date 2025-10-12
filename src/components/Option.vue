<template>
  <option
    :value="value"
    :disabled="disabled"
    :selected="selected"
  >
    <slot>{{ label }}</slot>
  </option>
</template>

<script setup>
const props = defineProps({
  value: {
    type: [String, Number, Boolean],
    required: true
  },
  label: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  selected: {
    type: Boolean,
    default: false
  }
})
</script>