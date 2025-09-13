<template>
  <div class="w-full">
    <div
      :class="dropzoneClasses"
      @drop="handleDrop"
      @dragover="handleDragOver"
      @dragenter="handleDragEnter"
      @dragleave="handleDragLeave"
      @click="triggerFileInput"
    >
      <input
        ref="fileInput"
        type="file"
        :multiple="multiple"
        :accept="accept"
        class="hidden"
        @change="handleFileSelect"
      />
      
      <div class="flex flex-col items-center justify-center py-6">
        <Icon name="upload" class="h-8 w-8 text-muted-foreground mb-2" />
        <p class="text-sm text-muted-foreground text-center">
          <span class="font-semibold">Click to upload</span> or drag and drop
        </p>
        <p v-if="accept" class="text-xs text-muted-foreground mt-1">
          {{ accept }}
        </p>
      </div>
    </div>
    
    <div v-if="files.length > 0" class="mt-4 space-y-2">
      <div
        v-for="(file, index) in files"
        :key="index"
        class="flex items-center justify-between p-2 bg-muted rounded-md"
      >
        <div class="flex items-center space-x-2">
          <Icon name="file" class="h-4 w-4 text-muted-foreground" />
          <span class="text-sm">{{ file.name }}</span>
          <span class="text-xs text-muted-foreground">({{ formatFileSize(file.size) }})</span>
        </div>
        <button
          @click="removeFile(index)"
          class="text-muted-foreground hover:text-foreground"
        >
          <Icon name="x" class="h-4 w-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { cva } from 'class-variance-authority'
import { cn } from '../utils/cn.js'
import Icon from './Icon.vue'

const props = defineProps({
  multiple: Boolean,
  accept: String,
  maxSize: Number, // in bytes
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'dashed'].includes(value)
  }
})

const emit = defineEmits(['files-selected', 'file-removed'])

const files = ref([])
const isDragOver = ref(false)
const fileInput = ref(null)

const dropzoneVariants = cva(
  'border-2 border-dashed rounded-lg cursor-pointer transition-colors hover:bg-muted/50',
  {
    variants: {
      variant: {
        default: 'border-muted-foreground/25',
        dashed: 'border-primary/50'
      }
    }
  }
)

const dropzoneClasses = computed(() => 
  cn(
    dropzoneVariants({ variant: props.variant }),
    isDragOver.value && 'border-primary bg-primary/5'
  )
)

const handleDrop = (event) => {
  event.preventDefault()
  isDragOver.value = false
  
  const droppedFiles = Array.from(event.dataTransfer.files)
  addFiles(droppedFiles)
}

const handleDragOver = (event) => {
  event.preventDefault()
}

const handleDragEnter = (event) => {
  event.preventDefault()
  isDragOver.value = true
}

const handleDragLeave = (event) => {
  event.preventDefault()
  isDragOver.value = false
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event) => {
  const selectedFiles = Array.from(event.target.files)
  addFiles(selectedFiles)
}

const addFiles = (newFiles) => {
  const validFiles = newFiles.filter(file => {
    if (props.maxSize && file.size > props.maxSize) {
      return false
    }
    return true
  })
  
  if (props.multiple) {
    files.value.push(...validFiles)
  } else {
    files.value = validFiles.slice(0, 1)
  }
  
  emit('files-selected', files.value)
}

const removeFile = (index) => {
  files.value.splice(index, 1)
  emit('file-removed', files.value)
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>
