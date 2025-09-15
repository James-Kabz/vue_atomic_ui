<template>
  <aside 
    :class="cn(
      'bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col',
      isCollapsed ? 'w-16' : 'w-64',
      'h-screen sticky top-0',
      className
    )"
  >
    <!-- Sidebar Header -->
    <div class="p-4 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <slot name="header">
          <div :class="cn('flex items-center space-x-3', isCollapsed && 'justify-center')">
            <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
              </svg>
            </div>
            <div v-if="!isCollapsed" class="flex flex-col">
              <span class="text-lg font-semibold text-gray-900">AppName</span>
              <span class="text-xs text-gray-500">v2.0</span>
            </div>
          </div>
        </slot>
        
        <!-- Collapse Toggle -->
        <button
          @click="toggleCollapsed"
          class="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
          :class="isCollapsed && 'hidden'"
        >
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-3 py-4 overflow-y-auto">
      <div class="space-y-1">
        <!-- Primary Navigation Items -->
        <div v-for="item in items" :key="item.id || item.label" class="relative">
          <!-- Regular Nav Item -->
          <component
            :is="item.href ? 'a' : 'button'"
            :href="item.href"
            @click="item.onClick"
            :class="cn(
              'group flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200',
              item.active 
                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
              isCollapsed ? 'justify-center px-2' : 'justify-start'
            )"
          >
            <!-- Icon -->
            <div class="flex items-center justify-center w-5 h-5 mr-3" :class="isCollapsed && 'mr-0'">
              <component :is="getIcon(item.icon)" class="w-5 h-5" />
            </div>
            
            <!-- Label -->
            <span v-if="!isCollapsed" class="flex-1 text-left">{{ item.label }}</span>
            
            <!-- Badge -->
            <span 
              v-if="item.badge && !isCollapsed" 
              class="ml-auto inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              :class="item.active ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'"
            >
              {{ item.badge }}
            </span>

            <!-- Chevron for items with children -->
            <svg
              v-if="item.children && !isCollapsed"
              :class="cn('ml-auto w-4 h-4 transition-transform', item.expanded && 'rotate-90')"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </component>

          <!-- Submenu -->
          <div
            v-if="item.children && item.expanded && !isCollapsed"
            class="mt-1 ml-6 space-y-1"
          >
            <a
              v-for="child in item.children"
              :key="child.id || child.label"
              :href="child.href"
              :class="cn(
                'group flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors',
                child.active 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )"
            >
              <div class="w-2 h-2 bg-gray-300 rounded-full mr-3 group-hover:bg-gray-400"></div>
              {{ child.label }}
            </a>
          </div>

          <!-- Tooltip for collapsed state -->
          <div
            v-if="isCollapsed"
            class="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50"
          >
            {{ item.label }}
          </div>
        </div>

        <!-- Divider -->
        <div v-if="secondaryItems.length > 0" class="my-4">
          <div class="border-t border-gray-200"></div>
        </div>

        <!-- Secondary Navigation Items -->
        <div v-for="item in secondaryItems" :key="item.id || item.label" class="relative">
          <component
            :is="item.href ? 'a' : 'button'"
            :href="item.href"
            @click="item.onClick"
            :class="cn(
              'group flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200',
              item.active 
                ? 'bg-blue-50 text-blue-700' 
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
              isCollapsed ? 'justify-center px-2' : 'justify-start'
            )"
          >
            <div class="flex items-center justify-center w-5 h-5 mr-3" :class="isCollapsed && 'mr-0'">
              <component :is="getIcon(item.icon)" class="w-5 h-5" />
            </div>
            <span v-if="!isCollapsed" class="flex-1 text-left">{{ item.label }}</span>
          </component>

          <!-- Tooltip for collapsed state -->
          <div
            v-if="isCollapsed"
            class="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50"
          >
            {{ item.label }}
          </div>
        </div>
      </div>
    </nav>

    <!-- Collapse/Expand Button (for collapsed state) -->
    <button
      v-if="isCollapsed"
      @click="toggleCollapsed"
      class="m-3 p-2 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
    >
      <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"/>
      </svg>
    </button>

    <!-- Footer -->
    <div v-if="!isCollapsed" class="border-t border-gray-200 p-4 mt-auto">
      <slot name="footer">
        <div class="flex items-center space-x-3">
          <div class="w-9 h-9 bg-gray-300 rounded-full flex items-center justify-center">
            <svg class="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">{{ user.name || 'John Doe' }}</p>
            <p class="text-xs text-gray-500 truncate">{{ user.email || 'john@example.com' }}</p>
          </div>
          <button class="p-1.5 rounded-md hover:bg-gray-100 transition-colors">
            <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zM12 13a1 1 0 110-2 1 1 0 010 2zM12 20a1 1 0 110-2 1 1 0 010 2z"/>
            </svg>
          </button>
        </div>
      </slot>
    </div>

    <!-- Collapsed User Section -->
    <div v-else class="border-t border-gray-200 p-3">
      <div class="flex justify-center">
        <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
          <svg class="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
          </svg>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    default: () => [
      { 
        id: 'dashboard',
        label: 'Dashboard', 
        href: '/dashboard', 
        icon: 'home', 
        active: true 
      },
      { 
        id: 'users',
        label: 'Users', 
        href: '/users', 
        icon: 'users',
        badge: '12'
      },
      { 
        id: 'projects',
        label: 'Projects', 
        icon: 'folder',
        children: [
          { label: 'Active Projects', href: '/projects/active', active: false },
          { label: 'Archived', href: '/projects/archived', active: false }
        ],
        expanded: false
      },
      { 
        id: 'analytics',
        label: 'Analytics', 
        href: '/analytics', 
        icon: 'chart' 
      },
    ]
  },
  secondaryItems: {
    type: Array,
    default: () => [
      { 
        id: 'settings',
        label: 'Settings', 
        href: '/settings', 
        icon: 'settings' 
      },
      { 
        id: 'help',
        label: 'Help & Support', 
        href: '/help', 
        icon: 'help' 
      }
    ]
  },
  user: {
    type: Object,
    default: () => ({
      name: 'John Doe',
      email: 'john@example.com',
      avatar: null
    })
  },
  collapsed: {
    type: Boolean,
    default: false
  },
  className: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['toggle-collapsed'])

const isCollapsed = ref(props.collapsed)

const toggleCollapsed = () => {
  isCollapsed.value = !isCollapsed.value
  emit('toggle-collapsed', isCollapsed.value)
}

// Icon components mapping
const iconComponents = {
  home: () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
    </svg>
  ),
  users: () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
    </svg>
  ),
  folder: () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
    </svg>
  ),
  chart: () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
    </svg>
  ),
  settings: () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
    </svg>
  ),
  help: () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
    </svg>
  )
}

const getIcon = (iconName) => {
  return iconComponents[iconName] || iconComponents.home
}

// Helper function for class names (you'd typically import this)
const cn = (...classes) => {
  return classes.filter(Boolean).join(' ')
}
</script>