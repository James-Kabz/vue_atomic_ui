<template>
  <div
    :class="[
      'relative flex',
      orientation === 'vertical'
        ? 'items-start mb-8 last:mb-0'
        : 'flex-col items-center mx-8 last:mx-0'
    ]"
  >
    <!-- Line -->
    <div
      v-if="orientation === 'vertical'"
      class="absolute left-3 top-0 w-0.5 h-full bg-slate-200"
    />

    <!-- Dot / Icon -->
    <div
      class="z-10 flex items-center justify-center w-6 h-6 rounded-full border-2 border-blue-500 bg-white text-blue-500"
    >
      <slot name="icon">
        <!-- Default dot -->
        <div class="w-2 h-2 rounded-full bg-blue-500" />
      </slot>
    </div>

    <!-- Content -->
    <div
      :class="[
        'ml-6',
        orientation === 'horizontal' ? 'mt-2 text-center' : ''
      ]"
    >
      <h3 class="text-slate-900 font-medium">
        <slot name="title">
          {{ title }}
        </slot>
      </h3>
      <p
        v-if="subtitle"
        class="text-slate-500 text-sm"
      >
        <slot name="subtitle">
          {{ subtitle }}
        </slot>
      </p>
      <div class="mt-2 text-slate-600 text-sm">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  orientation: {
    type: String,
    default: 'vertical',
    validator: (val) => ['vertical', 'horizontal'].includes(val)
  }
})
</script>
