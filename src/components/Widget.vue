<template>
  <div
    ref="widgetRef"
    :class="[
      'widget-card bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden transition-all duration-200',
      isDragging && 'shadow-lg z-50',
      isResizing && 'shadow-lg z-50',
      isEditMode && 'cursor-move'
    ]"
    :style="widgetStyle"
    @mousedown="handleMouseDown"
  >
    <!-- Resize handles (only in edit mode) -->
    <div v-if="isEditMode" class="absolute inset-0 pointer-events-none">
      <div
        class="resize-handle resize-handle-se absolute bottom-0 right-0 w-4 h-4 cursor-se-resize pointer-events-auto"
        @mousedown.stop="startResize('se')"
      ></div>
      <div
        class="resize-handle resize-handle-sw absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize pointer-events-auto"
        @mousedown.stop="startResize('sw')"
      ></div>
      <div
        class="resize-handle resize-handle-ne absolute top-0 right-0 w-4 h-4 cursor-ne-resize pointer-events-auto"
        @mousedown.stop="startResize('ne')"
      ></div>
      <div
        class="resize-handle resize-handle-nw absolute top-0 left-0 w-4 h-4 cursor-nw-resize pointer-events-auto"
        @mousedown.stop="startResize('nw')"
      ></div>
    </div>

    <!-- Widget content -->
    <div class="p-4 h-full">
      <div class="flex justify-between items-center mb-2">
        <h3 class="text-lg font-semibold text-gray-800">{{ widget.title }}</h3>
        <button
          v-if="isEditMode"
          @click="$emit('remove', widget.id)"
          class="text-red-500 hover:text-red-700 p-1"
        >
          ×
        </button>
      </div>
      <div class="widget-content">
        <!-- Dynamic component rendering -->
        <component :is="widget.component" v-bind="widget.props || {}">
          {{ widget.children || '' }}
        </component>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'

const props = defineProps({
  widget: {
    type: Object,
    required: true
  },
  isEditMode: {
    type: Boolean,
    default: false
  },
  gridCellSize: {
    type: Number,
    default: 120
  },
  gridCols: {
    type: Number,
    default: 12
  }
})

const emit = defineEmits(['update:position', 'update:size', 'remove'])

const widgetRef = ref(null)
const isDragging = ref(false)
const isResizing = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const resizeStart = ref({ x: 0, y: 0, colSpan: 0, rowSpan: 0 })
const resizeDirection = ref('')

const widgetStyle = computed(() => {
  const { position, colSpan, rowSpan } = props.widget
  return {
    gridColumn: `${position.x + 1} / span ${colSpan}`,
    gridRow: `${position.y + 1} / span ${rowSpan}`,
    minHeight: `${props.gridCellSize * rowSpan}px`
  }
})

function handleMouseDown(event) {
  if (!props.isEditMode || isResizing.value) return

  isDragging.value = true
  dragStart.value = {
    x: event.clientX - props.widget.position.x * props.gridCellSize,
    y: event.clientY - props.widget.position.y * props.gridCellSize
  }

  document.addEventListener('mousemove', handleDrag)
  document.addEventListener('mouseup', stopDrag)
}

function handleDrag(event) {
  if (!isDragging.value) return

  const rect = widgetRef.value?.parentElement?.getBoundingClientRect()
  if (!rect) return

  const x = Math.max(0, Math.min(props.gridCols - props.widget.colSpan, Math.round((event.clientX - dragStart.value.x) / props.gridCellSize)))
  const y = Math.max(0, Math.round((event.clientY - dragStart.value.y) / props.gridCellSize))

  emit('update:position', { x, y })
}

function stopDrag() {
  isDragging.value = false
  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('mouseup', stopDrag)
}

function startResize(direction) {
  if (!props.isEditMode) return

  isResizing.value = true
  resizeDirection.value = direction
  resizeStart.value = {
    x: event.clientX,
    y: event.clientY,
    colSpan: props.widget.colSpan,
    rowSpan: props.widget.rowSpan
  }

  document.addEventListener('mousemove', handleResize)
  document.addEventListener('mouseup', stopResize)
}

function handleResize(event) {
  if (!isResizing.value) return

  const deltaX = event.clientX - resizeStart.value.x
  const deltaY = event.clientY - resizeStart.value.y

  let newColSpan = resizeStart.value.colSpan
  let newRowSpan = resizeStart.value.rowSpan

  if (resizeDirection.value.includes('e')) {
    newColSpan = Math.max(1, Math.min(props.gridCols - props.widget.position.x, resizeStart.value.colSpan + Math.round(deltaX / props.gridCellSize)))
  }
  if (resizeDirection.value.includes('w')) {
    const leftChange = Math.round(deltaX / props.gridCellSize)
    newColSpan = Math.max(1, resizeStart.value.colSpan - leftChange)
    // Adjust position if resizing left
    if (leftChange > 0 && props.widget.position.x > 0) {
      emit('update:position', { x: Math.max(0, props.widget.position.x - leftChange), y: props.widget.position.y })
    }
  }
  if (resizeDirection.value.includes('s')) {
    newRowSpan = Math.max(1, resizeStart.value.rowSpan + Math.round(deltaY / props.gridCellSize))
  }
  if (resizeDirection.value.includes('n')) {
    const topChange = Math.round(deltaY / props.gridCellSize)
    newRowSpan = Math.max(1, resizeStart.value.rowSpan - topChange)
    // Adjust position if resizing up
    if (topChange > 0 && props.widget.position.y > 0) {
      emit('update:position', { x: props.widget.position.x, y: Math.max(0, props.widget.position.y - topChange) })
    }
  }

  emit('update:size', { colSpan: newColSpan, rowSpan: newRowSpan })
}

function stopResize() {
  isResizing.value = false
  resizeDirection.value = ''
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
}

onUnmounted(() => {
  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
})
</script>

<style scoped>
.resize-handle {
  background: rgba(59, 130, 246, 0.5);
  border: 1px solid #3b82f6;
}

.resize-handle-se::after {
  content: '';
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-bottom: 6px solid #3b82f6;
}

.resize-handle-sw::after {
  content: '';
  position: absolute;
  bottom: 2px;
  left: 2px;
  width: 0;
  height: 0;
  border-right: 6px solid transparent;
  border-bottom: 6px solid #3b82f6;
}

.resize-handle-ne::after {
  content: '';
  position: absolute;
  top: 2px;
  right: 2px;
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-top: 6px solid #3b82f6;
}

.resize-handle-nw::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 0;
  height: 0;
  border-right: 6px solid transparent;
  border-top: 6px solid #3b82f6;
}
</style>