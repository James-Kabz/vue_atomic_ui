<template>
  <div class="w-full">
    <input
      type="range"
      :min="min"
      :max="max"
      :step="step"
      v-model="internalValue"
      @input="updateValue"
      class="w-full accent-blue-500 cursor-pointer"
    />
    <div class="flex justify-between text-xs text-slate-500 mt-1">
      <span>{{ min }}</span>
      <span>{{ internalValue }}</span>
      <span>{{ max }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue"

const props = defineProps({
  modelValue: { type: Number, default: 0 },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  step: { type: Number, default: 1 }
})
const emit = defineEmits(["update:modelValue"])

const internalValue = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
  internalValue.value = val
})

const updateValue = () => {
  emit("update:modelValue", Number(internalValue.value))
}
</script>
