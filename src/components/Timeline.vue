<template>
  <div
    :class="[
      'relative flex text-(--ui-text)',
      orientation === 'vertical' ? 'flex-col' : 'flex-row'
    ]"
  >
    <slot />
  </div>
</template>

<script setup>
defineProps({
  orientation: {
    type: String,
    default: 'vertical',
    validator: (val) => ['vertical', 'horizontal'].includes(val)
  }
})
</script>
