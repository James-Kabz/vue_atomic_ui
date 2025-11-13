<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import Icon from '../Icon.vue'
import Loader from '../Loader.vue'
import { cn } from '../../utils/cn'

const props = defineProps({
  id: { type: String, required: true },
  title: { type: String, required: true },
  icon: { type: String, default: null },
  requiredRoles: { type: Function, default: null },
  loading: { type: Boolean, default: false },
  height: { type: String, default: 'auto' },
  maxHeight: { type: String, default: 'none' },
  minHeight: { type: String, default: '200px' },
  width: { type: String, default: '100%' },
  showRefresh: { type: Boolean, default: true },
  showHeader: { type: Boolean, default: true },
  padding: { type: String, default: 'normal' },
  hasRole: {
    type: Function,
    default: () => () => false
  },
  // Chart props
  chartType: { type: String, default: null },
  chartData: { type: Object, default: null },
  chartOptions: { type: Object, default: () => ({}) },
  // Customization options
  customizationOptions: { 
    type: Array, 
    default: () => [] // e.g., [{ id: 'legend', label: 'Show Legend', default: true }]
  }
})

const emit = defineEmits(['refresh', 'dragstart', 'dragend', 'customize', 'keypress'])

const canView = computed(() => {
  if (!props.requiredRoles) return true
  return props.requiredRoles(props.hasRole)
})

const containerStyles = computed(() => ({
  width: props.width,
  height: props.height !== 'auto' ? props.height : undefined,
  maxHeight: props.maxHeight !== 'none' ? props.maxHeight : undefined,
  minHeight: props.minHeight
}))

const paddingClasses = {
  none: '',
  small: 'p-3',
  normal: 'p-4',
  large: 'p-6'
}

// === Customization Panel ===
const showCustomization = ref(false)
const customSettings = ref({})

// Initialize custom settings from props
onMounted(() => {
  props.customizationOptions.forEach(option => {
    customSettings.value[option.id] = option.default ?? true
  })
})

const toggleCustomization = () => {
  showCustomization.value = !showCustomization.value
}

const updateSetting = (optionId, value) => {
  customSettings.value[optionId] = value
  emit('customize', { ...customSettings.value })
  // Re-render chart with new settings
  if (props.chartType && props.chartData) {
    setTimeout(renderChart, 50)
  }
}

// === Keyboard Controls ===
const widgetRef = ref(null)
const isFocused = ref(false)

const handleKeyDown = (e) => {
  if (!isFocused.value) return
  
  const handlers = {
    'r': () => emit('refresh'),
    'R': () => emit('refresh'),
    'c': () => toggleCustomization(),
    'C': () => toggleCustomization(),
    'Escape': () => showCustomization.value = false,
    'h': () => showKeyboardHelp.value = !showKeyboardHelp.value,
    'H': () => showKeyboardHelp.value = !showKeyboardHelp.value,
    '?': () => showKeyboardHelp.value = !showKeyboardHelp.value
  }

  if (handlers[e.key]) {
    e.preventDefault()
    handlers[e.key]()
    emit('keypress', e.key)
  }
}

const handleFocus = () => {
  isFocused.value = true
}

const handleBlur = () => {
  isFocused.value = false
}

// === Keyboard Help ===
const showKeyboardHelp = ref(false)
const keyboardShortcuts = [
  { key: 'R', description: 'Refresh widget' },
  { key: 'C', description: 'Open customization' },
  { key: 'Esc', description: 'Close panels' },
  { key: '?', description: 'Toggle help' }
]

// === Native Drag & Drop ===
const isDragging = ref(false)
let dragClone = null

const handleDragStart = (e) => {
  if (!e.dataTransfer) return
  isDragging.value = true
  emit('dragstart', props.id)

  const rect = e.target.getBoundingClientRect()
  dragClone = e.target.cloneNode(true)
  Object.assign(dragClone.style, {
    position: 'fixed',
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    pointerEvents: 'none',
    opacity: '0.8',
    zIndex: '1000',
    left: `${e.clientX - rect.width / 2}px`,
    top: `${e.clientY - rect.height / 2}px`
  })
  document.body.appendChild(dragClone)

  e.dataTransfer.setDragImage(dragClone, rect.width / 2, rect.height / 2)
  e.dataTransfer.effectAllowed = 'move'
  e.dataTransfer.setData('text/plain', props.id)
}

const handleDrag = (e) => {
  if (dragClone && e.clientX && e.clientY) {
    dragClone.style.left = `${e.clientX - dragClone.offsetWidth / 2}px`
    dragClone.style.top = `${e.clientY - dragClone.offsetHeight / 2}px`
  }
}

const handleDragEnd = () => {
  isDragging.value = false
  emit('dragend', props.id)
  if (dragClone) {
    document.body.removeChild(dragClone)
    dragClone = null
  }
}

// === Native Canvas Chart Rendering ===
const chartCanvas = ref(null)
let chartInstance = null

const defaultChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 800,
    easing: 'easeInOutQuart'
  },
  plugins: {
    legend: {
      display: true,
      position: 'bottom',
      labels: {
        padding: 15,
        font: { size: 12 },
        usePointStyle: true,
        pointStyle: 'circle'
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 12,
      titleFont: { size: 14, weight: 'bold' },
      bodyFont: { size: 13 },
      cornerRadius: 6
    }
  }
}

const renderChart = () => {
  if (!chartCanvas.value || !props.chartType || !props.chartData) return

  const ctx = chartCanvas.value.getContext('2d')
  const mergedOptions = { 
    ...defaultChartOptions, 
    ...props.chartOptions,
    plugins: {
      ...defaultChartOptions.plugins,
      ...props.chartOptions.plugins,
      legend: {
        ...defaultChartOptions.plugins.legend,
        ...props.chartOptions.plugins?.legend,
        display: customSettings.value.legend ?? defaultChartOptions.plugins.legend.display
      }
    }
  }

  // Clear previous chart
  if (chartInstance) {
    ctx.clearRect(0, 0, chartCanvas.value.width, chartCanvas.value.height)
  }

  chartCanvas.value.width = chartCanvas.value.offsetWidth * window.devicePixelRatio
  chartCanvas.value.height = chartCanvas.value.offsetHeight * window.devicePixelRatio
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

  const width = chartCanvas.value.offsetWidth
  const height = chartCanvas.value.offsetHeight

  switch (props.chartType) {
    case 'bar':
      renderBarChart(ctx, width, height, mergedOptions)
      break
    case 'pie':
      renderPieChart(ctx, width, height, mergedOptions)
      break
    case 'doughnut':
      renderDoughnutChart(ctx, width, height, mergedOptions)
      break
    case 'line':
      renderLineChart(ctx, width, height, mergedOptions)
      break
  }
}

const renderBarChart = (ctx, width, height, options) => {
  const data = props.chartData.datasets[0].data
  const labels = props.chartData.labels
  const colors = props.chartData.datasets[0].backgroundColor
  
  const padding = 60
  const legendHeight = options.plugins.legend.display ? 80 : 0
  const chartHeight = height - padding - legendHeight
  const chartWidth = width - padding * 2
  
  const maxValue = Math.max(...data)
  const barWidth = chartWidth / data.length * 0.6
  const spacing = chartWidth / data.length

  // Draw bars
  data.forEach((value, index) => {
    const barHeight = (value / maxValue) * chartHeight
    const x = padding + spacing * index + spacing / 2 - barWidth / 2
    const y = padding + chartHeight - barHeight

    ctx.fillStyle = colors[index]
    ctx.fillRect(x, y, barWidth, barHeight)

    // Draw value on top if enabled
    if (customSettings.value.values ?? true) {
      ctx.fillStyle = '#1e293b'
      ctx.font = 'bold 12px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(value, x + barWidth / 2, y - 5)
    }

    // Draw label if enabled
    if (customSettings.value.labels ?? true) {
      ctx.fillStyle = '#64748b'
      ctx.font = '11px sans-serif'
      ctx.save()
      ctx.translate(x + barWidth / 2, padding + chartHeight + 15)
      ctx.rotate(-Math.PI / 6)
      ctx.fillText(labels[index], 0, 0)
      ctx.restore()
    }
  })

  // Draw axes
  ctx.strokeStyle = '#cbd5e1'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(padding, padding)
  ctx.lineTo(padding, padding + chartHeight)
  ctx.lineTo(padding + chartWidth, padding + chartHeight)
  ctx.stroke()

  // Draw legend
  if (options.plugins.legend.display) {
    drawLegend(ctx, width, height - legendHeight + 20, labels, colors)
  }
}

const renderPieChart = (ctx, width, height, options) => {
  const data = props.chartData.datasets[0].data
  const labels = props.chartData.labels
  const colors = props.chartData.datasets[0].backgroundColor
  
  const total = data.reduce((sum, val) => sum + val, 0)
  const legendHeight = options.plugins.legend.display ? 80 : 0
  const centerX = width / 2
  const centerY = (height - legendHeight) / 2
  const radius = Math.min(centerX, centerY) - 40

  let currentAngle = -Math.PI / 2

  data.forEach((value, index) => {
    const sliceAngle = (value / total) * 2 * Math.PI

    // Draw slice
    ctx.fillStyle = colors[index]
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle)
    ctx.closePath()
    ctx.fill()

    // Draw border
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw percentage if enabled
    if (customSettings.value.percentages ?? true) {
      const midAngle = currentAngle + sliceAngle / 2
      const textX = centerX + Math.cos(midAngle) * (radius * 0.7)
      const textY = centerY + Math.sin(midAngle) * (radius * 0.7)
      
      const percentage = ((value / total) * 100).toFixed(1)
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 13px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(`${percentage}%`, textX, textY)
    }

    currentAngle += sliceAngle
  })

  // Draw legend
  if (options.plugins.legend.display) {
    drawLegend(ctx, width, height - legendHeight + 20, labels, colors)
  }
}

const renderDoughnutChart = (ctx, width, height, options) => {
  const data = props.chartData.datasets[0].data
  const labels = props.chartData.labels
  const colors = props.chartData.datasets[0].backgroundColor
  
  const total = data.reduce((sum, val) => sum + val, 0)
  const legendHeight = options.plugins.legend.display ? 80 : 0
  const centerX = width / 2
  const centerY = (height - legendHeight) / 2
  const outerRadius = Math.min(centerX, centerY) - 40
  const innerRadius = outerRadius * 0.6

  let currentAngle = -Math.PI / 2

  data.forEach((value, index) => {
    const sliceAngle = (value / total) * 2 * Math.PI

    // Draw slice
    ctx.fillStyle = colors[index]
    ctx.beginPath()
    ctx.arc(centerX, centerY, outerRadius, currentAngle, currentAngle + sliceAngle)
    ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true)
    ctx.closePath()
    ctx.fill()

    // Draw border
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 2
    ctx.stroke()

    currentAngle += sliceAngle
  })

  // Draw center circle
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI)
  ctx.fill()

  // Draw total in center if enabled
  if (customSettings.value.centerTotal ?? true) {
    ctx.fillStyle = '#1e293b'
    ctx.font = 'bold 24px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(total, centerX, centerY - 10)
    ctx.font = '12px sans-serif'
    ctx.fillStyle = '#64748b'
    ctx.fillText('Total', centerX, centerY + 15)
  }

  // Draw legend
  if (options.plugins.legend.display) {
    drawLegend(ctx, width, height - legendHeight + 20, labels, colors)
  }
}

const renderLineChart = (ctx, width, height, options) => {
  const data = props.chartData.datasets[0].data
  const labels = props.chartData.labels
  const color = props.chartData.datasets[0].borderColor || '#3b82f6'
  
  const padding = 60
  const legendHeight = options.plugins.legend.display ? 60 : 0
  const chartHeight = height - padding - legendHeight
  const chartWidth = width - padding * 2
  
  const maxValue = Math.max(...data)
  const minValue = Math.min(...data)
  const range = maxValue - minValue || 1
  const spacing = chartWidth / (data.length - 1)

  // Draw grid lines if enabled
  if (customSettings.value.gridLines ?? true) {
    ctx.strokeStyle = '#e2e8f0'
    ctx.lineWidth = 1
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(padding + chartWidth, y)
      ctx.stroke()
    }
  }

  // Draw line
  ctx.strokeStyle = color
  ctx.lineWidth = 3
  ctx.beginPath()
  data.forEach((value, index) => {
    const x = padding + spacing * index
    const y = padding + chartHeight - ((value - minValue) / range) * chartHeight
    if (index === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  })
  ctx.stroke()

  // Draw points if enabled
  if (customSettings.value.dataPoints ?? true) {
    data.forEach((value, index) => {
      const x = padding + spacing * index
      const y = padding + chartHeight - ((value - minValue) / range) * chartHeight
      
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.arc(x, y, 6, 0, 2 * Math.PI)
      ctx.fill()
      
      ctx.strokeStyle = color
      ctx.lineWidth = 3
      ctx.stroke()

      // Draw labels if enabled
      if (customSettings.value.labels ?? true) {
        ctx.fillStyle = '#64748b'
        ctx.font = '11px sans-serif'
        ctx.textAlign = 'center'
        ctx.save()
        ctx.translate(x, padding + chartHeight + 15)
        ctx.rotate(-Math.PI / 6)
        ctx.fillText(labels[index], 0, 0)
        ctx.restore()
      }
    })
  }

  // Draw axes
  ctx.strokeStyle = '#cbd5e1'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(padding, padding)
  ctx.lineTo(padding, padding + chartHeight)
  ctx.lineTo(padding + chartWidth, padding + chartHeight)
  ctx.stroke()
}

const drawLegend = (ctx, width, startY, labels, colors) => {
  const itemWidth = 120
  const itemsPerRow = Math.floor(width / itemWidth)
  const startX = (width - itemsPerRow * itemWidth) / 2

  labels.forEach((label, index) => {
    const row = Math.floor(index / itemsPerRow)
    const col = index % itemsPerRow
    const x = startX + col * itemWidth
    const y = startY + row * 25

    // Draw color box
    ctx.fillStyle = colors[index]
    ctx.fillRect(x, y, 12, 12)

    // Draw label
    ctx.fillStyle = '#1e293b'
    ctx.font = '12px sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText(label, x + 18, y + 10)
  })
}

onMounted(() => {
  window.addEventListener('dragover', handleDrag)
  window.addEventListener('keydown', handleKeyDown)
  
  if (props.chartType && props.chartData) {
    setTimeout(renderChart, 100)
    window.addEventListener('resize', renderChart)
  }
})

onUnmounted(() => {
  window.removeEventListener('dragover', handleDrag)
  window.removeEventListener('resize', renderChart)
  window.removeEventListener('keydown', handleKeyDown)
  if (dragClone) document.body.removeChild(dragClone)
})

// Watch for chart data changes
const watchChart = () => {
  if (props.chartType && props.chartData) {
    setTimeout(renderChart, 50)
  }
}

// Watch computed for data changes to trigger re-render
const chartDataString = computed(() => JSON.stringify(props.chartData))
watch(chartDataString, () => {
  watchChart()
})
</script>

<template>
  <div
    v-if="canView"
    ref="widgetRef"
    draggable="true"
    tabindex="0"
    :style="containerStyles"
    :class="cn(
      'bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all select-none flex flex-col relative',
      isDragging ? 'opacity-50 scale-95' : 'hover:shadow-lg cursor-move',
      isFocused ? 'ring-2 ring-blue-400 ring-offset-2' : ''
    )"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
    @focus="handleFocus"
    @blur="handleBlur"
  >
    <!-- Header -->
    <div
      v-if="showHeader"
      class="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 flex-shrink-0"
    >
      <div class="flex items-center gap-3">
        <Icon
          v-if="icon"
          :icon="icon"
          class="w-5 h-5 text-slate-700"
        />
        <h3 class="font-semibold text-lg text-slate-900">
          {{ title }}
        </h3>
      </div>
      <div class="flex items-center gap-2">
        <slot name="header-actions" />
        
        <!-- Keyboard Help -->
        <button
          class="p-2 rounded-lg hover:bg-white/80 transition-all duration-200 hover:scale-105 active:scale-95"
          title="Keyboard shortcuts (?)"
          @click="showKeyboardHelp = !showKeyboardHelp"
        >
          <Icon
            icon="help-circle"
            class="w-4 h-4 text-slate-600"
          />
        </button>

        <!-- Customize -->
        <button
          v-if="customizationOptions.length > 0"
          class="p-2 rounded-lg hover:bg-white/80 transition-all duration-200 hover:scale-105 active:scale-95"
          :class="{ 'bg-blue-100': showCustomization }"
          title="Customize (C)"
          @click="toggleCustomization"
        >
          <Icon
            icon="settings"
            class="w-4 h-4 text-slate-600"
          />
        </button>

        <!-- Refresh -->
        <button
          v-if="showRefresh"
          class="p-2 rounded-lg hover:bg-white/80 transition-all duration-200 hover:scale-105 active:scale-95"
          :disabled="loading"
          title="Refresh (R)"
          @click="$emit('refresh')"
        >
          <Icon
            icon="refresh"
            class="w-4 h-4 text-slate-600"
            :class="{ 'animate-spin': loading }"
          />
        </button>
      </div>
    </div>

    <!-- Customization Panel -->
    <div
      v-if="showCustomization"
      class="absolute top-16 right-4 z-20 bg-white rounded-lg shadow-xl border border-slate-200 p-4 min-w-[250px]"
    >
      <div class="flex items-center justify-between mb-3">
        <h4 class="font-semibold text-sm text-slate-900">Customize Widget</h4>
        <button
          class="p-1 rounded hover:bg-slate-100"
          @click="showCustomization = false"
        >
          <Icon icon="x" class="w-4 h-4 text-slate-600" />
        </button>
      </div>
      
      <div class="space-y-3">
        <div
          v-for="option in customizationOptions"
          :key="option.id"
          class="flex items-center justify-between"
        >
          <label
            :for="`setting-${option.id}`"
            class="text-sm text-slate-700 cursor-pointer"
          >
            {{ option.label }}
          </label>
          <button
            :id="`setting-${option.id}`"
            :class="[
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
              customSettings[option.id] ? 'bg-blue-600' : 'bg-slate-300'
            ]"
            @click="updateSetting(option.id, !customSettings[option.id])"
          >
            <span
              :class="[
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                customSettings[option.id] ? 'translate-x-6' : 'translate-x-1'
              ]"
            />
          </button>
        </div>
      </div>
    </div>

    <!-- Keyboard Help Panel -->
    <div
      v-if="showKeyboardHelp"
      class="absolute top-16 right-4 z-20 bg-white rounded-lg shadow-xl border border-slate-200 p-4 min-w-[280px]"
    >
      <div class="flex items-center justify-between mb-3">
        <h4 class="font-semibold text-sm text-slate-900">Keyboard Shortcuts</h4>
        <button
          class="p-1 rounded hover:bg-slate-100"
          @click="showKeyboardHelp = false"
        >
          <Icon icon="x" class="w-4 h-4 text-slate-600" />
        </button>
      </div>
      
      <div class="space-y-2">
        <div
          v-for="shortcut in keyboardShortcuts"
          :key="shortcut.key"
          class="flex items-center justify-between text-sm"
        >
          <span class="text-slate-700">{{ shortcut.description }}</span>
          <kbd class="px-2 py-1 bg-slate-100 border border-slate-300 rounded text-xs font-mono">
            {{ shortcut.key }}
          </kbd>
        </div>
      </div>
    </div>

    <!-- Body -->
    <div class="relative flex-1 overflow-hidden">
      <div
        v-if="loading"
        class="absolute inset-0 bg-white/90 backdrop-blur-sm z-10 flex items-center justify-center"
      >
        <Loader
          type="spin"
          size="medium"
          color="#3b82f6"
        />
      </div>
      
      <!-- Chart Canvas -->
      <canvas
        v-if="chartType && chartData"
        ref="chartCanvas"
        class="w-full h-full"
        :class="paddingClasses[padding]"
      />
      
      <!-- Regular Content -->
      <div
        v-else
        class="overflow-auto h-full"
        :class="paddingClasses[padding]"
      >
        <slot />
      </div>
    </div>

    <div
      v-if="$slots.footer"
      class="border-t border-slate-200 px-6 py-3 bg-slate-50 flex-shrink-0"
    >
      <slot name="footer" />
    </div>
  </div>
</template>