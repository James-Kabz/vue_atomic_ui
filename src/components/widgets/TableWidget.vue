<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Data Table'
  },
  apiConfig: {
    type: Object,
    default: () => ({})
  }
})

const tableData = ref([])
const loading = ref(false)
const error = ref(null)
const refreshInterval = ref(null)

const columns = computed(() => {
  if (!tableData.value || tableData.value.length === 0) return []

  // Auto-generate columns from first row
  const firstRow = tableData.value[0]
  return Object.keys(firstRow).map(key => ({
    key,
    label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')
  }))
})

function getCellValue(row, key) {
  const value = row[key]
  if (value === null || value === undefined) return '-'
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

async function fetchData() {
  if (!props.apiConfig.url) return

  loading.value = true
  error.value = null

  try {
    const config = {
      method: props.apiConfig.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...props.apiConfig.headers
      }
    }

    if (config.method === 'POST' && props.apiConfig.body) {
      config.body = JSON.stringify(props.apiConfig.body)
    }

    const url = new URL(props.apiConfig.url)
    if (props.apiConfig.params) {
      Object.entries(props.apiConfig.params).forEach(([key, value]) => {
        url.searchParams.append(key, value)
      })
    }

    const response = await fetch(url.toString(), config)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const result = await response.json()
    const rawData = props.apiConfig.dataPath ? getNestedValue(result, props.apiConfig.dataPath) : result

    tableData.value = Array.isArray(rawData) ? rawData : [rawData]
  } catch (err) {
    error.value = err.message
    console.error('TableWidget fetch error:', err)
  } finally {
    loading.value = false
  }
}

function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}

function startAutoRefresh() {
  if (props.apiConfig.refreshInterval) {
    refreshInterval.value = setInterval(fetchData, props.apiConfig.refreshInterval)
  }
}

function stopAutoRefresh() {
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value)
    refreshInterval.value = null
  }
}

onMounted(() => {
  fetchData()
  startAutoRefresh()
})

onUnmounted(() => {
  stopAutoRefresh()
})
</script>

<template>
  <div class="table-widget">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
      <button
        v-if="loading"
        class="text-gray-400 animate-spin"
        disabled
      >
        ⟳
      </button>
    </div>

    <div v-if="error" class="text-red-500 text-sm mb-4">
      Error loading table data: {{ error }}
    </div>

    <div v-else-if="tableData && tableData.length > 0" class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="(row, index) in tableData"
            :key="index"
            class="hover:bg-gray-50"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
            >
              {{ getCellValue(row, column.key) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="text-gray-500 text-center py-8">
      No table data available
    </div>
  </div>
</template>
