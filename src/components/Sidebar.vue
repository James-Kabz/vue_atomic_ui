<template>
  <div>
    <!-- Mobile Overlay -->
    <div v-if="isMobileOpen && isMobile" class="fixed inset-0 z-30 lg:hidden" @click="closeMobileSidebar"></div>

    <!-- Sidebar -->
    <aside :class="cn(
      'fixed left-0 top-0 z-40 h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out overflow-y-auto',
      // Mobile behavior
      isMobile
        ? cn(
          'transform',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )
        : 'translate-x-0',
      // Desktop behavior
      !isMobile && isCollapsed ? 'shadow-lg' : ''
    )" :style="{ width: sidebarWidth + 'px' }">
      <!-- Mobile Header with Close Button -->
      <div v-if="isMobile" class="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
        <h2 v-if="header" class="text-lg font-extrabold text-gray-900">
          {{ isCollapsed ? header.title?.charAt(0) : header.title }}
        </h2>
        <button @click="closeMobileSidebar" class="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Desktop Header -->
      <div v-if="!isMobile && header"
        class="flex items-center justify-start p-4.5 border-b border-gray-200 flex-shrink-0">
        <h2 v-if="!isCollapsed" class="font-serif-custom text-lg font-extrabold text-gray-700">
          {{ header.title }}
        </h2>

        <div v-else class="flex items-center justify-center w-full">
          <span class="text-xl font-bold text-gray-700">
            {{ header.title?.charAt(0) }}
          </span>
        </div>
      </div>

      <!-- Navigation -->
      <nav :class="cn('p-4 space-y-2 flex-1', isCollapsed && !isMobile ? 'px-2' : '')">
        <template v-for="item in navigationItems" :key="item.name">
          <!-- Section Headers -->
          <div v-if="item.type === 'section'" :class="cn('mt-0 mb-2', isCollapsed && !isMobile ? 'hidden' : '')">
            <h3 class="px-1 text-md font-light text-gray-500 uppercase tracking-wider">
              {{ item.label }}
            </h3>
          </div>

          <!-- Navigation Links -->
          <div v-else-if="item.type === 'link'" class="space-y-1">
            <!-- Main Link -->
            <div :class="cn(
              'flex items-center justify-between rounded-lg transition-colors relative group',
              hasSubItems(item) ? 'cursor-pointer' : '',
              isItemActive(item)
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            )">
              <!-- Tooltip for collapsed state -->
              <div v-if="isCollapsed && !isMobile && !hasSubItems(item)"
                class="absolute left-full ml-2 px-1 py-1 bg-gray-900 text-white text-sm rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                {{ item.label }}
                <div class="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900">
                </div>
              </div>

              <router-link v-if="!hasSubItems(item)" :to="item.route" @click="handleNavigation(item)" :class="cn(
                'flex items-center flex-1 rounded-lg transition-colors',
                isCollapsed && !isMobile ? 'px-2 py-2 justify-center' : 'px-1 py-5'
              )">
                <Icon :icon="item.icon" :class="cn(
                  'flex-shrink-0',
                  isCollapsed && !isMobile ? 'w-5 h-5' : 'w-5 h-5 mr-2'
                )" />
                <span v-if="!isCollapsed || isMobile" class="truncate text-lg font-extrabold ">{{ item.label }}</span>
                <span v-if="item.badge && (!isCollapsed || isMobile)"
                  class="ml-auto inline-flex items-center justify-center px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                  {{ item.badge }}
                </span>
                <!-- Badge dot for collapsed state -->
                <div v-if="item.badge && isCollapsed && !isMobile"
                  class="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
              </router-link>

              <!-- Parent item with sub-items -->
              <div v-else @click="toggleSubItems(item.name)" :class="cn(
                'flex items-center flex-1 cursor-pointer rounded-lg transition-colors',
                isCollapsed && !isMobile ? 'px-2 py-2 justify-center' : 'px-1 py-2'
              )">
                <Icon :icon="item.icon" :class="cn(
                  'flex-shrink-0',
                  isCollapsed && !isMobile ? 'w-5 h-5' : 'w-5 h-5 mr-2'
                )" />
                <span v-if="!isCollapsed || isMobile" class="truncate text-lg font-extrabold flex-1">{{ item.label
                }}</span>
                <span v-if="item.badge && (!isCollapsed || isMobile)"
                  class="inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 mr-2">
                  {{ item.badge }}
                </span>
                <svg v-if="!isCollapsed || isMobile" :class="cn(
                  'w-4 h-4 transition-transform duration-200',
                  expandedItems.includes(item.name) ? 'rotate-90' : ''
                )" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
                <!-- Badge dot for collapsed state -->
                <div v-if="item.badge && isCollapsed && !isMobile"
                  class="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
              </div>

              <!-- Tooltip for collapsed parent items -->
              <div v-if="isCollapsed && !isMobile && hasSubItems(item)"
                class="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                {{ item.label }}
                <div class="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900">
                </div>
              </div>
            </div>

            <!-- Sub-items -->
            <div v-if="hasSubItems(item) && expandedItems.includes(item.name) && (!isCollapsed || isMobile)"
              class="ml-6 space-y-1 border-l-2 border-gray-100 pl-4">
              <router-link v-for="subItem in item.subItems" :key="subItem.name" :to="subItem.route"
                @click="handleNavigation(subItem)" :class="cn(
                  'flex items-center px-1 py-2 rounded-lg text-sm font-medium transition-colors',
                  isItemActive(subItem)
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )">
                <Icon v-if="subItem.icon" :icon="subItem.icon" class="w-6 h-6 mr-1 flex-shrink-0" />
                <span class="truncate text-md font-semibold">{{ subItem.label }}</span>
                <span v-if="subItem.badge"
                  class="ml-auto inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                  {{ subItem.badge }}
                </span>
              </router-link>
            </div>
          </div>
        </template>
      </nav>
    </aside>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { cn } from '../utils/cn.js'
import Icon from './Icon.vue'

// Props
const props = defineProps({
  sidebarWidth: {
    type: Number,
    default: 256
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
  },
  autoExpandActive: {
    type: Boolean,
    default: true
  },
  collapsed: {
    type: Boolean,
    default: false
  },
  mobileOpen: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['navigate', 'toggle-mobile', 'toggle-collapsed'])

// State
const expandedItems = ref([])
const isMobile = ref(false)

// Computed
const isCollapsed = computed(() => props.collapsed && !isMobile.value)
const isMobileOpen = computed(() => props.mobileOpen)

// Methods
const handleNavigation = (item) => {
  emit('navigate', item)
  // Close mobile sidebar on navigation
  if (isMobile.value) {
    closeMobileSidebar()
  }
}

const closeMobileSidebar = () => {
  emit('toggle-mobile', false)
}

const hasSubItems = (item) => {
  return item.subItems && item.subItems.length > 0
}

const toggleSubItems = (itemName) => {
  const index = expandedItems.value.indexOf(itemName)
  if (index > -1) {
    expandedItems.value.splice(index, 1)
  } else {
    expandedItems.value.push(itemName)
  }
}

// Check if navigation item is active
const isItemActive = (item) => {
  if (!item.route) return false

  if (props.currentRoute === item.route) return true
  if (props.currentRoute.startsWith(item.route + '/')) return true

  // Check if any sub-item is active
  if (hasSubItems(item)) {
    return item.subItems.some(subItem => isItemActive(subItem))
  }

  return false
}

// Auto-expand parent items when sub-items are active
const autoExpandActiveItems = () => {
  if (!props.autoExpandActive) return

  props.navigationItems.forEach(item => {
    if (hasSubItems(item)) {
      const hasActiveSubItem = item.subItems.some(subItem => isItemActive(subItem))
      if (hasActiveSubItem && !expandedItems.value.includes(item.name)) {
        expandedItems.value.push(item.name)
      }
    }
  })
}

// Handle responsive behavior
const checkMobile = () => {
  const wasMobile = isMobile.value
  isMobile.value = window.innerWidth < 1024 // lg breakpoint

  // Close mobile sidebar when switching to desktop
  if (wasMobile && !isMobile.value && isMobileOpen.value) {
    closeMobileSidebar()
  }
}

// Handle escape key to close mobile sidebar
const handleEscape = (event) => {
  if (event.key === 'Escape' && isMobile.value && isMobileOpen.value) {
    closeMobileSidebar()
  }
}

// Lifecycle
onMounted(() => {
  autoExpandActiveItems()
  checkMobile()
  window.addEventListener('resize', checkMobile)
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
  document.removeEventListener('keydown', handleEscape)
})

// Watch for route changes to auto-expand
watch(() => props.currentRoute, () => {
  autoExpandActiveItems()
})

// Watch for mobile state changes to handle collapsed state
watch(isMobile, (newVal) => {
  if (newVal && props.collapsed) {
    // When switching to mobile, ensure collapsed state is handled properly
    emit('toggle-collapsed', false)
  }
})

// Expose computed values for parent components
defineExpose({
  isMobile,
  isCollapsed,
  isMobileOpen
})
</script>