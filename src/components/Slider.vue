<template>
  <div class="w-full">
    <input
      type="range"
      :min="min"
      :max="max"
      :step="step"
      :value="modelValue"
      class="w-full accent-(--ui-primary) cursor-pointer"
      @input="updateValue"
    >
    <div class="flex justify-between text-xs ui-text mt-1">
      <span>{{ min }}</span>
      <span>{{ modelValue }}</span>
      <span>{{ max }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: [Number, String], default: 0 },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  step: { type: Number, default: 1 }
})
const emit = defineEmits(["update:modelValue"])

const updateValue = (event) => {
  emit("update:modelValue", Number(event.target.value))
}
</script>
