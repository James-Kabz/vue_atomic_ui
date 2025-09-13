<template>
  <div class="flex items-center justify-between">
    <div class="flex flex-1 items-center space-x-2">
      <h2 v-if="title" class="text-lg font-semibold">{{ title }}</h2>
      <slot name="title" />
    </div>
    <div class="flex items-center space-x-2">
      <slot name="actions" />
      <Button
        v-if="showRefresh"
        variant="outline"
        size="sm"
        @click="handleRefresh"
      >
        <Icon name="refresh" class="h-4 w-4" />
        Refresh
      </Button>
      <Button
        v-if="showExport"
        variant="outline"
        size="sm"
        @click="handleExport"
      >
        <Icon name="download" class="h-4 w-4" />
        Export
      </Button>
    </div>
  </div>
</template>

<script setup>
import Button from './Button.vue'
import Icon from './Icon.vue'

const props = defineProps({
  title: String,
  showRefresh: {
    type: Boolean,
    default: false
  },
  showExport: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['refresh', 'export'])

const handleRefresh = () => emit('refresh')
const handleExport = () => emit('export')
</script>
