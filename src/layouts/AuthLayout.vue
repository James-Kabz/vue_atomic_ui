<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Left Side - Branding/Info -->
    <div class="hidden lg:flex lg:w-1/2 bg-blue-600 relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800"></div>
      <div class="relative z-10 flex flex-col justify-center px-12 py-24">
        <slot name="branding">
          <div class="mb-8">
            <Logo variant="white" class="mb-6" />
            <Typography variant="h2" class="text-white mb-4">
              Welcome to Our Platform
            </Typography>
            <Text class="text-blue-100 text-lg leading-relaxed">
              Join thousands of users who trust our platform for their business needs.
            </Text>
          </div>
        </slot>

        <!-- Features/Benefits -->
        <div class="space-y-6">
          <slot name="features">
            <div class="flex items-center space-x-4">
              <div class="flex-shrink-0">
                <Icon name="check-circle" class="h-6 w-6 text-blue-200" />
              </div>
              <Text class="text-blue-100">Secure and reliable platform</Text>
            </div>
            <div class="flex items-center space-x-4">
              <div class="flex-shrink-0">
                <Icon name="check-circle" class="h-6 w-6 text-blue-200" />
              </div>
              <Text class="text-blue-100">24/7 customer support</Text>
            </div>
            <div class="flex items-center space-x-4">
              <div class="flex-shrink-0">
                <Icon name="check-circle" class="h-6 w-6 text-blue-200" />
              </div>
              <Text class="text-blue-100">Easy to use interface</Text>
            </div>
          </slot>
        </div>
      </div>
    </div>

    <!-- Right Side - Auth Form -->
    <div class="flex-1 flex flex-col justify-center px-6 py-12 lg:px-20 xl:px-24">
      <div class="mx-auto w-full max-w-sm">
        <!-- Mobile Logo -->
        <div class="lg:hidden mb-8 text-center">
          <slot name="mobile-logo">
            <Logo class="mx-auto mb-4" />
          </slot>
        </div>

        <!-- Auth Content -->
        <div>
          <slot name="auth-header">
            <div class="mb-8">
              <Typography variant="h2" class="text-gray-900 mb-2">
                {{ authTitle || 'Sign in to your account' }}
              </Typography>
              <Text class="text-gray-600">
                {{ authSubtitle || 'Welcome back! Please enter your details.' }}
              </Text>
            </div>
          </slot>

          <!-- Auth Form -->
          <div class="space-y-6">
            <slot />
          </div>

          <!-- Auth Footer -->
          <div class="mt-8">
            <slot name="auth-footer">
              <Divider class="mb-6" />
              <div class="text-center">
                <Text class="text-gray-600">
                  {{ footerText || "Don't have an account?" }}
                  <Link href="/register" class="font-medium text-blue-600 hover:text-blue-500">
                    {{ footerLinkText || 'Sign up' }}
                  </Link>
                </Text>
              </div>
            </slot>
          </div>
        </div>
      </div>

      <!-- Terms/Privacy -->
      <div class="mt-8 text-center">
        <slot name="legal">
          <Text class="text-xs text-gray-500">
            By continuing, you agree to our 
            <Link href="/terms" class="underline">Terms of Service</Link>
            and 
            <Link href="/privacy" class="underline">Privacy Policy</Link>
          </Text>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  authTitle: {
    type: String,
    default: 'Sign in to your account'
  },
  authSubtitle: {
    type: String,
    default: 'Welcome back! Please enter your details.'
  },
  footerText: {
    type: String,
    default: "Don't have an account?"
  },
  footerLinkText: {
    type: String,
    default: 'Sign up'
  }
})
</script>
