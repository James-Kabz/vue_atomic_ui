<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    required: true,
    // Expected format: [{ complied: 60, uncomplied: 40 }, ...]
  },
  labels: {
    type: Array,
    default: () => []
  },
  colors: {
    type: Array,
    default: () => ['#f97316', '#10b981'], // [uncomplied color (bottom), complied color (top)]
  },
  stackKeys: {
    type: Array,
    default: () => ['uncomplied', 'complied'] // Bottom to top order
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
    default: 'transition-all duration-200 hover:opacity-90 cursor-pointer'
  },
  axisLabelClasses: {
    type: String,
    default: 'fill-slate-600 text-xs font-medium'
  },
  maxValue: {
    type: Number,
    default: 100 // Default for percentages
  },
  xAxisLabel: {
    type: String,
    default: ''
  },
  yAxisLabel: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['bar-click', 'bar-hover', 'segment-click', 'segment-hover'])

const tooltip = ref({
  visible: false,
  x: 0,
  y: 0,
  label: '',
  segmentLabel: '',
  value: 0,
  percentage: 0,
  color: ''
})

const chartHeight = computed(() => {
  return props.height - props.padding.top - props.padding.bottom
})

const chartWidth = computed(() => {
  return props.width - props.padding.left - props.padding.right
})

const barWidth = computed(() => {
  const spacing = Math.min(chartWidth.value / props.data.length * 0.3, 40)
  return (chartWidth.value - spacing * (props.data.length + 1)) / props.data.length
})

const getBarX = (index) => {
  const spacing = Math.min(chartWidth.value / props.data.length * 0.3, 40)
  return props.padding.left + spacing + index * (barWidth.value + spacing)
}

const yTicks = computed(() => {
  const ticks = []
  const numTicks = 5

  for (let i = 0; i <= numTicks; i++) {
    const y = props.padding.top + (chartHeight.value / numTicks) * i
    ticks.push(y)
  }

  return ticks
})

// Calculate the Y position for a segment (from bottom)
const getSegmentY = (dataIndex, stackIndex) => {
  const item = props.data[dataIndex]
  const scale = chartHeight.value / props.maxValue
  
  // Calculate cumulative height from bottom up to and including this segment
  let cumulativeValue = 0
  for (let i = 0; i <= stackIndex; i++) {
    const key = props.stackKeys[i]
    cumulativeValue += item[key] || 0
  }
  
  // Y position is from top, so we subtract from bottom
  return props.padding.top + chartHeight.value - (cumulativeValue * scale)
}

const getSegmentHeight = (dataIndex, stackIndex) => {
  const item = props.data[dataIndex]
  const key = props.stackKeys[stackIndex]
  const value = item[key] || 0
  const scale = chartHeight.value / props.maxValue
  return value * scale
}

const getSegmentColor = (stackIndex) => {
  return props.colors[stackIndex % props.colors.length]
}

const getYAxisLabel = (tick) => {
  const value = ((props.height - props.padding.bottom - tick) / chartHeight.value) * props.maxValue
  return Math.round(value)
}

const formatSegmentLabel = (key) => {
  return key.charAt(0).toUpperCase() + key.slice(1)
}

const getTotalValue = (dataIndex) => {
  const item = props.data[dataIndex]
  return props.stackKeys.reduce((sum, key) => sum + (item[key] || 0), 0)
}

const handleMouseEnter = (event, dataIndex, stackIndex) => {
  const item = props.data[dataIndex]
  const key = props.stackKeys[stackIndex]
  const value = item[key] || 0
  const total = getTotalValue(dataIndex)
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0
  const label = props.labels[dataIndex] || `Item ${dataIndex + 1}`
  const segmentLabel = formatSegmentLabel(key)

  tooltip.value = {
    visible: true,
    x: event.clientX,
    y: event.clientY,
    label,
    segmentLabel,
    value,
    percentage,
    color: getSegmentColor(stackIndex)
  }

  emit('segment-hover', { dataIndex, stackIndex, key, value, label })
}

const handleMouseLeave = () => {
  tooltip.value.visible = false
}

const handleSegmentClick = (dataIndex, stackIndex) => {
  const item = props.data[dataIndex]
  const key = props.stackKeys[stackIndex]
  const value = item[key] || 0
  const label = props.labels[dataIndex] || `Item ${dataIndex + 1}`

  emit('segment-click', { dataIndex, stackIndex, key, value, label })
}
</script>

<template>
  <div class="w-full h-full relative">
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
          stroke-dasharray="4,4"
          opacity="0.3"
        />
      </g>

      <!-- Gradients for each segment type -->
      <defs>
        <linearGradient
          v-for="(key, stackIndex) in stackKeys"
          :id="`stackGradient-${stackIndex}`"
          :key="`gradient-${stackIndex}`"
          x1="0%"
          y1="0%"
          x2="0%"
          y2="100%"
        >
          <stop
            offset="0%"
            :stop-color="getSegmentColor(stackIndex)"
            stop-opacity="0.95"
          />
          <stop
            offset="100%"
            :stop-color="getSegmentColor(stackIndex)"
            stop-opacity="0.85"
          />
        </linearGradient>
      </defs>

      <!-- Stacked Bar Segments (render bottom to top) -->
      <g>
        <g
          v-for="(item, dataIndex) in data"
          :key="`bar-group-${dataIndex}`"
        >
          <rect
            v-for="(key, stackIndex) in stackKeys"
            :key="`segment-${dataIndex}-${stackIndex}`"
            :x="getBarX(dataIndex)"
            :y="getSegmentY(dataIndex, stackIndex)"
            :width="barWidth"
            :height="getSegmentHeight(dataIndex, stackIndex)"
            :fill="`url(#stackGradient-${stackIndex})`"
            :class="barClasses"
            rx="0"
            @mouseenter="handleMouseEnter($event, dataIndex, stackIndex)"
            @mouseleave="handleMouseLeave"
            @click="handleSegmentClick(dataIndex, stackIndex)"
          >
            <animate
              attributeName="height"
              :from="0"
              :to="getSegmentHeight(dataIndex, stackIndex)"
              dur="0.6s"
              :begin="`${stackIndex * 0.05}s`"
              fill="freeze"
            />
            <animate
              attributeName="y"
              :from="padding.top + chartHeight"
              :to="getSegmentY(dataIndex, stackIndex)"
              dur="0.6s"
              :begin="`${stackIndex * 0.05}s`"
              fill="freeze"
            />
          </rect>
        </g>
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

      <!-- X-axis title -->
      <g v-if="xAxisLabel">
        <text
          :x="padding.left + chartWidth / 2"
          :y="height - 10"
          class="fill-slate-700 text-sm font-semibold"
          text-anchor="middle"
        >
          {{ xAxisLabel }}
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

      <!-- Y-axis title -->
      <g v-if="yAxisLabel">
        <text
          :x="-(padding.top + chartHeight / 2)"
          :y="15"
          class="fill-slate-700 text-sm font-semibold"
          text-anchor="middle"
          transform="rotate(-90)"
        >
          {{ yAxisLabel }}
        </text>
      </g>

      <!-- Axes lines -->
      <line
        :x1="padding.left"
        :y1="padding.top"
        :x2="padding.left"
        :y2="height - padding.bottom"
        stroke="#cbd5e1"
        stroke-width="2"
      />
      <line
        :x1="padding.left"
        :y1="height - padding.bottom"
        :x2="width - padding.right"
        :y2="height - padding.bottom"
        stroke="#cbd5e1"
        stroke-width="2"
      />
    </svg>

    <!-- Professional Tooltip -->
    <div
      v-if="tooltip.visible"
      :style="{
        position: 'fixed',
        left: `${tooltip.x}px`,
        top: `${tooltip.y}px`,
        transform: 'translate(-50%, -120%)',
        pointerEvents: 'none',
        zIndex: 9999
      }"
      class="animate-in fade-in duration-200"
    >
      <div class="bg-slate-900 text-white px-4 py-3 rounded-lg shadow-2xl border border-slate-700 min-w-[180px]">
        <div class="flex items-center gap-2 mb-2">
          <div
            :style="{ backgroundColor: tooltip.color }"
            class="w-3 h-3 rounded shadow-sm"
          />
          <p class="font-semibold text-sm">
            {{ tooltip.label }}
          </p>
        </div>
        <div class="ml-5">
          <p class="text-xs text-slate-300 mb-1">{{ tooltip.segmentLabel }}</p>
          <span class="text-2xl font-bold">{{ tooltip.value }}%</span>
        </div>
        <!-- Tooltip arrow -->
        <div
          class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-slate-900 border-r border-b border-slate-700"
        />
      </div>
    </div>
  </div>
</template>