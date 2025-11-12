<!-- DashboardWidget.vue -->
<template>
  <div
    ref="widgetRef"
    :class="[
      'widget-card bg-white border rounded-lg shadow-sm overflow-hidden transition-all duration-200 relative',
      (isDragging || isResizing) && 'shadow-lg z-50 border-blue-500 border-2',
      !isDragging && !isResizing && 'border-gray-200',
      isEditMode && 'cursor-move'
    ]"
    :style="widgetStyle"
    @mousedown="handleMouseDown"
  >
    <!-- Resize handles (only in edit mode) -->
    <div v-if="isEditMode" class="absolute inset-0 pointer-events-none z-10">
      <div
        class="resize-handle resize-handle-se absolute bottom-0 right-0 w-4 h-4 bg-blue-500 rounded-tl cursor-se-resize pointer-events-auto border-2 border-white shadow-md hover:bg-blue-600 hover:scale-110 transition-all"
        @mousedown.stop="startResize('se')"
      ></div>
      <div
        class="resize-handle resize-handle-sw absolute bottom-0 left-0 w-4 h-4 bg-blue-500 rounded-tr cursor-sw-resize pointer-events-auto border-2 border-white shadow-md hover:bg-blue-600 hover:scale-110 transition-all"
        @mousedown.stop="startResize('sw')"
      ></div>
      <div
        class="resize-handle resize-handle-ne absolute top-0 right-0 w-4 h-4 bg-blue-500 rounded-bl cursor-ne-resize pointer-events-auto border-2 border-white shadow-md hover:bg-blue-600 hover:scale-110 transition-all"
        @mousedown.stop="startResize('ne')"
      ></div>
      <div
        class="resize-handle resize-handle-nw absolute top-0 left-0 w-4 h-4 bg-blue-500 rounded-br cursor-nw-resize pointer-events-auto border-2 border-white shadow-md hover:bg-blue-600 hover:scale-110 transition-all"
        @mousedown.stop="startResize('nw')"
      ></div>
    </div>

    <!-- Widget content -->
    <div class="p-4 h-full">
      <div class="flex justify-between items-center mb-2">
        <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <svg v-if="isEditMode" class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16"></path>
          </svg>
          {{ widget.title }}
        </h3>
        <button
          v-if="isEditMode"
          @click.stop="$emit('remove', widget.id)"
          class="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      <div class="widget-content overflow-auto" :style="{ maxHeight: `${gridCellSize * widget.rowSpan - 80}px` }">
        <!-- Render specific widget components -->
        <component
          :is="'StatsWidget'"
          v-if="widget.component === 'StatsWidget'"
          :title="widget.title"
          :api-config="widget.apiConfig"
        />
        <component
          :is="'ChartWidget'"
          v-else-if="widget.component === 'ChartWidget'"
          :title="widget.title"
          :api-config="widget.apiConfig"
        />
        <component
          :is="'TableWidget'"
          v-else-if="widget.component === 'TableWidget'"
          :title="widget.title"
          :api-config="widget.apiConfig"
        />
        <component
          :is="'ListWidget'"
          v-else-if="widget.component === 'ListWidget'"
          :title="widget.title"
          :api-config="widget.apiConfig"
        />
        <!-- Simple components fallback -->
        <div v-else-if="widget.component === 'Typography'" class="text-gray-700">
          {{ widget.children }}
        </div>
        <button v-else-if="widget.component === 'Button'" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full">
          {{ widget.children }}
        </button>
        <div v-else-if="widget.component === 'Card'" class="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded h-full">
          <p class="text-gray-600">{{ widget.children || 'Card Content' }}</p>
        </div>
        <div v-else-if="widget.component === 'Alert'" :class="getAlertClass(widget.props?.type)" class="p-3 rounded">
          {{ widget.children }}
        </div>
        <div v-else-if="widget.component === 'Progress'" class="w-full">
          <div class="w-full bg-gray-200 rounded-full h-4">
            <div class="bg-blue-500 h-4 rounded-full transition-all" :style="{ width: `${widget.props?.value || 0}%` }"></div>
          </div>
        </div>
        <!-- Fallback for custom components -->
        <component
          v-else
          :is="widget.component"
          v-bind="widget.props || {}"
        >
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
const resizeStart = ref({ x: 0, y: 0, colSpan: 0, rowSpan: 0, posX: 0, posY: 0 })
const resizeDirection = ref('')

const widgetStyle = computed(() => {
  const { position, colSpan, rowSpan } = props.widget
  return {
    gridColumn: `${position.x + 1} / span ${colSpan}`,
    gridRow: `${position.y + 1} / span ${rowSpan}`,
    minHeight: `${props.gridCellSize * rowSpan}px`
  }
})

function getAlertClass(type = 'info') {
  const classes = {
    info: 'bg-blue-100 text-blue-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    success: 'bg-green-100 text-green-800'
  }
  return classes[type] || classes.info
}

function handleMouseDown(event) {
  if (!props.isEditMode || isResizing.value) return

  isDragging.value = true

  const gridElement = widgetRef.value?.parentElement
  const gridRect = gridElement?.getBoundingClientRect()
  const actualCellWidth = gridRect ? gridRect.width / props.gridCols : props.gridCellSize

  dragStart.value = {
    x: event.clientX - (props.widget.position.x * actualCellWidth + (gridRect?.left || 0)),
    y: event.clientY - (props.widget.position.y * props.gridCellSize + (gridRect?.top || 0))
  }

  document.addEventListener('mousemove', handleDrag)
  document.addEventListener('mouseup', stopDrag)
}

function handleDrag(event) {
  if (!isDragging.value) return

  const gridElement = widgetRef.value?.parentElement
  if (!gridElement) return

  const gridRect = gridElement.getBoundingClientRect()
  const actualCellWidth = gridRect.width / props.gridCols
  const actualCellHeight = props.gridCellSize

  // Calculate relative mouse position within grid
  const relativeX = event.clientX - gridRect.left - dragStart.value.x
  const relativeY = event.clientY - gridRect.top - dragStart.value.y

  const x = Math.max(0, Math.min(props.gridCols - props.widget.colSpan, Math.round(relativeX / actualCellWidth)))
  const y = Math.max(0, Math.round(relativeY / actualCellHeight))

  emit('update:position', { x, y })
}

function stopDrag() {
  isDragging.value = false
  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('mouseup', stopDrag)
}

function startResize(direction, event) {
  if (!props.isEditMode) return

  isResizing.value = true
  resizeDirection.value = direction
  resizeStart.value = {
    x: event.clientX,
    y: event.clientY,
    colSpan: props.widget.colSpan,
    rowSpan: props.widget.rowSpan,
    posX: props.widget.position.x,
    posY: props.widget.position.y
  }

  document.addEventListener('mousemove', handleResize)
  document.addEventListener('mouseup', stopResize)
}

function handleResize(event) {
  if (!isResizing.value) return

  const gridElement = widgetRef.value?.parentElement
  const gridRect = gridElement?.getBoundingClientRect()
  const actualCellWidth = gridRect ? gridRect.width / props.gridCols : props.gridCellSize

  const deltaX = event.clientX - resizeStart.value.x
  const deltaY = event.clientY - resizeStart.value.y

  let newColSpan = resizeStart.value.colSpan
  let newRowSpan = resizeStart.value.rowSpan
  let newX = resizeStart.value.posX
  let newY = resizeStart.value.posY

  // Handle horizontal resize
  if (resizeDirection.value.includes('e')) {
    const colChange = Math.round(deltaX / actualCellWidth)
    newColSpan = Math.max(1, Math.min(props.gridCols - resizeStart.value.posX, resizeStart.value.colSpan + colChange))
  }
  if (resizeDirection.value.includes('w')) {
    const colChange = Math.round(deltaX / actualCellWidth)
    newColSpan = Math.max(1, resizeStart.value.colSpan - colChange)
    newX = Math.max(0, Math.min(props.gridCols - newColSpan, resizeStart.value.posX + colChange))
  }

  // Handle vertical resize
  if (resizeDirection.value.includes('s')) {
    const rowChange = Math.round(deltaY / props.gridCellSize)
    newRowSpan = Math.max(1, resizeStart.value.rowSpan + rowChange)
  }
  if (resizeDirection.value.includes('n')) {
    const rowChange = Math.round(deltaY / props.gridCellSize)
    newRowSpan = Math.max(1, resizeStart.value.rowSpan - rowChange)
    newY = Math.max(0, resizeStart.value.posY + rowChange)
  }

  // Update position if needed (for west/north resizing)
  if (newX !== props.widget.position.x || newY !== props.widget.position.y) {
    emit('update:position', { x: newX, y: newY })
  }

  // Update size
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
.widget-card {
  user-select: none;
}

.resize-handle {
  z-index: 20;
}

.widget-content {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #f7fafc;
}

.widget-content::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.widget-content::-webkit-scrollbar-track {
  background: #f7fafc;
  border-radius: 3px;
}

.widget-content::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 3px;
}

.widget-content::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}
</style>