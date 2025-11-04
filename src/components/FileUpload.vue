<template>
  <div class="w-full">
    <div
      v-if="!files.length || multiple"
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
      >
      
      <div class="flex items-center justify-center px-4 py-3">
        <div class="bg-gray-100 rounded-full p-2 mr-3">
          <Icon
            icon="upload"
            class="h-6 w-6 text-gray-600"
          />
        </div>
        <div class="flex flex-col">
          <p class="text-sm font-medium text-gray-700">
            <span class="text-blue-600 font-semibold">Click to upload</span> or drag and drop
          </p>
          <p class="text-xs text-gray-500">
            {{ maxSize ? `Up to ${formatFileSize(maxSize)}` : 'No size limit' }}
            <span v-if="accept" class="ml-2">• {{ accept }}</span>
          </p>
        </div>
      </div>
    </div>
    
    <div
      v-if="files.length > 0"
      class="mt-4 space-y-2"
    >
      <div
        v-for="(file, index) in files"
        :key="index"
        class="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
      >
        <div class="flex items-center space-x-3">
          <div class="bg-blue-100 rounded-md p-2">
            <Icon
              icon="file"
              class="h-5 w-5 text-blue-600"
            />
          </div>
          <div class="flex flex-col">
            <span class="text-sm font-medium text-gray-900">{{ file.name }}</span>
            <span class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</span>
          </div>
        </div>
        <button
          class="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full p-1 transition-colors"
          @click="removeFile(index)"
        >
          <Icon
            icon="x"
            class="h-4 w-4"
          />
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
  'border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 ease-in-out shadow-sm',
  {
    variants: {
      variant: {
        default: 'border-gray-300 hover:border-gray-400 hover:bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-opacity-50',
        dashed: 'border-blue-300 hover:border-blue-400 hover:bg-blue-50 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-opacity-50'
      }
    }
  }
)

const dropzoneClasses = computed(() =>
  cn(
    dropzoneVariants({ variant: props.variant }),
    {
      'border-green-500 bg-green-50 shadow-md': files.value.length > 0 && !isDragOver.value,
      'border-blue-500 bg-blue-50 ring-4 ring-blue-200 ring-opacity-50 shadow-lg': isDragOver.value,
      'border-green-600 bg-green-100 ring-4 ring-green-200 ring-opacity-50 shadow-lg': files.value.length > 0 && isDragOver.value
    }
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
