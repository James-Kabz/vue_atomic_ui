<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Chart'
  },
  apiConfig: {
    type: Object,
    default: () => ({})
  }
})

const chartData = ref(null)
const loading = ref(false)
const error = ref(null)
const refreshInterval = ref(null)

const maxValue = computed(() => {
  if (!chartData.value) return 0
  return Math.max(...chartData.value.map(item => item.value || 0))
})

function getBarHeight(value) {
  if (maxValue.value === 0) return 0
  return (value / maxValue.value) * 80 // 80% max height
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

    // Transform to chart format
    chartData.value = Array.isArray(rawData)
      ? rawData.map(item => ({
          label: item.label || item.name || item.category,
          value: item.value || item.count || item.amount || 0
        }))
      : Object.entries(rawData).map(([key, value]) => ({
          label: key,
          value: typeof value === 'number' ? value : 0
        }))
  } catch (err) {
    error.value = err.message
    console.error('ChartWidget fetch error:', err)
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
  <div class="chart-widget">
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
      Error loading chart data: {{ error }}
    </div>

    <div
      v-else-if="chartData"
      class="h-64"
    >
      <!-- Simple bar chart visualization -->
      <div class="flex items-end justify-between h-full space-x-2">
        <div
          v-for="(item, index) in chartData"
          :key="index"
          class="flex-1 flex flex-col items-center"
        >
          <div
            class="bg-blue-500 rounded-t w-full transition-all duration-300 hover:bg-blue-600"
            :style="{ height: `${getBarHeight(item.value)}%` }"
          />
          <span class="text-xs text-gray-600 mt-2 truncate w-full text-center">
            {{ item.label || item.name || `Item ${index + 1}` }}
          </span>
        </div>
      </div>
    </div>

    <div
      v-else
      class="text-gray-500 text-center py-8"
    >
      No chart data available
    </div>
  </div>
</template>
