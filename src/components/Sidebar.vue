<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { cn } from '../utils/cn.js'
import Icon from './Icon.vue'

// Props
const props = defineProps({
  sidebarWidth: {
    type: Number,
    default: 130
  },
  header: {
    type: Object,
    default: null
  },
  navigationItems: {
    type: Array,
    required: true,
  },
  managementSettings: {
    type: Array,
    default: () => []
  },
  showManagementSettings: {
    type: Boolean,
    default: true
  },
  mobileOpen: {
    type: Boolean,
    default: false
  },
  isManagementSettingsActive: {
    type: Boolean,
    default: false
  },
  currentPath: {
    type: String,
    default: ''
  },
  // Search props
  showSearch: {
    type: Boolean,
    default: false
  },
  searchPlaceholder: {
    type: String,
    default: 'Search...'
  },
  searchableMenus: {
    type: Array,
    default: () => [] // Array of menu names that should have search (e.g., ['compliance', 'risks'])
  }
})

// Emits
const emit = defineEmits([
  'navigate',
  'update:mobileOpen',
  'search'
])

// Internal State
const isMobile = ref(false)
const submenuOpen = ref(false)
const currentSubmenu = ref(null)
const managementSettingsOpen = ref(false)
const searchQuery = ref('')

// Computed
const isMobileOpen = computed(() => props.mobileOpen)

const submenuStyle = computed(() => {
  if (isMobile.value) {
    return {}
  }
  return {
    left: `${props.sidebarWidth}px`,
  }
})

const managementStyle = computed(() => {
  if (isMobile.value) {
    return {}
  }
  return {
    left: `${props.sidebarWidth}px`,
  }
})

// Check if current submenu should show search
const shouldShowSubmenuSearch = computed(() => {
  if (!props.showSearch || !currentSubmenu.value) return false
  
  // Check if this menu is in the searchableMenus list
  const menuName = currentSubmenu.value.name?.toLowerCase() || ''
  return props.searchableMenus.some(name => 
    menuName.includes(name.toLowerCase())
  )
})

// Filter submenu items based on search query
const filteredSubmenuItems = computed(() => {
  if (!currentSubmenu.value?.subItems) return []
  
  if (!searchQuery.value.trim()) {
    return currentSubmenu.value.subItems
  }
  
  const query = searchQuery.value.toLowerCase().trim()
  return currentSubmenu.value.subItems.filter(item => {
    const label = item.label?.toLowerCase() || ''
    const name = item.name?.toLowerCase() || ''
    return label.includes(query) || name.includes(query)
  })
})

// Computed for main content margin
const contentMarginLeft = computed(() => {
  if (isMobile.value) {
    return 0
  }

  let margin = props.sidebarWidth
  if (submenuOpen.value) margin += 220
  if (managementSettingsOpen.value) margin += 220

  return margin
})

// Methods
const handleNavigation = (item) => {
  emit('navigate', item)
  if (isMobile.value) {
    closeMobileSidebar()
  }
  // On mobile, always close menus after navigation
  // On desktop, don't close submenu if navigating to a subitem, or management settings if navigating to a setting
  const isSubmenuItem = submenuOpen.value && currentSubmenu.value && currentSubmenu.value.subItems.some(sub => sub.route === item.route)
  const isManagementItem = managementSettingsOpen.value && props.managementSettings.some(setting => setting.route === item.route)
  if (isMobile.value || !(isSubmenuItem || isManagementItem)) {
    closeAllMenus()
  }
}

const closeMobileSidebar = () => {
  emit('update:mobileOpen', false)
}

const hasSubItems = (item) => {
  return item.subItems && item.subItems.length > 0
}

const handleSubmenuClick = (item) => {
  // Close any open menus
  if (managementSettingsOpen.value) {
    closeManagementSettings()
  }
  if (submenuOpen.value && currentSubmenu.value !== item) {
    closeSubmenu()
    setTimeout(() => {
      currentSubmenu.value = item
      submenuOpen.value = true
      searchQuery.value = '' // Reset search when opening new submenu
    }, 300)
  } else if (!submenuOpen.value) {
    currentSubmenu.value = item
    submenuOpen.value = true
    searchQuery.value = '' // Reset search when opening submenu
  } else if (currentSubmenu.value === item) {
    closeSubmenu()
  }
  if (isMobile.value) {
    closeMobileSidebar()
  }
}

const handleManagementSettingsClick = () => {
  // Close any open menus
  if (submenuOpen.value) {
    closeSubmenu()
  }
  if (!managementSettingsOpen.value) {
    managementSettingsOpen.value = true
  } else {
    closeManagementSettings()
  }
  if (isMobile.value) {
    closeMobileSidebar()
  }
}

const closeSubmenu = () => {
  submenuOpen.value = false
  searchQuery.value = '' // Reset search when closing submenu
  setTimeout(() => {
    currentSubmenu.value = null
  }, 300)
}

const closeManagementSettings = () => {
  managementSettingsOpen.value = false
}

const closeAllMenus = () => {
  closeSubmenu()
  closeManagementSettings()
}

const handleSubmenuNavigation = (item) => {
  handleNavigation(item)
}

const handleManagementSettingsNavigation = (item) => {
  handleNavigation(item)
}

const handleSearch = (value) => {
  searchQuery.value = value
  emit('search', { query: value, menu: currentSubmenu.value?.name })
}

const clearSearch = () => {
  searchQuery.value = ''
}

// Check if navigation item is active using passed currentPath prop
const isItemActive = (item) => {
  const currentPath = props.currentPath
  
  if (!item.route) {
    // For parent items with subItems, check if any subItem is active
    if (item.subItems && item.subItems.length > 0) {
      return item.subItems.some(subItem => {
        if (!subItem.route) return false
        return currentPath === subItem.route || currentPath.startsWith(subItem.route + '/')
      })
    }
    return false
  }

  if (currentPath === item.route) return true
  if (currentPath.startsWith(item.route + '/')) return true

  return false
}

// Handle responsive behavior
const checkMobile = () => {
  const wasMobile = isMobile.value
  isMobile.value = window.innerWidth < 1024

  if (wasMobile && !isMobile.value && isMobileOpen.value) {
    closeMobileSidebar()
  }
}

// Handle escape key to close mobile sidebar and menus
const handleEscape = (event) => {
  if (event.key === 'Escape') {
    if (submenuOpen.value || managementSettingsOpen.value) {
      closeAllMenus()
    } else if (isMobile.value && isMobileOpen.value) {
      closeMobileSidebar()
    }
  }
}

// Lifecycle
onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
  document.removeEventListener('keydown', handleEscape)
})

// Expose values for parent
defineExpose({
  isMobile,
  isMobileOpen,
  submenuOpen,
  managementSettingsOpen,
  contentMarginLeft,
  closeAllMenus
})
</script>

<template>
  <div>
    <!-- Mobile Overlay -->
    <transition
      enter-active-class="transition-opacity duration-300"
      leave-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isMobileOpen && isMobile"
        class="fixed inset-0 z-30 lg:hidden"
        @click="closeMobileSidebar"
      />
    </transition>

    <!-- Sidebar -->
    <aside
      :class="cn(
        'fixed left-0 z-40 border-r overflow-hidden flex flex-col',
        'transition-all duration-300 ease-in-out',
        'bg-(--ui-surface) border-(--ui-border)',
        isMobile
          ? cn('transform h-screen', isMobileOpen ? 'translate-x-0' : '-translate-x-full')
          : 'translate-x-0 h-[calc(100vh-4rem)]'
      )"
      :style="{ width: sidebarWidth + 'px', top: isMobile ? '0px' : '4rem' }"
    >
      <!-- Mobile Header with Close Button -->
      <div
        v-if="isMobile"
        class="flex items-center justify-between p-4 border-b border-(--ui-border) shrink-0 lg:hidden"
      >
        <h2 class="text-lg font-bold text-(--ui-text)">
          {{ header?.title }}
        </h2>
        <button
          class="p-2 rounded-lg text-(--ui-text-soft) hover:text-(--ui-text) hover:bg-(--ui-surface-muted) transition-colors"
          aria-label="Close sidebar"
          @click="closeMobileSidebar"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>


      <!-- Navigation -->
      <nav class="flex-1 overflow-y-auto overflow-x-hidden p-4">
        <div class="space-y-2">
          <template
            v-for="item in navigationItems"
            :key="item.name || item.label"
          >
            <!-- Navigation Links -->
            <div v-if="item.type === 'link'">
              <!-- Regular Link (no subitems) -->
              <router-link
                v-if="!hasSubItems(item)"
                :to="item.route"
                :class="cn(
                  'flex flex-col items-center justify-center rounded-xl transition-all duration-200 group relative py-4 px-3',
                  isItemActive(item)
                    ? 'bg-linear-to-br from-(--ui-primary-soft) to-(--ui-primary-soft) border border-(--ui-primary-soft) shadow-sm'
                    : 'text-(--ui-text-soft) hover:bg-(--ui-surface-muted) hover:text-(--ui-text) border border-transparent'
                )"
                @click="handleNavigation(item)"
              >
                <!-- Icon Container -->
                <div
                  :class="cn(
                    'flex items-center justify-center rounded-lg transition-colors mb-2',
                    'w-12 h-12',
                    isItemActive(item)
                      ? 'bg-linear-to-br from-(--ui-primary) to-(--ui-primary) text-(--ui-text-inverse) shadow-md'
                      : 'text-(--ui-text-soft) group-hover:text-(--ui-text) bg-(--ui-surface-muted) group-hover:bg-(--ui-surface-soft)'
                  )"
                >
                  <Icon
                    :icon="item.icon"
                    class="w-6 h-6"
                  />
                </div>

                <!-- Label -->
                <span 
                  :class="cn(
                    'text-xs font-medium text-center',
                    isItemActive(item) 
                      ? 'text-(--ui-primary) font-semibold' 
                      : 'text-(--ui-text-soft) group-hover:text-(--ui-text)'
                  )"
                >
                  {{ item.label }}
                </span>

                <!-- Badge -->
                <span
                  v-if="item.badge"
                  class="absolute top-2 right-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full bg-(--ui-danger) text-(--ui-text-inverse)"
                >
                  {{ item.badge }}
                </span>
              </router-link>

              <!-- Parent item with sub-items -->
              <div
                v-else
                :class="cn(
                  'flex flex-col items-center justify-center rounded-xl transition-all duration-200 cursor-pointer group relative py-4 px-3',
                  isItemActive(item)
                    ? 'bg-linear-to-br from-(--ui-primary-soft) to-(--ui-primary-soft) border border-(--ui-primary-soft) shadow-sm'
                    : 'text-(--ui-text-soft) hover:bg-(--ui-surface-muted) hover:text-(--ui-text) border border-transparent'
                )"
                @click="handleSubmenuClick(item)"
              >
                <!-- Icon Container -->
                <div
                  :class="cn(
                    'flex items-center justify-center rounded-lg transition-colors mb-2',
                    'w-12 h-12',
                    isItemActive(item)
                      ? 'bg-linear-to-br from-(--ui-primary) to-(--ui-primary) text-(--ui-text-inverse) shadow-md'
                      : 'text-(--ui-text-soft) group-hover:text-(--ui-text) bg-(--ui-surface-muted) group-hover:bg-(--ui-surface-soft)'
                  )"
                >
                  <Icon
                    :icon="item.icon"
                    class="w-6 h-6"
                  />
                </div>

                <!-- Label -->
                <span 
                  :class="cn(
                    'text-xs font-medium text-center',
                    isItemActive(item) 
                      ? 'text-(--ui-primary) font-semibold' 
                      : 'text-(--ui-text-soft) group-hover:text-(--ui-text)'
                  )"
                >
                  {{ item.label }}
                </span>

                <!-- Badge -->
                <span
                  v-if="item.badge"
                  class="absolute top-2 right-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full bg-(--ui-danger) text-(--ui-text-inverse)"
                >
                  {{ item.badge }}
                </span>

                <!-- Active indicator dot for parent items -->
                <div
                  v-if="isItemActive(item) && hasSubItems(item)"
                  class="absolute top-1.5 right-1.5 w-2 h-2 bg-(--ui-primary) rounded-full"
                />
              </div>
            </div>
          </template>
        </div>
      </nav>

      <!-- Bottom Navigation - Management Settings -->
      <div
        v-if="showManagementSettings"
        class="border-t border-(--ui-border) p-4 shrink-0"
      >
        <div
          :class="cn(
            'flex flex-col items-center justify-center rounded-xl transition-all duration-200 cursor-pointer group relative py-4 px-3',
            isManagementSettingsActive
              ? 'bg-linear-to-br from-(--ui-primary-soft) to-(--ui-primary-soft) border border-(--ui-primary-soft) shadow-sm'
              : 'text-(--ui-text-soft) hover:bg-(--ui-surface-muted) hover:text-(--ui-text) border border-transparent'
          )"
          @click="handleManagementSettingsClick"
        >
          <div
            :class="cn(
              'flex items-center justify-center rounded-lg transition-colors mb-2',
              'w-12 h-12',
              isManagementSettingsActive
                ? 'bg-linear-to-br from-(--ui-primary) to-(--ui-primary) text-(--ui-text-inverse) shadow-md'
                : 'text-(--ui-text-soft) group-hover:text-(--ui-text) bg-(--ui-surface-muted) group-hover:bg-(--ui-surface-soft)'
            )"
          >
            <Icon
              icon="cog"
              class="w-6 h-6"
            />
          </div>
          <span 
            :class="cn(
              'text-xs font-medium text-center',
              isManagementSettingsActive 
                ? 'text-(--ui-primary) font-semibold' 
                : 'text-(--ui-text-soft) group-hover:text-(--ui-text)'
            )"
          >
            Settings
          </span>

          <!-- Active indicator dot for management settings -->
          <div
            v-if="isManagementSettingsActive"
            class="absolute top-1.5 right-1.5 w-2 h-2 bg-(--ui-primary) rounded-full"
          />
        </div>
      </div>
    </aside>

    <!-- Submenu Sidebar -->
    <transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-300 ease-in"
      enter-from-class="opacity-0 -translate-x-full"
      enter-to-class="opacity-100 translate-x-0"
      leave-from-class="opacity-100 translate-x-0"
      leave-to-class="opacity-0 -translate-x-full"
    >
      <aside
        v-if="submenuOpen"
        :class="
          cn(
            'fixed z-40 bg-(--ui-surface) border-r border-(--ui-border) overflow-y-auto shadow-lg',
            isMobile ? 'left-0 w-52 top-20 h-screen' : 'w-56 top-16 h-[calc(100vh-4rem)]',
          )
        "
        :style="submenuStyle"
      >
        <!-- Submenu Header -->
        <div class="sticky top-0 bg-(--ui-surface) border-b border-(--ui-border) z-10">
          <div class="flex items-center justify-between p-4">
            <button
              class="p-2 -ml-2 rounded-lg text-(--ui-text-soft) hover:text-(--ui-text-muted) hover:bg-(--ui-surface-muted) transition-colors"
              aria-label="Close submenu"
              @click="closeSubmenu"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <h3 class="flex-1 text-sm font-bold text-(--ui-text) ml-2">
              {{ currentSubmenu?.label }}
            </h3>
          </div>

          <!-- Search Bar (Conditionally shown) -->
          <div
            v-if="shouldShowSubmenuSearch"
            class="px-4 pb-3"
          >
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                :placeholder="searchPlaceholder"
                class="w-full px-3 py-2 pl-9 pr-9 text-sm border border-(--ui-border) rounded-lg focus:outline-none focus:ring-2 focus:ring-(--ui-primary) focus:border-transparent transition-all"
                @input="handleSearch(searchQuery)"
              >
              <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-(--ui-text-soft)">
                <Icon
                  icon="search"
                  class="w-4 h-4"
                />
              </div>
              <button
                v-if="searchQuery"
                class="absolute right-2 top-1/2 transform -translate-y-1/2 text-(--ui-text-soft) hover:text-(--ui-text-muted) transition-colors p-1"
                @click="clearSearch"
              >
                <Icon
                  icon="times"
                  class="w-4 h-4"
                />
              </button>
            </div>
            
            <!-- Search Results Count -->
            <div
              v-if="searchQuery"
              class="mt-2 text-xs text-(--ui-text-soft) px-1"
            >
              {{ filteredSubmenuItems.length }} result{{ filteredSubmenuItems.length !== 1 ? 's' : '' }} found
            </div>
          </div>
        </div>

        <!-- Submenu Items -->
        <nav class="p-3">
          <!-- No Results Message -->
          <div
            v-if="shouldShowSubmenuSearch && searchQuery && filteredSubmenuItems.length === 0"
            class="px-3 py-8 text-center"
          >
            <Icon
              icon="search"
              class="w-12 h-12 mx-auto text-(--ui-text-soft) mb-3"
            />
            <p class="text-sm text-(--ui-text-soft) mb-1">
              No results found
            </p>
            <p class="text-xs text-(--ui-text-soft)">
              Try a different search term
            </p>
          </div>

          <!-- Submenu Items List -->
          <div
            v-else
            class="space-y-1"
          >
            <router-link
              v-for="subItem in filteredSubmenuItems"
              :key="subItem.name"
              :to="subItem.route"
              :class="
                cn(
                  'flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative',
                  isItemActive(subItem)
                    ? 'bg-linear-to-br from-(--ui-primary-soft) to-(--ui-primary-soft) text-(--ui-primary) shadow-sm border border-(--ui-primary-soft)'
                    : 'text-(--ui-text-muted) hover:bg-(--ui-surface-muted) hover:text-(--ui-text) border border-transparent',
                )
              "
              @click="handleSubmenuNavigation(subItem)"
            >
              <!-- Active indicator bar -->
              <div
                v-if="isItemActive(subItem)"
                class="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-linear-to-b from-(--ui-primary) to-(--ui-primary) rounded-r-full"
              />

              <div
                :class="
                  cn(
                    'flex items-center justify-center w-8 h-8 rounded-lg mr-3 shrink-0 transition-colors ml-2',
                    isItemActive(subItem)
                      ? 'bg-linear-to-br from-(--ui-primary) to-(--ui-primary) text-(--ui-text-inverse) shadow-md'
                      : 'bg-(--ui-surface-muted) text-(--ui-text-muted) group-hover:bg-(--ui-surface-soft)',
                  )
                "
              >
                <Icon
                  v-if="subItem.icon"
                  :icon="subItem.icon"
                  class="w-4 h-4"
                />
              </div>
              <span 
                :class="cn(
                  'flex-1 truncate font-semibold',
                  isItemActive(subItem) ? 'text-(--ui-primary)' : 'text-(--ui-text-muted)'
                )"
              >
                {{ subItem.label }}
              </span>
              <span
                v-if="subItem.badge"
                class="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold rounded-full bg-(--ui-danger) text-(--ui-text-inverse)"
              >
                {{ subItem.badge }}
              </span>
            </router-link>
          </div>
        </nav>
      </aside>
    </transition>

    <!-- Management Settings Sidebar -->
    <transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-300 ease-in"
      enter-from-class="opacity-0 -translate-x-full"
      enter-to-class="opacity-100 translate-x-0"
      leave-from-class="opacity-100 translate-x-0"
      leave-to-class="opacity-0 -translate-x-full"
    >
      <aside
        v-if="managementSettingsOpen"
        :class="
          cn(
            'fixed z-40 bg-(--ui-surface) border-r border-(--ui-border) overflow-y-auto shadow-lg',
            isMobile ? 'left-0 w-52 top-20 h-full' : 'w-58 h-[calc(100vh-4rem)]',
          )
        "
        :style="{ ...managementStyle, top: isMobile ? '55px' : '4rem' }"
      >
        <!-- Management Settings Header -->
        <div class="sticky top-0 z-10 bg-(--ui-surface) border-b border-(--ui-border)">
          <div class="flex items-center justify-between p-4">
            <button
              class="p-2 -ml-2 rounded-lg text-(--ui-text-soft) hover:text-(--ui-text-muted) hover:bg-(--ui-surface-muted) transition-colors"
              aria-label="Close management settings"
              @click="closeManagementSettings"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <h3 class="flex-1 text-sm font-bold text-(--ui-text) ml-2">
              Management Settings
            </h3>
          </div>
        </div>

        <!-- Management Settings Items -->
        <nav class="p-3">
          <div class="space-y-1">
            <template
              v-for="setting in managementSettings"
              :key="setting.name"
            >
              <!-- Section Header -->
              <div
                v-if="setting.type === 'section'"
                class="px-3 py-2 text-xs font-semibold text-(--ui-text-soft) uppercase tracking-wider"
              >
                {{ setting.label }}
              </div>
              <!-- Link Item -->
              <router-link
                v-else-if="setting.route"
                :to="setting.route"
                :class="
                  cn(
                    'flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative',
                    isItemActive(setting)
                      ? 'bg-linear-to-br from-(--ui-primary-soft) to-(--ui-primary-soft) text-(--ui-primary) shadow-sm border border-(--ui-primary-soft)'
                      : 'text-(--ui-text-muted) hover:bg-(--ui-surface-muted) hover:text-(--ui-text) border border-transparent',
                  )
                "
                @click="handleManagementSettingsNavigation(setting)"
              >
                <!-- Active indicator bar -->
                <div
                  v-if="isItemActive(setting)"
                  class="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-linear-to-b from-(--ui-primary) to-(--ui-primary) rounded-r-full"
                />

                <div
                  :class="
                    cn(
                      'flex items-center justify-center w-8 h-8 rounded-lg mr-3 shrink-0 transition-colors',
                      isItemActive(setting)
                        ? 'bg-linear-to-br from-(--ui-primary) to-(--ui-primary) text-(--ui-text-inverse) shadow-md'
                        : 'bg-(--ui-surface-muted) text-(--ui-text-muted) group-hover:bg-(--ui-surface-soft)',
                    )
                  "
                >
                  <Icon
                    v-if="setting.icon"
                    :icon="setting.icon"
                    class="w-4 h-4"
                  />
                </div>
                <span
                  :class="cn(
                    'flex-1 truncate font-semibold',
                    isItemActive(setting) ? 'text-(--ui-primary)' : 'text-(--ui-text-muted)'
                  )"
                >
                  {{ setting.label }}
                </span>
              </router-link>
            </template>
          </div>
        </nav>
      </aside>
    </transition>

    <!-- Overlay for mobile submenus -->
    <transition
      enter-active-class="transition-opacity duration-300"
      leave-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="(submenuOpen || managementSettingsOpen) && isMobile"
        class="fixed inset-0 z-30 bg-transparent"
        @click="closeAllMenus"
      />
    </transition>
  </div>
</template>