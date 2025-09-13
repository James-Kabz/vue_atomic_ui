<template>
  <div v-show="isActive">
    <slot />
  </div>
</template>

<script setup>
import { inject, onMounted, ref } from "vue"

const props = defineProps({
  label: { type: String, required: true }
})

const tabsContext = inject("tabsContext")
const index = ref(null)
const isActive = ref(false)

onMounted(() => {
  index.value = tabsContext.registerTab(props.label)
  isActive.value = tabsContext.activeIndex.value === index.value

  // Watch for changes
  watch(tabsContext.activeIndex, (newIndex) => {
    isActive.value = newIndex === index.value
  })
})
</script>
