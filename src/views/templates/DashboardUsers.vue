<script setup>
import { computed, ref } from 'vue'
import Badge from '../../components/Badge.vue'
import Button from '../../components/Button.vue'
import DataTable from '../../components/DataTable.vue'
import DataTableFilters from '../../components/DataTableFilters.vue'
import DataTableToolBar from '../../components/DataTableToolBar.vue'
import DashboardShell from './DashboardShell.vue'

const searchQuery = ref('')
const dateFrom = ref('')
const dateTo = ref('')
const selectedStatus = ref('')
const selectedUsers = ref([])
const density = ref('normal')

const statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Paused', value: 'paused' },
  { label: 'Pending', value: 'pending' }
]

const addButtonConfig = {
  label: 'Add User',
  icon: 'plus',
  variant: 'success',
  size: 'md',
  tooltip: 'Create a new user'
}

const columns = [
  { key: 'name', label: 'User' },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' },
  { key: 'lastLogin', label: 'Last Login' }
]

const visibleColumnKeys = ref(columns.map((column) => column.key))
const visibleColumns = computed(() =>
  columns.filter((column) => visibleColumnKeys.value.includes(column.key))
)

const allUsers = ref([
  { id: 1, name: 'Ari Lopez', role: 'Admin', status: 'active', lastLogin: '2 hours ago' },
  { id: 2, name: 'Bianca Shaw', role: 'Manager', status: 'active', lastLogin: 'Yesterday' },
  { id: 3, name: 'Chris Mills', role: 'Analyst', status: 'pending', lastLogin: '2 days ago' },
  { id: 4, name: 'Dani Hill', role: 'Reviewer', status: 'paused', lastLogin: '3 days ago' },
  { id: 5, name: 'Emil Cruz', role: 'Analyst', status: 'active', lastLogin: '4 days ago' }
])

const filteredUsers = computed(() => {
  return allUsers.value.filter((user) => {
    const matchSearch = !searchQuery.value || user.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchStatus = !selectedStatus.value || user.status === selectedStatus.value
    return matchSearch && matchStatus
  })
})

const bulkActions = [
  { key: 'message', label: 'Message', icon: 'message', variant: 'primary' },
  { key: 'pause', label: 'Pause', icon: 'pause', variant: 'warning' },
  { key: 'remove', label: 'Remove', icon: 'trash', variant: 'danger' }
]

const statusVariant = (status) => {
  const map = {
    active: 'success',
    paused: 'warning',
    pending: 'secondary'
  }
  return map[status] || 'secondary'
}

const handleToggleColumn = ({ column, visible }) => {
  if (visible) {
    if (!visibleColumnKeys.value.includes(column)) {
      visibleColumnKeys.value = [...visibleColumnKeys.value, column]
    }
  } else {
    visibleColumnKeys.value = visibleColumnKeys.value.filter((key) => key !== column)
  }
}
</script>

<template>
  <DashboardShell current-page="Users">
    <div class="space-y-6">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-semibold text-slate-900">User Directory</h1>
          <p class="text-slate-600 mt-1">Track active users, permissions, and last activity.</p>
        </div>
        <Button variant="primary">Invite Team</Button>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <DataTableFilters
          v-model:search-query="searchQuery"
          v-model:date-from="dateFrom"
          v-model:date-to="dateTo"
          :status-options="statusOptions"
          v-model:selected-status="selectedStatus"
          :show-file-upload="false"
          :show-date-filter="false"
          :show-export="true"
          :show-add="true"
          :add-button="addButtonConfig"
          search-placeholder="Search users"
          @export="() => {}"
          @add="() => {}"
        />

        <DataTableToolBar
          :selected-items="selectedUsers"
          :total-items="filteredUsers.length"
          :bulk-actions="bulkActions"
          :density="density"
          :toggleable-columns="columns"
          :visible-columns="visibleColumnKeys"
          :show-density-toggle="true"
          :show-column-toggle="false"
          :show-refresh="false"
          @update:density="(value) => (density = value)"
          @toggle-column="handleToggleColumn"
        />

        <DataTable
          :data="filteredUsers"
          :columns="visibleColumns"
          :selectable="true"
          :selected-items="selectedUsers"
          :density="density"
          :page-size="5"
          :show-pagination="true"
          striped
          @selection-change="(items) => (selectedUsers = items)"
        >
          <template #cell-status="{ value }">
            <Badge :variant="statusVariant(value)" size="sm">{{ value }}</Badge>
          </template>
        </DataTable>
      </div>
    </div>
  </DashboardShell>
</template>
