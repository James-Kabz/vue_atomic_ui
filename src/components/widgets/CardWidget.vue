<script setup>
import { ref } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Card'
  },
  content: {
    type: String,
    default: ''
  },
  apiConfig: {
    type: Object,
    default: () => ({})
  }
})

const loading = ref(false)
const error = ref(null)
const cardContent = ref(props.content)
</script>


<template>
  <div class="card-widget">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">
        {{ title }}
      </h3>
      <button
        v-if="loading"
        class="text-gray-400 animate-spin"
        disabled
      >
        ⟳
      </button>
    </div>

    <div
      v-if="error"
      class="text-red-500 text-sm mb-4"
    >
      Error: {{ error }}
    </div>

    <div
      v-else
      class="bg-white border border-gray-200 rounded-lg p-4"
    >
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div v-html="cardContent" />
    </div>
  </div>
</template>