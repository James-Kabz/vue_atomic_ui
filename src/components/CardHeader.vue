<template>
  <header
    :class="cn(
      'flex items-center justify-between border-b border-border bg-card/30 backdrop-blur-sm',
      padding,
      $attrs.class
    )"
  >
    <div :class="cn('flex flex-col', textSpacing)">
      <h2 class="text-lg font-semibold leading-tight text-foreground">
        <slot name="title" />
      </h2>
      <p v-if="$slots.description" class="text-sm text-muted-foreground">
        <slot name="description" />
      </p>
    </div>

    <div v-if="$slots.actions" class="flex items-center gap-2">
      <slot name="actions" />
    </div>
  </header>
</template>

<script setup>
import { cn } from '../utils/cn.js'

defineOptions({ inheritAttrs: false })

const props = defineProps({
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
