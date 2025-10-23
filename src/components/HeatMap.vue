<template>
  <div class="w-full h-full">
    <svg
      :width="width"
      :height="height"
      :viewBox="`0 0 ${width} ${height}`"
      class="overflow-visible"
    >
      <defs>
        <!-- Define gradient for smooth color transitions -->
        <linearGradient id="heatmapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" :style="`stop-color:${colorScale[0]};stop-opacity:1`" />
          <stop offset="50%" :style="`stop-color:${colorScale[1]};stop-opacity:1`" />
          <stop offset="100%" :style="`stop-color:${colorScale[2]};stop-opacity:1`" />
        </linearGradient>
      </defs>

      <!-- Grid cells -->
      <g>
        <template v-for="(row, rowIndex) in data" :key="`row-${rowIndex}`">
          <rect
            v-for="(cell, colIndex) in row"
            :key="`cell-${rowIndex}-${colIndex}`"
            :x="getCellX(colIndex)"
            :y="getCellY(rowIndex)"
            :width="cellWidth"
            :height="cellHeight"
            :fill="getCellColor(cell)"
            :stroke="showGridLines ? gridColor : 'none'"
            :stroke-width="gridStrokeWidth"
            :class="cellClasses"
            @mouseenter="handleCellMouseEnter($event, cell, rowIndex, colIndex)"
            @mouseleave="handleMouseLeave"
          />
        </template>
      </g>

      <!-- Vertical axis grid lines -->
      <g v-if="showAxes">
        <line
          v-for="i in xAxisTicks"
          :key="`vline-${i}`"
          :x1="padding.left + i * cellWidth"
          :y1="padding.top"
          :x2="padding.left + i * cellWidth"
          :y2="padding.top + chartHeight"
          :stroke="i === 0 || i === numCols ? axisStrokeColor : (showMajorGridLines ? gridColor : 'none')"
          :stroke-width="i === 0 || i === numCols ? axisStrokeWidth : majorGridStrokeWidth"
        />
      </g>

      <!-- Horizontal axis grid lines -->
      <g v-if="showAxes">
        <line
          v-for="i in yAxisTicks"
          :key="`hline-${i}`"
          :x1="padding.left"
          :y1="padding.top + i * cellHeight"
          :x2="padding.left + chartWidth"
          :y2="padding.top + i * cellHeight"
          :stroke="i === 0 || i === numRows ? axisStrokeColor : (showMajorGridLines ? gridColor : 'none')"
          :stroke-width="i === 0 || i === numRows ? axisStrokeWidth : majorGridStrokeWidth"
        />
      </g>

      <!-- X-axis labels -->
      <g v-if="showAxes && xAxisLabels.length">
        <text
          v-for="(label, i) in xAxisLabels"
          :key="`xlabel-${i}`"
          :x="padding.left + i * cellWidth"
          :y="height - padding.bottom + xAxisLabelOffset"
          text-anchor="middle"
          :class="axisLabelClasses"
        >
          {{ label }}
        </text>
      </g>

      <!-- Y-axis labels -->
      <g v-if="showAxes && yAxisLabels.length">
        <text
          v-for="(label, i) in yAxisLabels"
          :key="`ylabel-${i}`"
          :x="padding.left - yAxisLabelOffset"
          :y="padding.top + (numRows - i) * cellHeight - cellHeight / 2"
          text-anchor="middle"
          dominant-baseline="middle"
          :class="axisLabelClasses"
        >
          {{ label }}
        </text>
      </g>

      <!-- Column headers/titles -->
      <g v-if="columnHeaders && columnHeaders.length">
        <text
          v-for="(header, index) in columnHeaders"
          :key="`header-${index}`"
          :x="header.x !== undefined ? padding.left + header.x * cellWidth : padding.left + header.col * cellWidth"
          :y="padding.top - headerOffset"
          text-anchor="middle"
          :class="headerClasses"
        >
          {{ header.label }}
        </text>
      </g>

      <!-- Bubbles -->
      <g v-if="bubbles && bubbles.length">
        <g v-for="(bubble, index) in bubbles" :key="`bubble-group-${index}`">
          <circle
            :cx="getBubbleX(bubble)"
            :cy="getBubbleY(bubble)"
            :r="bubble.radius || 10"
            :fill="bubble.color || '#ffffff'"
            :stroke="bubble.stroke || bubble.color"
            :stroke-width="bubble.strokeWidth || (bubble.stroke ? 3 : 0)"
            :fill-opacity="bubble.opacity || 0.9"
            :class="bubbleClasses"
            @mouseenter="handleBubbleMouseEnter($event, bubble, index)"
            @mouseleave="handleMouseLeave"
          />
          <!-- Text inside bubble (for count indicators) -->
          <text
            v-if="bubble.text"
            :x="getBubbleX(bubble)"
            :y="getBubbleY(bubble)"
            text-anchor="middle"
            dominant-baseline="middle"
            :class="bubble.textClasses || 'text-xs fill-white font-bold pointer-events-none'"
          >
            {{ bubble.text }}
          </text>
          <!-- Label above bubble -->
          <text
            v-if="bubble.label && !bubble.text"
            :x="getBubbleX(bubble)"
            :y="getBubbleY(bubble) - (bubble.radius || 10) - 8"
            text-anchor="middle"
            :class="bubbleLabelClasses"
          >
            {{ bubble.label }}
          </text>
        </g>
      </g>

      <!-- Tooltip (SVG-based) -->
      <g v-if="tooltip.visible && tooltip.useSvg">
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

    <!-- Tooltip (HTML-based, positioned outside SVG) -->
    <div
      v-if="tooltip.visible && !tooltip.useSvg"
      class="fixed bg-gray-800 text-white px-3 py-1 rounded text-xs pointer-events-none z-50"
      :style="{
        left: tooltip.x + 'px',
        top: tooltip.y + 'px',
        transform: 'translate(-50%, -100%)'
      }"
    >
      {{ tooltip.content }}
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    required: true,
    validator: (value) => Array.isArray(value) && value.every(row => Array.isArray(row))
  },
  bubbles: {
    type: Array,
    default: () => []
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
    default: () => ({ top: 60, right: 80, bottom: 60, left: 80 })
  },
  colorScale: {
    type: Array,
    default: () => ['#10b981', '#fbbf24', '#ef4444'] // green, yellow, red
  },
  minValue: {
    type: Number,
    default: 0
  },
  maxValue: {
    type: Number,
    default: 100
  },
  showGridLines: {
    type: Boolean,
    default: false
  },
  showMajorGridLines: {
    type: Boolean,
    default: true
  },
  gridColor: {
    type: String,
    default: '#6b7280'
  },
  gridStrokeWidth: {
    type: Number,
    default: 0.5
  },
  majorGridStrokeWidth: {
    type: Number,
    default: 1
  },
  showAxes: {
    type: Boolean,
    default: true
  },
  xAxisLabels: {
    type: Array,
    default: () => []
  },
  yAxisLabels: {
    type: Array,
    default: () => []
  },
  columnHeaders: {
    type: Array,
    default: () => []
  },
  axisStrokeColor: {
    type: String,
    default: '#6b7280'
  },
  axisStrokeWidth: {
    type: Number,
    default: 2
  },
  xAxisLabelOffset: {
    type: Number,
    default: 30
  },
  yAxisLabelOffset: {
    type: Number,
    default: 30
  },
  headerOffset: {
    type: Number,
    default: 20
  },
  cellClasses: {
    type: String,
    default: 'transition-opacity duration-200 hover:opacity-80 cursor-pointer'
  },
  bubbleClasses: {
    type: String,
    default: 'cursor-pointer transition-all'
  },
  axisLabelClasses: {
    type: String,
    default: 'text-sm fill-gray-700'
  },
  headerClasses: {
    type: String,
    default: 'text-xs fill-gray-600 font-medium'
  },
  bubbleLabelClasses: {
    type: String,
    default: 'text-xs fill-gray-700 font-medium pointer-events-none'
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
  useSvgTooltip: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['cell-click', 'cell-hover', 'bubble-click', 'bubble-hover'])

const tooltip = ref({
  visible: false,
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  content: '',
  useSvg: props.useSvgTooltip
})

// Computed properties
const numRows = computed(() => props.data.length)
const numCols = computed(() => props.data[0]?.length || 0)

const chartWidth = computed(() => props.width - props.padding.left - props.padding.right)
const chartHeight = computed(() => props.height - props.padding.top - props.padding.bottom)

const cellWidth = computed(() => chartWidth.value / numCols.value)
const cellHeight = computed(() => chartHeight.value / numRows.value)

const xAxisTicks = computed(() => {
  return Array.from({ length: numCols.value + 1 }, (_, i) => i)
})

const yAxisTicks = computed(() => {
  return Array.from({ length: numRows.value + 1 }, (_, i) => i)
})

// Methods
const getCellX = (colIndex) => {
  return props.padding.left + colIndex * cellWidth.value
}

const getCellY = (rowIndex) => {
  return props.padding.top + rowIndex * cellHeight.value
}

const getBubbleX = (bubble) => {
  if (bubble.px !== undefined) return bubble.px
  return props.padding.left + bubble.x * cellWidth.value
}

const getBubbleY = (bubble) => {
  if (bubble.py !== undefined) return bubble.py
  // Invert Y coordinate (0 at bottom, max at top)
  return props.padding.top + (numRows.value - bubble.y) * cellHeight.value - cellHeight.value / 2
}

const getCellColor = (value) => {
  if (value == null) return 'transparent'

  const normalizedValue = (value - props.minValue) / (props.maxValue - props.minValue)
  const clampedValue = Math.max(0, Math.min(1, normalizedValue))

  const scaleLength = props.colorScale.length - 1
  const index = Math.floor(clampedValue * scaleLength)
  const fraction = (clampedValue * scaleLength) - index

  if (index >= scaleLength) return props.colorScale[scaleLength]

  const color1 = props.colorScale[index]
  const color2 = props.colorScale[index + 1]

  return interpolateColor(color1, color2, fraction)
}

const interpolateColor = (color1, color2, fraction) => {
  const hex1 = color1.replace('#', '')
  const hex2 = color2.replace('#', '')

  const r1 = parseInt(hex1.substr(0, 2), 16)
  const g1 = parseInt(hex1.substr(2, 2), 16)
  const b1 = parseInt(hex1.substr(4, 2), 16)

  const r2 = parseInt(hex2.substr(0, 2), 16)
  const g2 = parseInt(hex2.substr(2, 2), 16)
  const b2 = parseInt(hex2.substr(4, 2), 16)

  const r = Math.round(r1 + (r2 - r1) * fraction)
  const g = Math.round(g1 + (g2 - g1) * fraction)
  const b = Math.round(b1 + (b2 - b1) * fraction)

  return `rgb(${r}, ${g}, ${b})`
}

const handleCellMouseEnter = (event, value, rowIndex, colIndex) => {
  const rect = event.target.getBoundingClientRect()

  if (props.useSvgTooltip) {
    tooltip.value = {
      visible: true,
      x: rect.left + rect.width / 2 - rect.left + event.target.getAttribute('x'),
      y: rect.top - rect.top + event.target.getAttribute('y'),
      width: 100,
      height: 24,
      content: `Value: ${value} (${rowIndex}, ${colIndex})`,
      useSvg: true
    }
  } else {
    tooltip.value = {
      visible: true,
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
      content: `Value: ${value}`,
      useSvg: false
    }
  }

  emit('cell-hover', { value, rowIndex, colIndex })
}

const handleBubbleMouseEnter = (event, bubble, index) => {
  const rect = event.target.getBoundingClientRect()

  if (props.useSvgTooltip) {
    tooltip.value = {
      visible: true,
      x: parseFloat(event.target.getAttribute('cx')),
      y: parseFloat(event.target.getAttribute('cy')),
      width: 120,
      height: 24,
      content: bubble.tooltip || bubble.label || `Bubble ${index + 1}`,
      useSvg: true
    }
  } else {
    tooltip.value = {
      visible: true,
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
      content: bubble.tooltip || bubble.label || `Bubble ${index + 1}`,
      useSvg: false
    }
  }

  emit('bubble-hover', { bubble, index })
}

const handleMouseLeave = () => {
  tooltip.value.visible = false
}
</script>