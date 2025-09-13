<template>
  <div :class="filtersClasses">
    <div class="flex flex-1 items-center space-x-2">
      <Input
        v-if="searchable"
        :placeholder="searchPlaceholder"
        :model-value="searchValue"
        @update:model-value="handleSearchChange"
        class="h-8 w-[150px] lg:w-[250px]"
      />
      <slot name="filters" />
    </div>
    <div class="flex items-center space-x-2">
      <slot name="actions" />
      <Button
        v-if="hasActiveFilters"
        variant="ghost"
        size="sm"
        @click="clearFilters"
      >
        Reset
      </Button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { cva } from 'class-variance-authority'
import { cn } from '../utils/cn.js'
import Button from './Button.vue'
import Input from './Input.vue'

const props = defineProps({
  searchable: {
    type: Boolean,
    default: true
  },
  searchValue: String,
  searchPlaceholder: {
    type: String,
    default: 'Filter...'
  },
  hasActiveFilters: Boolean,
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'compact'].includes(value)
  }
})

const emit = defineEmits(['search-change', 'clear-filters'])

const filtersVariants = cva('flex items-center justify-between', {
  variants: {
    variant: {
      default: 'py-4',
      compact: 'py-2'
    }
  }
})

const filtersClasses = computed(() => 
  cn(filtersVariants({ variant: props.variant }))
)

const handleSearchChange = (value) => {
  emit('search-change', value)
}

const clearFilters = () => {
  emit('clear-filters')
}
</script>
