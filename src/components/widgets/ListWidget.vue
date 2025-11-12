<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: 'List'
  },
  apiConfig: {
    type: Object,
    default: () => ({})
  },
  data: {
    type: Array,
    default: () => []
  }
})

const listData = ref([])
const loading = ref(false)
const error = ref(null)
const refreshInterval = ref(null)

function getInitials(item) {
  const text = item.title || item.name || item.label || ''
  return text.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2) || '••'
}

async function fetchData() {
  // If direct data is provided, use it
  if (props.data && props.data.length > 0) {
    listData.value = props.data
    return
  }

  // Otherwise, try API
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

    listData.value = Array.isArray(rawData) ? rawData : [rawData]
  } catch (err) {
    error.value = err.message
    console.error('ListWidget fetch error:', err)
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
  <div class="list-widget">
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
      Error loading list data: {{ error }}
    </div>

    <div
      v-else-if="listData && listData.length > 0"
      class="space-y-2"
    >
      <div
        v-for="(item, index) in listData"
        :key="index"
        class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span class="text-sm font-medium text-blue-600">
              {{ getInitials(item) }}
            </span>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-900">
              {{ item.title || item.name || item.label || `Item ${index + 1}` }}
            </p>
            <p
              v-if="item.description || item.subtitle"
              class="text-sm text-gray-500"
            >
              {{ item.description || item.subtitle }}
            </p>
          </div>
        </div>
        <div
          v-if="item.value || item.amount"
          class="text-sm font-medium text-gray-900"
        >
          {{ item.value || item.amount }}
        </div>
      </div>
    </div>

    <div
      v-else
      class="text-gray-500 text-center py-8"
    >
      No list data available
    </div>
  </div>
</template>
