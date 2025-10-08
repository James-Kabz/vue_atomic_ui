<script setup>
import { computed, ref, watch } from 'vue'
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Icon,
  Modal,
  Progress,
  Accordion,
  AccordionItem,
} from '@stlhorizon/vue-ui'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  risk: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue', 'close', 'addMatrix'])

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const currentMatrixIndex = ref(0)

const sortedMatrices = computed(() => {
  if (!props.risk?.matrices) return []
  return [...props.risk.matrices].sort((a, b) => new Date(a.review_date) - new Date(b.review_date))
})

const getRiskColor = (level) => {
  const colors = {
    Low: 'green',
    Medium: 'yellow',
    High: 'red',
    Critical: 'red'
  }
  return colors[level] || 'gray'
}

const accordionItems = computed(() => {
  return sortedMatrices.value.map((matrix) => ({
    title: `
      <div class="flex items-center justify-between w-full">
        <div class="flex items-center gap-3">
          <div class="w-3 h-3 rounded-full bg-${getRiskColor(matrix.probability.probability)}-500"></div>
          <span class="font-semibold text-slate-800">${matrix.matrix}</span>
        </div>
        <div class="flex items-center gap-4 text-sm">
          <span class="flex items-center gap-1">
            <i class="fas fa-calendar text-blue-600"></i>
            <span class="text-slate-600">${new Date(matrix.review_date).toLocaleDateString()}</span>
          </span>
        </div>
      </div>
    `,
    content: `
      <div class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <div class="bg-white p-4 rounded-lg border border-slate-200">
              <div class="flex items-center gap-2 mb-2">
                <i class="fas fa-chart-line text-blue-600"></i>
                <span class="text-sm font-medium text-slate-700">Probability</span>
              </div>
              <div class="text-lg font-bold text-slate-800 mb-1">${matrix.probability.probability}</div>
              <Progress :value="matrix.probability_percentage" class="h-2" />
              <div class="text-xs text-slate-500 mt-1">${matrix.probability_percentage}%</div>
            </div>
            <div class="bg-white p-4 rounded-lg border border-slate-200">
              <div class="flex items-center gap-2 mb-2">
                <i class="fas fa-exclamation-triangle text-orange-600"></i>
                <span class="text-sm font-medium text-slate-700">Impact</span>
              </div>
              <div class="text-lg font-bold text-slate-800 mb-1">${matrix.impact.impact}</div>
              <Progress :value="matrix.impact_percentage" class="h-2" />
              <div class="text-xs text-slate-500 mt-1">${matrix.impact_percentage}%</div>
            </div>
          </div>
          <div class="bg-white p-4 rounded-lg border border-slate-200">
            <div class="flex items-center gap-2 mb-2">
              <i class="fas fa-shield-alt text-purple-600"></i>
              <span class="text-sm font-medium text-slate-700">Exposure</span>
            </div>
            <div class="text-2xl font-bold text-slate-800">${matrix.exposure}</div>
          </div>
        </div>
      </div>
    `,
  }))
})

const currentMatrix = computed(() => {
  return sortedMatrices.value[currentMatrixIndex.value] || null
})

const goToNextMatrix = () => {
  if (currentMatrixIndex.value < sortedMatrices.value.length - 1) {
    currentMatrixIndex.value++
  }
}

const goToPreviousMatrix = () => {
  if (currentMatrixIndex.value > 0) {
    currentMatrixIndex.value--
  }
}

const handleClose = () => {
  emit('close')
}

const handleAddMatrix = () => {
  emit('addMatrix', props.risk)
}

// Reset index when risk changes
watch(
  () => props.risk,
  () => {
    currentMatrixIndex.value = 0
  },
)
</script>

<template>
  <Modal
    v-model="isOpen"
    :showClose="true"
    :closeOnBackdrop="true"
    @close="handleClose"
    size="full"
    :resizable="true"
  >
    <!-- Modal Header with Gradient -->
    <div class="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 px-8 py-6">
      <div class="max-w-8xl mx-auto">
        <div class="flex items-start gap-4">
          <div
            class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg"
          >
            <Icon icon="shield-virus" class="w-6 h-6 text-white" />
          </div>
          <div class="flex-1">
            <h2 class="text-3xl font-bold text-slate-800 mb-2">
              {{ risk?.risk }}
            </h2>
            <p class="text-base text-slate-600 leading-relaxed">
              {{ risk?.description }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Matrix Button -->
    <div class="bg-white border-b border-slate-200 px-8 py-4 shadow-sm">
      <div class="max-w-8xl mx-auto flex justify-end">
        <Button
          @click="handleAddMatrix"
          variant="success"
          size="default"
        >
          <template #icon>
            <Icon icon="plus" class="w-4 h-4" />
          </template>
          Add Risk Matrix
        </Button>
      </div>
    </div>

    <!-- Matrix Accordion -->
    <div class="p-8 bg-gradient-to-br from-slate-50 to-white min-h-[600px]">
      <div class="max-w-8xl mx-auto">
        <Accordion :items="accordionItems" variant="bordered" />
      </div>
    </div>
  </Modal>
</template>