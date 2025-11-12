<script setup>
import { ref, computed, onMounted } from 'vue'
import DashboardWidget from './DashboardWidget.vue'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  },
  widgets: {
    type: Array,
    default: () => []
  }
})

const dashboardWidgets = ref([])
const mode = ref('read')
const isEditMode = computed(() => mode.value === 'edit')
const gridRef = ref(null)
const gridCols = ref(12)
const gridCellSize = ref(120)

const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${gridCols.value}, 1fr)`,
  gridAutoRows: `${gridCellSize.value}px`
}))

// Check if two widgets collide
function checkCollision(widget1, widget2) {
  return !(
    widget1.position.x + widget1.colSpan <= widget2.position.x ||
    widget2.position.x + widget2.colSpan <= widget1.position.x ||
    widget1.position.y + widget1.rowSpan <= widget2.position.y ||
    widget2.position.y + widget2.rowSpan <= widget1.position.y
  )
}

// Resolve collisions by pushing widgets down
function resolveCollisions(updatedWidget) {
  const movedWidgets = new Set([updatedWidget.id])
  
  function pushWidgetDown(widget) {
    if (movedWidgets.has(widget.id)) return

    movedWidgets.add(widget.id)
    widget.position.y = updatedWidget.position.y + updatedWidget.rowSpan

    // Check for new collisions with other widgets
    dashboardWidgets.value.forEach(other => {
      if (other.id !== widget.id && !movedWidgets.has(other.id)) {
        if (checkCollision(widget, other)) {
          pushWidgetDown(other)
        }
      }
    })
  }

  // Check all widgets for collisions with the updated widget
  dashboardWidgets.value.forEach(widget => {
    if (widget.id !== updatedWidget.id && checkCollision(updatedWidget, widget)) {
      pushWidgetDown(widget)
    }
  })
}

function updateWidgetPosition(widgetId, newPosition) {
  const widget = dashboardWidgets.value.find(w => w.id === widgetId)
  if (!widget) return

  // Create a temporary widget with new position
  const tempWidget = {
    ...widget,
    position: { ...newPosition }
  }

  // Update the widget position
  widget.position = { ...newPosition }

  // Resolve any collisions
  resolveCollisions(tempWidget)

  saveToStorage()
}

function updateWidgetSize(widgetId, newSize) {
  const widget = dashboardWidgets.value.find(w => w.id === widgetId)
  if (!widget) return

  // Check if new size would exceed grid bounds
  if (widget.position.x + newSize.colSpan > gridCols.value) {
    newSize.colSpan = gridCols.value - widget.position.x
  }

  // Create a temporary widget with new size
  const tempWidget = {
    ...widget,
    colSpan: newSize.colSpan,
    rowSpan: newSize.rowSpan
  }

  // Check if resize would cause collisions
  let hasCollision = false
  dashboardWidgets.value.forEach(other => {
    if (other.id !== widget.id && checkCollision(tempWidget, other)) {
      hasCollision = true
    }
  })

  // Only update if no collision or resolve collisions
  widget.colSpan = newSize.colSpan
  widget.rowSpan = newSize.rowSpan

  if (hasCollision) {
    resolveCollisions(tempWidget)
  }

  saveToStorage()
}

function addWidget(widget) {
  dashboardWidgets.value.push({
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
  const index = dashboardWidgets.value.findIndex(w => w.id === widgetId)
  if (index > -1) {
    dashboardWidgets.value.splice(index, 1)
    saveToStorage()
  }
}

function loadFromStorage() {
  try {
    const stored = localStorage.getItem('dashboard-data')
    if (stored) {
      const parsed = JSON.parse(stored)
      if (parsed.widgets && Array.isArray(parsed.widgets)) {
        dashboardWidgets.value = parsed.widgets
      }
      if (parsed.mode) {
        mode.value = parsed.mode
      }
    }
  } catch (e) {
    console.warn('Failed to load dashboard data from storage', e)
    dashboardWidgets.value = []
    mode.value = 'read'
  }
}

function saveToStorage() {
  localStorage.setItem('dashboard-data', JSON.stringify({
    widgets: dashboardWidgets.value,
    mode: mode.value
  }))
}

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
  // Find the lowest Y position that's available
  const maxY = dashboardWidgets.value.length > 0
    ? Math.max(...dashboardWidgets.value.map(w => w.position.y + w.rowSpan))
    : 0

  // Try to place widget at bottom
  for (let x = 0; x <= gridCols.value - colSpan; x++) {
    const testWidget = {
      position: { x, y: maxY },
      colSpan,
      rowSpan
    }

    let hasCollision = false
    for (const widget of dashboardWidgets.value) {
      if (checkCollision(testWidget, widget)) {
        hasCollision = true
        break
      }
    }

    if (!hasCollision) {
      return { x, y: maxY }
    }
  }

  // If no space at bottom, place below everything
  return { x: 0, y: maxY }
}

onMounted(() => {
  loadFromStorage()
  // Add widgets if none exist
  if (dashboardWidgets.value.length === 0) {
    if (props.widgets && props.widgets.length > 0) {
      // Use provided widgets
      props.widgets.forEach(widget => {
        addWidget(widget)
      })
    } else if (props.data && Object.keys(props.data).length > 0) {
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
      // Add sample widgets to showcase functionality
      addWidget({
        id: 'stats-demo',
        title: 'User Statistics',
        component: 'StatsWidget',
        colSpan: 6,
        rowSpan: 2,
        position: { x: 0, y: 0 },
        apiConfig: {
          url: '/api/fake-stats',
          refreshInterval: 10000
        }
      })

      addWidget({
        id: 'chart-demo',
        title: 'Sales Chart',
        component: 'ChartWidget',
        colSpan: 6,
        rowSpan: 3,
        position: { x: 6, y: 0 },
        apiConfig: {
          url: '/api/fake-chart',
          refreshInterval: 15000
        }
      })

      addWidget({
        id: 'table-demo',
        title: 'Recent Orders',
        component: 'TableWidget',
        colSpan: 12,
        rowSpan: 4,
        position: { x: 0, y: 2 },
        apiConfig: {
          url: '/api/fake-table',
          params: { limit: 5 }
        }
      })

      addWidget({
        id: 'list-demo',
        title: 'Active Users',
        component: 'ListWidget',
        colSpan: 6,
        rowSpan: 3,
        position: { x: 0, y: 6 },
        apiConfig: {
          url: '/api/fake-list',
          refreshInterval: 20000
        }
      })
    }
  }
})
</script>


<template>
  <div class="dashboard-container">
    <!-- Dashboard Header -->
    <div class="flex justify-between items-center mb-4 p-4 bg-gray-50 rounded-lg">
      <h2 class="text-2xl font-bold text-gray-800">
        Dashboard
      </h2>
      <div class="flex gap-2">
        <button
          :class="[
            'px-4 py-2 rounded-lg font-medium transition-colors',
            isEditMode
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          ]"
          @click="toggleMode"
        >
          {{ isEditMode ? 'Exit Edit' : 'Edit Mode' }}
        </button>
        <button
          v-if="isEditMode"
          class="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
          @click="addSampleWidget"
        >
          Add Widget
        </button>
      </div>
    </div>

    <!-- Grid Container -->
    <div
      ref="gridRef"
      class="dashboard-grid grid gap-4 p-4 min-h-screen bg-gray-100 rounded-lg"
      :style="gridStyle"
    >
      <DashboardWidget
        v-for="widget in dashboardWidgets"
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