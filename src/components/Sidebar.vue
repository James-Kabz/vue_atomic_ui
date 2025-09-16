<template>
  <aside
    :class="cn(
      'fixed left-0 top-0 z-40 h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out',
      isCollapsed ? 'w-16' : 'w-64'
    )"
  >
    <!-- Sidebar Header -->
    <div class="flex items-center justify-between p-4 border-b border-gray-200">
      <div v-if="!isCollapsed" class="flex items-center space-x-2">
        <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span class="text-white font-bold text-sm">UI</span>
        </div>
        <h2 class="text-lg font-semibold text-gray-900">Dashboard</h2>
      </div>
      <button
        @click="toggleSidebar"
        class="p-1 rounded-md hover:bg-gray-100 transition-colors"
      >
        <svg
          class="w-5 h-5 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            :d="isCollapsed ? 'M9 5l7 7-7 7' : 'M15 19l-7-7 7-7'"
          />
        </svg>
      </button>
    </div>

    <!-- Navigation -->
    <nav class="p-4 space-y-2">
      <template v-for="item in navigationItems" :key="item.name">
        <div v-if="item.type === 'section' && !isCollapsed" class="mt-6 mb-2">
          <h3 class="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {{ item.label }}
          </h3>
        </div>
        
        <a
          v-else-if="item.type === 'link'"
          :href="item.href"
          @click.prevent="handleNavigation(item)"
          :class="cn(
            'flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors',
            item.active
              ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
          )"
        >
          <component
            :is="item.icon"
            :class="cn(
              'flex-shrink-0',
              isCollapsed ? 'w-5 h-5' : 'w-5 h-5 mr-3'
            )"
          />
          <span v-if="!isCollapsed" class="truncate">{{ item.label }}</span>
          <span
            v-if="item.badge && !isCollapsed"
            class="ml-auto inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800"
          >
            {{ item.badge }}
          </span>
        </a>
      </template>
    </nav>

    <!-- User Section -->
    <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
      <div
        :class="cn(
          'flex items-center',
          isCollapsed ? 'justify-center' : 'space-x-3'
        )"
      >
        <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
          <span class="text-gray-600 text-sm font-medium">JD</span>
        </div>
        <div v-if="!isCollapsed" class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 truncate">John Doe</p>
          <p class="text-xs text-gray-500 truncate">john@example.com</p>
        </div>
        <button
          v-if="!isCollapsed"
          class="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
            />
          </svg>
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue'
import { cn } from '../utils/cn.js'

// Props
const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false
  },
  navigationItems: {
    type: Array,
    default: () => []
  }
})

// Emits
const emit = defineEmits(['toggle', 'navigate'])

// State
const isCollapsed = ref(props.collapsed)

// Methods
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
  emit('toggle', isCollapsed.value)
}

const handleNavigation = (item) => {
  emit('navigate', item)
}

// Icons as simple SVG components
const DashboardIcon = {
  template: `
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v0H8v0z"/>
    </svg>
  `
}

const UsersIcon = {
  template: `
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-5.5a4 4 0 11-8 0 4 4 0 018 0z"/>
    </svg>
  `
}

const SettingsIcon = {
  template: `
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
    </svg>
  `
}

const ReportsIcon = {
  template: `
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
    </svg>
  `
}

// Export width for layout calculations
const sidebarWidth = computed(() => isCollapsed.value ? 64 : 256)

defineExpose({
  isCollapsed,
  sidebarWidth,
  toggleSidebar
})
</script>