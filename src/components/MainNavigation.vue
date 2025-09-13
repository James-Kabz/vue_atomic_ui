<template>
  <nav :class="cn('flex space-x-8', className)">
    <slot>
      <Link 
        v-for="item in items" 
        :key="item.label"
        :href="item.href"
        :class="cn(
          'text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors',
          item.active && 'text-blue-600 font-semibold'
        )"
      >
        {{ item.label }}
      </Link>
    </slot>
  </nav>
</template>

<script setup>
import { cn } from '../utils/cn.js'

defineProps({
  items: {
    type: Array,
    default: () => [
      { label: 'Home', href: '/', active: true },
      { label: 'About', href: '/about' },
      { label: 'Services', href: '/services' },
      { label: 'Contact', href: '/contact' }
    ]
  },
  className: {
    type: String,
    default: ''
  }
})
</script>
