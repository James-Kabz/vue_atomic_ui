import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useDashboardStore = defineStore('dashboard', () => {
  const widgets = ref([])
  const mode = ref('read') // 'read' or 'edit'

  const isEditMode = computed(() => mode.value === 'edit')

  function setMode(newMode) {
    mode.value = newMode
    saveToStorage()
  }

  function addWidget(widget) {
    widgets.value.push({
      id: widget.id || Date.now().toString(),
      title: widget.title || 'New Widget',
      component: widget.component || 'DefaultWidget',
      colSpan: widget.colSpan || 4,
      rowSpan: widget.rowSpan || 4,
      position: widget.position || { x: 0, y: 0 },
      mode: widget.mode || 'read',
      ...widget
    })
  }

  function removeWidget(widgetId) {
    const index = widgets.value.findIndex(w => w.id === widgetId)
    if (index > -1) {
      widgets.value.splice(index, 1)
    }
  }

  function updateWidgetPosition(widgetId, newPosition) {
    const widget = widgets.value.find(w => w.id === widgetId)
    if (widget) {
      widget.position = { ...newPosition }
    }
  }

  function updateWidgetSize(widgetId, newSize) {
    const widget = widgets.value.find(w => w.id === widgetId)
    if (widget) {
      widget.colSpan = newSize.colSpan
      widget.rowSpan = newSize.rowSpan
    }
  }

  function updateWidget(widgetId, updates) {
    const widget = widgets.value.find(w => w.id === widgetId)
    if (widget) {
      Object.assign(widget, updates)
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

  return {
    widgets,
    mode,
    isEditMode,
    setMode,
    addWidget,
    removeWidget,
    updateWidgetPosition,
    updateWidgetSize,
    updateWidget,
    loadFromStorage,
    saveToStorage
  }
})