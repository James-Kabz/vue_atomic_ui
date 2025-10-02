<template>
  <div class="w-full">
    <!-- Tab headers -->
    <div class="flex space-x-1 border-b border-slate-200" role="tablist">
      <button
        v-for="(tab, index) in tabs"
        :key="index"
        :id="`tab-${index}`"
        @click="selectTab(index)"
        :class="cn(
          tabVariants({ size: props.size, variant: props.variant }),
          activeIndex === index
            ? 'border-blue-500 text-blue-600 bg-blue-50'
            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
        )"
        :aria-selected="activeIndex === index"
        :aria-controls="`panel-${index}`"
        role="tab"
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
  variant: { type: String, default: 'default' }
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
}

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
