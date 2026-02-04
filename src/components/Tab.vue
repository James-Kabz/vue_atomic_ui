<template>
  <div class="w-full">
    <!-- Tab headers -->
    <div
      class="flex space-x-1 border-b border-(--ui-border)"
      role="tablist"
    >
      <button
        v-for="(tab, index) in tabs"
        :id="`tab-${index}`"
        :key="index"
        :disabled="props.loading"
        :class="cn(
          tabVariants({ size: props.size, variant: props.variant }),
          activeIndex === index
            ? 'border-(--ui-primary) text-(--ui-primary) bg-(--ui-primary-soft)'
            : 'border-transparent text-(--ui-text-soft) hover:text-(--ui-text-muted) hover:border-(--ui-border)',
          props.loading && 'cursor-not-allowed opacity-50'
        )"
        :aria-selected="activeIndex === index"
        :aria-controls="`panel-${index}`"
        role="tab"
        @click="!props.loading && selectTab(index)"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Tab panels -->
    <div class="mt-4">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { provide, ref } from "vue"
import { cva } from "class-variance-authority"
import { cn } from "../utils/cn"

const props = defineProps({
  defaultIndex: { type: Number, default: 0 },
  size: { type: String, default: 'md' },
  variant: { type: String, default: 'default' },
  loading: { type: Boolean, default: false }
})

const tabVariants = cva(
  "font-medium transition-colors border-b-2 -mb-px",
  {
    variants: {
      size: {
        sm: "px-3 py-1.5 text-xs",
        md: "px-4 py-2 text-sm",
        lg: "px-5 py-2.5 text-base",
      },
      variant: {
        default: "",
      }
    },
    defaultVariants: {
      size: "md",
      variant: "default"
    }
  }
)

const activeIndex = ref(props.defaultIndex)
const tabs = ref([])

const selectTab = (index) => {
  activeIndex.value = index
  emit('tab-change', index)
}

const emit = defineEmits(['tab-change'])

provide("tabsContext", {
  activeIndex,
  tabs,
  registerTab: (label) => {
    tabs.value.push({ label })
    return tabs.value.length - 1
  },
  unregisterTab: (index) => {
    tabs.value.splice(index, 1)
  }
})
</script>
