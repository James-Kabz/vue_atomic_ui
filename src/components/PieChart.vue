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
    default: () => ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316']
  },
  width: {
    type: Number,
    default: 400
  },
  height: {
    type: Number,
    default: 300
  },
  doughnut: {
    type: Boolean,
    default: false
  },
  innerRadiusRatio: {
    type: Number,
    default: 0.6
  },
  showValues: {
    type: Boolean,
    default: true
  },
  showPercentages: {
    type: Boolean,
    default: true
  },
  showLegend: {
    type: Boolean,
    default: true
  },
  showCenterText: {
    type: Boolean,
    default: true
  },
  legendPosition: {
    type: String,
    default: 'bottom', // 'bottom', 'right'
    validator: (value) => ['bottom', 'right'].includes(value)
  },
  strokeColor: {
    type: String,
    default: '#ffffff'
  },
  strokeWidth: {
    type: Number,
    default: 2
  },
  centerFill: {
    type: String,
    default: '#ffffff'
  },
  sliceClasses: {
    type: String,
    default: 'transition-all duration-200 hover:opacity-80 cursor-pointer'
  },
  valueLabelClasses: {
    type: String,
    default: 'fill-white text-xs font-bold'
  },
  centerTextClasses: {
    type: String,
    default: 'fill-slate-900 text-2xl font-bold'
  },
  centerLabelClasses: {
    type: String,
    default: 'fill-slate-600 text-sm'
  },
  legendTextClasses: {
    type: String,
    default: 'fill-slate-700 text-xs font-medium'
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
const totalValue = computed(() => {
  return props.data.reduce((sum, value) => sum + value, 0)
})

const centerX = computed(() => {
  return props.showLegend && props.legendPosition === 'right' 
    ? props.width / 3 
    : props.width / 2
})

const centerY = computed(() => {
  const legendHeight = props.showLegend && props.legendPosition === 'bottom' 
    ? Math.ceil(props.data.length / 2) * 25 
    : 0
  return (props.height - legendHeight) / 2
})

const radius = computed(() => {
  const legendHeight = props.showLegend && props.legendPosition === 'bottom' 
    ? Math.ceil(props.data.length / 2) * 25 
    : 0
  const availableHeight = props.height - legendHeight
  const availableWidth = props.showLegend && props.legendPosition === 'right' 
    ? props.width * 0.6 
    : props.width
  return Math.min(availableWidth, availableHeight) / 2 - 40
})

const innerRadius = computed(() => {
  return props.doughnut ? radius.value * props.innerRadiusRatio : 0
})

const slices = computed(() => {
  const total = totalValue.value
  let currentAngle = -Math.PI / 2 // Start at top

  return props.data.map((value, index) => {
    const percentage = ((value / total) * 100).toFixed(1)
    const sliceAngle = (value / total) * 2 * Math.PI
    const endAngle = currentAngle + sliceAngle

    // Create arc path
    const path = createArcPath(
      centerX.value,
      centerY.value,
      radius.value,
      innerRadius.value,
      currentAngle,
      endAngle
    )

    // Calculate label position (middle of slice)
    const labelRadius = props.doughnut 
      ? (radius.value + innerRadius.value) / 2 
      : radius.value * 0.7
    const midAngle = currentAngle + sliceAngle / 2
    const labelX = centerX.value + Math.cos(midAngle) * labelRadius
    const labelY = centerY.value + Math.sin(midAngle) * labelRadius

    const slice = {
      value,
      percentage,
      path,
      labelX,
      labelY,
      label: props.labels[index] || `Item ${index + 1}`,
      startAngle: currentAngle,
      endAngle
    }

    currentAngle = endAngle

    return slice
  })
})

// Methods
const createArcPath = (cx, cy, r, innerR, startAngle, endAngle) => {
  const x1 = cx + r * Math.cos(startAngle)
  const y1 = cy + r * Math.sin(startAngle)
  const x2 = cx + r * Math.cos(endAngle)
  const y2 = cy + r * Math.sin(endAngle)

  const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0

  if (innerR === 0) {
    // Regular pie chart
    return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`
  } else {
    // Doughnut chart
    const x3 = cx + innerR * Math.cos(endAngle)
    const y3 = cy + innerR * Math.sin(endAngle)
    const x4 = cx + innerR * Math.cos(startAngle)
    const y4 = cy + innerR * Math.sin(startAngle)

    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 ${largeArcFlag} 0 ${x4} ${y4} Z`
  }
}

const getSliceColor = (index) => {
  return props.colors[index % props.colors.length]
}

const getLegendX = (index) => {
  if (props.legendPosition === 'right') {
    return props.width * 0.65
  }
  const itemsPerRow = 2
  const col = index % itemsPerRow
  return props.width / 4 + col * (props.width / 2)
}

const getLegendY = (index) => {
  if (props.legendPosition === 'right') {
    return 40 + index * 25
  }
  const itemsPerRow = 2
  const row = Math.floor(index / itemsPerRow)
  const legendHeight = Math.ceil(props.data.length / 2) * 25
  return props.height - legendHeight + 20 + row * 25
}

const handleMouseEnter = (event, slice, index) => {
  const rect = event.target.getBoundingClientRect()

  tooltip.value = {
    visible: true,
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
    width: 100,
    height: 24,
    content: `${slice.label}: ${slice.value} (${slice.percentage}%)`
  }

  emit('slice-hover', { value: slice.value, index, label: slice.label, percentage: slice.percentage })
}

const handleMouseLeave = () => {
  tooltip.value.visible = false
}

const handleSliceClick = (slice, index) => {
  emit('slice-click', { value: slice.value, index, label: slice.label, percentage: slice.percentage })
}
</script>


<template>
  <div class="w-full h-full">
    <svg
      :width="width"
      :height="height"
      :viewBox="`0 0 ${width} ${height}`"
      class="overflow-visible"
    >
      <!-- Pie slices -->
      <g>
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
          @click="handleSliceClick(slice, index)"
        />
      </g>

      <!-- Center circle for doughnut -->
      <circle
        v-if="doughnut"
        :cx="centerX"
        :cy="centerY"
        :r="innerRadius"
        :fill="centerFill"
      />

      <!-- Center text for doughnut -->
      <g v-if="doughnut && showCenterText">
        <text
          :x="centerX"
          :y="centerY - 5"
          :class="centerTextClasses"
          text-anchor="middle"
          dominant-baseline="middle"
        >
          {{ totalValue }}
        </text>
        <text
          :x="centerX"
          :y="centerY + 15"
          :class="centerLabelClasses"
          text-anchor="middle"
          dominant-baseline="middle"
        >
          Total
        </text>
      </g>

      <!-- Value labels on slices -->
      <g v-if="showValues">
        <text
          v-for="(slice, index) in slices"
          :key="`value-${index}`"
          :x="slice.labelX"
          :y="slice.labelY"
          :class="valueLabelClasses"
          text-anchor="middle"
          dominant-baseline="middle"
        >
          {{ showPercentages ? `${slice.percentage}%` : slice.value }}
        </text>
      </g>

      <!-- Legend -->
      <g v-if="showLegend">
        <g
          v-for="(slice, index) in slices"
          :key="`legend-${index}`"
          :transform="`translate(${getLegendX(index)}, ${getLegendY(index)})`"
        >
          <rect
            :width="12"
            :height="12"
            :fill="getSliceColor(index)"
            rx="2"
          />
          <text
            :x="18"
            :y="10"
            :class="legendTextClasses"
          >
            {{ slice.label }}
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
