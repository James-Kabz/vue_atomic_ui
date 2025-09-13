<template>
  <div
    :class="[
      'relative flex',
      orientation === 'vertical' ? 'flex-col' : 'flex-row'
    ]"
  >
    <slot />
  </div>
</template>

<script setup>
const props = defineProps({
  orientation: {
    type: String,
    default: 'vertical',
    validator: (val) => ['vertical', 'horizontal'].includes(val)
  }
})
</script>
