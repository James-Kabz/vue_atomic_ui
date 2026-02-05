<template>
  <footer :class="cn('ui-glossy-surface border-t ui-glossy-border', className)">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Brand -->
        <div class="col-span-1 md:col-span-2">
          <slot name="brand">
            <Logo class="mb-4" />
            <Text class="text-(--ui-text) max-w-md">
              Building beautiful applications with modern Vue.js components.
            </Text>
          </slot>
        </div>

        <!-- Links -->
        <div>
          <slot name="links">
            <Typography
              variant="h6"
              class="mb-4"
            >
              Quick Links
            </Typography>
            <div class="space-y-2">
              <Link
                href="#"
                class="block text-(--ui-text) hover:text-(--ui-text)"
              >
                About
              </Link>
              <Link
                href="#"
                class="block text-(--ui-text) hover:text-(--ui-text)"
              >
                Services
              </Link>
              <Link
                href="#"
                class="block text-(--ui-text) hover:text-(--ui-text)"
              >
                Contact
              </Link>
            </div>
          </slot>
        </div>

        <!-- Social -->
        <div>
          <slot name="social">
            <Typography
              variant="h6"
              class="mb-4"
            >
              Follow Us
            </Typography>
            <div class="flex space-x-4">
              <Link
                href="#"
                class="text-(--ui-text) hover:text-(--ui-text)"
              >
                <Icon
                  name="twitter"
                  class="h-5 w-5"
                />
              </Link>
              <Link
                href="#"
                class="text-(--ui-text) hover:text-(--ui-text)"
              >
                <Icon
                  name="github"
                  class="h-5 w-5"
                />
              </Link>
            </div>
          </slot>
        </div>
      </div>

      <Divider class="my-8" />

      <div class="flex flex-col md:flex-row justify-between items-center">
        <slot name="copyright">
          <Text class="text-(--ui-text)">
            © {{ new Date().getFullYear() }} Your Company. All rights reserved.
          </Text>
        </slot>
        <slot name="legal">
          <div class="flex space-x-6 mt-4 md:mt-0">
            <Link
              href="#"
              class="text-(--ui-text) hover:text-(--ui-text)"
            >
              Privacy
            </Link>
            <Link
              href="#"
              class="text-(--ui-text) hover:text-(--ui-text)"
            >
              Terms
            </Link>
          </div>
        </slot>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { cn } from '../utils/cn.js'

defineProps({
  className: {
    type: String,
    default: ''
  }
})
</script>
