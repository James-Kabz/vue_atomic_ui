<template>
  <header :class="cn('bg-white border-b border-gray-200 shadow-sm', className)">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo/Brand -->
        <div class="flex items-center">
          <slot name="logo">
            <Logo />
          </slot>
        </div>

        <!-- Main Navigation -->
        <div class="hidden md:block">
          <slot name="navigation">
            <MainNavigation />
          </slot>
        </div>

        <!-- Actions -->
        <div class="flex items-center space-x-4">
          <slot name="actions">
            <Button variant="ghost" size="sm">Sign In</Button>
            <Button size="sm">Sign Up</Button>
          </slot>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden">
          <slot name="mobile-toggle">
            <Button variant="ghost" size="sm" @click="$emit('toggle-mobile-menu')">
              <Icon name="menu" class="h-5 w-5" />
            </Button>
          </slot>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { cn } from '../utils/cn.js'

defineProps({
  className: {
    type: String,
    default: ''
  }
})

defineEmits(['toggle-mobile-menu'])
</script>
