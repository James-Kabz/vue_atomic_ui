<template>
  <div class="flex items-center">
    <div
      :class="[
        'flex items-center justify-center w-8 h-8 rounded-full border-2',
        active ? 'bg-blue-500 border-blue-500 text-white' :
        completed ? 'bg-green-500 border-green-500 text-white' :
        'border-slate-300 text-slate-500'
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
        class="text-sm text-slate-400"
      >
        {{ description }}
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  step: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  active: { type: Boolean, default: false },
  completed: { type: Boolean, default: false }
})
</script>
