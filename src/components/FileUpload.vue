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
      v-if="files.length > 0 || uploadingFiles.length > 0"
      class="mt-4 space-y-2"
    >
      <!-- Uploading files -->
      <div
        v-for="(fileItem, index) in uploadingFiles"
        :key="`uploading-${index}`"
        class="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm"
      >
        <div class="flex items-center space-x-3">
          <CircularProgress
            :value="fileItem.progress"
            :max="100"
            size="sm"
            variant="default"
            :dynamic-color="true"
            class="flex-shrink-0"
          />
          <div class="flex flex-col">
            <span class="text-sm font-medium text-gray-900">{{ fileItem.file.name }}</span>
            <span class="text-xs text-gray-500">Uploading... {{ Math.round(fileItem.progress) }}%</span>
          </div>
        </div>
      </div>

      <!-- Uploaded files -->
      <div
        v-for="(file, index) in files"
        :key="`uploaded-${index}`"
        class="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
      >
        <div class="flex items-center space-x-3">
          <div class="bg-green-100 rounded-md p-2">
            <Icon
              icon="file"
              class="h-5 w-5 text-green-600"
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
import { ref, computed, reactive } from 'vue'
import { cva } from 'class-variance-authority'
import { cn } from '../utils/cn.js'
import Icon from './Icon.vue'
import CircularProgress from './CircularProgress.vue'

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
const uploadingFiles = ref([])

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

  // Add files to uploading state with progress
  const filesWithProgress = validFiles.map(file => reactive({
    file,
    progress: 0,
    uploading: true
  }))

  uploadingFiles.value.push(...filesWithProgress)

  // Simulate upload progress with smooth increments
  filesWithProgress.forEach((fileItem) => {
    const duration = 2000 + Math.random() * 2000 // 2-4 seconds total
    const intervalTime = 50 // Update every 50ms
    const totalSteps = duration / intervalTime
    const increment = 100 / totalSteps

    const interval = setInterval(() => {
      fileItem.progress += increment

      if (fileItem.progress >= 100) {
        fileItem.progress = 100
        fileItem.uploading = false
        clearInterval(interval)

        // Move to files array after upload completes
        if (props.multiple) {
          files.value.push(fileItem.file)
        } else {
          files.value = [fileItem.file]
        }

        // Remove from uploading
        uploadingFiles.value.splice(uploadingFiles.value.indexOf(fileItem), 1)

        emit('files-selected', files.value)
      }
    }, intervalTime)
  })
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