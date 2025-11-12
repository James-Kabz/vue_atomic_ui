<script setup>
import { computed } from 'vue'
import DashboardWidget from './DashboardWidget.vue'

const props = defineProps({
  widgets: {
    type: Array,
    required: true,
    validator: (value) => Array.isArray(value) && value.every(widget =>
      widget.id &&
      widget.component &&
      widget.title &&
      widget.colSpan &&
      widget.rowSpan &&
      widget.position &&
      typeof widget.position.x === 'number' &&
      typeof widget.position.y === 'number'
    )
  },
  gridCols: {
    type: Number,
    default: 12,
    validator: (value) => value > 0 && value <= 24
  },
  gridCellSize: {
    type: Number,
    default: 120,
    validator: (value) => value > 0
  },
  readOnly: {
    type: Boolean,
    default: true
  }
})

const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${props.gridCols}, 1fr)`,
  gridAutoRows: `${props.gridCellSize}px`
}))

// Emit events for widget interactions
const emit = defineEmits(['widget:update:position', 'widget:update:size', 'widget:remove'])
</script>


<template>
  <div class="dashboard-container">
    <!-- Grid Container -->
    <div
      class="dashboard-grid grid gap-4 p-4 min-h-screen bg-gray-100 rounded-lg"
      :style="gridStyle"
    >
      <DashboardWidget
        v-for="widget in widgets"
        :key="widget.id"
        :widget="widget"
        :is-edit-mode="!readOnly"
        :grid-cell-size="gridCellSize"
        :grid-cols="gridCols"
        @update:position="(pos) => $emit('widget:update:position', { id: widget.id, position: pos })"
        @update:size="(size) => $emit('widget:update:size', { id: widget.id, size })"
        @remove="() => $emit('widget:remove', widget.id)"
      />
    </div>
  </div>
</template>


<style scoped>
.dashboard-container {
  width: 100%;
  max-width: 100vw;
  overflow-x: auto;
}

.dashboard-grid {
  transition: all 0.3s ease;
}
</style>