<template>
  <div class="flex items-center">
    <div
      :class="[
        'flex items-center justify-center w-8 h-8 rounded-full border-2',
        active ? 'bg-(--ui-primary) border-(--ui-primary) text-(--ui-text-inverse)' :
        completed ? 'bg-(--ui-success) border-(--ui-success) text-(--ui-text-inverse)' :
        'border-(--ui-border) ui-glossy-border text-(--ui-text-soft)'
      ]"
    >
      <span>{{ step }}</span>
    </div>
    <div class="ml-2">
      <div class="font-medium">
        {{ title }}
      </div>
      <div
        v-if="description"
        class="text-sm text-(--ui-text-soft)"
      >
        {{ description }}
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  step: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  active: { type: Boolean, default: false },
  completed: { type: Boolean, default: false }
})
</script>
