<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Simple Header -->
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <slot name="logo">
            <Logo />
          </slot>
          <slot name="actions">
            <Button variant="ghost" size="sm" @click="$router?.go(-1)">
              Go Back
            </Button>
          </slot>
        </div>
      </div>
    </header>

    <!-- Error Content -->
    <main class="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full text-center">
        <slot name="error-content">
          <!-- Error Icon -->
          <div class="mb-8">
            <slot name="error-icon">
              <div class="mx-auto h-24 w-24 text-gray-400">
                <Icon name="alert-circle" class="h-full w-full" />
              </div>
            </slot>
          </div>

          <!-- Error Message -->
          <div class="mb-8">
            <slot name="error-title">
              <Typography variant="h1" class="text-gray-900 mb-4">
                {{ errorCode || '404' }}
              </Typography>
            </slot>
            <slot name="error-message">
              <Typography variant="h3" class="text-gray-600 mb-2">
                {{ errorTitle || 'Page not found' }}
              </Typography>
              <Text class="text-gray-500">
                {{ errorDescription || 'The page you are looking for does not exist.' }}
              </Text>
            </slot>
          </div>

          <!-- Error Actions -->
          <div class="space-y-4">
            <slot name="error-actions">
              <Button @click="$router?.push('/')" class="w-full">
                Go to Homepage
              </Button>
              <Button variant="outline" @click="$router?.go(-1)" class="w-full">
                Go Back
              </Button>
            </slot>
          </div>
        </slot>
      </div>
    </main>

    <!-- Minimal Footer -->
    <footer class="bg-white border-t border-gray-200 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <slot name="footer">
          <Text class="text-gray-500">
            © {{ new Date().getFullYear() }} Your Company. All rights reserved.
          </Text>
        </slot>
      </div>
    </footer>
  </div>
</template>

<script setup>
defineProps({
  errorCode: {
    type: [String, Number],
    default: '404'
  },
  errorTitle: {
    type: String,
    default: 'Page not found'
  },
  errorDescription: {
    type: String,
    default: 'The page you are looking for does not exist.'
  }
})
</script>
