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
          <div v-if="errorCode" :class="codeClasses">
            {{ errorCode }}
          </div>

          <h1 :class="titleClasses">
            <slot name="title">{{ errorTitle }}</slot>
          </h1>

          <p :class="messageClasses">
            <slot name="message">{{ errorMessage }}</slot>
          </p>
        </div>

        <!-- Actions -->
        <div v-if="$slots.actions || showDefaultActions" :class="actionsClasses">
          <slot name="actions">
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                v-if="showHomeButton"
                @click="goHome"
                variant="primary"
                size="lg"
              >
                <Icon :icon="homeButtonIcon" class="w-4 h-4 mr-2" />
                {{ homeButtonText }}
              </Button>

              <Button
                v-if="showBackButton"
                variant="outline"
                size="lg"
                @click="goBack"
              >
                <Icon icon="arrow-left" class="w-4 h-4 mr-2" />
                {{ backButtonText }}
              </Button>

              <Button
                v-if="showRetryButton"
                variant="ghost"
                size="lg"
                @click="retry"
              >
                <Icon icon="redo" class="w-4 h-4 mr-2" />
                {{ retryButtonText }}
              </Button>

              <Button
                v-if="showSupportButton"
                variant="ghost"
                size="lg"
                @click="$emit('contact-support')"
              >
                <Icon icon="user" class="w-4 h-4 mr-2" />
                Contact Support
              </Button>
            </div>
          </slot>
        </div>

        <!-- Additional Info Section -->
        <div v-if="$slots['additional-info'] || showAdditionalInfo" :class="additionalInfoClasses">
          <slot name="additional-info">
            <div class="mt-8 max-w-md mx-auto" v-if="additionalInfoConfig">
              <div class="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
                <h3 class="text-lg font-semibold text-slate-900 mb-4">
                  {{ additionalInfoConfig.title }}
                </h3>
                <ul class="space-y-3">
                  <li 
                    v-for="(item, index) in additionalInfoConfig.items" 
                    :key="index"
                    class="flex items-start gap-3 text-sm text-slate-600"
                  >
                    <Icon 
                      :icon="item.icon" 
                      :color="item.iconColor || 'slate-400'" 
                      class="w-4 h-4 mt-0.5 flex-shrink-0" 
                    />
                    <span>{{ item.text }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </slot>
        </div>

        <!-- Help Section -->
        <div v-if="$slots.help || helpText" :class="helpClasses">
          <slot name="help">
            <p class="text-sm text-slate-600">
              {{ helpText }}
              <a v-if="supportUrl" :href="supportUrl" class="text-blue-600 hover:text-blue-700 underline ml-1">
                <Icon icon="question-circle" class="w-4 h-4 inline mr-1" />
                Get Help
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
import { useRouter } from 'vue-router'
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
      type: [String, Number],
      default: '404'
    },
    errorCode: {
      type: [String, Number],
      default: null
    },
    errorTitle: {
      type: String,
      default: null
    },
    errorMessage: {
      type: String,
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
    showSupportButton: {
      type: Boolean,
      default: false
    },
    showAdditionalInfo: {
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
  emits: ['retry', 'back', 'contact-support'],
  setup(props, { emit }) {
    const router = useRouter()

    const errorConfigs = computed(() => {
      const configs = {
        '404': {
          title: 'Page Not Found',
          message: 'Sorry, we couldn\'t find the page you\'re looking for.',
          icon: 'search',
          color: 'slate-400',
          homeButtonIcon: 'home',
          additionalInfo: {
            title: 'What can you do?',
            items: [
              { icon: 'check', iconColor: 'green-500', text: 'Check the URL for typos' },
              { icon: 'check', iconColor: 'green-500', text: 'Go back to the previous page' },
              { icon: 'check', iconColor: 'green-500', text: 'Visit our homepage' }
            ]
          }
        },
        '403': {
          title: 'Unauthorized Access',
          message: 'You are not authorized to view this page.',
          icon: 'ban',
          color: 'red-500',
          homeButtonIcon: 'lock',
          additionalInfo: {
            title: 'Why am I seeing this?',
            items: [
              { icon: 'check', iconColor: 'yellow-500', text: 'You may need to log in to access this page' },
              { icon: 'check', iconColor: 'yellow-500', text: 'Your account might not have the required permissions' },
              { icon: 'check', iconColor: 'yellow-500', text: 'Contact support if you believe this is an error' }
            ]
          }
        },
        '401': {
          title: 'Authentication Required',
          message: 'You need to log in to access this resource.',
          icon: 'lock',
          color: 'amber-500',
          homeButtonIcon: 'lock',
          additionalInfo: {
            title: 'How to proceed?',
            items: [
              { icon: 'check', iconColor: 'blue-500', text: 'Log in with your credentials' },
              { icon: 'check', iconColor: 'blue-500', text: 'Create an account if you don\'t have one' },
              { icon: 'check', iconColor: 'blue-500', text: 'Reset your password if you forgot it' }
            ]
          }
        },
        '500': {
          title: 'Internal Server Error',
          message: 'Something went wrong on our end. Please try again later.',
          icon: 'server',
          color: 'red-500',
          homeButtonIcon: 'home',
          additionalInfo: {
            title: 'What happened?',
            items: [
              { icon: 'check', iconColor: 'red-500', text: 'Our servers are experiencing issues' },
              { icon: 'check', iconColor: 'red-500', text: 'The problem is temporary' },
              { icon: 'check', iconColor: 'red-500', text: 'Try refreshing the page or come back later' }
            ]
          }
        },
        '503': {
          title: 'Service Unavailable',
          message: 'The service is temporarily unavailable. Please try again later.',
          icon: 'tools',
          color: 'amber-500',
          homeButtonIcon: 'home',
          additionalInfo: {
            title: 'Service Status',
            items: [
              { icon: 'check', iconColor: 'amber-500', text: 'We\'re performing scheduled maintenance' },
              { icon: 'check', iconColor: 'amber-500', text: 'Normal service will resume shortly' },
              { icon: 'check', iconColor: 'amber-500', text: 'Check our status page for updates' }
            ]
          }
        },
        'network': {
          title: 'Network Error',
          message: 'Unable to connect to the server. Please check your internet connection.',
          icon: 'wifi',
          color: 'red-500',
          homeButtonIcon: 'home',
          additionalInfo: {
            title: 'Connection Issues',
            items: [
              { icon: 'check', iconColor: 'red-500', text: 'Check your internet connection' },
              { icon: 'check', iconColor: 'red-500', text: 'Try refreshing the page' },
              { icon: 'check', iconColor: 'red-500', text: 'Contact your network administrator' }
            ]
          }
        }
      }

      return configs[props.errorType] || configs['404']
    })

    const errorConfig = computed(() => errorConfigs.value)

    const errorTitle = computed(() => {
      return props.errorTitle || errorConfig.value.title
    })

    const errorMessage = computed(() => {
      return props.errorMessage || errorConfig.value.message
    })

    const homeButtonIcon = computed(() => {
      return errorConfig.value.homeButtonIcon || 'home'
    })

    const additionalInfoConfig = computed(() => {
      return props.showAdditionalInfo ? errorConfig.value.additionalInfo : null
    })

    const goHome = () => {
      router.push(props.homeUrl)
    }

    const goBack = () => {
      if (window.history.length > 1) {
        router.back()
      } else {
        router.push(props.homeUrl)
      }
      emit('back')
    }

    const retry = () => {
      window.location.reload()
      emit('retry')
    }

    // Computed classes
    const layoutClasses = computed(() => [
      'min-h-screen relative flex items-center justify-center',
      'px-4 sm:px-6 lg:px-8'
    ])

    const backgroundClasses = computed(() => [
      'absolute inset-0 -z-10'
    ])

    const contentClasses = computed(() => [
      'w-full max-w-2xl mx-auto text-center'
    ])

    const headerClasses = computed(() => [
      'mb-8'
    ])

    const errorContentClasses = computed(() => [
      'space-y-8'
    ])

    const illustrationClasses = computed(() => [
      'flex justify-center mb-6'
    ])

    const iconContainerClasses = computed(() => [
      'w-32 h-32 flex items-center justify-center'
    ])

    const detailsClasses = computed(() => [
      'space-y-4'
    ])

    const codeClasses = computed(() => [
      'text-6xl font-bold text-slate-300 mb-4'
    ])

    const titleClasses = computed(() => [
      'text-3xl font-bold text-slate-900'
    ])

    const messageClasses = computed(() => [
      'text-lg text-slate-600 max-w-lg mx-auto'
    ])

    const actionsClasses = computed(() => [
      'mt-8'
    ])

    const additionalInfoClasses = computed(() => [
      'mt-8'
    ])

    const helpClasses = computed(() => [
      'mt-6'
    ])

    return {
      errorConfig,
      errorTitle,
      errorMessage,
      homeButtonIcon,
      additionalInfoConfig,
      goHome,
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
      codeClasses,
      titleClasses,
      messageClasses,
      actionsClasses,
      additionalInfoClasses,
      helpClasses
    }
  }
}
</script>