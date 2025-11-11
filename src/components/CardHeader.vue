<template>
  <header
    :class="cn(
      'flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50/50',
      $attrs.class
    )"
  >
    <div class="flex flex-col">
      <Typography
        v-if="title || $slots.title"
        variant="text-lg"
        color="default"
        class="font-semibold"
      >
        <slot name="title">
          {{ title }}
        </slot>
      </Typography>
      <Typography
        v-if="subtitle || $slots.description"
        variant="body-sm"
        color="muted"
        class="mt-1"
      >
        <slot name="description">
          {{ subtitle }}
        </slot>
      </Typography>
    </div>

    <div v-if="$slots.actions">
      <slot name="actions" />
    </div>
  </header>
</template>

<script setup>
import { cn } from '../utils/cn.js'
import Typography from './Typography.vue'

defineOptions({ inheritAttrs: false })

defineProps({
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  }
})
</script>