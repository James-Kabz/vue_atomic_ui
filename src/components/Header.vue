<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { cn } from '../utils/cn.js'
import Icon from './Icon.vue'

const props = defineProps({
  sidebarWidth: { type: Number, default: 256 },
  currentSection: { type: String, default: 'Dashboard' },
  currentPage: { type: String, default: 'Overview' },
  currentRoute: { type: String, default: '' },
  user: { type: Object, required: true },
  notifications: { type: Array, default: () => [] },
  profileMenuItems: { type: Array, required: true },
  mobileOpen: { type: Boolean, default: false },
  currentOrganisation: { type: Object, default: null },
  companyLogo: { type: String, default: '' },
  organisationLogo: { type: String, default: '' },
  organisations: { type: Array, default: () => [] },
  activeRoles: { type: Array, default: () => [] },
  // New props for customization
  showSearch: { type: Boolean, default: true },
  showNotifications: { type: Boolean, default: true },
  showBreadcrumb: { type: Boolean, default: true },
  showOrganisationInfo: { type: Boolean, default: true },
  showUserDetails: { type: Boolean, default: true },
  showHeaderLogo: { type: Boolean, default: true },
  headerLogo: { type: String, default: 'dist/logo.png' },
  searchPlaceholder: { type: String, default: 'Search...' },
  notificationsTitle: { type: String, default: 'Notifications' },
  organisationSwitcherTitle: { type: String, default: 'Switch Organisation' },
  organisationSwitcherDescription: { type: String, default: 'Select an organisation to view its data' },
  // Allow custom user initials logic
  
  userInitialsOverride: { type: String, default: '' },
  // Allow custom user role display
  userRoleDisplayOverride: { type: String, default: '' }
})

const emit = defineEmits([
  'search', 
  'profile-action', 
  'logout', 
  'navigate', 
  'toggle-mobile-sidebar', 
  'organisation-change',
  'notification-click',
  'view-all-notifications'
])

const searchQuery = ref('')
const showNotificationsDropdown = ref(false)
const showProfile = ref(false)
const notificationCount = ref(props.notifications.length)
const showMobileSearch = ref(false)
const isMobile = ref(false)
const showOrganisationDropdown = ref(false)

const userInitials = computed(() => {
  if (props.userInitialsOverride) return props.userInitialsOverride
  const name = props.user?.name || 'Guest'
  return name.split(' ').map(n => n[0] || '').join('').toUpperCase()
})

const userRoleNames = computed(() => {
  if (props.userRoleDisplayOverride) return props.userRoleDisplayOverride
  
  const roles = []
  
  // Add activeRoles if available (these take priority when switching organisations)
  if (props.activeRoles?.length > 0) {
    roles.push(...props.activeRoles.map(role => 
      typeof role === 'string' ? role : role.name
    ))
  }
  
  // If no active roles, fall back to user.roles
  if (roles.length === 0 && props.user?.roles?.length > 0) {
    roles.push(...props.user.roles.map(role => 
      typeof role === 'string' ? role : role.name
    ))
  }
  
  // If still no roles, use the current organisation role if available
  if (roles.length === 0 && props.currentOrganisation?.role) {
    roles.push(props.currentOrganisation.role)
  }
  
  // Final fallback
  if (roles.length === 0) return 'Member'
  
  // Capitalize and format role names
  return roles
    .map(role => role.charAt(0).toUpperCase() + role.slice(1).replace(/-/g, ' '))
    .join(', ')
})

const formattedActiveRoles = computed(() => {
  if (!props.activeRoles || props.activeRoles.length === 0) return ''
  
  return props.activeRoles
    .map(role => typeof role === 'string' ? role : role.name)
    .map(role => role.charAt(0).toUpperCase() + role.slice(1).replace(/-/g, ' '))
    .join(', ')
})

const toggleNotifications = () => {
  showNotificationsDropdown.value = !showNotificationsDropdown.value
  showProfile.value = false
}

const toggleProfile = () => {
  showProfile.value = !showProfile.value
  showNotificationsDropdown.value = false
  showOrganisationDropdown.value = false
}

const toggleOrganisationDropdown = () => {
  showOrganisationDropdown.value = !showOrganisationDropdown.value
  showProfile.value = false
  showNotificationsDropdown.value = false
}

const handleNavigation = (item) => {
  emit('navigate', item)
  showProfile.value = false
}

const isItemActive = (item) => {
  if (!item.route) return false
  if (props.currentRoute === item.route) return true
  if (props.currentRoute.startsWith(item.route + '/')) return true
  return false
}

const handleProfileAction = (item) => {
  emit('profile-action', item)
  showProfile.value = false
}

const handleLogout = () => {
  emit('logout')
  showProfile.value = false
}

const handleOrganisationChange = (organisation) => {
  emit('organisation-change', organisation)
  showOrganisationDropdown.value = false
}

const handleNotificationClick = (notification) => {
  emit('notification-click', notification)
}

const handleViewAllNotifications = () => {
  emit('view-all-notifications')
  showNotificationsDropdown.value = false
}

const handleClickOutside = (event) => {
  if (!event.target.closest('.absolute') && !event.target.closest('button')) {
    showNotificationsDropdown.value = false
    showProfile.value = false
    showOrganisationDropdown.value = false
  }
}

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('resize', checkMobile)
})

watch(searchQuery, (newValue) => emit('search', newValue))

watch(() => props.notifications.length, (newLength) => {
  notificationCount.value = newLength
})
</script>

<template>
  <header
    :class="cn(
      'fixed top-0 z-50 bg-white border-b border-gray-200 transition-all duration-300 ease-in-out w-full'
    )"
    :style="{ left: '0' }"
  >
    <div class="flex items-center justify-between h-16 px-4 md:px-6">
      <!-- Left side - Page Title / Breadcrumb -->
      <div class="flex items-center">
        <!-- Organisation Info -->
        <div
          v-if="showOrganisationInfo && currentOrganisation"
          class="mr-4 flex-shrink-0 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-2 rounded-lg border border-blue-100 flex items-center gap-3 relative"
        >
          <!-- Company Logo (Software Company) -->
          <div
            v-if="companyLogo"
            class="flex-shrink-0"
          >
            <img
              :src="companyLogo"
              alt="Company logo"
              class="w-6 h-6 object-contain rounded"
            >
          </div>

          <!-- Organisation Logo (Registered Organisation) -->
          <div
            v-if="organisationLogo"
            class="flex-shrink-0"
          >
            <img
              :src="organisationLogo"
              :alt="`${currentOrganisation.organisation_name} logo`"
              class="w-8 h-8 object-contain rounded border border-blue-200"
            >
          </div>

          <!-- Organisation Switcher -->
          <button
            v-if="organisations.length > 1"
            class="flex items-center gap-2 min-w-0 cursor-pointer hover:bg-blue-100/50 rounded-md px-2 py-1 transition-colors"
            @click="toggleOrganisationDropdown"
          >
            <div class="min-w-0">
              <p class="text-lg font-bold text-blue-900 truncate max-w-[200px]">
                {{ currentOrganisation.organisation_name }}
              </p>
              <p
                v-if="formattedActiveRoles"
                class="text-xs text-blue-600 truncate font-medium"
              >
                {{ formattedActiveRoles }}
              </p>
            </div>
            <svg
              class="w-4 h-4 text-blue-600 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                :d="showOrganisationDropdown ? 'm5 15 7-7 7 7' : 'm19 9-7 7-7-7'"
              />
            </svg>
          </button>

          <!-- Static display when only one organisation -->
          <div
            v-else
            class="min-w-0"
          >
            <p class="text-lg font-bold text-blue-900 truncate max-w-[200px]">
              {{ currentOrganisation.organisation_name }}
            </p>
            <p
              v-if="formattedActiveRoles"
              class="text-xs text-blue-600 truncate font-medium"
            >
              {{ formattedActiveRoles }}
            </p>
          </div>

          <!-- Organisation Dropdown -->
          <transition
            enter-active-class="transition-all duration-200 ease-out"
            leave-active-class="transition-all duration-200 ease-in"
            enter-from-class="opacity-0 translate-y-2 scale-95"
            enter-to-class="opacity-100 translate-y-0 scale-100"
            leave-from-class="opacity-100 translate-y-0 scale-100"
            leave-to-class="opacity-0 translate-y-2 scale-95"
          >
            <div
              v-if="showOrganisationDropdown"
              class="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto"
            >
              <div class="p-3 border-b border-gray-200">
                <h3 class="text-sm font-semibold text-gray-900">
                  {{ organisationSwitcherTitle }}
                </h3>
                <p class="text-xs text-gray-500 mt-1">
                  {{ organisationSwitcherDescription }}
                </p>
              </div>
              <div class="py-2">
                <button
                  v-for="org in organisations"
                  :key="org.org_id || org.organisation_name"
                  :class="cn(
                    'flex items-center w-full px-3 py-2.5 text-sm transition-colors',
                    org.org_id === currentOrganisation?.org_id
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                      : 'text-gray-700 hover:bg-gray-50'
                  )"
                  @click="handleOrganisationChange(org)"
                >
                  <div
                    v-if="org.logo"
                    class="flex-shrink-0 mr-3"
                  >
                    <img
                      :src="org.logo"
                      :alt="`${org.organisation_name} logo`"
                      class="w-6 h-6 object-contain rounded"
                    >
                  </div>
                  <div class="flex-1 text-left min-w-0">
                    <p class="font-medium truncate">
                      {{ org.organisation_name }}
                    </p>
                    <!-- <p
                      v-if="org.role"
                      class="text-xs text-gray-500 truncate"
                    >
                      {{ org.role }}
                    </p> -->
                  </div>
                  <svg
                    v-if="org.org_id === currentOrganisation?.org_id"
                    class="w-4 h-4 text-blue-500 flex-shrink-0 ml-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 01 1.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </transition>
        </div>

        <!-- Header Logo -->
        <div
          v-if="showHeaderLogo"
          class="mr-4 flex-shrink-0"
        >
          <img
            :src="headerLogo"
            alt="Company Logo"
            class="w-8 h-8 object-contain"
          >
        </div>

        <!-- Breadcrumb -->
        <nav
          v-if="showBreadcrumb"
          class="hidden md:flex items-center space-x-2 text-sm truncate"
        >
          <span class="text-gray-500 truncate">{{ currentSection }}</span>
          <svg
            class="w-4 h-4 text-gray-400 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
          <span class="text-gray-900 font-medium truncate">{{ currentPage }}</span>
        </nav>
      </div>

      <!-- Right side -->
      <div class="flex items-center space-x-3 md:space-x-4">
        <!-- Mobile Sidebar Toggle -->
        <button
          v-if="isMobile"
          class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
          @click="emit('toggle-mobile-sidebar')"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <!-- Search -->
        <div
          v-if="showSearch && (!isMobile || showMobileSearch)"
          class="relative"
        >
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              class="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="searchPlaceholder"
            class="pl-10 pr-4 py-2 w-48 md:w-64 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
          <!-- Close search button on mobile -->
          <button
            v-if="isMobile"
            class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            @click="showMobileSearch = false"
          >
            ✕
          </button>
        </div>
        <button
          v-else-if="showSearch && isMobile"
          class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
          @click="showMobileSearch = true"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>

        <!-- Notifications -->
        <button
          v-if="showNotifications"
          class="relative p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
          @click="toggleNotifications"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <span
            v-if="notificationCount > 0"
            class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
          >
            {{ notificationCount > 9 ? '9+' : notificationCount }}
          </span>
        </button>

        <!-- Notifications Dropdown -->
        <transition
          enter-active-class="transition-all duration-300 ease-out"
          leave-active-class="transition-all duration-300 ease-in"
          enter-from-class="opacity-0 translate-y-2 scale-95"
          enter-to-class="opacity-100 translate-y-0 scale-100"
          leave-from-class="opacity-100 translate-y-0 scale-100"
          leave-to-class="opacity-0 translate-y-2 scale-95"
        >
          <div
            v-if="showNotificationsDropdown"
            class="absolute right-4 md:right-6 top-16 mt-2 w-72 md:w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
          >
            <div class="p-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900">
                {{ notificationsTitle }}
              </h3>
            </div>
            <div class="max-h-96 overflow-y-auto">
              <div
                v-if="notifications.length === 0"
                class="p-8 text-center"
              >
                <svg
                  class="w-12 h-12 mx-auto text-gray-300 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <p class="text-sm text-gray-500">
                  No notifications
                </p>
              </div>
              <div
                v-for="notification in notifications"
                v-else
                :key="notification.id"
                class="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                @click="handleNotificationClick(notification)"
              >
                <div class="flex items-start space-x-3">
                  <div class="flex-shrink-0 w-2 h-2 mt-2 bg-blue-500 rounded-full" />
                  <div class="flex-1">
                    <p class="text-sm text-gray-900">
                      {{ notification.title }}
                    </p>
                    <p class="text-xs text-gray-500 mt-1">
                      {{ notification.time }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-if="notifications.length > 0"
              class="p-4 text-center"
            >
              <button
                class="text-sm text-blue-600 hover:text-blue-800"
                @click="handleViewAllNotifications"
              >
                View all notifications
              </button>
            </div>
          </div>
        </transition>

        <!-- Profile Dropdown -->
        <div class="relative">
          <button
            class="flex items-center space-x-2 md:space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
            @click="toggleProfile"
          >
            <div class="w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center transition-colors shadow-sm">
              <span class="text-blue-700 text-sm font-medium">{{ userInitials }}</span>
            </div>
            <!-- Hide details on mobile or when showUserDetails is false -->
            <div
              v-if="showUserDetails"
              class="hidden md:block text-left max-w-[160px] truncate"
            >
              <p class="text-sm font-medium text-gray-900 truncate">
                {{ user.name }}
              </p>
              <p class="text-xs text-gray-500 truncate leading-tight">
                {{ userRoleNames }}
              </p>
            </div>
            <svg
              class="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          <!-- Dropdown -->
          <transition
            enter-active-class="transition-all duration-200 ease-out"
            leave-active-class="transition-all duration-200 ease-in"
            enter-from-class="opacity-0 translate-y-2 scale-95"
            enter-to-class="opacity-100 translate-y-0 scale-100"
            leave-from-class="opacity-100 translate-y-0 scale-100"
            leave-to-class="opacity-0 translate-y-2 scale-95"
          >
            <div
              v-if="showProfile"
              class="absolute right-0 mt-2 w-58 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
            >
              <div class="p-4 border-b border-gray-200">
                <p class="text-sm font-medium text-gray-900">
                  {{ user.name }}
                </p>
                <p class="text-xs text-gray-500">
                  {{ user.email }}
                </p>
              </div>
              <div class="py-2">
                <template
                  v-for="item in profileMenuItems"
                  :key="item.name"
                >
                  <router-link
                    v-if="item.route"
                    :to="item.route"
                    :class="cn(
                      'flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative',
                      isItemActive(item)
                        ? 'bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 shadow-sm border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
                    )"
                    @click="handleNavigation(item)"
                  >
                    <!-- Active indicator bar -->
                    <div
                      v-if="isItemActive(item)"
                      class="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-r-full"
                    />
                    <div
                      :class="cn(
                        'flex items-center justify-center w-8 h-8 rounded-lg mr-3 flex-shrink-0 transition-colors ml-2',
                        isItemActive(item)
                          ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                      )"
                    >
                      <Icon
                        v-if="item.icon"
                        :icon="item.icon"
                        class="w-4 h-4"
                      />
                    </div>
                    <span
                      :class="cn(
                        'flex-1 truncate font-semibold',
                        isItemActive(item) ? 'text-blue-700' : 'text-gray-700'
                      )"
                    >
                      {{ item.label }}
                    </span>
                  </router-link>
                  <button
                    v-else
                    class="flex items-center w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-transparent"
                    @click="handleProfileAction(item)"
                  >
                    <div class="flex items-center justify-center w-8 h-8 rounded-lg mr-3 flex-shrink-0 transition-colors ml-2 bg-gray-100 text-gray-600 group-hover:bg-gray-200">
                      <Icon
                        v-if="item.icon"
                        :icon="item.icon"
                        class="w-4 h-4"
                      />
                    </div>
                    <span class="flex-1 truncate font-semibold text-gray-700">
                      {{ item.label }}
                    </span>
                  </button>
                </template>
              </div>
              <div class="border-t border-gray-200 py-2">
                <button
                  class="flex items-center w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative text-red-600 hover:bg-red-50 border border-transparent"
                  @click="handleLogout"
                >
                  <div class="flex items-center justify-center w-8 h-8 rounded-lg mr-1 flex-shrink-0 transition-colors ml-2 bg-red-100 text-red-600 group-hover:bg-red-200">
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a2 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                  </div>
                  <span class="truncate font-semibold text-red-600">
                    Sign out
                  </span>
                </button>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </header>
</template>