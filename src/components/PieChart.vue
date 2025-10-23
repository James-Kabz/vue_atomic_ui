<template>
  <div class="w-full h-full flex items-center justify-center">
    <svg
      :width="size"
      :height="size"
      :viewBox="`0 0 ${size} ${size}`"
      class="overflow-visible"
    >
      <!-- Pie slices -->
      <g :transform="`translate(${centerX}, ${centerY})`">
        <path
          v-for="(slice, index) in slices"
          :key="`slice-${index}`"
          :d="slice.path"
          :fill="getSliceColor(index)"
          :stroke="strokeColor"
          :stroke-width="strokeWidth"
          :class="sliceClasses"
          @mouseenter="handleMouseEnter($event, slice, index)"
          @mouseleave="handleMouseLeave"
        />
      </g>

      <!-- Center circle for donut chart -->
      <circle
        v-if="donut"
        :cx="centerX"
        :cy="centerY"
        :r="donutRadius"
        :fill="donutFill"
      />

      <!-- Labels -->
      <g v-if="showLabels">
        <text
          v-for="(slice, index) in slices"
          :key="`label-${index}`"
          :x="getLabelX(slice, index)"
          :y="getLabelY(slice, index)"
          :class="labelClasses"
          text-anchor="middle"
          dominant-baseline="middle"
        >
          {{ getLabelText(slice, index) }}
        </text>
      </g>

      <!-- Legend -->
      <g v-if="showLegend" :transform="`translate(0, ${size + 20})`">
        <g
          v-for="(slice, index) in slices"
          :key="`legend-${index}`"
          :transform="`translate(${index * legendItemWidth}, 0)`"
        >
          <rect
            :x="0"
            :y="0"
            :width="legendItemHeight"
            :height="legendItemHeight"
            :fill="getSliceColor(index)"
            :stroke="strokeColor"
            :stroke-width="1"
          />
          <text
            :x="legendItemHeight + 8"
            :y="legendItemHeight / 2 + 4"
            :class="legendTextClasses"
          >
            {{ getLegendText(slice, index) }}
          </text>
        </g>
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
    default: () => ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4']
  },
  size: {
    type: Number,
    default: 300
  },
  donut: {
    type: Boolean,
    default: false
  },
  donutRadius: {
    type: Number,
    default: 60
  },
  donutFill: {
    type: String,
    default: '#ffffff'
  },
  strokeColor: {
    type: String,
    default: '#ffffff'
  },
  strokeWidth: {
    type: Number,
    default: 2
  },
  showLabels: {
    type: Boolean,
    default: false
  },
  showLegend: {
    type: Boolean,
    default: true
  },
  labelType: {
    type: String,
    default: 'percentage',
    validator: (value) => ['value', 'percentage', 'label'].includes(value)
  },
  sliceClasses: {
    type: String,
    default: 'transition-all duration-200 hover:opacity-80 cursor-pointer'
  },
  labelClasses: {
    type: String,
    default: 'fill-white text-xs font-semibold'
  },
  legendTextClasses: {
    type: String,
    default: 'fill-slate-600 text-sm font-medium'
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
  }
})

const emit = defineEmits(['slice-click', 'slice-hover'])

const tooltip = ref({
  visible: false,
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  content: ''
})

// Computed properties
const centerX = computed(() => props.size / 2)
const centerY = computed(() => props.size / 2)
const radius = computed(() => (props.size - 40) / 2)

const total = computed(() => props.data.reduce((sum, value) => sum + value, 0))

const slices = computed(() => {
  let currentAngle = -Math.PI / 2 // Start from top

  return props.data.map((value, index) => {
    const percentage = value / total.value
    const angle = percentage * 2 * Math.PI
    const startAngle = currentAngle
    const endAngle = currentAngle + angle

    const path = describeArc(centerX.value, centerY.value, radius.value, startAngle, endAngle)

    currentAngle = endAngle

    return {
      path,
      value,
      percentage,
      startAngle,
      endAngle,
      index
    }
  })
})

const legendItemWidth = computed(() => {
  const maxLabelLength = Math.max(...props.labels.map(label => label.length))
  return Math.max(80, maxLabelLength * 8 + 30)
})

const legendItemHeight = computed(() => 16)

// Methods
const describeArc = (x, y, radius, startAngle, endAngle) => {
  const startX = x + Math.cos(startAngle) * radius
  const startY = y + Math.sin(startAngle) * radius
  const endX = x + Math.cos(endAngle) * radius
  const endY = y + Math.sin(endAngle) * radius

  const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0

  const pathData = [
    `M ${startX} ${startY}`,
    `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`
  ]

  if (props.donut) {
    const innerStartX = x + Math.cos(endAngle) * props.donutRadius
    const innerStartY = y + Math.sin(endAngle) * props.donutRadius
    const innerEndX = x + Math.cos(startAngle) * props.donutRadius
    const innerEndY = y + Math.sin(startAngle) * props.donutRadius

    pathData.push(`L ${innerStartX} ${innerStartY}`)
    pathData.push(`A ${props.donutRadius} ${props.donutRadius} 0 ${largeArcFlag} 0 ${innerEndX} ${innerEndY}`)
    pathData.push('Z')
  } else {
    pathData.push(`L ${x} ${y} Z`)
  }

  return pathData.join(' ')
}

const getSliceColor = (index) => {
  return props.colors[index % props.colors.length]
}

const getLabelX = (slice, index) => {
  const midAngle = (slice.startAngle + slice.endAngle) / 2
  const labelRadius = radius.value * 0.7
  return centerX.value + Math.cos(midAngle) * labelRadius
}

const getLabelY = (slice, index) => {
  const midAngle = (slice.startAngle + slice.endAngle) / 2
  const labelRadius = radius.value * 0.7
  return centerY.value + Math.sin(midAngle) * labelRadius
}

const getLabelText = (slice, index) => {
  switch (props.labelType) {
    case 'value':
      return slice.value.toString()
    case 'percentage':
      return `${Math.round(slice.percentage * 100)}%`
    case 'label':
      return props.labels[index] || `Item ${index + 1}`
    default:
      return `${Math.round(slice.percentage * 100)}%`
  }
}

const getLegendText = (slice, index) => {
  const label = props.labels[index] || `Item ${index + 1}`
  const percentage = Math.round(slice.percentage * 100)
  return `${label} (${percentage}%)`
}

const handleMouseEnter = (event, slice, index) => {
  const rect = event.target.getBoundingClientRect()
  const label = props.labels[index] || `Item ${index + 1}`

  tooltip.value = {
    visible: true,
    x: rect.left + rect.width / 2,
    y: rect.top,
    width: 100,
    height: 24,
    content: `${label}: ${slice.value} (${Math.round(slice.percentage * 100)}%)`
  }

  emit('slice-hover', { slice, index, label })
}

const handleMouseLeave = () => {
  tooltip.value.visible = false
}
</script>