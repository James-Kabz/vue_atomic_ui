<template>
  <component 
    :is="iconComponent" 
    :class="iconClasses"
    v-bind="$attrs"
  />
</template>

<script setup>
import { computed } from 'vue'
import { cn } from '../utils/cn.js'
import * as LucideIcons from 'lucide-vue-next'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  size: {
    type: [String, Number],
    default: 24
  },
  class: String
})

const iconComponent = computed(() => {
  const iconName = props.name
  return LucideIcons[iconName] || LucideIcons.HelpCircle
})

const iconClasses = computed(() => 
  cn('inline-block', props.class)
)
</script>
