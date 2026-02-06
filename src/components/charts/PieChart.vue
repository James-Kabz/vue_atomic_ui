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
        default: 'bottom',
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
        default: 'fill-(--ui-surface) text-sm font-bold drop-shadow-md'
    },
    centerTextClasses: {
        type: String,
        default: 'fill-(--ui-text) text-2xl font-bold'
    },
    centerLabelClasses: {
        type: String,
        default: 'fill-(--ui-text) text-sm'
    },
    legendTextClasses: {
        type: String,
        default: 'fill-(--ui-text) text-xs font-medium'
    }
})

const emit = defineEmits(['slice-click', 'slice-hover'])

const tooltip = ref({
    visible: false,
    x: 0,
    y: 0,
    label: '',
    value: 0,
    percentage: '0',
    color: ''
})

// Computed properties
const totalValue = computed(() => {
    const sum = props.data.reduce((sum, value) => sum + (value || 0), 0)
    return sum || 0
})

const hasValidData = computed(() => {
    return props.data.length > 0 && totalValue.value > 0
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
    if (!hasValidData.value) return []

    const total = totalValue.value
    let currentAngle = -Math.PI / 2

    return props.data.map((value, index) => {
        const safeValue = value || 0
        const percentage = ((safeValue / total) * 100).toFixed(1)
        const sliceAngle = (safeValue / total) * 2 * Math.PI
        const endAngle = currentAngle + sliceAngle

        const path = createArcPath(
            centerX.value,
            centerY.value,
            radius.value,
            innerRadius.value,
            currentAngle,
            endAngle
        )

        const labelRadius = props.doughnut
            ? (radius.value + innerRadius.value) / 2
            : radius.value * 0.7
        const midAngle = currentAngle + sliceAngle / 2
        const labelX = centerX.value + Math.cos(midAngle) * labelRadius
        const labelY = centerY.value + Math.sin(midAngle) * labelRadius

        const slice = {
            value: safeValue,
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
    }).filter(slice => slice.value > 0)
})

// Methods
const createArcPath = (cx, cy, r, innerR, startAngle, endAngle) => {
    const x1 = cx + r * Math.cos(startAngle)
    const y1 = cy + r * Math.sin(startAngle)
    const x2 = cx + r * Math.cos(endAngle)
    const y2 = cy + r * Math.sin(endAngle)

    const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0

    if (innerR === 0) {
        return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`
    } else {
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
    tooltip.value = {
        visible: true,
        x: event.clientX,
        y: event.clientY,
        label: slice.label,
        value: slice.value,
        percentage: slice.percentage,
        color: getSliceColor(index)
    }

    emit('slice-hover', {
        value: slice.value,
        index,
        label: slice.label,
        percentage: slice.percentage
    })
}

const handleMouseLeave = () => {
    tooltip.value.visible = false
}

const handleSliceClick = (slice, index) => {
    emit('slice-click', {
        value: slice.value,
        index,
        label: slice.label,
        percentage: slice.percentage
    })
}
</script>

<template>
  <div class="w-full h-full relative">
    <!-- Empty State -->
    <div
      v-if="!hasValidData"
      class="w-full h-full flex items-center justify-center"
    >
      <div class="text-center">
        <div class="ui-text mb-2">
          <svg
            class="w-16 h-16 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
            />
          </svg>
        </div>
        <p class="text-sm ui-text">
          No data available
        </p>
      </div>
    </div>

    <!-- Chart -->
    <svg
      v-else
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
      <div class="--ui-bg ui-text px-4 py-3 rounded-lg shadow-2xl border ui-border-strong min-w-[180px]">
        <div class="flex items-center gap-2 mb-1.5">
          <div
            :style="{ backgroundColor: tooltip.color }"
            class="w-3 h-3 rounded-full shadow-sm"
          />
          <p class="font-semibold text-sm">
            {{ tooltip.label }}
          </p>
        </div>
        <div class="flex items-baseline gap-2 ml-5">
          <span class="text-2xl font-bold">{{ tooltip.value }}</span>
          <span class="text-xs ui-text">tasks</span>
        </div>
        <div class="mt-1 ml-5">
          <span class="text-xs ui-text">{{ tooltip.percentage }}% of total</span>
        </div>
        <!-- Tooltip arrow -->
        <div
          class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 --ui-bg border-r border-b ui-border-strong"
        />
      </div>
    </div>
  </div>
</template>
