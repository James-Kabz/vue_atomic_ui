<template>
  <header :class="cn(
    'fixed top-0 right-0 z-30 bg-white border-b border-gray-200 transition-all duration-300 ease-in-out',
    `left-${sidebarCollapsed ? '16' : '64'}`
  )" :style="{ left: `${sidebarWidth}px` }">
    <div class="flex items-center justify-between h-16 px-6">
      <!-- Left side - App Logo (visible when sidebar is collapsed) -->
      <div class="flex items-center">
        <div v-if="sidebarCollapsed" class="flex items-center space-x-3 mr-6">
          <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-sm">UI</span>
          </div>
          <h1 class="text-xl font-semibold text-gray-900">Dashboard</h1>
        </div>

        <!-- Breadcrumb / Page Title -->
        <nav class="flex items-center space-x-2 text-sm">
          <span class="text-gray-500">{{ currentSection }}</span>
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
          <span class="text-gray-900 font-medium">{{ currentPage }}</span>
        </nav>
      </div>

      <!-- Right side - Search, Notifications, Profile -->
      <div class="flex items-center space-x-4">
        <!-- Search -->
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input type="text" placeholder="Search..."
            class="pl-10 pr-4 py-2 w-64 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            v-model="searchQuery" />
        </div>

        <!-- Notifications -->
        <button @click="toggleNotifications"
          class="relative p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M13 3h2.586a1 1 0 01.707.293l6.414 6.414a1 1 0 01.293.707V19a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h4L13 3z" />
          </svg>
          <span v-if="notificationCount > 0"
            class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {{ notificationCount }}
          </span>
        </button>

        <!-- Notifications Dropdown -->
        <div v-if="showNotifications"
          class="absolute right-6 top-16 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div class="p-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Notifications</h3>
          </div>
          <div class="max-h-96 overflow-y-auto">
            <div v-for="notification in notifications" :key="notification.id"
              class="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
              <div class="flex items-start space-x-3">
                <div class="flex-shrink-0 w-2 h-2 mt-2 bg-blue-500 rounded-full"></div>
                <div class="flex-1">
                  <p class="text-sm text-gray-900">{{ notification.title }}</p>
                  <p class="text-xs text-gray-500 mt-1">{{ notification.time }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="p-4 text-center">
            <button class="text-sm text-blue-600 hover:text-blue-800">View all notifications</button>
          </div>
        </div>

        <!-- Profile Dropdown -->
        <div class="relative">
          <button @click="toggleProfile"
            class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
            <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span class="text-gray-600 text-sm font-medium">{{ userInitials }}</span>
            </div>
            <div class="hidden md:block text-left">
              <p class="text-sm font-medium text-gray-900">{{ user.name }}</p>
              <p class="text-xs text-gray-500">{{ user.role }}</p>
            </div>
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- Profile Dropdown Menu -->
          <!-- Profile Dropdown Menu -->
          <div v-if="showProfile"
            class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            <div class="p-4 border-b border-gray-200">
              <p class="text-sm font-medium text-gray-900">{{ user.name }}</p>
              <p class="text-xs text-gray-500">{{ user.email }}</p>
            </div>
            <div class="py-2">
              <router-link v-for="item in profileMenuItems" :key="item.name" :to="{ name: item.route }"
                class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                @click="handleProfileAction(item)"
                >
                <font-awesome-icon :icon="item.icon" class="w-4 h-4 mr-3 text-gray-400" />
                {{ item.label }}
              </router-link>
            </div>
            <div class="border-t border-gray-200 py-2">
              <button @click="handleLogout"
                class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign out
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { cn } from '../utils/cn.js'

// Props
const props = defineProps({
  sidebarWidth: { type: Number, default: 256 },
  sidebarCollapsed: { type: Boolean, default: false },
  currentSection: { type: String, default: 'Dashboard' },
  currentPage: { type: String, default: 'Overview' },
  user: {
    type: Object,
    required: true,
  },
  notifications: {
    type: Array,
    default: () => []
  },
  profileMenuItems: {
    type: Array,
    required: true
  }
})

// Emits
const emit = defineEmits(['search', 'profile-action', 'logout'])

// State
const searchQuery = ref('')
const showNotifications = ref(false)
const showProfile = ref(false)
const notificationCount = ref(props.notifications.length)

// Computed
const userInitials = computed(() => {
  const name = props.user?.name || 'Guest'
  return name
    .split(' ')
    .map(n => n[0] || '')
    .join('')
    .toUpperCase()
})

// Methods
const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
  showProfile.value = false
}

const toggleProfile = () => {
  showProfile.value = !showProfile.value
  showNotifications.value = false
}

const handleProfileAction = (item) => {
  emit('profile-action', item)
  showProfile.value = false
}

const handleLogout = () => {
  emit('logout')
  showProfile.value = false
}

const handleClickOutside = (event) => {
  if (!event.target.closest('.absolute') && !event.target.closest('button')) {
    showNotifications.value = false
    showProfile.value = false
  }
}

// Lifecycle
onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))

// Watch search query
watch(searchQuery, (newValue) => emit('search', newValue))
</script>
