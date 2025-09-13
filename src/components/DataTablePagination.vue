<template>
  <div class="flex items-center justify-between px-2">
    <div class="flex-1 text-sm text-muted-foreground">
      {{ selectedText }}
    </div>
    <div class="flex items-center space-x-6 lg:space-x-8">
      <div class="flex items-center space-x-2">
        <p class="text-sm font-medium">Rows per page</p>
        <Select :model-value="pageSize" @update:model-value="handlePageSizeChange">
          <Option v-for="size in pageSizeOptions" :key="size" :value="size">
            {{ size }}
          </Option>
        </Select>
      </div>
      <div class="flex w-[100px] items-center justify-center text-sm font-medium">
        Page {{ currentPage }} of {{ totalPages }}
      </div>
      <div class="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          :disabled="currentPage === 1"
          @click="goToFirstPage"
        >
          First
        </Button>
        <Button
          variant="outline"
          size="sm"
          :disabled="currentPage === 1"
          @click="goToPreviousPage"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          :disabled="currentPage === totalPages"
          @click="goToNextPage"
        >
          Next
        </Button>
        <Button
          variant="outline"
          size="sm"
          :disabled="currentPage === totalPages"
          @click="goToLastPage"
        >
          Last
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Button from './Button.vue'
import Select from './Select.vue'
import Option from './Option.vue'

const props = defineProps({
  currentPage: {
    type: Number,
    default: 1
  },
  totalPages: {
    type: Number,
    required: true
  },
  pageSize: {
    type: Number,
    default: 10
  },
  totalItems: {
    type: Number,
    required: true
  },
  selectedCount: {
    type: Number,
    default: 0
  },
  pageSizeOptions: {
    type: Array,
    default: () => [10, 20, 30, 40, 50]
  }
})

const emit = defineEmits(['page-change', 'page-size-change'])

const selectedText = computed(() => {
  if (props.selectedCount > 0) {
    return `${props.selectedCount} of ${props.totalItems} row(s) selected.`
  }
  return `${props.totalItems} row(s) total.`
})

const goToFirstPage = () => emit('page-change', 1)
const goToPreviousPage = () => emit('page-change', props.currentPage - 1)
const goToNextPage = () => emit('page-change', props.currentPage + 1)
const goToLastPage = () => emit('page-change', props.totalPages)
const handlePageSizeChange = (newSize) => emit('page-size-change', newSize)
</script>
