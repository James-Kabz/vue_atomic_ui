<template>
  <component
    :is="tag"
    :class="cn(
      'flex items-center justify-between gap-4',
      $attrs.class
    )"
  >
    <div class="flex flex-col gap-1 min-w-0">
      <component
        :is="titleTag"
        v-if="title || $slots.title"
        :class="cn(
          'font-semibold text-lg leading-tight',
          titleClass
        )"
      >
        <slot name="title">
          {{ title }}
        </slot>
      </component>
      
      <p
        v-if="subtitle || $slots.description"
        :class="cn(
          'text-sm text-muted-foreground',
          subtitleClass
        )"
      >
        <slot name="description">
          {{ subtitle }}
        </slot>
      </p>
    </div>

    <div
      v-if="$slots.actions"
      class="flex items-center gap-2 shrink-0"
    >
      <slot name="actions" />
    </div>
  </component>
</template>

<script setup>
import { cn } from '../utils/cn.js'

defineOptions({ inheritAttrs: false })

defineProps({
  /**
   * Main title text
   */
  title: {
    type: String,
    default: ''
  },
  
  /**
   * Subtitle/description text
   */
  subtitle: {
    type: String,
    default: ''
  },
  
  /**
   * Root HTML tag (header, div, section, etc.)
   */
  tag: {
    type: String,
    default: 'header'
  },
  
  /**
   * Title HTML tag (h1, h2, h3, etc.)
   */
  titleTag: {
    type: String,
    default: 'h2'
  },
  
  /**
   * Additional classes for title
   */
  titleClass: {
    type: String,
    default: ''
  },
  
  /**
   * Additional classes for subtitle
   */
  subtitleClass: {
    type: String,
    default: ''
  }
})
</script>