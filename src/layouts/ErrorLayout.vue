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
            <div :class="iconContainerClasses">
              <Icon
                :icon="errorConfig.icon"
                size="xxl"
                :color="errorConfig.color"
                :aria-label="`${errorType} error icon`"
              />
            </div>
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
                <Icon icon="home" size="sm" class="mr-2" />
                {{ homeButtonText }}
              </Button>

              <Button
                v-if="showBackButton"
                variant="outline"
                size="lg"
                @click="goBack"
              >
                <Icon icon="arrow-left" size="sm" class="mr-2" />
                {{ backButtonText }}
              </Button>

              <Button
                v-if="showRetryButton"
                variant="ghost"
                size="lg"
                @click="retry"
              >
                <Icon icon="redo" size="sm" class="mr-2" />
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
                <Icon icon="question-circle" size="xs" class="mr-1" />
                Contact Support
              </a>
            </p>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import Button from '../components/Button.vue'
import Icon from '../components/Icon.vue'

export default {
  name: 'ErrorPage',
  components: {
    Button,
    Icon
  },
  props: {
    errorType: {
      type: String,
      default: '404',
      validator: (value) => ['404', '500', '403', '401', '400', '429', '503', 'network', 'timeout', 'generic'].includes(value)
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
  },
  emits: ['retry', 'back'],
  setup(props, { emit }) {
    const errorConfigs = computed(() => {
      const configs = {
        '404': {
          title: 'Page Not Found',
          message: 'Sorry, we couldn\'t find the page you\'re looking for.',
          icon: 'search',
          color: 'slate-400'
        },
        '500': {
          title: 'Internal Server Error',
          message: 'Something went wrong on our end. Please try again later.',
          icon: 'server',
          color: 'red-500'
        },
        '503': {
          title: 'Service Unavailable',
          message: 'The service is temporarily unavailable. Please try again later.',
          icon: 'tools',
          color: 'amber-500'
        },
        '403': {
          title: 'Access Denied',
          message: 'You don\'t have permission to access this resource.',
          icon: 'ban',
          color: 'red-500'
        },
        '401': {
          title: 'Unauthorized',
          message: 'You need to log in to access this resource.',
          icon: 'lock',
          color: 'amber-500'
        },
        '400': {
          title: 'Bad Request',
          message: 'The request could not be understood by the server.',
          icon: 'exclamation-triangle',
          color: 'amber-500'
        },
        '429': {
          title: 'Too Many Requests',
          message: 'You\'ve made too many requests. Please wait and try again.',
          icon: 'clock',
          color: 'amber-500'
        },
        'network': {
          title: 'Network Error',
          message: 'Unable to connect to the server. Please check your internet connection.',
          icon: 'wifi',
          color: 'red-500'
        },
        'timeout': {
          title: 'Request Timeout',
          message: 'The request took too long to complete. Please try again.',
          icon: 'hourglass-half',
          color: 'amber-500'
        },
        'generic': {
          title: 'Something went wrong',
          message: 'An unexpected error occurred. Please try again.',
          icon: 'exclamation-circle',
          color: 'slate-400'
        }
      }

      return configs[props.errorType] || configs.generic
    })

    const errorConfig = computed(() => errorConfigs.value)

    const errorTitle = computed(() => {
      return props.errorTitle || errorConfig.value.title
    })

    const errorMessage = computed(() => {
      return props.errorMessage || errorConfig.value.message
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

    const iconContainerClasses = computed(() => [
      'w-32 h-32 flex items-center justify-center'
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

    return {
      errorConfig,
      errorTitle,
      errorMessage,
      goBack,
      retry,
      layoutClasses,
      backgroundClasses,
      contentClasses,
      headerClasses,
      errorContentClasses,
      illustrationClasses,
      iconContainerClasses,
      detailsClasses,
      titleClasses,
      messageClasses,
      codeClasses,
      actionsClasses,
      helpClasses
    }
  }
}
</script>