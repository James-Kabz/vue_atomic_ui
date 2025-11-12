<template>
  <div class="dashboard-container">
    <!-- Dashboard Header -->
    <div class="flex justify-between items-center mb-4 p-4 bg-gray-50 rounded-lg">
      <h2 class="text-2xl font-bold text-gray-800">Dashboard</h2>
      <div class="flex gap-2">
        <button
          @click="toggleMode"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition-colors',
            isEditMode
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          ]"
        >
          {{ isEditMode ? 'Exit Edit' : 'Edit Mode' }}
        </button>
        <button
          v-if="isEditMode"
          @click="addSampleWidget"
          class="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
        >
          Add Widget
        </button>
      </div>
    </div>

    <!-- Grid Container -->
    <div
      ref="gridRef"
      class="dashboard-grid grid gap-4 p-4 min-h-screen bg-gray-100 rounded-lg"
      :class="gridClasses"
      :style="gridStyle"
    >
      <Widget
        v-for="widget in widgets"
        :key="widget.id"
        :widget="widget"
        :is-edit-mode="isEditMode"
        :grid-cell-size="gridCellSize"
        :grid-cols="gridCols"
        @update:position="(pos) => updateWidgetPosition(widget.id, pos)"
        @update:size="(size) => updateWidgetSize(widget.id, size)"
        @remove="removeWidget"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Widget from './Widget.vue'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})

const widgets = ref([])
const mode = ref('read')
const isEditMode = computed(() => mode.value === 'edit')

function addWidget(widget) {
  widgets.value.push({
    id: widget.id || Date.now().toString(),
    title: widget.title || 'New Widget',
    component: widget.component || 'Typography',
    colSpan: widget.colSpan || 4,
    rowSpan: widget.rowSpan || 2,
    position: widget.position || { x: 0, y: 0 },
    mode: widget.mode || 'read',
    children: widget.children || '',
    props: widget.props || {},
    ...widget
  })
  saveToStorage()
}

function removeWidget(widgetId) {
  const index = widgets.value.findIndex(w => w.id === widgetId)
  if (index > -1) {
    widgets.value.splice(index, 1)
    saveToStorage()
  }
}

function updateWidgetPosition(widgetId, newPosition) {
  const widget = widgets.value.find(w => w.id === widgetId)
  if (widget) {
    widget.position = { ...newPosition }
    saveToStorage()
  }
}

function updateWidgetSize(widgetId, newSize) {
  const widget = widgets.value.find(w => w.id === widgetId)
  if (widget) {
    widget.colSpan = newSize.colSpan
    widget.rowSpan = newSize.rowSpan
    saveToStorage()
  }
}

function loadFromStorage() {
  try {
    const stored = localStorage.getItem('dashboard-data')
    if (stored) {
      const parsed = JSON.parse(stored)
      if (parsed.widgets && Array.isArray(parsed.widgets)) {
        widgets.value = parsed.widgets
      }
      if (parsed.mode) {
        mode.value = parsed.mode
      }
    }
  } catch (e) {
    console.warn('Failed to load dashboard data from storage', e)
    widgets.value = []
    mode.value = 'read'
  }
}

function saveToStorage() {
  localStorage.setItem('dashboard-data', JSON.stringify({
    widgets: widgets.value,
    mode: mode.value
  }))
}

const gridRef = ref(null)
const gridCols = ref(12)
const gridCellSize = ref(120)

const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${gridCols.value}, minmax(${gridCellSize.value}px, 1fr))`,
  gridAutoRows: `${gridCellSize.value}px`
}))

const gridClasses = computed(() => ({
  'grid-cols-12': gridCols.value === 12,
  'md:grid-cols-8': gridCols.value === 12, // responsive
  'sm:grid-cols-4': gridCols.value === 12
}))

function toggleMode() {
  mode.value = isEditMode.value ? 'read' : 'edit'
  saveToStorage()
}

function addSampleWidget() {
  const sampleWidgets = [
    { title: 'Sample Text', component: 'Typography', colSpan: 4, rowSpan: 2, children: 'This is a sample text widget. You can edit, drag, and resize it!' },
    { title: 'Sample Button', component: 'Button', colSpan: 3, rowSpan: 1, children: 'Click Me' },
    { title: 'Sample Card', component: 'Card', colSpan: 5, rowSpan: 3 },
    { title: 'Sample Alert', component: 'Alert', colSpan: 4, rowSpan: 2, props: { type: 'info' }, children: 'This is a sample alert widget.' },
    { title: 'Sample Progress', component: 'Progress', colSpan: 6, rowSpan: 1, props: { value: 75 } }
  ]
  const randomWidget = sampleWidgets[Math.floor(Math.random() * sampleWidgets.length)]
  addWidget({
    ...randomWidget,
    id: Date.now().toString(),
    position: findEmptyPosition(randomWidget.colSpan, randomWidget.rowSpan)
  })
}

function findEmptyPosition(colSpan, rowSpan) {
  // Simple algorithm to find empty spot
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x <= gridCols.value - colSpan; x++) {
      if (isPositionEmpty(x, y, colSpan, rowSpan)) {
        return { x, y }
      }
    }
  }
  return { x: 0, y: 0 } // fallback
}

function isPositionEmpty(x, y, colSpan, rowSpan) {
  return !widgets.value.some(widget => {
    const wx = widget.position.x
    const wy = widget.position.y
    const wcol = widget.colSpan
    const wrow = widget.rowSpan
    return !(x + colSpan <= wx || wx + wcol <= x || y + rowSpan <= wy || wy + wrow <= y)
  })
}


onMounted(() => {
  loadFromStorage()
  // Add some default widgets if empty
  if (widgets.value.length === 0) {
    if (props.data && Object.keys(props.data).length > 0) {
      // Create widgets based on provided data
      let yPos = 0
      Object.entries(props.data).forEach(([key, value], index) => {
        addWidget({
          id: `data-${key}`,
          title: key.charAt(0).toUpperCase() + key.slice(1),
          component: 'Typography',
          colSpan: 6,
          rowSpan: 2,
          position: { x: (index % 2) * 6, y: yPos },
          children: Array.isArray(value) ? value.slice(0, 5).join(', ') : String(value)
        })
        if (index % 2 === 1) yPos += 2
      })
    } else {
      addWidget({
        id: '1',
        title: 'Welcome Widget',
        component: 'Typography',
        colSpan: 12,
        rowSpan: 2,
        position: { x: 0, y: 0 },
        children: 'Welcome to Dashboard! Switch to edit mode to customize your widgets.'
      })
    }
  }
})
</script>

<style scoped>
.dashboard-grid {
  transition: all 0.3s ease;
}

.dashboard-container {
  width: 100%;
  max-width: 100vw;
  overflow-x: auto;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: repeat(4, minmax(80px, 1fr)) !important;
    grid-auto-rows: 80px !important;
  }
}

@media (max-width: 480px) {
  .dashboard-grid {
    grid-template-columns: repeat(2, minmax(60px, 1fr)) !important;
    grid-auto-rows: 60px !important;
  }
}
</style>