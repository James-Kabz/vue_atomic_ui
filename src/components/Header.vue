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
  userInitialsOverride: { type: String, default: '' },
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
const showMobileSearch = ref(false)
const isMobile = ref(false)
const showOrganisationDropdown = ref(false)

const notificationCount = computed(() => {
  return props.notifications.filter(n => !n.read).length
})
const userInitials = computed(() => {
  if (props.userInitialsOverride) return props.userInitialsOverride
  const name = props.user?.name || 'Guest'
  return name.split(' ').map(n => n[0] || '').join('').toUpperCase()
})

const userRoleNames = computed(() => {
  if (props.userRoleDisplayOverride) return props.userRoleDisplayOverride

  const roles = []

  if (props.activeRoles?.length > 0) {
    roles.push(...props.activeRoles.map(role =>
      typeof role === 'string' ? role : role.name
    ))
  }

  if (roles.length === 0 && props.user?.roles?.length > 0) {
    roles.push(...props.user.roles.map(role =>
      typeof role === 'string' ? role : role.name
    ))
  }

  if (roles.length === 0 && props.currentOrganisation?.role) {
    roles.push(props.currentOrganisation.role)
  }

  if (roles.length === 0) return 'Member'

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

const getNotificationTypeClass = (notification) => {
  if (notification.title.includes('Overdue')) {
    return 'bg-red-100 text-red-600'
  }
  
  if (notification.title.includes('Due in 0')) {
    return 'bg-orange-100 text-orange-600'
  }
  
  const classes = {
    'due_date_reminder': 'bg-amber-100 text-amber-600',
    'info': 'bg-blue-100 text-blue-600',
    'success': 'bg-green-100 text-green-600',
    'warning': 'bg-yellow-100 text-yellow-600',
    'error': 'bg-red-100 text-red-600'
  }
  
  return classes[notification.type] || classes.info
}


const formatModelName = (model) => {
  if (!model) return ''
  
  const parts = model.split('\\')
  const modelName = parts[parts.length - 1]
  
  return modelName
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

const formatDueDate = (dateString) => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const dueDate = new Date(date)
  dueDate.setHours(0, 0, 0, 0)
  
  const diffTime = dueDate - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Due Today'
  if (diffDays === 1) return 'Due Tomorrow'
  if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`
  if (diffDays <= 7) return `Due in ${diffDays} days`
  
  return date.toLocaleDateString('en-KE', { 
    month: 'short', 
    day: 'numeric',
    year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
  })
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
</script>

<template>
  <header
    :class="cn(
      'fixed top-0 z-50 bg-white border-b border-gray-200 transition-all duration-300 ease-in-out w-full'
    )"
    :style="{ left: '0' }"
  >
    <div class="flex items-center justify-between h-14 sm:h-16 px-3 sm:px-4 md:px-6">
      <!-- Left side - Organisation & Page Info -->
      <div class="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
        <!-- Mobile Sidebar Toggle - Moved to far left -->
        <button
          v-if="isMobile"
          class="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors shrink-0"
          @click="emit('toggle-mobile-sidebar')"
        >
          <Icon
            icon="bars"
            class="w-5 h-5"
          />
        </button>

        <!-- Company Logo (Software Provider) -->
        <div
          v-if="companyLogo && showHeaderLogo"
          class="shrink-0 hidden sm:block"
        >
          <img
            :src="companyLogo"
            alt="Company logo"
            class="w-8 h-8 sm:w-10 sm:h-10 object-contain rounded-lg shadow-sm"
          >
        </div>

        <!-- Divider -->
        <div
          v-if="companyLogo && showOrganisationInfo && currentOrganisation"
          class="h-6 sm:h-8 w-px bg-gray-300 shrink-0 hidden sm:block"
        />

        <!-- Organisation Info Card - Simplified for mobile -->
        <div
          v-if="showOrganisationInfo && currentOrganisation"
          class="shrink-0 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-blue-200 shadow-sm flex items-center gap-2 sm:gap-3 relative hover:shadow-md transition-shadow max-w-[180px] sm:max-w-none"
        >
          <!-- Organisation Logo - Hidden on very small screens -->
          <div
            v-if="organisationLogo"
            class="shrink-0 hidden xs:block"
          >
            <div class="relative">
              <img
                :src="organisationLogo"
                :alt="`${currentOrganisation.organisation_name} logo`"
                class="w-7 h-7 sm:w-10 sm:h-10 object-contain rounded-lg bg-white p-0.5 sm:p-1 border border-blue-200 shadow-sm"
              >
              <!-- Online indicator -->
              <div class="absolute -bottom-0.5 -right-0.5 w-2 h-2 sm:w-3 sm:h-3 bg-green-500 border-2 border-white rounded-full" />
            </div>
          </div>

          <!-- Organisation Details with Switcher -->
          <button
            v-if="organisations.length > 1"
            class="flex items-center gap-1.5 sm:gap-2 min-w-0 cursor-pointer hover:bg-white/50 rounded-lg px-1.5 sm:px-2 py-1 sm:py-1.5 transition-all group"
            @click="toggleOrganisationDropdown"
          >
            <div class="min-w-0 flex-1">
              <p class="text-xs sm:text-sm font-bold text-blue-900 truncate max-w-[120px] sm:max-w-[180px] group-hover:text-blue-700">
                {{ currentOrganisation.organisation_name }}
              </p>
              <div class="flex items-center gap-1 sm:gap-1.5 mt-0.5 hidden sm:flex">
                <Icon
                  icon="user"
                  class="w-3 h-3 text-blue-600 shrink-0"
                />
                <p
                  v-if="formattedActiveRoles"
                  class="text-xs text-blue-700 truncate font-medium"
                >
                  {{ formattedActiveRoles }}
                </p>
              </div>
            </div>
            <Icon
              icon="chevron-down"
              class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 shrink-0 group-hover:text-blue-700 transition-transform"
              :class="{ 'rotate-180': showOrganisationDropdown }"
            />
          </button>

          <!-- Static display when only one organisation -->
          <div
            v-else
            class="min-w-0 flex-1"
          >
            <p class="text-xs sm:text-sm font-bold text-blue-900 truncate max-w-[120px] sm:max-w-[180px]">
              {{ currentOrganisation.organisation_name }}
            </p>
            <div class="flex items-center gap-1 sm:gap-1.5 mt-0.5 hidden sm:flex">
              <Icon
                icon="user"
                class="w-3 h-3 text-blue-600 shrink-0"
              />
              <p
                v-if="formattedActiveRoles"
                class="text-xs text-blue-700 truncate font-medium"
              >
                {{ formattedActiveRoles }}
              </p>
            </div>
          </div>

          <!-- Organisation Dropdown - Mobile optimized -->
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
              class="absolute top-full left-0 right-0 sm:left-0 sm:right-auto mt-2 w-full sm:w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden"
            >
              <div class="p-3 sm:p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <h3 class="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Icon
                    icon="list"
                    class="w-4 h-4 text-blue-600"
                  />
                  {{ organisationSwitcherTitle }}
                </h3>
                <p class="text-xs text-gray-600 mt-1">
                  {{ organisationSwitcherDescription }}
                </p>
              </div>
              <div class="py-2 max-h-80 overflow-y-auto">
                <button
                  v-for="org in organisations"
                  :key="org.org_id || org.organisation_name"
                  :class="cn(
                    'flex items-center w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm transition-all group',
                    org.org_id === currentOrganisation?.org_id
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-l-4 border-blue-500'
                      : 'text-gray-700 hover:bg-gray-50 border-l-4 border-transparent'
                  )"
                  @click="handleOrganisationChange(org)"
                >
                  <div
                    v-if="org.logo"
                    class="shrink-0 mr-2 sm:mr-3"
                  >
                    <img
                      :src="org.logo"
                      :alt="`${org.organisation_name} logo`"
                      class="w-7 h-7 sm:w-8 sm:h-8 object-contain rounded-lg bg-white p-0.5 sm:p-1 border border-gray-200 group-hover:border-blue-200 transition-colors"
                    >
                  </div>
                  <div
                    v-else
                    class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-linear-to-br from-gray-200 to-gray-300 flex items-center justify-center mr-2 sm:mr-3 shrink-0"
                  >
                    <Icon
                      icon="building"
                      class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500"
                    />
                  </div>
                  <div class="flex-1 text-left min-w-0">
                    <p class="font-semibold truncate text-sm">
                      {{ org.organisation_name }}
                    </p>
                    <p
                      v-if="org.type"
                      class="text-xs text-gray-500 truncate"
                    >
                      {{ org.type.name }}
                    </p>
                  </div>
                  <Icon
                    v-if="org.org_id === currentOrganisation?.org_id"
                    icon="check-circle"
                    class="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 shrink-0 ml-2"
                  />
                </button>
              </div>
            </div>
          </transition>
        </div>

        <!-- Breadcrumb - Hidden on mobile -->
        <nav
          v-if="showBreadcrumb"
          class="hidden lg:flex items-center space-x-2 text-sm truncate"
        >
          <span class="text-gray-500 truncate">{{ currentSection }}</span>
          <Icon
            icon="chevron-right"
            class="w-4 h-4 text-gray-400 shrink-0"
          />
          <span class="text-gray-900 font-semibold truncate">{{ currentPage }}</span>
        </nav>
      </div>

      <!-- Right side - Actions -->
      <div class="flex items-center space-x-1 sm:space-x-2 md:space-x-3">
        <!-- Search - Mobile optimized -->
        <div
          v-if="showSearch && (!isMobile || showMobileSearch)"
          class="relative"
        >
          <div class="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
            <Icon
              icon="search"
              class="w-4 h-4 text-gray-400"
            />
          </div>
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="searchPlaceholder"
            class="pl-8 sm:pl-10 pr-8 sm:pr-4 py-1.5 sm:py-2 w-36 sm:w-48 md:w-64 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          >
          <button
            v-if="isMobile"
            class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
            @click="showMobileSearch = false"
          >
            <Icon icon="times" class="w-4 h-4" />
          </button>
        </div>
        <button
          v-else-if="showSearch && isMobile"
          class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
          @click="showMobileSearch = true"
        >
          <Icon
            icon="search"
            class="w-5 h-5"
          />
        </button>

        <!-- Notifications -->
        <button
          v-if="showNotifications"
          class="relative p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
          @click="toggleNotifications"
        >
          <Icon
            icon="bell"
            class="w-5 h-5"
          />
          <span
            v-if="notificationCount > 0"
            class="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 min-w-[16px] h-[16px] sm:min-w-[18px] sm:h-[18px] bg-red-500 text-white text-[10px] sm:text-xs rounded-full flex items-center justify-center font-semibold px-0.5 sm:px-1"
          >
            {{ notificationCount > 9 ? '9+' : notificationCount }}
          </span>
        </button>

        <!-- Notifications Dropdown - Mobile optimized -->
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
            class="absolute right-2 sm:right-4 md:right-6 top-14 sm:top-16 mt-2 w-[calc(100vw-1rem)] max-w-sm sm:w-80 md:w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50"
          >
            <div class="p-3 sm:p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <h3 class="text-sm sm:text-base font-bold text-gray-900">
                {{ notificationsTitle }}
              </h3>
              <p v-if="notificationCount > 0" class="text-xs text-gray-600 mt-1">
                You have {{ notificationCount }} unread notification{{ notificationCount > 1 ? 's' : '' }}
              </p>
            </div>
            
            <div class="max-h-[60vh] sm:max-h-96 overflow-y-auto">
              <div
                v-if="notifications.length === 0"
                class="p-6 sm:p-8 text-center"
              >
                <Icon
                  icon="bell"
                  class="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-gray-300 mb-2"
                />
                <p class="text-sm text-gray-500">
                  No notifications
                </p>
              </div>
              
              <div
                v-for="notification in notifications"
                v-else
                :key="notification.id"
                :class="[
                  'p-3 sm:p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors',
                  notification.read ? 'opacity-60' : ''
                ]"
                @click="handleNotificationClick(notification)"
              >
                <div class="flex items-start space-x-2 sm:space-x-3">
                  <!-- Notification Type Icon -->
                  <div 
                    :class="[
                      'shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center',
                      getNotificationTypeClass(notification)
                    ]"
                  >
                    <Icon
                      v-if="notification.title.includes('Overdue')"
                      icon="exclamation-triangle"
                      class="w-4 h-4 sm:w-5 sm:h-5"
                    />
                    <Icon
                      v-else-if="notification.type === 'due_date_reminder'"
                      icon="clock"
                      class="w-4 h-4 sm:w-5 sm:h-5"
                    />
                    <Icon
                      v-else
                      icon="bell"
                      class="w-4 h-4 sm:w-5 sm:h-5"
                    />
                  </div>
                  
                  <div class="flex-1 min-w-0">
                    <!-- Notification Title -->
                    <div class="flex items-start justify-between gap-2">
                      <p class="text-xs sm:text-sm font-semibold text-gray-900 flex-1 leading-tight">
                        {{ notification.title }}
                      </p>
                      <!-- Unread indicator -->
                      <div 
                        v-if="!notification.read"
                        class="shrink-0 w-2 h-2 mt-1 bg-blue-500 rounded-full" 
                      />
                    </div>
                    
                    <div 
                      v-if="notification.source"
                      class="flex items-center gap-1 sm:gap-1.5 mt-1.5 flex-wrap"
                    >
                      <span class="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs font-semibold bg-indigo-100 text-indigo-800 border border-indigo-200">
                        <Icon icon="tag" class="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
                        {{ notification.source.body_code }}
                      </span>
                      <Icon icon="chevron-right" class="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-400 hidden xs:block" />
                      <span class="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                        {{ notification.source.code }}
                      </span>
                    </div>
                    
                    <!-- Model & Due Date Badges -->
                    <div class="flex items-center gap-1.5 sm:gap-2 mt-1.5 sm:mt-2 flex-wrap">
                      <span 
                        v-if="notification.model"
                        class="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        <Icon icon="file" class="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
                        <span class="truncate max-w-[100px] sm:max-w-none">{{ formatModelName(notification.model) }}</span>
                      </span>
                      
                      <!-- Due Date Badge -->
                      <span 
                        v-if="notification.due_date"
                        :class="[
                          'inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs font-medium whitespace-nowrap',
                          notification.title.includes('Overdue') 
                            ? 'bg-red-100 text-red-800 border border-red-200' 
                            : notification.title.includes('Due in 0')
                            ? 'bg-orange-100 text-orange-800 border border-orange-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        ]"
                      >
                        <Icon icon="calendar" class="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1 shrink-0" />
                        {{ formatDueDate(notification.due_date) }}
                      </span>
                    </div>
                    
                    <!-- Time -->
                    <p class="text-[10px] sm:text-xs text-gray-500 mt-1.5 sm:mt-2 flex items-center">
                      <Icon icon="clock" class="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
                      {{ notification.time }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div
              v-if="notifications.length > 0"
              class="p-2 sm:p-3 text-center border-t border-gray-200 bg-gray-50"
            >
              <button
                class="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                @click="handleViewAllNotifications"
              >
                View all notifications →
              </button>
            </div>
          </div>
        </transition>

        <!-- Profile Dropdown -->
        <div class="relative">
          <button
            class="flex items-center space-x-1 sm:space-x-2 md:space-x-3 p-1 sm:p-2 rounded-lg hover:bg-gray-50 transition-colors"
            @click="toggleProfile"
          >
            <div
              class="w-7 h-7 sm:w-8 sm:h-8 bg-linear-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center transition-colors shadow-sm"
            >
              <span class="text-blue-700 text-xs sm:text-sm font-medium">{{ userInitials }}</span>
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
            <Icon
              icon="chevron-down"
              class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400"
            />
          </button>

          <!-- Dropdown - Mobile optimized -->
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
              class="absolute right-0 mt-2 w-56 sm:w-58 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
            >
              <div class="p-3 sm:p-4 border-b border-gray-200">
                <p class="text-sm font-medium text-gray-900 truncate">
                  {{ user.name }}
                </p>
                <p class="text-xs text-gray-500 truncate">
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
                      'flex items-center px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative',
                      isItemActive(item)
                        ? 'bg-linear-to-br from-blue-50 to-blue-100 text-blue-700 shadow-sm border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
                    )"
                    @click="handleNavigation(item)"
                  >
                    <!-- Active indicator bar -->
                    <div
                      v-if="isItemActive(item)"
                      class="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 sm:h-8 bg-linear-to-b from-blue-500 to-blue-600 rounded-r-full"
                    />
                    <div
                      :class="cn(
                        'flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg mr-2 sm:mr-3 shrink-0 transition-colors ml-1 sm:ml-2',
                        isItemActive(item)
                          ? 'bg-linear-to-br from-blue-500 to-blue-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                      )"
                    >
                      <Icon
                        v-if="item.icon"
                        :icon="item.icon"
                        class="w-3.5 h-3.5 sm:w-4 sm:h-4"
                      />
                    </div>
                    <span
                      :class="cn(
                        'flex-1 truncate font-semibold text-xs sm:text-sm',
                        isItemActive(item) ? 'text-blue-700' : 'text-gray-700'
                      )"
                    >
                      {{ item.label }}
                    </span>
                  </router-link>
                  <button
                    v-else
                    class="flex items-center w-full px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-transparent"
                    @click="handleProfileAction(item)"
                  >
                    <div
                      class="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg mr-2 sm:mr-3 shrink-0 transition-colors ml-1 sm:ml-2 bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                    >
                      <Icon
                        v-if="item.icon"
                        :icon="item.icon"
                        class="w-3.5 h-3.5 sm:w-4 sm:h-4"
                      />
                    </div>
                    <span class="flex-1 truncate font-semibold text-gray-700 text-xs sm:text-sm">
                      {{ item.label }}
                    </span>
                  </button>
                </template>
              </div>
              <div class="border-t border-gray-200 py-2">
                <button
                  class="flex items-center w-full px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative text-red-600 hover:bg-red-50 border border-transparent"
                  @click="handleLogout"
                >
                  <div
                    class="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg mr-1 sm:mr-1 shrink-0 transition-colors ml-1 sm:ml-2 bg-red-100 text-red-600 group-hover:bg-red-200"
                  >
                    <Icon
                      icon="sign-out-alt"
                      class="w-3.5 h-3.5 sm:w-4 sm:h-4"
                    />
                  </div>
                  <span class="truncate font-semibold text-red-600 text-xs sm:text-sm">
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