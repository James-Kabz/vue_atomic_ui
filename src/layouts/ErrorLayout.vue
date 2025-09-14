<template>
  <div :class="layoutClasses">
    <!-- Background -->
    <div v-if="showBackground" :class="backgroundClasses">
      <slot name="background">
        <div class="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100" />
      </slot>
    </div>

    <!-- Content -->
    <div :class="contentClasses">
      <!-- Header/Logo -->
      <div v-if="$slots.header || showLogo" :class="headerClasses">
        <slot name="header">
          <div class="flex justify-center">
            <slot name="logo">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                  <span class="text-white font-bold text-lg">STL</span>
                </div>
                <span class="text-2xl font-bold text-slate-900">{{ brandName }}</span>
              </div>
            </slot>
          </div>
        </slot>
      </div>

      <!-- Error Content -->
      <div :class="errorContentClasses">
        <!-- Error Icon/Illustration -->
        <div v-if="$slots.illustration || showDefaultIllustration" :class="illustrationClasses">
          <slot name="illustration">
            <component :is="errorIcon" :class="iconClasses" />
          </slot>
        </div>

        <!-- Error Details -->
        <div :class="detailsClasses">
          <h1 :class="titleClasses">
            <slot name="title">{{ errorTitle }}</slot>
          </h1>

          <p :class="messageClasses">
            <slot name="message">{{ errorMessage }}</slot>
          </p>

          <!-- Error Code -->
          <div v-if="errorCode" :class="codeClasses">
            Error Code: {{ errorCode }}
          </div>
        </div>

        <!-- Actions -->
        <div v-if="$slots.actions || showDefaultActions" :class="actionsClasses">
          <slot name="actions">
            <div class="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                v-if="showHomeButton"
                :href="homeUrl"
                variant="primary"
                size="lg"
              >
                {{ homeButtonText }}
              </Button>

              <Button
                v-if="showBackButton"
                variant="outline"
                size="lg"
                @click="goBack"
              >
                {{ backButtonText }}
              </Button>

              <Button
                v-if="showRetryButton"
                variant="ghost"
                size="lg"
                @click="retry"
              >
                {{ retryButtonText }}
              </Button>
            </div>
          </slot>
        </div>

        <!-- Additional Help -->
        <div v-if="$slots.help || helpText" :class="helpClasses">
          <slot name="help">
            <p class="text-sm text-slate-600">
              {{ helpText }}
              <a v-if="supportUrl" :href="supportUrl" class="text-blue-600 hover:text-blue-700 underline ml-1">
                Contact Support
              </a>
            </p>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Button from '../../atoms/Button/Button.vue'

// Error icons
const Error404Icon = {
  template: `
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="80" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="2"/>
      <text x="100" y="110" text-anchor="middle" font-size="48" font-weight="bold" fill="#64748b">404</text>
    </svg>
  `
}

const Error500Icon = {
  template: `
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="80" fill="#fef2f2" stroke="#fecaca" stroke-width="2"/>
      <text x="100" y="110" text-anchor="middle" font-size="48" font-weight="bold" fill="#dc2626">500</text>
    </svg>
  `
}

const ErrorGenericIcon = {
  template: `
    <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
    </svg>
  `
}

const props = defineProps({
  errorType: {
    type: String,
    default: '404',
    validator: (value) => ['404', '500', '403', 'generic'].includes(value)
  },
  errorTitle: {
    type: String,
    default: null
  },
  errorMessage: {
    type: String,
    default: null
  },
  errorCode: {
    type: [String, Number],
    default: null
  },
  brandName: {
    type: String,
    default: 'Software Technologies'
  },
  showLogo: {
    type: Boolean,
    default: true
  },
  showBackground: {
    type: Boolean,
    default: true
  },
  showDefaultIllustration: {
    type: Boolean,
    default: true
  },
  showDefaultActions: {
    type: Boolean,
    default: true
  },
  showHomeButton: {
    type: Boolean,
    default: true
  },
  showBackButton: {
    type: Boolean,
    default: true
  },
  showRetryButton: {
    type: Boolean,
    default: false
  },
  homeUrl: {
    type: String,
    default: '/'
  },
  homeButtonText: {
    type: String,
    default: 'Go Home'
  },
  backButtonText: {
    type: String,
    default: 'Go Back'
  },
  retryButtonText: {
    type: String,
    default: 'Try Again'
  },
  helpText: {
    type: String,
    default: null
  },
  supportUrl: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['retry', 'back'])

const errorDefaults = computed(() => {
  const defaults = {
    '404': {
      title: 'Page Not Found',
      message: 'Sorry, we couldn\'t find the page you\'re looking for.',
      icon: Error404Icon
    },
    '500': {
      title: 'Server Error',
      message: 'Something went wrong on our end. Please try again later.',
      icon: Error500Icon
    },
    '403': {
      title: 'Access Denied',
      message: 'You don\'t have permission to access this resource.',
      icon: ErrorGenericIcon
    },
    'generic': {
      title: 'Something went wrong',
      message: 'An unexpected error occurred. Please try again.',
      icon: ErrorGenericIcon
    }
  }

  return defaults[props.errorType] || defaults.generic
})

const errorIcon = computed(() => errorDefaults.value.icon)

const errorTitle = computed(() => {
  return props.errorTitle || errorDefaults.value.title
})

const errorMessage = computed(() => {
  return props.errorMessage || errorDefaults.value.message
})

const goBack = () => {
  if (window.history.length > 1) {
    window.history.back()
  } else {
    window.location.href = props.homeUrl
  }
  emit('back')
}

const retry = () => {
  window.location.reload()
  emit('retry')
}

const layoutClasses = computed(() => [
  'min-h-screen relative flex items-center justify-center',
  'px-4 sm:px-6 lg:px-8'
])

const backgroundClasses = computed(() => [
  'absolute inset-0 -z-10'
])

const contentClasses = computed(() => [
  'w-full max-w-lg mx-auto text-center'
])

const headerClasses = computed(() => [
  'mb-8'
])

const errorContentClasses = computed(() => [
  'space-y-6'
])

const illustrationClasses = computed(() => [
  'flex justify-center mb-6'
])

const iconClasses = computed(() => [
  'w-32 h-32 text-slate-400'
])

const detailsClasses = computed(() => [
  'space-y-3'
])

const titleClasses = computed(() => [
  'text-3xl font-bold text-slate-900'
])

const messageClasses = computed(() => [
  'text-lg text-slate-600'
])

const codeClasses = computed(() => [
  'text-sm text-slate-500 font-mono'
])

const actionsClasses = computed(() => [
  'mt-8'
])

const helpClasses = computed(() => [
  'mt-6'
])
</script>
