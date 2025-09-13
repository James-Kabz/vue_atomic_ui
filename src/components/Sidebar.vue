<template>
  <aside :class="cn('bg-white border-r border-gray-200 h-full', className)">
    <div class="p-6">
      <!-- Sidebar Header -->
      <div class="mb-8">
        <slot name="header">
          <Logo />
        </slot>
      </div>

      <!-- Navigation -->
      <nav class="space-y-2">
        <slot name="navigation">
          <SidebarNavigation :items="items" />
        </slot>
      </nav>

      <!-- Footer -->
      <div class="mt-auto pt-8">
        <slot name="footer">
          <Divider class="mb-4" />
          <div class="flex items-center space-x-3">
            <Avatar size="sm" />
            <div>
              <Text class="text-sm font-medium">John Doe</Text>
              <Text class="text-xs text-gray-500">john@example.com</Text>
            </div>
          </div>
        </slot>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { cn } from '../utils/cn.js'

defineProps({
  items: {
    type: Array,
    default: () => [
      { label: 'Dashboard', href: '/dashboard', icon: 'home', active: true },
      { label: 'Users', href: '/users', icon: 'users' },
      { label: 'Settings', href: '/settings', icon: 'settings' }
    ]
  },
  className: {
    type: String,
    default: ''
  }
})
</script>
