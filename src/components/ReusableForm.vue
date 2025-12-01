<script setup>
import Slider from './Slider.vue'
import DatePicker from './DatePicker.vue'
import { ref, watch, computed, reactive } from 'vue'
import FormField from './FormField.vue'
import Input from './Input.vue'
import Textarea from './Textarea.vue'
import Select from './Select.vue'
import MultiSelect from './MultiSelect.vue'
import Button from './Button.vue'
import { toast } from '../lib/toast'
import Label from './Label.vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Form',
  },
  description: {
    type: String,
    default: '',
  },
  entityName: {
    type: String,
    default: 'Item',
  },
  fields: {
    type: Array,
    required: true,
    validator: (fields) => {
      return fields.every(
        (field) =>
          field.name &&
          field.label &&
          field.type &&
          [
            'text',
            'number',
            'password',
            'textarea',
            'select',
            'checkbox',
            'slider',
            'date',
            'color',
            'email',
            'tel',
            'url',
            'time',
            'datetime-local',
            'month',
            'week',
            'file',
            'multifile',
            'radio',
            'switch',
            'range',
            'search',
            'hidden',
            'multiselect',
          ].includes(field.type),
      )
    },
  },
  initialData: {
    type: Object,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  customValidation: {
    type: Function,
    default: null,
  },
  submitLabel: {
    type: String,
    default: 'Submit',
  },
  showReset: {
    type: Boolean,
    default: true,
  },
  showCancel: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['submit', 'reset', 'cancel'])

const isLoading = computed(() => props.loading)

const formData = ref({})
const errors = ref({})
const isInitialized = ref(false)

// Multi-file upload state
const uploadingFilesMap = ref({}) // { fieldName: [{ file, progress, id }] }
const dragOverFields = ref({}) // { fieldName: boolean }

const fileInputRefs = ref({})

const triggerFileInput = (fieldName) => {
  const input = fileInputRefs.value[fieldName]
  if (input) {
    input.click()
  }
}

const setFileInputRef = (fieldName, el) => {
  if (el) {
    fileInputRefs.value[fieldName] = el
  }
}

// Initialize form data based on fields
const initializeFormData = () => {
  const data = {}
  props.fields.forEach((field) => {
    if (field.type === 'checkbox' || field.type === 'switch') {
      data[field.name] = false
    } else if (field.type === 'number' || field.type === 'slider' || field.type === 'range') {
      data[field.name] = field.min !== undefined ? field.min : 0
    } else if (field.type === 'file') {
      data[field.name] = null
    } else if (field.type === 'multifile') {
      data[field.name] = []
    } else if (field.type === 'radio') {
      data[field.name] = field.options?.[0]?.value || ''
    } else if (field.type === 'multiselect') {
      data[field.name] = []
    } else {
      data[field.name] = ''
    }
  })
  return data
}

// Watch for initialData changes to populate form
watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      const data = {}
      props.fields.forEach((field) => {
        if (field.type === 'checkbox' || field.type === 'switch') {
          data[field.name] = newData[field.name] ?? false
        } else if (field.type === 'number' || field.type === 'slider' || field.type === 'range') {
          data[field.name] = newData[field.name] ?? (field.min !== undefined ? field.min : 0)
        } else if (field.type === 'file') {
          data[field.name] = null
        } else if (field.type === 'multifile') {
          data[field.name] = Array.isArray(newData[field.name]) ? newData[field.name] : []
        } else if (field.type === 'multiselect') {
          data[field.name] = Array.isArray(newData[field.name]) ? newData[field.name] : []
        } else {
          data[field.name] = newData[field.name] ?? ''
        }
      })
      formData.value = data
      isInitialized.value = true
    } else {
      formData.value = initializeFormData()
      isInitialized.value = false
    }
  },
  { immediate: true, deep: true },
)

// Watch for initialData changes after initialization
watch(
  () => props.initialData,
  (newData) => {
    if (isInitialized.value && newData) {
      Object.keys(newData).forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(formData.value, key) && newData[key] !== undefined && newData[key] !== null) {
          formData.value[key] = newData[key]
        }
      })
    }
  },
  { deep: true },
)

const validateForm = () => {
  errors.value = {}

  props.fields.forEach((field) => {
    if (field.required && !field.disabled && field.type !== 'hidden') {
      const value = formData.value[field.name]

      if (field.type === 'checkbox' || field.type === 'switch') {
        if (field.required && !value) {
          errors.value[field.name] = field.errorMessage || `${field.label} is required`
        }
      } else if (field.type === 'number' || field.type === 'slider' || field.type === 'range') {
        if (value === '' || value === null || value === undefined) {
          errors.value[field.name] = field.errorMessage || `${field.label} is required`
        } else if (field.min !== undefined && Number(value) < field.min) {
          errors.value[field.name] = `${field.label} must be at least ${field.min}`
        } else if (field.max !== undefined && Number(value) > field.max) {
          errors.value[field.name] = `${field.label} must be at most ${field.max}`
        }
      } else if (field.type === 'email') {
        if (!value || !value.trim()) {
          errors.value[field.name] = field.errorMessage || `${field.label} is required`
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.value[field.name] = 'Please enter a valid email address'
        }
      } else if (field.type === 'url') {
        if (!value || !value.trim()) {
          errors.value[field.name] = field.errorMessage || `${field.label} is required`
        } else if (!/^https?:\/\/.+/.test(value)) {
          errors.value[field.name] = 'Please enter a valid URL'
        }
      } else if (field.type === 'tel') {
        if (!value || !value.trim()) {
          errors.value[field.name] = field.errorMessage || `${field.label} is required`
        }
      } else if (field.type === 'file') {
        if (!value) {
          errors.value[field.name] = field.errorMessage || `${field.label} is required`
        }
      } else if (field.type === 'multifile') {
        if (!Array.isArray(value) || value.length === 0) {
          errors.value[field.name] = field.errorMessage || `${field.label} is required`
        } else if (field.minFiles && value.length < field.minFiles) {
          errors.value[field.name] = `Please upload at least ${field.minFiles} file(s)`
        } else if (field.maxFiles && value.length > field.maxFiles) {
          errors.value[field.name] = `Maximum ${field.maxFiles} file(s) allowed`
        }
      } else if (field.type === 'radio') {
        if (!value) {
          errors.value[field.name] = field.errorMessage || `${field.label} is required`
        }
      } else if (field.type === 'multiselect') {
        if (!Array.isArray(value) || value.length === 0) {
          errors.value[field.name] = field.errorMessage || `${field.label} is required`
        }
      } else if (field.type === 'date' || field.type === 'time' || field.type === 'datetime-local' || field.type === 'month' || field.type === 'week') {
        if (!value || (typeof value === 'string' && !value.trim())) {
          errors.value[field.name] = field.errorMessage || `${field.label} is required`
        }
      } else if (field.type === 'password') {
        if (!value || (typeof value === 'string' && !value.trim())) {
          errors.value[field.name] = field.errorMessage || `${field.label} is required`
        }
      } else {
        if (!value || (typeof value === 'string' && !value.trim())) {
          errors.value[field.name] = field.errorMessage || `${field.label} is required`
        }
      }
    }

    if (field.validate && typeof field.validate === 'function') {
      const customError = field.validate(formData.value[field.name], formData.value)
      if (customError) {
        errors.value[field.name] = customError
      }
    }
  })

  if (props.customValidation) {
    const customErrors = props.customValidation(formData.value)
    if (customErrors && Object.keys(customErrors).length > 0) {
      errors.value = { ...errors.value, ...customErrors }
    }
  }

  return Object.keys(errors.value).length === 0
}

const handleSelectChange = async (field, value) => {
  formData.value[field.name] = value

  if (field.onChange && typeof field.onChange === 'function') {
    try {
      await field.onChange(value, formData.value)
    } catch (error) {
      console.error('Error in onChange handler:', error)
      toast.error('An error occurred while processing the change')
    }
  }
}

const handleSliderChange = (field, value) => {
  formData.value[field.name] = value

  if (field.onChange && typeof field.onChange === 'function') {
    try {
      field.onChange(value, formData.value)
    } catch (error) {
      console.error('Error in onChange handler:', error)
      toast.error('An error occurred while processing the change')
    }
  }
}

const handleFileChange = (field, event) => {
  const file = event.target.files?.[0] || null
  formData.value[field.name] = file

  if (field.onChange && typeof field.onChange === 'function') {
    try {
      field.onChange(file, formData.value)
    } catch (error) {
      console.error('Error in onChange handler:', error)
      toast.error('An error occurred while processing the file')
    }
  }
}

// Multi-file upload handlers
const handleMultiFileDrop = (field, event) => {
  event.preventDefault()
  dragOverFields.value[field.name] = false
  const droppedFiles = Array.from(event.dataTransfer?.files || [])
  addMultipleFiles(field, droppedFiles)
}

const handleMultiFileDragOver = (event) => {
  event.preventDefault()
}

const handleMultiFileDragEnter = (field, event) => {
  event.preventDefault()
  dragOverFields.value[field.name] = true
}

const handleMultiFileDragLeave = (field, event) => {
  event.preventDefault()
  dragOverFields.value[field.name] = false
}

const handleMultiFileSelect = (field, event) => {
  const selectedFiles = Array.from(event.target?.files || [])
  addMultipleFiles(field, selectedFiles)
  // Reset input so same file can be selected again
  event.target.value = ''
}

const addMultipleFiles = (field, newFiles) => {
  const currentFiles = formData.value[field.name] || []
  const maxFiles = field.maxFiles || Infinity
  const maxSize = field.maxSize || Infinity

  // Filter valid files
  const validFiles = newFiles.filter(file => {
    if (file.size > maxSize) {
      toast.error(`${file.name} exceeds maximum size of ${formatFileSize(maxSize)}`)
      return false
    }
    if (field.accept) {
      const acceptedTypes = field.accept.split(',').map(t => t.trim().toLowerCase())
      const fileExt = '.' + file.name.split('.').pop()?.toLowerCase()
      const fileMime = file.type.toLowerCase()
      const isAccepted = acceptedTypes.some(type => {
        if (type.startsWith('.')) return fileExt === type
        if (type.endsWith('/*')) return fileMime.startsWith(type.replace('/*', '/'))
        return fileMime === type
      })
      if (!isAccepted) {
        toast.error(`${file.name} is not an accepted file type`)
        return false
      }
    }
    return true
  })

  // Check max files limit
  const remainingSlots = maxFiles - currentFiles.length
  if (remainingSlots <= 0) {
    toast.error(`Maximum ${maxFiles} file(s) allowed`)
    return
  }
  const filesToAdd = validFiles.slice(0, remainingSlots)
  if (filesToAdd.length < validFiles.length) {
    toast.warning(`Only ${filesToAdd.length} file(s) added. Maximum ${maxFiles} file(s) allowed`)
  }

  // Initialize uploading map for this field if not exists
  if (!uploadingFilesMap.value[field.name]) {
    uploadingFilesMap.value[field.name] = []
  }

  // Add files with progress tracking
  filesToAdd.forEach(file => {
    const fileItem = reactive({
      file,
      progress: 0,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    })
    uploadingFilesMap.value[field.name].push(fileItem)

    // Simulate upload progress
    const duration = 1500 + Math.random() * 1500
    const intervalTime = 50
    const totalSteps = duration / intervalTime
    const increment = 100 / totalSteps

    const interval = setInterval(() => {
      fileItem.progress += increment
      if (fileItem.progress >= 100) {
        fileItem.progress = 100
        clearInterval(interval)

        // Move to completed files
        formData.value[field.name] = [...(formData.value[field.name] || []), file]

        // Remove from uploading
        const idx = uploadingFilesMap.value[field.name]?.findIndex(f => f.id === fileItem.id)
        if (idx > -1) {
          uploadingFilesMap.value[field.name].splice(idx, 1)
        }

        // Trigger onChange callback
        if (field.onChange && typeof field.onChange === 'function') {
          try {
            field.onChange(formData.value[field.name], formData.value)
          } catch (error) {
            console.error('Error in onChange handler:', error)
          }
        }
      }
    }, intervalTime)
  })
}

const removeMultiFile = (field, index) => {
  const files = [...(formData.value[field.name] || [])]
  files.splice(index, 1)
  formData.value[field.name] = files

  if (field.onFileRemoved && typeof field.onFileRemoved === 'function') {
    try {
      field.onFileRemoved(files, formData.value)
    } catch (error) {
      console.error('Error in onFileRemoved handler:', error)
    }
  }
}

const cancelUpload = (field, fileId) => {
  const idx = uploadingFilesMap.value[field.name]?.findIndex(f => f.id === fileId)
  if (idx > -1) {
    uploadingFilesMap.value[field.name].splice(idx, 1)
  }
}

// Utility functions
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getFileIcon = (file) => {
  const ext = file.name.split('.').pop()?.toLowerCase()
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(ext)) return 'image'
  if (['pdf'].includes(ext)) return 'file-text'
  if (['doc', 'docx'].includes(ext)) return 'file-text'
  if (['xls', 'xlsx', 'csv'].includes(ext)) return 'table'
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return 'archive'
  if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(ext)) return 'video'
  if (['mp3', 'wav', 'ogg', 'flac'].includes(ext)) return 'music'
  return 'file'
}

const getFileIconColor = (file) => {
  const ext = file.name.split('.').pop()?.toLowerCase()
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(ext)) return 'text-purple-600 bg-purple-100'
  if (['pdf'].includes(ext)) return 'text-red-600 bg-red-100'
  if (['doc', 'docx'].includes(ext)) return 'text-blue-600 bg-blue-100'
  if (['xls', 'xlsx', 'csv'].includes(ext)) return 'text-green-600 bg-green-100'
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return 'text-yellow-600 bg-yellow-100'
  if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(ext)) return 'text-pink-600 bg-pink-100'
  if (['mp3', 'wav', 'ogg', 'flac'].includes(ext)) return 'text-orange-600 bg-orange-100'
  return 'text-gray-600 bg-gray-100'
}

const handleSubmit = async () => {
  try {
    // Check if any files are still uploading
    const hasUploadingFiles = Object.values(uploadingFilesMap.value).some(arr => arr.length > 0)
    if (hasUploadingFiles) {
      toast.error('Please wait for all files to finish uploading')
      return
    }

    if (!validateForm()) {
      toast.error('Please fix the validation errors before submitting')
      return
    }

    const preparedData = {}
    props.fields.forEach((field) => {
      const value = formData.value[field.name]

      if (field.type === 'number' || field.type === 'slider' || field.type === 'range') {
        preparedData[field.name] = Number(value)
      } else if (field.type === 'text' || field.type === 'textarea' || field.type === 'date' ||
        field.type === 'email' || field.type === 'url' || field.type === 'tel' ||
        field.type === 'search' || field.type === 'time' || field.type === 'datetime-local' ||
        field.type === 'month' || field.type === 'week') {
        preparedData[field.name] = typeof value === 'string' ? value.trim() : value
      } else if (field.type === 'password') {
        preparedData[field.name] = value
      } else if (field.type === 'file' || field.type === 'multifile') {
        preparedData[field.name] = value
      } else {
        preparedData[field.name] = value
      }
    })

    emit('submit', {
      formData: preparedData,
      originalData: props.initialData,
    })
  } catch (error) {
    console.error('Error during form submission:', error)
    toast.error('An error occurred during submission')
  }
}

const handleReset = () => {
  formData.value = initializeFormData()
  errors.value = {}
  uploadingFilesMap.value = {}
  isInitialized.value = false
  emit('reset')
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<template>
  <div class="w-full p-2">
    <div v-if="title" class="mb-6">
      <h2 class="text-xl font-semibold text-gray-900">
        {{ title }}
      </h2>
      <p v-if="description" class="text-sm text-gray-600 mt-1">
        {{ description }}
      </p>
    </div>

    <form class="space-y-6" @submit.prevent="handleSubmit">
      <div v-for="field in fields" :key="field.name">
        <!-- Hidden fields don't need FormField wrapper -->
        <template v-if="field.type === 'hidden'">
          <input v-model="formData[field.name]" type="hidden">
        </template>

        <FormField v-else :id="`form-${entityName}-${field.name}-${Math.random().toString(36).slice(2, 5)}`"
          :label="field.label" :required="field.required && !field.disabled" :error="errors[field.name]"
          :error-message="errors[field.name]">
          <template #default="{ fieldId, hasError, ariaDescribedBy }">
            <!-- Text/Number/Password/Color/Email/Tel/URL/Search Input -->
            <Input v-if="['text', 'number', 'password', 'color', 'email', 'tel', 'url', 'search'].includes(field.type)"
              :id="fieldId" v-model="formData[field.name]" :type="field.type" :placeholder="field.placeholder"
              :disabled="isLoading || field.disabled" :readonly="field.disabled"
              :class="hasError ? 'border-red-500' : 'border-slate-300'" :aria-describedby="ariaDescribedBy" />

            <!-- Textarea -->
            <Textarea v-else-if="field.type === 'textarea'" :id="fieldId" v-model="formData[field.name]"
              :placeholder="field.placeholder" :disabled="isLoading || field.disabled" :rows="field.rows || 3" :class="[
                'w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
                hasError ? 'border-red-500' : 'border-slate-300',
              ]" :aria-describedby="ariaDescribedBy" />

            <!-- Select Dropdown -->
            <Select v-else-if="field.type === 'select'" :id="fieldId" :model-value="formData[field.name]"
              :options="field.options" :placeholder="field.placeholder || 'Select an option'"
              :disabled="isLoading || field.disabled" :has-error="hasError" :aria-describedby="ariaDescribedBy"
              @update:model-value="handleSelectChange(field, $event)" />

            <!-- MultiSelect Dropdown -->
            <MultiSelect v-else-if="field.type === 'multiselect'" :id="fieldId" :model-value="formData[field.name]"
              :options="field.options" :disabled="isLoading || field.disabled"
              :placeholder="field.placeholder || 'Select options'" :has-error="hasError"
              :aria-describedby="ariaDescribedBy" @update:model-value="formData[field.name] = $event" />

            <!-- Checkbox -->
            <div v-else-if="field.type === 'checkbox'" class="flex items-center">
              <Input :id="fieldId" v-model="formData[field.name]" type="checkbox"
                :disabled="isLoading || field.disabled"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                :aria-describedby="ariaDescribedBy" />
              <Label :for="fieldId" class="ml-2 text-sm text-gray-700">
                {{ field.checkboxLabel || field.label }}
              </Label>
            </div>

            <!-- Switch (styled checkbox) -->
            <div v-else-if="field.type === 'switch'" class="flex items-center">
              <button :id="fieldId" type="button" role="switch" :aria-checked="formData[field.name]"
                :disabled="isLoading || field.disabled" :class="[
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                  formData[field.name] ? 'bg-blue-600' : 'bg-gray-200',
                  (isLoading || field.disabled) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                ]" @click="formData[field.name] = !formData[field.name]">
                <span :class="[
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  formData[field.name] ? 'translate-x-6' : 'translate-x-1'
                ]" />
              </button>
              <Label :for="fieldId" class="ml-3 text-sm text-gray-700">
                {{ field.checkboxLabel || field.label }}
              </Label>
            </div>

            <!-- Radio Buttons -->
            <div v-else-if="field.type === 'radio'" class="space-y-2">
              <div v-for="option in field.options" :key="option.value" class="flex items-center">
                <Input :id="`${fieldId}-${option.value}`" v-model="formData[field.name]" type="radio"
                  :value="option.value" :disabled="isLoading || field.disabled"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  :aria-describedby="ariaDescribedBy" />
                <Label :for="`${fieldId}-${option.value}`" class="ml-2 text-sm text-gray-700">
                  {{ option.label }}
                </Label>
              </div>
            </div>

            <!-- Single File Input -->
            <div v-else-if="field.type === 'file'" class="space-y-2">
              <Input :id="fieldId" type="file" :accept="field.accept" :disabled="isLoading || field.disabled" :class="[
                'w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100',
                hasError ? 'border-red-500' : 'border-slate-300'
              ]" :aria-describedby="ariaDescribedBy" @change="handleFileChange(field, $event)" />
              <p v-if="field.helpText" class="text-xs text-gray-500">
                {{ field.helpText }}
              </p>
            </div>

            <div v-else-if="field.type === 'multifile'" class="space-y-3">
              <!-- Dropzone -->
              <div :class="[
                'border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200',
                dragOverFields[field.name]
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                  : hasError
                    ? 'border-red-300 hover:border-red-400 bg-red-50/50'
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50',
                (isLoading || field.disabled) ? 'opacity-50 cursor-not-allowed' : ''
              ]" @drop="handleMultiFileDrop(field, $event)" @dragover="handleMultiFileDragOver"
                @dragenter="handleMultiFileDragEnter(field, $event)"
                @dragleave="handleMultiFileDragLeave(field, $event)" @click="triggerFileInput(field.name)">
                <!-- Use :ref with function to properly set refs -->
                <input :ref="(el) => setFileInputRef(field.name, el)" type="file" :multiple="field.multiple !== false"
                  :accept="field.accept" class="hidden" :disabled="isLoading || field.disabled"
                  @change="handleMultiFileSelect(field, $event)">
                <!-- ... existing code for dropzone content ... -->
              </div>

            </div>

            <!-- Slider -->
            <Slider v-else-if="field.type === 'slider'" :model-value="formData[field.name]" :min="field.min"
              :max="field.max" :step="field.step" :disabled="isLoading || field.disabled"
              @update:model-value="handleSliderChange(field, $event)" />

            <!-- Range (HTML5 native range input) -->
            <div v-else-if="field.type === 'range'" class="space-y-2">
              <div class="flex items-center gap-4">
                <Input :id="fieldId" v-model="formData[field.name]" type="range" :min="field.min" :max="field.max"
                  :step="field.step || 1" :disabled="isLoading || field.disabled" class="flex-1"
                  :aria-describedby="ariaDescribedBy" />
                <span class="text-sm font-medium text-gray-700 min-w-[3rem] text-right">
                  {{ formData[field.name] }}
                </span>
              </div>
            </div>

            <!-- Date Picker -->
            <DatePicker v-else-if="field.type === 'date'" :id="fieldId" v-model="formData[field.name]"
              :disabled="isLoading || field.disabled" :required="field.required" :min="field.min" :max="field.max"
              :placeholder="field.placeholder || 'Select date'" :format="field.format || 'MM/DD/YYYY'"
              :clearable="field.clearable !== false" :show-today="field.showToday !== false"
              :calendar-position="field.calendarPosition || 'left-0 bottom-full'" :aria-describedby="ariaDescribedBy" />

            <!-- Time Input -->
            <Input v-else-if="field.type === 'time'" :id="fieldId" v-model="formData[field.name]" type="time"
              :disabled="isLoading || field.disabled" :class="hasError ? 'border-red-500' : 'border-slate-300'"
              :aria-describedby="ariaDescribedBy" />

            <!-- DateTime Local Input -->
            <Input v-else-if="field.type === 'datetime-local'" :id="fieldId" v-model="formData[field.name]"
              type="datetime-local" :disabled="isLoading || field.disabled"
              :class="hasError ? 'border-red-500' : 'border-slate-300'" :aria-describedby="ariaDescribedBy" />

            <!-- Month Input -->
            <Input v-else-if="field.type === 'month'" :id="fieldId" v-model="formData[field.name]" type="month"
              :disabled="isLoading || field.disabled" :class="hasError ? 'border-red-500' : 'border-slate-300'"
              :aria-describedby="ariaDescribedBy" />

            <!-- Week Input -->
            <Input v-else-if="field.type === 'week'" :id="fieldId" v-model="formData[field.name]" type="week"
              :disabled="isLoading || field.disabled" :class="hasError ? 'border-red-500' : 'border-slate-300'"
              :aria-describedby="ariaDescribedBy" />
          </template>
        </FormField>
      </div>

      <div class="flex justify-end gap-3 pt-6">
        <Button v-if="showReset" type="button" variant="outline" :disabled="isLoading" @click="handleReset">
          Reset
        </Button>
        <Button v-if="showCancel" type="button" variant="outline" :disabled="isLoading" @click="handleCancel">
          Cancel
        </Button>
        <Button type="submit" :disabled="isLoading" :loading="isLoading" variant="default">
          {{ submitLabel }}
        </Button>
      </div>
    </form>
  </div>
</template>
