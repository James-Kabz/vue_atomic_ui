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
    logoUrl: {
      type: String,
      default: '/logo.png' // Update this with your logo path
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
      default: 'https://lh3.googleusercontent.com/gps-cs-s/AG0ilSxeN2zWMjNsmwOrn8a8dDwnu2e5jjzYNembgPZFUXus_sLxUfpCJSKS-8Z7fj3ta1Q_xXDZ-skeFTUoGR75RTIlxQCIYrmjLOqfBNsk8Cjd_qrJaa72l1D2-aEoDwJJKKeTpUmeEg=s1360-w1360-h1020-rw'
    },
    backgroundOpacity: {
      type: Number,
      default: 0.4
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
    showFooter: {
      type: Boolean,
      default: true
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
  setup() {
    const currentYear = computed(() => new Date().getFullYear())

    return {
      currentYear
    }
  }
}
</script>

<template>
  <div
    class="min-h-screen relative flex items-center justify-center overflow-x-hidden"
    :style="{ backgroundColor: backgroundColor }"
  >
    <!-- Background Image -->
    <div
      class="absolute inset-0 bg-cover bg-center"
      :style="{
        backgroundImage: `url('${backgroundImage}')`,
        opacity: backgroundOpacity
      }"
    />

    <!-- Main Container -->
    <div class="container mx-auto px-4 py-10 lg:py-0 relative z-10 w-full">
      <div class="grid lg:grid-cols-10 gap-6 lg:gap-8 items-center min-h-screen">
        <!-- Branding Section (Left Side) - Hidden on mobile -->
        <div class="hidden lg:block lg:col-span-6 text-(--ui-text-inverse) text-center lg:text-left space-y-6">
          <!-- Logo -->
          <div class="mb-6 flex justify-center lg:justify-start">
            <img
              :src="logoUrl"
              alt="Company Logo"
              class="h-52 lg:h-72 w-auto object-contain"
            >
          </div>

          <!-- Quote -->
          <div
            v-if="quote"
            class="max-w-md mx-auto lg:mx-0"
          >
            <p class="text-sm lg:text-base font-light text-[color:color-mix(in oklab, var(--ui-text-inverse), transparent 30%)] italic leading-relaxed">
              "{{ quote }}"
            </p>
          </div>
        </div>

        <!-- Form Section (Right Side) -->
        <div class="lg:col-span-4 w-full">
          <!-- Mobile Logo - Only shown on mobile -->
          <div class="lg:hidden mb-6 flex justify-center">
            <img
              :src="logoUrl"
              alt="Company Logo"
              class="h-24 w-auto object-contain"
            >
          </div>

          <div class="bg-(--ui-surface) rounded-lg shadow-xl p-4 sm:p-6 lg:p-8 max-w-md mx-auto w-full">
            <!-- Card Header -->
            <div
              v-if="$slots['card-header'] || title"
              class="mb-4 sm:mb-6"
            >
              <slot name="card-header">
                <div class="text-center">
                  <h1 class="text-xl sm:text-2xl font-bold text-(--ui-text)">
                    {{ title }}
                  </h1>
                  <p
                    v-if="subtitle"
                    class="text-sm sm:text-base text-(--ui-text-muted) mt-2"
                  >
                    {{ subtitle }}
                  </p>
                </div>
              </slot>
            </div>

            <!-- Main Form Content -->
            <div class="space-y-4 sm:space-y-6">
              <router-view />
            </div>

            <!-- Card Footer -->
            <div
              v-if="$slots['card-footer']"
              class="mt-4 sm:mt-6"
            >
              <slot name="card-footer" />
            </div>
          </div>

          <!-- Additional Links -->
          <div
            v-if="$slots.links"
            class="mt-4 sm:mt-6 text-center"
          >
            <slot name="links" />
          </div>
        </div>
      </div>
    </div>

    <!-- Footer (Bottom Right) - Adjusted for mobile -->
    <div 
      v-if="showFooter" 
      class="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 text-right"
    >
      <img
        :src="logoUrl"
        alt="Company Logo"
        class="hidden sm:block h-20 sm:h-32 lg:h-40 w-auto object-contain ml-auto mb-2"
      >
      <div class="text-[color:color-mix(in oklab, var(--ui-text-inverse), transparent 10%)] text-[10px] sm:text-xs bg-[color:color-mix(in oklab, var(--ui-surface-strong), transparent 70%)] sm:bg-transparent px-2 py-1 sm:p-0 rounded">
        <div class="font-medium">
          {{ appName }}
        </div>
        <div class="hidden sm:block">
          ({{ appVersion }})
        </div>
        <div class="hidden sm:block">
          {{ copyright }}
        </div>
      </div>
    </div>

    <!-- Social Media Links (Bottom Left) - Adjusted for mobile -->
    <div class="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 flex gap-1.5 sm:gap-2">
      <a
        v-for="social in socialLinks"
        :key="social.name"
        :href="social.url"
        :class="[
          'w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded text-xs transition-colors',
          social.variant === 'primary'
            ? 'bg-(--ui-primary) hover:bg-(--ui-primary-strong) text-(--ui-text-inverse)'
            : social.variant === 'info'
              ? 'bg-(--ui-primary) hover:bg-(--ui-primary) text-(--ui-text-inverse)'
              : 'bg-(--ui-surface-soft) hover:bg-(--ui-surface-soft) text-(--ui-text-inverse)'
        ]"
      >
        <font-awesome-icon :icon="['fab', social.icon]" />
      </a>
    </div>
  </div>
</template>