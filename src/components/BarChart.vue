<template>
  <div class="w-full h-full">
    <svg
      :width="width"
      :height="height"
      :viewBox="`0 0 ${width} ${height}`"
      class="overflow-visible"
    >
      <!-- Grid lines -->
      <g v-if="showGrid">
        <line
          v-for="tick in yTicks"
          :key="`grid-${tick}`"
          :x1="padding.left"
          :y1="tick"
          :x2="width - padding.right"
          :y2="tick"
          :stroke="gridColor"
          stroke-width="1"
          stroke-dasharray="2,2"
        />
      </g>

      <!-- Bars -->
      <g>
        <rect
          v-for="(value, index) in data"
          :key="`bar-${index}`"
          :x="getBarX(index)"
          :y="getBarY(value)"
          :width="barWidth"
          :height="getBarHeight(value)"
          :fill="getBarColor(index)"
          :class="barClasses"
          @mouseenter="handleMouseEnter($event, value, index)"
          @mouseleave="handleMouseLeave"
        />
      </g>

      <!-- X-axis labels -->
      <g v-if="showXAxis">
        <text
          v-for="(label, index) in labels"
          :key="`xlabel-${index}`"
          :x="getBarX(index) + barWidth / 2"
          :y="height - padding.bottom + 20"
          :class="axisLabelClasses"
          text-anchor="middle"
        >
          {{ label }}
        </text>
      </g>

      <!-- Y-axis labels -->
      <g v-if="showYAxis">
        <text
          v-for="tick in yTicks"
          :key="`ylabel-${tick}`"
          :x="padding.left - 10"
          :y="tick + 4"
          :class="axisLabelClasses"
          text-anchor="end"
        >
          {{ getYAxisLabel(tick) }}
        </text>
      </g>

      <!-- Tooltip -->
      <g v-if="tooltip.visible">
        <rect
          :x="tooltip.x - tooltip.width / 2"
          :y="tooltip.y - tooltip.height - 10"
          :width="tooltip.width"
          :height="tooltip.height"
          :fill="tooltipBackground"
          :stroke="tooltipBorder"
          stroke-width="1"
          rx="4"
        />
        <text
          :x="tooltip.x"
          :y="tooltip.y - tooltip.height / 2 - 2"
          :class="tooltipTextClasses"
          text-anchor="middle"
        >
          {{ tooltip.content }}
        </text>
      </g>
    </svg>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { cn } from '../utils/cn.js'

const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  labels: {
    type: Array,
    default: () => []
  },
  colors: {
    type: Array,
    default: () => ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6']
  },
  width: {
    type: Number,
    default: 400
  },
  height: {
    type: Number,
    default: 300
  },
  padding: {
    type: Object,
    default: () => ({ top: 20, right: 20, bottom: 60, left: 60 })
  },
  showGrid: {
    type: Boolean,
    default: true
  },
  showXAxis: {
    type: Boolean,
    default: true
  },
  showYAxis: {
    type: Boolean,
    default: true
  },
  gridColor: {
    type: String,
    default: '#e5e7eb'
  },
  barClasses: {
    type: String,
    default: 'transition-all duration-200 hover:opacity-80 cursor-pointer'
  },
  axisLabelClasses: {
    type: String,
    default: 'fill-slate-600 text-xs font-medium'
  },
  tooltipBackground: {
    type: String,
    default: '#1f2937'
  },
  tooltipBorder: {
    type: String,
    default: '#374151'
  },
  tooltipTextClasses: {
    type: String,
    default: 'fill-white text-xs font-medium'
  },
  maxValue: {
    type: Number,
    default: null
  }
})

const emit = defineEmits(['bar-click', 'bar-hover'])

const tooltip = ref({
  visible: false,
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  content: ''
})

// Computed properties
const maxDataValue = computed(() => {
  return props.maxValue || Math.max(...props.data)
})

const barWidth = computed(() => {
  const availableWidth = props.width - props.padding.left - props.padding.right
  return availableWidth / props.data.length * 0.8
})

const barSpacing = computed(() => {
  const availableWidth = props.width - props.padding.left - props.padding.right
  return availableWidth / props.data.length * 0.2
})

const yTicks = computed(() => {
  const ticks = []
  const chartHeight = props.height - props.padding.top - props.padding.bottom
  const numTicks = 5

  for (let i = 0; i <= numTicks; i++) {
    const y = props.padding.top + (chartHeight / numTicks) * i
    ticks.push(y)
  }

  return ticks
})

// Methods
const getBarX = (index) => {
  return props.padding.left + index * (barWidth.value + barSpacing.value) + barSpacing.value / 2
}

const getBarY = (value) => {
  const chartHeight = props.height - props.padding.top - props.padding.bottom
  const scale = chartHeight / maxDataValue.value
  return props.padding.top + chartHeight - (value * scale)
}

const getBarHeight = (value) => {
  const chartHeight = props.height - props.padding.top - props.padding.bottom
  const scale = chartHeight / maxDataValue.value
  return value * scale
}

const getBarColor = (index) => {
  return props.colors[index % props.colors.length]
}

const getYAxisLabel = (tick) => {
  const chartHeight = props.height - props.padding.top - props.padding.bottom
  const value = ((props.height - props.padding.bottom - tick) / chartHeight) * maxDataValue.value
  return Math.round(value)
}

const handleMouseEnter = (event, value, index) => {
  const rect = event.target.getBoundingClientRect()
  const label = props.labels[index] || `Item ${index + 1}`

  tooltip.value = {
    visible: true,
    x: rect.left + rect.width / 2,
    y: rect.top,
    width: 80,
    height: 24,
    content: `${label}: ${value}`
  }

  emit('bar-hover', { value, index, label })
}

const handleMouseLeave = () => {
  tooltip.value.visible = false
}
</script>