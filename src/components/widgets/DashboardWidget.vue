<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
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
    required: true,
    default: () => () => false
  }
})

const emit = defineEmits(['refresh', 'dragstart', 'dragend'])

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

onMounted(() => window.addEventListener('dragover', handleDrag))
onUnmounted(() => {
  window.removeEventListener('dragover', handleDrag)
  if (dragClone) document.body.removeChild(dragClone)
})
</script>

<template>
  <div
    v-if="canView"
    draggable="true"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
    :style="containerStyles"
    :class="cn(
      'bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all select-none flex flex-col',
      isDragging ? 'opacity-50 scale-95' : 'hover:shadow-lg cursor-move'
    )"
  >
    <!-- Header -->
    <div
      v-if="showHeader"
      class="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 flex-shrink-0"
    >
      <div class="flex items-center gap-3">
        <Icon v-if="icon" :icon="icon" class="w-5 h-5 text-slate-700" />
        <h3 class="font-semibold text-lg text-slate-900">{{ title }}</h3>
      </div>
      <div class="flex items-center gap-3">
        <slot name="header-actions" />
        <button
          v-if="showRefresh"
          @click="$emit('refresh')"
          class="p-2 rounded-lg hover:bg-white/80 transition-all duration-200 hover:scale-105 active:scale-95"
          :disabled="loading"
        >
          <Icon icon="refresh" class="w-4 h-4 text-slate-600" :class="{ 'animate-spin': loading }" />
        </button>
      </div>
    </div>

    <!-- Body -->
    <div class="relative flex-1 overflow-hidden">
      <div
        v-if="loading"
        class="absolute inset-0 bg-white/90 backdrop-blur-sm z-10 flex items-center justify-center"
      >
        <Loader type="spin" size="medium" color="#3b82f6" />
      </div>
      <div class="overflow-auto h-full" :class="paddingClasses[padding]">
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

