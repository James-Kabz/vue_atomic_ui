<template>
  <header
    :class="cn(
      'flex items-center justify-between border-b border-border bg-white text-black',
      padding,
      $attrs.class
    )"
  >
    <div :class="cn('flex flex-col', textSpacing)">
      <h2 v-if="title" class="text-lg font-semibold leading-tight text-black">
        {{ title }}
      </h2>
      <h2 v-else class="text-lg font-semibold leading-tight text-black">
        <slot name="title" />
      </h2>
      <p v-if="subtitle" class="text-sm text-gray-600">
        {{ subtitle }}
      </p>
      <p
        v-else-if="$slots.description"
        class="text-sm text-gray-600"
      >
        <slot name="description" />
      </p>
    </div>

    <div
      v-if="$slots.actions"
      class="flex items-center gap-2"
    >
      <slot name="actions" />
    </div>
  </header>
</template>


<script setup>
import { cn } from '../utils/cn.js'

defineOptions({ inheritAttrs: false })

defineProps({
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  titleClass: {
    type: String,
    default: ''
  },
  subtitleClass: {
    type: String,
    default: ''
  },
  padding: {
    type: String,
    default: 'p-4 md:p-6'
  },
  textSpacing: {
    type: String,
    default: 'space-y-1'
  }
})
</script>
