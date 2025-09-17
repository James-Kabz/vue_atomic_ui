<template>
  <aside :class="cn(
    'fixed left-0 top-0 z-40 h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out'
  )" :style="{ width: sidebarWidth + 'px' }">
    <!-- Sidebar Header -->
    <div v-if="header" class="flex items-center justify-start p-4 border-b border-gray-200">
      <h2 class="text-xl font-semibold text-gray-900">
        {{ header.title }}
      </h2>
    </div>

    <!-- Navigation -->
    <nav class="p-4 space-y-2">
      <template v-for="item in navigationItems" :key="item.name">
        <!-- Section -->
        <div v-if="item.type === 'section'" class="mt-6 mb-2">
          <h3 class="px-3 text-lg font-semibold text-gray-600 uppercase tracking-wider">
            {{ item.label }}
          </h3>
        </div>

        <!-- Link -->
        <router-link 
          v-else-if="item.type === 'link'" 
          :to="item.route" 
          @click="handleNavigation(item)" 
          :class="cn(
            'flex items-center px-3 py-2 rounded-lg text-2xl font-medium transition-colors',
            isItemActive(item)
              ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-600'
          )"
        >
          <Icon :icon="item.icon" size="md" class="mr-3 text-5xl flex-shrink-0" />
          <span class="truncate text-sm">{{ item.label }}</span>
          <span 
            v-if="item.badge"
            class="ml-auto inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800"
          >
            {{ item.badge }}
          </span>
        </router-link>
      </template>
    </nav>
  </aside>
</template>

<script setup>
import { cn } from '../utils/cn.js'
import Icon from './Icon.vue'

// Props
const props = defineProps({
  sidebarWidth: {
    type: Number,
    default: 256 // e.g., 64, 256
  },
  header: {
    type: Object,
    default: null
  },
  navigationItems: {
    type: Array,
    required: true,
  },
  currentRoute: {
    type: String,
    default: ''
  }
})

// Emits
const emit = defineEmits(['navigate'])

// Methods
const handleNavigation = (item) => {
  emit('navigate', item)
}

// Check if navigation item is active
const isItemActive = (item) => {
  if (!item.route) return false
  
  if (props.currentRoute === item.route) return true
  if (props.currentRoute.startsWith(item.route + '/')) return true
  
  return false
}
</script>
