<script setup>
import { computed, ref } from 'vue'

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
    default: 'transition-all duration-200 hover:opacity-90 cursor-pointer'
  },
  axisLabelClasses: {
    type: String,
    default: 'fill-slate-600 text-xs font-medium'
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
  label: '',
  value: 0,
  color: ''
})

const maxDataValue = computed(() => {
  return props.maxValue || Math.max(...props.data)
})

const barWidth = computed(() => {
  const availableWidth = props.width - props.padding.left - props.padding.right
  return availableWidth / props.data.length * 0.7
})

const barSpacing = computed(() => {
  const availableWidth = props.width - props.padding.left - props.padding.right
  return availableWidth / props.data.length * 0.3
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
  const label = props.labels[index] || `Item ${index + 1}`

  tooltip.value = {
    visible: true,
    x: event.clientX,
    y: event.clientY,
    label,
    value,
    color: getBarColor(index)
  }

  emit('bar-hover', { value, index, label })
}

const handleMouseLeave = () => {
  tooltip.value.visible = false
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

      <!-- Bars with gradient -->
      <defs>
        <linearGradient
          v-for="(value, index) in data"
          :id="`barGradient-${index}`"
          :key="`gradient-${index}`"
          x1="0%"
          y1="0%"
          x2="0%"
          y2="100%"
        >
          <stop
            offset="0%"
            :stop-color="getBarColor(index)"
            stop-opacity="1"
          />
          <stop
            offset="100%"
            :stop-color="getBarColor(index)"
            stop-opacity="0.7"
          />
        </linearGradient>
      </defs>

      <g>
        <rect
          v-for="(value, index) in data"
          :key="`bar-${index}`"
          :x="getBarX(index)"
          :y="getBarY(value)"
          :width="barWidth"
          :height="getBarHeight(value)"
          :fill="`url(#barGradient-${index})`"
          :class="barClasses"
          rx="4"
          @mouseenter="handleMouseEnter($event, value, index)"
          @mouseleave="handleMouseLeave"
        >
          <animate
            attributeName="height"
            :from="0"
            :to="getBarHeight(value)"
            dur="0.8s"
            fill="freeze"
          />
          <animate
            attributeName="y"
            :from="padding.top + (height - padding.top - padding.bottom)"
            :to="getBarY(value)"
            dur="0.8s"
            fill="freeze"
          />
        </rect>
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
      <div class="bg-slate-900 text-white px-4 py-3 rounded-lg shadow-2xl border border-slate-700 min-w-[160px]">
        <div class="flex items-center gap-2 mb-1">
          <div
            :style="{ backgroundColor: tooltip.color }"
            class="w-3 h-3 rounded shadow-sm"
          />
          <p class="font-semibold text-sm">
            {{ tooltip.label }}
          </p>
        </div>
        <div class="ml-5">
          <span class="text-2xl font-bold">{{ tooltip.value }}</span>
        </div>
        <!-- Tooltip arrow -->
        <div
          class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-slate-900 border-r border-b border-slate-700"
        />
      </div>
    </div>
  </div>
</template>
