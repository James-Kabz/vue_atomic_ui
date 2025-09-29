<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <Sidebar ref="sidebarRef" :navigation-items="navigationItems" :header="{ title: 'Risk & Compliance' }"
      :current-route="currentRoute" :mobile-open="mobileOpen"
      :is-management-settings-active="isManagementSettingsActive" @toggle="handleSidebarToggle"
      @toggle-mobile="handleMobileToggle" @navigate="handleNavigation" @open-submenu="handleOpenSubmenu"
      @open-management-settings="handleOpenManagementSettings" />

    <!-- Submenu Sidebar -->
    <aside v-if="submenuOpen" :class="cn(
      'fixed left-0 top-0 z-50 h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out overflow-y-auto shadow-xl',
      isMobile ? 'w-full' : 'w-64',
      submenuOpen ? 'translate-x-0' : '-translate-x-full'
    )" :style="{ marginLeft: isMobile ? '0' : `${sidebarWidth}px` }">

      <!-- Submenu Header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200">
        <div class="flex items-center">
          <button @click="closeSubmenu" class="p-2 mr-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h3 class="text-lg font-extrabold text-gray-900">{{ currentSubmenu?.label }}</h3>
        </div>
      </div>

      <!-- Submenu Items -->
      <nav class="p-4 space-y-2">
        <router-link v-for="subItem in currentSubmenu?.subItems" :key="subItem.name" :to="subItem.route"
          @click="handleSubmenuNavigation(subItem)" :class="cn(
            'flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 group relative',
            isItemActive(subItem)
              ? 'bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 shadow-sm border border-blue-200'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
          )">
          <!-- Active indicator bar -->
          <div
            v-if="isItemActive(subItem)"
            class="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-r-full"
          />

          <div
            :class="
              cn(
                'flex items-center justify-center w-8 h-8 rounded-lg mr-3 flex-shrink-0 transition-colors ml-2',
                isItemActive(subItem)
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200',
              )
            "
          >
            <Icon v-if="subItem.icon" :icon="subItem.icon" class="w-4 h-4" />
          </div>
          <span class="truncate text-md font-semibold">{{ subItem.label }}</span>
          <span v-if="subItem.badge"
            class="ml-auto inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
            {{ subItem.badge }}
          </span>
        </router-link>
      </nav>
    </aside>

    <!-- Management Settings Sidebar -->
    <aside v-if="managementSettingsOpen" :class="cn(
      'fixed left-0 top-0 z-50 h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out overflow-y-auto shadow-xl',
      isMobile ? 'w-full' : 'ml-16 w-64',
      managementSettingsOpen ? 'translate-x-0' : '-translate-x-full'
    )">
      <!-- Management Settings Header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200">
        <div class="flex items-center">
          <button @click="closeManagementSettings"
            class="p-2 mr-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h3 class="text-lg font-extrabold text-gray-900">Management Settings</h3>
        </div>
      </div>

      <!-- Management Settings Items -->
      <nav class="p-4 space-y-2">
        <router-link v-for="setting in managementSettingsItems" :key="setting.name" :to="setting.route"
          @click="handleManagementSettingsNavigation(setting)" :class="cn(
            'flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 group relative',
            isItemActive(setting)
              ? 'bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 shadow-sm border border-blue-200'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
          )">
          <!-- Active indicator bar -->
          <div
            v-if="isItemActive(setting)"
            class="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-r-full"
          />

          <div
            :class="
              cn(
                'flex items-center justify-center w-8 h-8 rounded-lg mr-3 flex-shrink-0 transition-colors ml-2',
                isItemActive(setting)
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200',
              )
            "
          >
            <Icon v-if="setting.icon" :icon="setting.icon" class="w-4 h-4" />
          </div>
          <span class="truncate text-md font-semibold">{{ setting.label }}</span>
        </router-link>
      </nav>
    </aside>

    <!-- Overlay for mobile submenus -->
    <div v-if="(submenuOpen || managementSettingsOpen) && isMobile"
      class="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" @click="closeAllMenus">
    </div>

    <!-- Header -->
    <Header :sidebar-width="sidebarWidth" :sidebar-collapsed="sidebarCollapsed" :current-section="currentSection"
      :current-page="currentPage" :user="user" :profile-menu-items="profileMenuItems" :mobile-open="mobileOpen"
      @search="handleSearch" @profile-action="handleProfileAction" @logout="handleLogout"
      @toggle-mobile-sidebar="handleMobileSidebarToggle" />

    <!-- Main Content -->
    <main class="transition-all duration-300 ease-in-out pt-16 min-h-screen"
      :style="{ marginLeft: mainContentMarginLeft }">
      <div class="p-6">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, provide, watch, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Sidebar from '../components/Sidebar.vue'
import Header from '../components/Header.vue'
import Icon from '../components/Icon.vue'
import { cn } from '../utils/cn.js'

const router = useRouter()
const route = useRoute()

// Props
const props = defineProps({
  user: {
    type: Object,
    default: () => ({
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Administrator'
    })
  },
  initialSection: {
    type: String,
    default: 'Dashboard'
  },
  initialPage: {
    type: String,
    default: 'Overview'
  }
})

// State
const sidebarRef = ref(null)
const sidebarCollapsed = ref(false)
const currentSection = ref(props.initialSection)
const currentPage = ref(props.initialPage)
const currentRoute = ref(route.path)
const isMobile = ref(false)
const mobileOpen = ref(false)
const submenuOpen = ref(false)
const currentSubmenu = ref(null)
const managementSettingsOpen = ref(false)

// Management settings items
const managementSettingsItems = [
  {
    name: 'system-settings',
    label: 'System Settings',
    route: '/management/system-settings',
    icon: 'cog'
  },
  {
    name: 'user-management',
    label: 'User Management',
    route: '/management/user-management',
    icon: 'users'
  },
  {
    name: 'permissions',
    label: 'Permissions',
    route: '/management/permissions',
    icon: 'shield'
  },
  {
    name: 'audit-logs',
    label: 'Audit Logs',
    route: '/management/audit-logs',
    icon: 'clipboard-list'
  },
  {
    name: 'backup',
    label: 'Backup & Restore',
    route: '/management/backup',
    icon: 'database'
  }
]

// Emits
const emit = defineEmits([
  'navigate',
  'search',
  'profile-action',
  'logout',
  'sidebar-toggle'
])

const profileMenuItems = [
  {
    name: 'profile',
    label: 'Profile',
    route: 'profile',
    icon: 'user'
  },
  {
    name: 'settings',
    label: 'Settings',
    route: 'settings',
    icon: 'cog'
  },
]

// Navigation items configuration
const navigationItems = [
  {
    type: 'section',
    label: 'Dashboard'
  },
  {
    type: 'link',
    name: 'dashboard',
    label: 'Dashboard',
    route: '/dashboard',
    icon: 'home'
  },
  {
    type: 'link',
    name: 'analytics',
    label: 'Analytics',
    route: '/analytics',
    icon: 'user',
    badge: '2'
  },
  {
    type: 'section',
    label: 'Management'
  },
  {
    type: 'link',
    name: 'users',
    label: 'User Management',
    icon: 'users',
    subItems: [
      {
        name: 'all-users',
        label: 'All Users',
        route: '/users',
        icon: 'user'
      },
      {
        name: 'roles',
        label: 'Roles & Permissions',
        route: '/users/roles',
        icon: 'shield'
      },
      {
        name: 'activity',
        label: 'User Activity',
        route: '/users/activity',
        icon: 'activity'
      }
    ]
  },
  {
    type: 'link',
    name: 'roles',
    label: 'Roles & Permissions',
    route: '/roles',
    icon: 'cogs'
  },
]

// Computed
const sidebarWidth = computed(() => {
  return sidebarCollapsed.value ? 64 : 256
})

const mainContentMarginLeft = computed(() => {
  if (isMobile.value) return '0'

  let margin = sidebarWidth.value
  if (submenuOpen.value) margin += 256
  if (managementSettingsOpen.value) margin += 256

  return `${margin}px`
})

const isManagementSettingsActive = computed(() => {
  return route.path.startsWith('/management')
})

// Methods
const checkMobile = () => {
  isMobile.value = window.innerWidth < 1024 // lg breakpoint
}

const handleSidebarToggle = (collapsed) => {
  sidebarCollapsed.value = collapsed
  emit('sidebar-toggle', collapsed)
}

const handleMobileSidebarToggle = () => {
  mobileOpen.value = !mobileOpen.value
}

const handleMobileToggle = (value) => {
  mobileOpen.value = value
}

const handleNavigation = (item) => {
  if (item.route) {
    router.push(item.route)
  }
  closeAllMenus()
  emit('navigate', item)
}

const handleOpenSubmenu = (item) => {
  currentSubmenu.value = item
  submenuOpen.value = true
  if (isMobile.value) {
    mobileOpen.value = false
  }
}

const handleOpenManagementSettings = () => {
  managementSettingsOpen.value = true
  if (isMobile.value) {
    mobileOpen.value = false
  }
}

const closeSubmenu = () => {
  submenuOpen.value = false
  currentSubmenu.value = null
}

const closeManagementSettings = () => {
  managementSettingsOpen.value = false
}

const closeAllMenus = () => {
  closeSubmenu()
  closeManagementSettings()
  mobileOpen.value = false
}

const handleSubmenuNavigation = (item) => {
  handleNavigation(item)
}

const handleManagementSettingsNavigation = (item) => {
  handleNavigation(item)
}

const isItemActive = (item) => {
  if (!item.route) return false
  return route.path === item.route || route.path.startsWith(item.route + '/')
}

const updateBreadcrumbFromRoute = (routePath) => {
  const sectionMap = {
    '/dashboard': { section: 'Dashboard', page: 'Overview' },
    '/analytics': { section: 'Dashboard', page: 'Analytics' },
    '/users': { section: 'Management', page: 'Users' },
    '/roles': { section: 'Management', page: 'Roles & Permissions' },
    '/management': { section: 'Management', page: 'Settings' },
    '/management/system-settings': { section: 'Management', page: 'System Settings' },
    '/management/user-management': { section: 'Management', page: 'User Management' },
    '/management/permissions': { section: 'Management', page: 'Permissions' },
    '/management/audit-logs': { section: 'Management', page: 'Audit Logs' },
    '/management/backup': { section: 'Management', page: 'Backup & Restore' }
  }

  const breadcrumb = sectionMap[routePath] || { section: 'Dashboard', page: 'Overview' }
  currentSection.value = breadcrumb.section
  currentPage.value = breadcrumb.page
}

const handleSearch = (query) => {
  emit('search', query)
}

const handleProfileAction = (action) => {
  emit('profile-action', action)
}

const handleLogout = () => {
  emit('logout')
}

// Lifecycle
onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

// Watch for route changes
watch(() => route.path, (newPath) => {
  currentRoute.value = newPath
  updateBreadcrumbFromRoute(newPath)
  closeAllMenus()
}, { immediate: true })

// Provide layout context to child components
provide('dashboardLayout', {
  sidebarCollapsed,
  sidebarWidth,
  currentSection,
  currentPage,
  navigate: handleNavigation,
  toggleSidebar: () => handleSidebarToggle(!sidebarCollapsed.value),
  updateCurrentPage: (section, page) => {
    currentSection.value = section
    currentPage.value = page
  }
})

// Expose methods for parent components
defineExpose({
  navigate: handleNavigation,
  toggleSidebar: () => handleSidebarToggle(!sidebarCollapsed.value),
  updateCurrentPage: (section, page) => {
    currentSection.value = section
    currentPage.value = page
  },
  sidebarCollapsed,
  sidebarWidth
})
</script>