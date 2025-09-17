<template>
  <!-- <DashboardLayout
    ref="layoutRef"
    :user="user"
    initial-section="Dashboard"
    initial-page="Demo"
    @navigate="handleNavigation"
    @search="handleSearch"
    @profile-action="handleProfileAction"
    @logout="handleLogout"
    @sidebar-toggle="handleSidebarToggle"
  > -->
    <!-- Demo Content -->
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Dashboard Demo</h1>
          <p class="text-gray-600 mt-1">Welcome to the Vue UI Dashboard demo page</p>
        </div>
        <div class="flex items-center space-x-3">
          <button
            @click="toggleSidebar"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {{ sidebarCollapsed ? 'Expand' : 'Collapse' }} Sidebar
          </button>
          <button
            @click="refreshData"
            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Refresh Data
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">{{ stat.label }}</p>
              <p class="text-2xl font-bold text-gray-900 mt-1">{{ stat.value }}</p>
            </div>
            <div :class="`w-12 h-12 rounded-lg flex items-center justify-center ${stat.bgColor}`">
              <component :is="stat.icon" :class="`w-6 h-6 ${stat.iconColor}`"/>
            </div>
          </div>
          <div class="flex items-center mt-4">
            <span :class="`text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`">
              {{ stat.trend === 'up' ? '+' : '-' }}{{ stat.change }}%
            </span>
            <span class="text-sm text-gray-500 ml-2">from last month</span>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Chart 1 -->
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900">Revenue Overview</h3>
            <select class="text-sm border border-gray-300 rounded-lg px-3 py-2">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <div class="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div class="text-center">
              <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
              <p class="text-gray-600">Chart component would go here</p>
            </div>
          </div>
        </div>

        <!-- Chart 2 -->
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900">User Activity</h3>
            <div class="flex items-center space-x-2">
              <span class="inline-flex items-center w-3 h-3 bg-blue-500 rounded-full"></span>
              <span class="text-sm text-gray-600">Active Users</span>
            </div>
          </div>
          <div class="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div class="text-center">
              <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                </svg>
              </div>
              <p class="text-gray-600">Activity chart would go here</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity Table -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <button class="text-sm text-blue-600 hover:text-blue-800">View all</button>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="activity in recentActivities" :key="activity.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span class="text-xs font-medium text-gray-600">{{ activity.user.initials }}</span>
                    </div>
                    <div class="ml-3">
                      <div class="text-sm font-medium text-gray-900">{{ activity.user.name }}</div>
                      <div class="text-sm text-gray-500">{{ activity.user.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ activity.action }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(activity.status)}`">
                    {{ activity.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ activity.time }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Debug Info -->
      <div class="bg-gray-100 p-4 rounded-lg">
        <h4 class="font-medium text-gray-900 mb-2">Layout Debug Info</h4>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span class="font-medium">Sidebar Collapsed:</span> {{ sidebarCollapsed }}
          </div>
          <div>
            <span class="font-medium">Sidebar Width:</span> {{ sidebarWidth }}px
          </div>
          <div>
            <span class="font-medium">Current Section:</span> {{ currentSection }}
          </div>
          <div>
            <span class="font-medium">Current Page:</span> {{ currentPage }}
          </div>
        </div>
      </div>
    </div>
  <!-- </DashboardLayout> -->
</template>

<script setup>
import { ref, computed, inject } from 'vue'

// Layout reference
const layoutRef = ref(null)

// Inject layout context (if needed for nested components)
const layoutContext = inject('dashboardLayout', null)

// User data
const user = ref({
  name: 'John Doe',
  email: 'john.doe@example.com',
  role: 'Administrator'
})

// Demo data
const stats = ref([
  {
    label: 'Total Users',
    value: '2,847',
    change: 12,
    trend: 'up',
    icon: {
      template: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-5.5a4 4 0 11-8 0 4 4 0 018 0z"/></svg>`
    },
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600'
  },
  {
    label: 'Revenue',
    value: '$45,231',
    change: 8,
    trend: 'up',
    icon: {
      template: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
    },
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600'
  },
  {
    label: 'Orders',
    value: '1,423',
    change: 3,
    trend: 'down',
    icon: {
      template: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>`
    },
    bgColor: 'bg-yellow-100',
    iconColor: 'text-yellow-600'
  },
  {
    label: 'Conversion Rate',
    value: '3.24%',
    change: 15,
    trend: 'up',
    icon: {
      template: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>`
    },
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-600'
  }
])

const recentActivities = ref([
  {
    id: 1,
    user: { name: 'Alice Johnson', email: 'alice@example.com', initials: 'AJ' },
    action: 'Created new project',
    status: 'Completed',
    time: '2 minutes ago'
  },
  {
    id: 2,
    user: { name: 'Bob Smith', email: 'bob@example.com', initials: 'BS' },
    action: 'Updated user profile',
    status: 'In Progress',
    time: '15 minutes ago'
  },
  {
    id: 3,
    user: { name: 'Carol Davis', email: 'carol@example.com', initials: 'CD' },
    action: 'Deleted old files',
    status: 'Failed',
    time: '1 hour ago'
  },
  {
    id: 4,
    user: { name: 'David Wilson', email: 'david@example.com', initials: 'DW' },
    action: 'Exported data report',
    status: 'Completed',
    time: '2 hours ago'
  }
])

// Computed properties to track layout state
const sidebarCollapsed = computed(() => layoutRef.value?.sidebarCollapsed || false)
const sidebarWidth = computed(() => layoutRef.value?.sidebarWidth || 256)
const currentSection = computed(() => layoutContext?.currentSection?.value || 'Dashboard')
const currentPage = computed(() => layoutContext?.currentPage?.value || 'Demo')

// Methods
const toggleSidebar = () => {
  if (layoutRef.value) {
    layoutRef.value.toggleSidebar()
  }
}

const refreshData = () => {
  // Simulate data refresh
  console.log('Refreshing data...')
  // You would typically make API calls here
}

const handleNavigation = (item) => {
  console.log('Navigated to:', item.name)
}

const handleSearch = (query) => {
  console.log('Search query:', query)
}

const handleProfileAction = (action) => {
  console.log('Profile action:', action.name)
}

const handleLogout = () => {
  console.log('User logged out')
  // Handle logout logic
}

const handleSidebarToggle = (collapsed) => {
  console.log('Sidebar toggled:', collapsed)
}

const getStatusColor = (status) => {
  const colors = {
    'Completed': 'bg-green-100 text-green-800',
    'In Progress': 'bg-yellow-100 text-yellow-800',
    'Failed': 'bg-red-100 text-red-800',
    'Pending': 'bg-gray-100 text-gray-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}
</script>
