<template>
  <div class="min-h-screen relative flex items-center justify-center" :style="{ backgroundColor: backgroundColor }">
    <!-- Background Image -->
    <div class="absolute inset-0 bg-cover bg-center" :style="{
      backgroundImage: `url('${backgroundImage}')`,
      opacity: backgroundOpacity
    }" />

    <!-- Main Container -->
    <div class="container mx-auto px-4 relative z-10">
      <div class="grid lg:grid-cols-10 gap-8 items-center min-h-screen">

        <!-- Branding Section (Left Side) -->
        <div class="lg:col-span-6 text-white text-center lg:text-left space-y-6">
          <!-- Primary Logo (eHORIZON style) -->
          <div class="mb-6">
            <div class="text-4xl lg:text-6xl font-bold mb-2">
              <span :style="{ color: primaryColor }">{{ primaryLogoPrefix }}</span>
              <span class="text-white">{{ primaryLogoText }}</span>
            </div>
            <div class="h-0.5 w-30 mx-auto lg:mx-0" :style="{ backgroundColor: primaryColor }" />
          </div>

          <!-- Secondary Logo (eBoard style) -->
          <div class="flex items-center justify-center lg:justify-start mb-6">
            <div class="flex items-center justify-center w-15 h-15 rounded-lg mr-4 text-white font-bold text-xl"
              :style="{ backgroundColor: primaryColor }">
              {{ secondaryLogoPrefix }}
            </div>
            <span class="text-3xl lg:text-4xl font-bold text-white">{{ secondaryLogoText }}</span>
          </div>

          <!-- Quote -->
          <div class="max-w-md mx-auto lg:mx-0">
            <p class="text-sm lg:text-base font-light text-white/70 italic leading-relaxed">
              <!-- "{{ quote }}" -->
            </p>
          </div>
        </div>

        <!-- Form Section (Right Side) -->
        <div class="lg:col-span-4">
          <div class="bg-white rounded-lg shadow-xl p-6 lg:p-8 max-w-md mx-auto">
            <!-- Card Header -->
            <div v-if="$slots['card-header'] || title" class="mb-6">
              <slot name="card-header">
                <div class="text-center">
                  <h1 class="text-2xl font-bold text-gray-900">{{ title }}</h1>
                  <p v-if="subtitle" class="text-gray-600 mt-2">{{ subtitle }}</p>
                </div>
              </slot>
            </div>

            <!-- Main Form Content -->
            <div class="space-y-6">
              <router-view />
            </div>

            <!-- Card Footer -->
            <div v-if="$slots['card-footer']" class="mt-6">
              <slot name="card-footer" />
            </div>
          </div>

          <!-- Additional Links -->
          <div v-if="$slots.links" class="mt-6 text-center">
            <slot name="links" />
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Company Branding (Bottom Right) -->
    <div class="absolute bottom-4 right-4 text-right">
      <div class="flex items-end justify-end mb-2">
        <div class="text-right mr-3">
          <div class="text-red-500 font-bold text-xs">{{ companyName }}</div>
          <div class="text-white text-xs">{{ companyType }}</div>
          <div class="text-white/70 text-xs">{{ companyTagline }}</div>
        </div>
        <div class="w-8 h-8 bg-red-500 rounded flex items-center justify-center text-white font-bold text-xs">
          {{ companyInitials }}
        </div>
      </div>
      <div class="text-white/70 text-xs">
        <div>{{ appName }} ({{ appVersion }})</div>
        <div>{{ copyright }}</div>
      </div>
    </div>

    <!-- Social Media Links (Bottom Left) -->
    <div class="absolute bottom-4 left-4 flex gap-2">
      <a v-for="social in socialLinks" :key="social.name" :href="social.url" :class="[
        'w-8 h-7 flex items-center justify-center rounded text-xs transition-colors',
        social.variant === 'primary'
          ? 'bg-blue-600 hover:bg-blue-700 text-white'
          : social.variant === 'info'
            ? 'bg-cyan-500 hover:bg-cyan-600 text-white'
            : 'bg-gray-600 hover:bg-gray-700 text-white'
      ]">
        <font-awesome-icon :icon="['fab', social.icon]" />
      </a>
    </div>

  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'AuthLayout',
  props: {
    title: {
      type: String,
      default: null
    },
    subtitle: {
      type: String,
      default: null
    },
    primaryLogoPrefix: {
      type: String,
      default: 'e'
    },
    primaryLogoText: {
      type: String,
      default: 'HORIZON'
    },
    secondaryLogoPrefix: {
      type: String,
      default: 'e'
    },
    secondaryLogoText: {
      type: String,
      default: 'Risk & Compliance'
    },
    quote: {
      type: String,
      default: ''
    },
    primaryColor: {
      type: String,
      default: '#e74c3c'
    },
    backgroundColor: {
      type: String,
      default: '#2c2c2c'
    },
    backgroundImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80'
    },
    backgroundOpacity: {
      type: Number,
      default: 0.4
    },
    companyName: {
      type: String,
      default: 'SOFTWARE'
    },
    companyType: {
      type: String,
      default: 'TECHNOLOGIES'
    },
    companyTagline: {
      type: String,
      default: 'People | Processes | Governance'
    },
    companyInitials: {
      type: String,
      default: 'ST'
    },
    appName: {
      type: String,
      default: 'eHorizon eBoard X'
    },
    appVersion: {
      type: String,
      default: 'Version 2.0'
    },
    copyright: {
      type: String,
      default: 'Copyright © 2025 Software Technologies Limited'
    },
    socialLinks: {
      type: Array,
      default: () => [
        { name: 'linkedin', url: '#', icon: 'linkedin-in', variant: 'primary' },
        { name: 'facebook', url: '#', icon: 'facebook-f', variant: 'primary' },
        { name: 'twitter', url: '#', icon: 'twitter', variant: 'info' }
      ]
    }
  },
  setup(props) {
    const currentYear = computed(() => new Date().getFullYear())

    return {
      currentYear
    }
  }
}
</script>