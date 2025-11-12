<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Statistics'
  },
  apiConfig: {
    type: Object,
    default: () => ({})
  }
})

const data = ref(null)
const loading = ref(false)
const error = ref(null)
const refreshInterval = ref(null)

const displayData = computed(() => {
  if (!data.value) return []

  // Transform API data to stats format
  if (Array.isArray(data.value)) {
    return data.value.map((item, index) => ({
      label: item.label || item.name || `Item ${index + 1}`,
      value: item.value || item.count || item.amount || 0,
      icon: item.icon || '📊',
      change: item.change
    }))
  }

  // If object, convert to array
  return Object.entries(data.value).map(([key, value]) => ({
    label: key.charAt(0).toUpperCase() + key.slice(1),
    value: typeof value === 'number' ? value : String(value),
    icon: '📈'
  }))
})

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
    data.value = props.apiConfig.dataPath ? getNestedValue(result, props.apiConfig.dataPath) : result
  } catch (err) {
    error.value = err.message
    console.error('StatsWidget fetch error:', err)
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
  <div class="stats-widget">
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
      Error loading data: {{ error }}
    </div>

    <div
      v-else-if="data"
      class="space-y-4"
    >
      <div
        v-for="(stat, index) in displayData"
        :key="index"
        class="bg-gray-50 p-4 rounded-lg"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">
              {{ stat.label }}
            </p>
            <p class="text-2xl font-bold text-gray-900">
              {{ stat.value }}
            </p>
          </div>
          <div class="text-2xl">
            {{ stat.icon }}
          </div>
        </div>
        <div
          v-if="stat.change !== undefined"
          class="mt-2"
        >
          <span
            :class="[
              'text-sm font-medium',
              stat.change > 0 ? 'text-green-600' : 'text-red-600'
            ]"
          >
            {{ stat.change > 0 ? '+' : '' }}{{ stat.change }}%
          </span>
          <span class="text-sm text-gray-500 ml-1">from last period</span>
        </div>
      </div>
    </div>

    <div
      v-else
      class="text-gray-500 text-center py-8"
    >
      No data available
    </div>
  </div>
</template>
