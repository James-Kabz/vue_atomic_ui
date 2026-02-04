<script setup>
import { ref, computed, inject } from 'vue'
import Icon from '../components/Icon.vue'

// Layout reference
const layoutRef = ref(null)

// Inject layout context (if needed for nested components)
const layoutContext = inject('dashboardLayout', null)

// Demo data
const stats = ref([
  {
    label: 'Total Users',
    value: '2,847',
    change: 12,
    trend: 'up',
    icon: 'users',
    bgColor: 'bg-(--ui-primary-soft)',
    iconColor: 'text-(--ui-primary)'
  },
  {
    label: 'Revenue',
    value: '$45,231',
    change: 8,
    trend: 'up',
    icon: 'dollar-sign',
    bgColor: 'bg-(--ui-success-soft)',
    iconColor: 'text-(--ui-success)'
  },
  {
    label: 'Orders',
    value: '1,423',
    change: 3,
    trend: 'down',
    icon: 'shopping-bag',
    bgColor: 'bg-(--ui-warning-soft)',
    iconColor: 'text-(--ui-warning)'
  },
  {
    label: 'Conversion Rate',
    value: '3.24%',
    change: 15,
    trend: 'up',
    icon: 'percent',
    bgColor: 'bg-(--ui-accent-soft)',
    iconColor: 'text-(--ui-accent)'
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


const getStatusColor = (status) => {
  const colors = {
    'Completed': 'bg-(--ui-success-soft) text-(--ui-success)',
    'In Progress': 'bg-(--ui-warning-soft) text-(--ui-warning)',
    'Failed': 'bg-(--ui-danger-soft) text-(--ui-danger)',
    'Pending': 'bg-(--ui-surface-muted) text-(--ui-text)'
  }
  return colors[status] || 'bg-(--ui-surface-muted) text-(--ui-text)'
}
</script>

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
        <h1 class="text-2xl font-bold text-(--ui-text)">
          Dashboard Demo
        </h1>
        <p class="text-(--ui-text-muted) mt-1">
          Welcome to the Vue UI Dashboard demo page
        </p>
      </div>
      <div class="flex items-center space-x-3">
        <button
          class="px-4 py-2 bg-(--ui-primary) text-(--ui-text-inverse) rounded-lg hover:bg-(--ui-primary-strong) transition-colors"
          @click="toggleSidebar"
        >
          {{ sidebarCollapsed ? 'Expand' : 'Collapse' }} Sidebar
        </button>
        <button
          class="px-4 py-2 bg-(--ui-surface-muted) text-(--ui-text-muted) rounded-lg hover:bg-(--ui-surface-soft) transition-colors"
          @click="refreshData"
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
        class="bg-(--ui-surface) p-6 rounded-lg shadow-sm border border-(--ui-border)"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-(--ui-text-muted)">
              {{ stat.label }}
            </p>
            <p class="text-2xl font-bold text-(--ui-text) mt-1">
              {{ stat.value }}
            </p>
          </div>
          <div :class="`w-12 h-12 rounded-lg flex items-center justify-center ${stat.bgColor}`">
            <Icon
              :icon="stat.icon"
              :class="`w-6 h-6 ${stat.iconColor}`"
            />
          </div>
        </div>
        <div class="flex items-center mt-4">
          <span :class="`text-sm font-medium ${stat.trend === 'up' ? 'text-(--ui-success)' : 'text-(--ui-danger)'}`">
            {{ stat.trend === 'up' ? '+' : '-' }}{{ stat.change }}%
          </span>
          <span class="text-sm text-(--ui-text-soft) ml-2">from last month</span>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Chart 1 -->
      <div class="bg-(--ui-surface) p-6 rounded-lg shadow-sm border border-(--ui-border)">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-(--ui-text)">
            Revenue Overview
          </h3>
          <select class="text-sm border border-(--ui-border) rounded-lg px-3 py-2">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
        </div>
        <div class="h-64 bg-(--ui-surface-muted) rounded-lg flex items-center justify-center">
          <div class="text-center">
            <div class="w-16 h-16 bg-(--ui-primary-soft) rounded-full flex items-center justify-center mx-auto mb-3">
              <svg
                class="w-8 h-8 text-(--ui-primary)"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <p class="text-(--ui-text-muted)">
              Chart component would go here
            </p>
          </div>
        </div>
      </div>

      <!-- Chart 2 -->
      <div class="bg-(--ui-surface) p-6 rounded-lg shadow-sm border border-(--ui-border)">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-(--ui-text)">
            User Activity
          </h3>
          <div class="flex items-center space-x-2">
            <span class="inline-flex items-center w-3 h-3 bg-(--ui-primary) rounded-full" />
            <span class="text-sm text-(--ui-text-muted)">Active Users</span>
          </div>
        </div>
        <div class="h-64 bg-(--ui-surface-muted) rounded-lg flex items-center justify-center">
          <div class="text-center">
            <div class="w-16 h-16 bg-(--ui-success-soft) rounded-full flex items-center justify-center mx-auto mb-3">
              <svg
                class="w-8 h-8 text-(--ui-success)"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <p class="text-(--ui-text-muted)">
              Activity chart would go here
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity Table -->
    <div class="bg-(--ui-surface) rounded-lg shadow-sm border border-(--ui-border)">
      <div class="p-6 border-b border-(--ui-border)">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-(--ui-text)">
            Recent Activity
          </h3>
          <button class="text-sm text-(--ui-primary) hover:text-(--ui-primary)">
            View all
          </button>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-(--ui-surface-muted)">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-(--ui-text-soft) uppercase tracking-wider">
                User
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-(--ui-text-soft) uppercase tracking-wider">
                Action
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-(--ui-text-soft) uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-(--ui-text-soft) uppercase tracking-wider">
                Time
              </th>
            </tr>
          </thead>
          <tbody class="bg-(--ui-surface) divide-y divide-gray-200">
            <tr
              v-for="activity in recentActivities"
              :key="activity.id"
              class="hover:bg-(--ui-surface-muted)"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-(--ui-surface-soft) rounded-full flex items-center justify-center">
                    <span class="text-xs font-medium text-(--ui-text-muted)">{{ activity.user.initials }}</span>
                  </div>
                  <div class="ml-3">
                    <div class="text-sm font-medium text-(--ui-text)">
                      {{ activity.user.name }}
                    </div>
                    <div class="text-sm text-(--ui-text-soft)">
                      {{ activity.user.email }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-(--ui-text)">
                  {{ activity.action }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(activity.status)}`">
                  {{ activity.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-(--ui-text-soft)">
                {{ activity.time }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Debug Info -->
    <div class="bg-(--ui-surface-muted) p-4 rounded-lg">
      <h4 class="font-medium text-(--ui-text) mb-2">
        Layout Debug Info
      </h4>
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
