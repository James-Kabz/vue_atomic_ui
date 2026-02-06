<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import Header from '../../components/Header.vue'
import Sidebar from '../../components/Sidebar.vue'

const props = defineProps({
  user: {
    type: Object,
    default: () => ({
      name: 'Jordan Blake',
      email: 'jordan@company.com',
      roles: ['admin'],
      organisations: [
        { id: 1, name: 'STL Horizon', role: 'Admin' }
      ],
      currentOrganisation: { id: 1, name: 'STL Horizon', role: 'Admin' }
    })
  },
  navigationItems: {
    type: Array,
    default: () => ([
      { type: 'section', label: 'Dashboard' },
      { type: 'link', name: 'overview', label: 'Overview', route: '/templates/overview', icon: 'home' },
      { type: 'link', name: 'analytics', label: 'Analytics', route: '/templates/analytics', icon: 'chart-bar' },
      { type: 'section', label: 'Operations' },
      { type: 'link', name: 'users', label: 'Users', route: '/templates/users', icon: 'users' },
      { type: 'link', name: 'billing', label: 'Billing', route: '/templates/billing', icon: 'credit-card' }
    ])
  },
  profileMenuItems: {
    type: Array,
    default: () => ([
      { name: 'profile', label: 'Profile', route: '/profile', icon: 'user' },
      { name: 'settings', label: 'Settings', route: '/settings', icon: 'cog' },
    ])
  },
  currentRoute: {
    type: String,
    default: ''
  },
  currentSection: {
    type: String,
    default: 'Dashboard'
  },
  currentPage: {
    type: String,
    default: 'Overview'
  },
  notifications: {
    type: Array,
    default: () => ([])
  }
})

const emit = defineEmits([
  'navigate',
  'search',
  'profile-action',
  'logout',
  'organisation-change',
  'sidebar-toggle'
])

const route = useRoute()
const resolvedRoute = computed(() => props.currentRoute || route.path)

const sidebarRef = ref(null)
const mobileOpen = ref(false)
const sidebarWidth = 130

const handleNavigation = (item) => emit('navigate', item)
const handleSearch = (query) => emit('search', query)
const handleProfileAction = (item) => emit('profile-action', item)
const handleLogout = () => emit('logout')
const handleOrganisationChange = (org) => emit('organisation-change', org)

const handleMobileSidebarToggle = () => {
  mobileOpen.value = !mobileOpen.value
  emit('sidebar-toggle', mobileOpen.value)
}
</script>

<template>
  <div class="min-h-screen  bg-(--ui-bg) overflow-hidden">
    <Sidebar
      ref="sidebarRef"
      :sidebar-width="sidebarWidth"
      :header="{ title: 'STL Horizon' }"
      :navigation-items="navigationItems"
      :management-settings="[]"
      :show-management-settings="false"
      :mobile-open="mobileOpen"
      :current-path="resolvedRoute"
      @navigate="handleNavigation"
      @update:mobile-open="(value) => (mobileOpen = value)"
    />

    <Header
      :sidebar-width="sidebarWidth"
      :current-section="currentSection"
      :current-page="currentPage"
      :current-route="resolvedRoute"
      :user="user"
      :notifications="notifications"
      :profile-menu-items="profileMenuItems"
      :mobile-open="mobileOpen"
      :current-organisation="user?.currentOrganisation || user?.organisations?.[0]"
      :organisations="user?.organisations || []"
      @search="handleSearch"
      @profile-action="handleProfileAction"
      @logout="handleLogout"
      @navigate="handleNavigation"
      @toggle-mobile-sidebar="handleMobileSidebarToggle"
      @organisation-change="handleOrganisationChange"
    />

    <main
      class="transition-all  duration-300 ease-in-out pt-16 min-h-screen"
      :style="{ marginLeft: sidebarRef?.contentMarginLeft + 'px' }"
    >
      <div class="p-6">
        <div class="mb-6 flex items-center gap-3">
          <router-link
            to="/templates/overview"
            class="px-3 py-1.5 rounded-md text-sm font-medium border ui-border-strong hover:bg-(--ui-surface)"
          >
            Dashboard
          </router-link>
          <router-link
            to="/components"
            class="px-3 py-1.5 rounded-md text-sm font-medium border x-strong hover:bg-(--ui-surface)"
          >
            Component Showcase
          </router-link>
        </div>
        <slot />
      </div>
    </main>
  </div>
</template>
