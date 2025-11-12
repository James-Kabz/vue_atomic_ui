import { useDashboardStore } from '../stores/dashboard'

export function useWidgetManager() {
  const store = useDashboardStore()

  function addWidget(widgetData) {
    store.addWidget(widgetData)
    store.saveToStorage()
  }

  function removeWidget(widgetId) {
    store.removeWidget(widgetId)
    store.saveToStorage()
  }

  function updateWidgetPosition(widgetId, newPosition) {
    store.updateWidgetPosition(widgetId, newPosition)
    store.saveToStorage()
  }

  function updateWidgetSize(widgetId, newSize) {
    store.updateWidgetSize(widgetId, newSize)
    store.saveToStorage()
  }

  function updateWidget(widgetId, updates) {
    store.updateWidget(widgetId, updates)
    store.saveToStorage()
  }

  function loadWidgets() {
    store.loadFromStorage()
  }

  return {
    widgets: store.widgets,
    mode: store.mode,
    isEditMode: store.isEditMode,
    setMode: store.setMode,
    addWidget,
    removeWidget,
    updateWidgetPosition,
    updateWidgetSize,
    updateWidget,
    loadWidgets
  }
}