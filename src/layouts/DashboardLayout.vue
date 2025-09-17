<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <Sidebar
      ref="sidebarRef"
      :collapsed="sidebarCollapsed"
      :navigation-items="navigationItems"
      :current-route="currentRoute"
      @toggle="handleSidebarToggle"
      @navigate="handleNavigation"
    />

    <!-- Header -->
    <Header
      :sidebar-width="sidebarWidth"
      :sidebar-collapsed="sidebarCollapsed"
      :current-section="currentSection"
      :current-page="currentPage"
      :user="user"
      :notifications="userNotifications"
      @search="handleSearch"
      @profile-action="handleProfileAction"
      @logout="handleLogout"
    />

    <!-- Main Content -->
    <main
      class="transition-all duration-300 ease-in-out pt-16 min-h-screen"
      :style="{ marginLeft: `${sidebarWidth}px` }"
    >
      <div class="p-6">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { Header, Sidebar } from '@stlhorizon/vue-ui'
import { ref, computed, provide, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

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

// Emits
const emit = defineEmits([
  'navigate',
  'search',
  'profile-action',
  'logout',
  'sidebar-toggle'
])

// State
const sidebarRef = ref(null)
const sidebarCollapsed = ref(false)
const currentSection = ref(props.initialSection)
const currentPage = ref(props.initialPage)
const currentRoute = ref(route.path)

// Navigation items configuration (removed active property)
const navigationItems = ref([
  {
    type: 'link',
    name: 'dashboard',
    label: 'Dashboard',
    route: '/dashboard',
    icon: 'DashboardIcon'
  },
  {
    type: 'link',
    name: 'analytics',
    label: 'Analytics',
    route: '/analytics',
    icon: 'ReportsIcon',
    badge: '2'
  },
  {
    type: 'section',
    label: 'Management'
  },
  {
    type: 'link',
    name: 'users',
    label: 'Users',
    route: '/users',
    icon: 'UsersIcon'
  },
  {
    type: 'link',
    name: 'roles',
    label: 'Roles & Permissions',
    route: '/roles',
    icon: 'SettingsIcon'
  },
  {
    type: 'section',
    label: 'Settings'
  },
  {
    type: 'link',
    name: 'preferences',
    label: 'Preferences',
    route: '/preferences',
    icon: 'SettingsIcon'
  },
  {
    type: 'link',
    name: 'integrations',
    label: 'Integrations',
    route: '/integrations',
    icon: 'SettingsIcon'
  }
])


const updateBreadcrumbFromRoute = (routePath) => {
  const sectionMap = {
    '/dashboard': { section: 'Dashboard', page: 'Overview' },
    '/analytics': { section: 'Dashboard', page: 'Analytics' },
    '/users': { section: 'Management', page: 'Users' },
    '/roles': { section: 'Management', page: 'Roles & Permissions' },
    '/preferences': { section: 'Settings', page: 'Preferences' },
    '/integrations': { section: 'Settings', page: 'Integrations' }
  }

  const breadcrumb = sectionMap[routePath] || { section: 'Dashboard', page: 'Overview' }
  currentSection.value = breadcrumb.section
  currentPage.value = breadcrumb.page
}

// Watch for route changes to update current route and breadcrumb
watch(() => route.path, (newPath) => {
  currentRoute.value = newPath
  updateBreadcrumbFromRoute(newPath)
}, { immediate: true })

// Computed
const sidebarWidth = computed(() => {
  return sidebarCollapsed.value ? 64 : 256
})

// Methods
const handleSidebarToggle = (collapsed) => {
  sidebarCollapsed.value = collapsed
  emit('sidebar-toggle', collapsed)
}

const handleNavigation = (item) => {
  if (item.route) {
    router.push(item.route)
  }
  emit('navigate', item)
}


const updateBreadcrumb = (item) => {
  const sectionMap = {
    dashboard: { section: 'Dashboard', page: 'Overview' },
    analytics: { section: 'Dashboard', page: 'Analytics' },
    users: { section: 'Management', page: 'Users' },
    roles: { section: 'Management', page: 'Roles & Permissions' },
    preferences: { section: 'Settings', page: 'Preferences' },
    integrations: { section: 'Settings', page: 'Integrations' }
  }

  const breadcrumb = sectionMap[item.name] || { section: 'Dashboard', page: item.label }
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

// Public methods for external control
const navigate = (itemName) => {
  const item = navigationItems.value.find(item => item.name === itemName)
  if (item) {
    handleNavigation(item)
  }
}

const toggleSidebar = () => {
  if (sidebarRef.value) {
    sidebarRef.value.toggleSidebar()
  }
}

const updateCurrentPage = (section, page) => {
  currentSection.value = section
  currentPage.value = page
}

// Provide layout context to child components
provide('dashboardLayout', {
  sidebarCollapsed,
  sidebarWidth,
  currentSection,
  currentPage,
  navigate,
  toggleSidebar,
  updateCurrentPage
})

// Expose methods for parent components
defineExpose({
  navigate,
  toggleSidebar,
  updateCurrentPage,
  sidebarCollapsed,
  sidebarWidth
})
</script>
