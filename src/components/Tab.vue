<template>
  <div>
    <!-- Tab headers -->
    <div class="flex border-b border-slate-200">
      <button
        v-for="(tab, index) in tabs"
        :key="index"
        @click="selectTab(index)"
        :class="[
          'px-4 py-2 -mb-px border-b-2 font-medium text-sm transition-colors',
          activeIndex === index
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
        ]"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Tab panels -->
    <div class="p-4">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { provide, ref } from "vue"

const props = defineProps({
  defaultIndex: { type: Number, default: 0 }
})

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
  }
})
</script>
