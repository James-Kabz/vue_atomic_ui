<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <Sidebar
      ref="sidebarRef"
      :navigation-items="navigationItems"
      :header="{
        title: 'Risk & Compliance',
      }"
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
      :profile-menu-items="profileMenuItems"
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
import { ref, computed, provide, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Sidebar from '../components/Sidebar.vue'
import Header from '../components/Header.vue'

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

// Navigation items configuration (removed active property)
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
    icon:  'home'
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
    label: 'Users',
    route: '/users',
    icon: 'users'
  },
  {
    type: 'link',
    name: 'roles',
    label: 'Roles & Permissions',
    route: '/roles',
    icon: 'cogs'
  },
]





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
