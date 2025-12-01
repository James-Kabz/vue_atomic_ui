<script setup>
import Modal from './Modal.vue'
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
import Icon from './Icon.vue'
import CircularProgress from './CircularProgress.vue'
import { cn } from '../utils/cn.js'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  modalType: {
    type: String,
    required: true,
    validator: (value) => ['create', 'edit'].includes(value),
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
            'multifile', // New multi-upload field type
            'radio',
            'switch',
            'range',
            'search',
            'hidden',
            'multiselect',
            'combobox',
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
  modalSize: {
    type: String,
    default: '4xl',
    validator: (value) => ['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl', 'full'].includes(value)
  },
  modalHeight: {
    type: String,
    default: 'auto',
  },
  modalResizable: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'submit', 'close'])

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const isLoading = computed(() => props.loading)

const formData = ref({})
const errors = ref({})
const isInitialized = ref(false)

// Multi-upload state management
const uploadingFilesMap = ref({}) // Map of field.name -> uploading files array
const dragOverFields = ref({}) // Map of field.name -> isDragOver boolean
const fileInputRefs = ref({}) // Store refs for file inputs

// Helper function to get nested value from object using dot notation
const getNestedValue = (obj, path) => {
  if (!obj || !path) return undefined
  return path.split('.').reduce((current, key) => current?.[key], obj)
}

// Helper function to set nested value in object using dot notation
const setNestedValue = (obj, path, value) => {
  const keys = path.split('.')
  const lastKey = keys.pop()
  const target = keys.reduce((current, key) => {
    if (!current[key]) current[key] = {}
    return current[key]
  }, obj)
  target[lastKey] = value
}

// Initialize form data based on fields
const initializeFormData = () => {
  const data = {}
  props.fields.forEach((field) => {
    // Handle nested fields (e.g., 'socials.facebook')
    if (field.name.includes('.')) {
      const [parent] = field.name.split('.')
      if (!data[parent]) {
        data[parent] = {}
      }
      setNestedValue(data, field.name, getDefaultValue(field))
    } else if (field.type === 'checkbox' || field.type === 'switch') {
      data[field.name] = false
    } else if (field.type === 'number' || field.type === 'slider' || field.type === 'range') {
      data[field.name] = field.min !== undefined ? field.min : 0
    } else if (field.type === 'file') {
      data[field.name] = null
    } else if (field.type === 'multifile') {
      data[field.name] = []
      uploadingFilesMap.value[field.name] = []
      dragOverFields.value[field.name] = false
    } else if (field.type === 'radio') {
      data[field.name] = field.options?.[0]?.value || ''
    } else if (field.type === 'multiselect') {
      data[field.name] = []
    } else if (field.type === 'combobox') {
      data[field.name] = ''
    } else {
      data[field.name] = ''
    }
  })
  return data
}

// Get default value for a field
const getDefaultValue = (field) => {
  if (field.type === 'checkbox' || field.type === 'switch') return false
  if (field.type === 'number' || field.type === 'slider' || field.type === 'range') {
    return field.min !== undefined ? field.min : 0
  }
  if (field.type === 'file') return null
  if (field.type === 'multifile') return []
  if (field.type === 'radio') return field.options?.[0]?.value || ''
  if (field.type === 'multiselect') return []
  if (field.type === 'combobox') return ''
  return ''
}

// Populate form data from initialData
const populateFormData = (data) => {
  const formValues = {}
  
  props.fields.forEach((field) => {
    if (field.name.includes('.')) {
      // Handle nested fields
      const value = getNestedValue(data, field.name)
      if (!formValues[field.name.split('.')[0]]) {
        formValues[field.name.split('.')[0]] = {}
      }
      setNestedValue(formValues, field.name, value !== undefined ? value : getDefaultValue(field))
    } else {
      // Handle regular fields
      const value = data?.[field.name]
      
      if (field.type === 'checkbox' || field.type === 'switch') {
        formValues[field.name] = value ?? false
      } else if (field.type === 'number' || field.type === 'slider' || field.type === 'range') {
        formValues[field.name] = value ?? (field.min !== undefined ? field.min : 0)
      } else if (field.type === 'file') {
        formValues[field.name] = null
      } else if (field.type === 'multifile') {
        formValues[field.name] = Array.isArray(value) ? value : []
        uploadingFilesMap.value[field.name] = []
        dragOverFields.value[field.name] = false
      } else if (field.type === 'multiselect') {
        formValues[field.name] = Array.isArray(value) ? value : []
      } else {
        formValues[field.name] = value ?? getDefaultValue(field)
      }
    }
  })
  
  return formValues
}

// Watch for initialData changes to populate form
watch(
  () => props.initialData,
  (newData) => {
    if (props.modalType === 'edit' && newData) {
      formData.value = populateFormData(newData)
      isInitialized.value = true
    } else if (props.modalType === 'create' && newData && !isInitialized.value) {
      formData.value = populateFormData(newData)
      isInitialized.value = true
    } else if (props.modalType === 'create' && !newData) {
      formData.value = initializeFormData()
      isInitialized.value = false
    }
  },
  { immediate: true, deep: true },
)

// Watch for modal open to reset form
watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      errors.value = {}
      if (props.modalType === 'create') {
        isInitialized.value = false
        if (props.initialData) {
          formData.value = populateFormData(props.initialData)
        } else {
          formData.value = initializeFormData()
        }
        isInitialized.value = true
      }
    }
  },
)

// Watch for initialData changes after initialization
watch(
  () => props.initialData,
  (newData) => {
    if (isInitialized.value && newData) {
      formData.value = populateFormData(newData)
    }
  },
  { deep: true },
)

const validateForm = () => {
  errors.value = {}
  props.fields.forEach((field) => {
    if (field.required && !field.disabled && field.type !== 'hidden') {
      const value = field.name.includes('.') 
        ? getNestedValue(formData.value, field.name)
        : formData.value[field.name]

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
      } else if (field.type === 'combobox') {
        if (!value || (typeof value === 'string' && !value.trim())) {
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
      const value = field.name.includes('.') 
        ? getNestedValue(formData.value, field.name)
        : formData.value[field.name]
      const customError = field.validate(value, formData.value)
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
  if (field.name.includes('.')) {
    setNestedValue(formData.value, field.name, value)
  } else {
    formData.value[field.name] = value
  }

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
  if (field.name.includes('.')) {
    setNestedValue(formData.value, field.name, value)
  } else {
    formData.value[field.name] = value
  }

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
  if (field.name.includes('.')) {
    setNestedValue(formData.value, field.name, file)
  } else {
    formData.value[field.name] = file
  }

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
const getDropzoneClasses = (field) => {
  const fieldFiles = getFieldValue(field.name) || []
  const isDragOver = dragOverFields.value[field.name]
  const hasFiles = fieldFiles.length > 0
  
  return cn(
    'border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 ease-in-out shadow-sm',
    field.variant === 'dashed' 
      ? 'border-blue-300 hover:border-blue-400 hover:bg-blue-50'
      : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50',
    'focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-opacity-50',
    {
      'border-green-500 bg-green-50 shadow-md': hasFiles && !isDragOver,
      'border-blue-500 bg-blue-50 ring-4 ring-blue-200 ring-opacity-50 shadow-lg': isDragOver,
      'border-green-600 bg-green-100 ring-4 ring-green-200 ring-opacity-50 shadow-lg': hasFiles && isDragOver
    }
  )
}

const handleMultiFileDrop = (field, event) => {
  event.preventDefault()
  dragOverFields.value[field.name] = false
  
  const droppedFiles = Array.from(event.dataTransfer.files)
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

const triggerMultiFileInput = (field) => {
  const input = fileInputRefs.value[field.name]
  if (input) {
    input.click()
  }
}

const handleMultiFileSelect = (field, event) => {
  const selectedFiles = Array.from(event.target.files)
  addMultipleFiles(field, selectedFiles)
  // Reset input value so same file can be selected again
  event.target.value = ''
}

const addMultipleFiles = (field, newFiles) => {
  const currentFiles = getFieldValue(field.name) || []
  
  // Filter valid files
  const validFiles = newFiles.filter(file => {
    // Check file size
    if (field.maxSize && file.size > field.maxSize) {
      toast.error(`File "${file.name}" exceeds maximum size of ${formatFileSize(field.maxSize)}`)
      return false
    }
    
    // Check file type
    if (field.accept) {
      const acceptedTypes = field.accept.split(',').map(t => t.trim().toLowerCase())
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase()
      const fileMimeType = file.type.toLowerCase()
      
      const isAccepted = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return fileExtension === type
        }
        if (type.endsWith('/*')) {
          return fileMimeType.startsWith(type.replace('/*', '/'))
        }
        return fileMimeType === type
      })
      
      if (!isAccepted) {
        toast.error(`File "${file.name}" is not an accepted file type`)
        return false
      }
    }
    
    // Check max files limit
    if (field.maxFiles) {
      const totalFiles = currentFiles.length + (uploadingFilesMap.value[field.name]?.length || 0)
      if (totalFiles >= field.maxFiles) {
        toast.error(`Maximum ${field.maxFiles} file(s) allowed`)
        return false
      }
    }
    
    // Check for duplicates
    const isDuplicate = currentFiles.some(existingFile => 
      existingFile.name === file.name && existingFile.size === file.size
    )
    if (isDuplicate) {
      toast.error(`File "${file.name}" has already been added`)
      return false
    }
    
    return true
  })

  if (validFiles.length === 0) return

  // Initialize uploading files map if needed
  if (!uploadingFilesMap.value[field.name]) {
    uploadingFilesMap.value[field.name] = []
  }

  // Add files to uploading state with progress
  const filesWithProgress = validFiles.map(file => reactive({
    file,
    progress: 0,
    uploading: true,
    id: Math.random().toString(36).slice(2, 11)
  }))

  uploadingFilesMap.value[field.name].push(...filesWithProgress)

  // Simulate upload progress with smooth increments
  filesWithProgress.forEach((fileItem) => {
    const duration = 1500 + Math.random() * 1500 // 1.5-3 seconds total
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
        const fieldFiles = getFieldValue(field.name) || []
        if (field.multiple !== false) {
          setFieldValue(field.name, [...fieldFiles, fileItem.file])
        } else {
          setFieldValue(field.name, [fileItem.file])
        }

        // Remove from uploading
        const uploadingIndex = uploadingFilesMap.value[field.name].findIndex(f => f.id === fileItem.id)
        if (uploadingIndex > -1) {
          uploadingFilesMap.value[field.name].splice(uploadingIndex, 1)
        }

        // Call onChange handler if provided
        if (field.onChange && typeof field.onChange === 'function') {
          try {
            field.onChange(getFieldValue(field.name), formData.value)
          } catch (error) {
            console.error('Error in onChange handler:', error)
          }
        }
      }
    }, intervalTime)
  })
}

const removeMultiFile = (field, index) => {
  const fieldFiles = getFieldValue(field.name) || []
  const newFiles = [...fieldFiles]
  newFiles.splice(index, 1)
  setFieldValue(field.name, newFiles)
  
  // Call onChange handler if provided
  if (field.onChange && typeof field.onChange === 'function') {
    try {
      field.onChange(newFiles, formData.value)
    } catch (error) {
      console.error('Error in onChange handler:', error)
    }
  }
}

const cancelUpload = (field, fileId) => {
  const uploadingIndex = uploadingFilesMap.value[field.name]?.findIndex(f => f.id === fileId)
  if (uploadingIndex > -1) {
    uploadingFilesMap.value[field.name].splice(uploadingIndex, 1)
  }
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getFileIcon = (file) => {
  const type = file.type || ''
  if (type.startsWith('image/')) return 'image'
  if (type.startsWith('video/')) return 'video'
  if (type.startsWith('audio/')) return 'music'
  if (type.includes('pdf')) return 'file-text'
  if (type.includes('zip') || type.includes('rar') || type.includes('7z')) return 'archive'
  if (type.includes('word') || type.includes('document')) return 'file-text'
  if (type.includes('excel') || type.includes('spreadsheet')) return 'table'
  if (type.includes('powerpoint') || type.includes('presentation')) return 'presentation'
  return 'file'
}

const getFileIconColor = (file) => {
  const type = file.type || ''
  if (type.startsWith('image/')) return 'text-purple-600 bg-purple-100'
  if (type.startsWith('video/')) return 'text-red-600 bg-red-100'
  if (type.startsWith('audio/')) return 'text-pink-600 bg-pink-100'
  if (type.includes('pdf')) return 'text-red-600 bg-red-100'
  if (type.includes('zip') || type.includes('rar')) return 'text-yellow-600 bg-yellow-100'
  if (type.includes('word')) return 'text-blue-600 bg-blue-100'
  if (type.includes('excel')) return 'text-green-600 bg-green-100'
  return 'text-gray-600 bg-gray-100'
}

const handleSubmit = async () => {
  try {
    // Check if any files are still uploading
    const hasUploadingFiles = props.fields.some(field => 
      field.type === 'multifile' && 
      uploadingFilesMap.value[field.name]?.length > 0
    )
    
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
      const value = field.name.includes('.') 
        ? getNestedValue(formData.value, field.name)
        : formData.value[field.name]

      if (field.type === 'number' || field.type === 'slider' || field.type === 'range') {
        if (field.name.includes('.')) {
          setNestedValue(preparedData, field.name, Number(value))
        } else {
          preparedData[field.name] = Number(value)
        }
      } else if (field.type === 'text' || field.type === 'textarea' || field.type === 'date' ||
        field.type === 'email' || field.type === 'url' || field.type === 'tel' ||
        field.type === 'search' || field.type === 'time' || field.type === 'datetime-local' ||
        field.type === 'month' || field.type === 'week') {
        const trimmedValue = typeof value === 'string' ? value.trim() : value
        if (field.name.includes('.')) {
          setNestedValue(preparedData, field.name, trimmedValue)
        } else {
          preparedData[field.name] = trimmedValue
        }
      } else if (field.type === 'password' || field.type === 'file' || field.type === 'multifile') {
        if (field.name.includes('.')) {
          setNestedValue(preparedData, field.name, value)
        } else {
          preparedData[field.name] = value
        }
      } else {
        if (field.name.includes('.')) {
          setNestedValue(preparedData, field.name, value)
        } else {
          preparedData[field.name] = value
        }
      }
    })

    emit('submit', {
      formData: preparedData,
      modalType: props.modalType,
      originalData: props.initialData,
    })
  } catch (error) {
    console.error('Error during form submission:', error)
    toast.error('An error occurred during submission')
  }
}

const handleClose = () => {
  formData.value = initializeFormData()
  errors.value = {}
  isInitialized.value = false
  uploadingFilesMap.value = {}
  dragOverFields.value = {}
  emit('close')
}

// Helper to get field value (handles nested fields)
const getFieldValue = (fieldName) => {
  return fieldName.includes('.') 
    ? getNestedValue(formData.value, fieldName)
    : formData.value[fieldName]
}

// Helper to set field value (handles nested fields)
const setFieldValue = (fieldName, value) => {
  if (fieldName.includes('.')) {
    setNestedValue(formData.value, fieldName, value)
  } else {
    formData.value[fieldName] = value
  }
}

// Set file input ref
const setFileInputRef = (el, fieldName) => {
  if (el) {
    fileInputRefs.value[fieldName] = el
  }
}
</script>

<template>
  <Modal
    v-model="isOpen"
    :show-close="true"
    :close-on-backdrop="true"
    :size="modalSize"
    :class="modalHeight === 'auto' ? '' : modalHeight"
    :resizable="modalResizable"
    @close="handleClose"
  >
    <div class="mb-6">
      <h2 class="text-xl font-semibold text-gray-900">
        {{ modalType === 'create' ? `Add New ${entityName}` : `Edit ${entityName}` }}
      </h2>
      <p class="text-sm text-gray-600 mt-1">
        {{
          modalType === 'create'
            ? `Fill in the details to create a new ${entityName.toLowerCase()}.`
            : `Update the ${entityName.toLowerCase()} information below.`
        }}
      </p>
    </div>

    <form
      class="space-y-6 overflow-y-auto"
      @submit.prevent="handleSubmit"
    >
      <div
        v-for="field in fields"
        :key="field.name"
      >
        <!-- Hidden fields don't need FormField wrapper -->
        <template v-if="field.type === 'hidden'">
          <input
            :value="getFieldValue(field.name)"
            type="hidden"
          >
        </template>

        <FormField
          v-else
          :id="`form-${entityName}-${field.name}-${Math.random().toString(36).slice(2, 5)}`"
          :label="field.label"
          :required="field.required && !field.disabled"
          :error="errors[field.name]"
          :error-message="errors[field.name]"
        >
          <template #default="{ fieldId, hasError, ariaDescribedBy }">
            <!-- Text/Number/Password/Color/Email/Tel/URL/Search Input -->
            <Input
              v-if="['text', 'number', 'password', 'color', 'email', 'tel', 'url', 'search'].includes(field.type)"
              :id="fieldId"
              :model-value="getFieldValue(field.name)"
              :type="field.type"
              :placeholder="field.placeholder"
              :disabled="isLoading || field.disabled"
              :readonly="field.disabled"
              :class="hasError ? 'border-red-500' : 'border-slate-300'"
              :aria-describedby="ariaDescribedBy"
              @update:model-value="setFieldValue(field.name, $event)"
            />

            <!-- Textarea -->
            <Textarea
              v-else-if="field.type === 'textarea'"
              :id="fieldId"
              :model-value="getFieldValue(field.name)"
              :placeholder="field.placeholder"
              :disabled="isLoading || field.disabled"
              :rows="field.rows || 3"
              :class="[
                'w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
                hasError ? 'border-red-500' : 'border-slate-300',
              ]"
              :aria-describedby="ariaDescribedBy"
              @update:model-value="setFieldValue(field.name, $event)"
            />

            <!-- Select Dropdown -->
            <Select
              v-else-if="field.type === 'select'"
              :id="fieldId"
              :model-value="getFieldValue(field.name)"
              :options="field.options"
              :placeholder="field.placeholder || 'Select an option'"
              :disabled="isLoading || field.disabled"
              :has-error="hasError"
              :aria-describedby="ariaDescribedBy"
              @update:model-value="handleSelectChange(field, $event)"
            />

            <!-- MultiSelect Dropdown -->
            <MultiSelect
              v-else-if="field.type === 'multiselect'"
              :id="fieldId"
              :model-value="getFieldValue(field.name)"
              :options="field.options"
              :disabled="isLoading || field.disabled"
              :placeholder="field.placeholder || 'Select options'"
              :has-error="hasError"
              :aria-describedby="ariaDescribedBy"
              @update:model-value="setFieldValue(field.name, $event)"
            />

            <!-- Combobox -->
            <Select
              v-else-if="field.type === 'combobox'"
              :id="fieldId"
              :model-value="getFieldValue(field.name)"
              :options="field.options"
              :placeholder="field.placeholder || 'Select or type to add new'"
              :disabled="isLoading || field.disabled"
              :has-error="hasError"
              :aria-describedby="ariaDescribedBy"
              :allow-create="field.allowCreate"
              @update:model-value="handleSelectChange(field, $event)"
            />

            <!-- Checkbox -->
            <div
              v-else-if="field.type === 'checkbox'"
              class="flex items-center"
            >
              <Input
                :id="fieldId"
                :model-value="getFieldValue(field.name)"
                type="checkbox"
                :disabled="isLoading || field.disabled"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                :aria-describedby="ariaDescribedBy"
                @update:model-value="setFieldValue(field.name, $event)"
              />
              <Label
                :for="fieldId"
                class="ml-2 text-sm text-gray-700"
              >
                {{ field.checkboxLabel || field.label }}
              </Label>
            </div>

            <!-- Switch (styled checkbox) -->
            <div
              v-else-if="field.type === 'switch'"
              class="flex items-center"
            >
              <button
                :id="fieldId"
                type="button"
                role="switch"
                :aria-checked="getFieldValue(field.name)"
                :disabled="isLoading || field.disabled"
                :class="[
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                  getFieldValue(field.name) ? 'bg-blue-600' : 'bg-gray-200',
                  (isLoading || field.disabled) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                ]"
                @click="setFieldValue(field.name, !getFieldValue(field.name))"
              >
                <span
                  :class="[
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    getFieldValue(field.name) ? 'translate-x-6' : 'translate-x-1'
                  ]"
                />
              </button>
              <Label
                :for="fieldId"
                class="ml-3 text-sm text-gray-700"
              >
                {{ field.checkboxLabel || field.label }}
              </Label>
            </div>

            <!-- Radio Buttons -->
            <div
              v-else-if="field.type === 'radio'"
              class="space-y-2"
            >
              <div
                v-for="option in field.options"
                :key="option.value"
                class="flex items-center"
              >
                <Input
                  :id="`${fieldId}-${option.value}`"
                  :model-value="getFieldValue(field.name)"
                  type="radio"
                  :value="option.value"
                  :disabled="isLoading || field.disabled"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  :aria-describedby="ariaDescribedBy"
                  @update:model-value="setFieldValue(field.name, $event)"
                />
                <Label
                  :for="`${fieldId}-${option.value}`"
                  class="ml-2 text-sm text-gray-700"
                >
                  {{ option.label }}
                </Label>
              </div>
            </div>

            <!-- Single File Input -->
            <div
              v-else-if="field.type === 'file'"
              class="space-y-2"
            >
              <Input
                :id="fieldId"
                type="file"
                :accept="field.accept"
                :disabled="isLoading || field.disabled"
                :class="[
                  'w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100',
                  hasError ? 'border-red-500' : 'border-slate-300'
                ]"
                :aria-describedby="ariaDescribedBy"
                @change="handleFileChange(field, $event)"
              />
              <p
                v-if="field.helpText"
                class="text-xs text-gray-500"
              >
                {{ field.helpText }}
              </p>
            </div>

            <!-- Multi-File Upload -->
            <div
              v-else-if="field.type === 'multifile'"
              class="w-full"
            >
              <!-- Dropzone -->
              <div
                v-if="!(getFieldValue(field.name)?.length > 0 && field.multiple === false)"
                :class="getDropzoneClasses(field)"
                @drop="handleMultiFileDrop(field, $event)"
                @dragover="handleMultiFileDragOver"
                @dragenter="handleMultiFileDragEnter(field, $event)"
                @dragleave="handleMultiFileDragLeave(field, $event)"
                @click="triggerMultiFileInput(field)"
              >
                <input
                  :ref="el => setFileInputRef(el, field.name)"
                  type="file"
                  :multiple="field.multiple !== false"
                  :accept="field.accept"
                  class="hidden"
                  :disabled="isLoading || field.disabled"
                  @change="handleMultiFileSelect(field, $event)"
                >

                <div class="flex items-center justify-center px-4 py-4">
                  <div class="bg-gray-100 rounded-full p-2.5 mr-3">
                    <Icon
                      icon="upload"
                      class="h-6 w-6 text-gray-600"
                    />
                  </div>
                  <div class="flex flex-col">
                    <p class="text-sm font-medium text-gray-700">
                      <span class="text-blue-600 font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p class="text-xs text-gray-500 mt-0.5">
                      {{ field.maxSize ? `Up to ${formatFileSize(field.maxSize)}` : 'No size limit' }}
                      <span
                        v-if="field.accept"
                        class="ml-1"
                      >• {{ field.accept }}</span>
                      <span
                        v-if="field.maxFiles"
                        class="ml-1"
                      >• Max {{ field.maxFiles }} file(s)</span>
                    </p>
                  </div>
                </div>
              </div>

              <!-- File List -->
              <div
                v-if="(getFieldValue(field.name)?.length > 0 || uploadingFilesMap[field.name]?.length > 0)"
                class="mt-3 space-y-2"
              >
                <!-- Uploading files -->
                <div
                  v-for="fileItem in uploadingFilesMap[field.name] || []"
                  :key="`uploading-${fileItem.id}`"
                  class="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm"
                >
                  <div class="flex items-center space-x-3 min-w-0 flex-1">
                    <CircularProgress
                      :value="fileItem.progress"
                      :max="100"
                      size="sm"
                      variant="default"
                      :dynamic-color="true"
                      class="flex-shrink-0"
                    />
                    <div class="flex flex-col min-w-0">
                      <span class="text-sm font-medium text-gray-900 truncate">{{ fileItem.file.name }}</span>
                      <span class="text-xs text-gray-500">Uploading... {{ Math.round(fileItem.progress) }}%</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    class="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full p-1 transition-colors ml-2"
                    @click.stop="cancelUpload(field, fileItem.id)"
                  >
                    <Icon
                      icon="x"
                      class="h-4 w-4"
                    />
                  </button>
                </div>

                <!-- Uploaded files -->
                <div
                  v-for="(file, index) in getFieldValue(field.name) || []"
                  :key="`uploaded-${index}-${file.name}`"
                  class="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div class="flex items-center space-x-3 min-w-0 flex-1">
                    <div
                      :class="[
                        'rounded-md p-2 flex-shrink-0',
                        getFileIconColor(file)
                      ]"
                    >
                      <Icon
                        :icon="getFileIcon(file)"
                        class="h-5 w-5"
                      />
                    </div>
                    <div class="flex flex-col min-w-0">
                      <span class="text-sm font-medium text-gray-900 truncate">{{ file.name }}</span>
                      <span class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    class="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full p-1.5 transition-colors ml-2"
                    :disabled="isLoading || field.disabled"
                    @click.stop="removeMultiFile(field, index)"
                  >
                    <Icon
                      icon="x"
                      class="h-4 w-4"
                    />
                  </button>
                </div>
              </div>

              <!-- Help text -->
              <p
                v-if="field.helpText"
                class="mt-2 text-xs text-gray-500"
              >
                {{ field.helpText }}
              </p>
            </div>

            <!-- Slider -->
            <Slider
              v-else-if="field.type === 'slider'"
              :model-value="getFieldValue(field.name)"
              :min="field.min"
              :max="field.max"
              :step="field.step"
              :disabled="isLoading || field.disabled"
              @update:model-value="handleSliderChange(field, $event)"
            />

            <!-- Range (HTML5 native range input) -->
            <div
              v-else-if="field.type === 'range'"
              class="space-y-2"
            >
              <div class="flex items-center gap-4">
                <Input
                  :id="fieldId"
                  :model-value="getFieldValue(field.name)"
                  type="range"
                  :min="field.min"
                  :max="field.max"
                  :step="field.step || 1"
                  :disabled="isLoading || field.disabled"
                  class="flex-1"
                  :aria-describedby="ariaDescribedBy"
                  @update:model-value="setFieldValue(field.name, $event)"
                />
                <span class="text-sm font-medium text-gray-700 min-w-[3rem] text-right">
                  {{ getFieldValue(field.name) }}
                </span>
              </div>
            </div>

            <!-- Date Picker -->
            <DatePicker
              v-else-if="field.type === 'date'"
              :id="fieldId"
              :model-value="getFieldValue(field.name)"
              :disabled="isLoading || field.disabled"
              :required="field.required"
              :min="field.min"
              :max="field.max"
              :placeholder="field.placeholder || 'Select date'"
              :format="field.format || 'MM/DD/YYYY'"
              :clearable="field.clearable !== false"
              :show-today="field.showToday !== false"
              :calendar-position="field.calendarPosition || 'left-0 bottom-full'"
              :aria-describedby="ariaDescribedBy"
              @update:model-value="setFieldValue(field.name, $event)"
            />

            <!-- Time Input -->
            <Input
              v-else-if="field.type === 'time'"
              :id="fieldId"
              :model-value="getFieldValue(field.name)"
              type="time"
              :disabled="isLoading || field.disabled"
              :class="hasError ? 'border-red-500' : 'border-slate-300'"
              :aria-describedby="ariaDescribedBy"
              @update:model-value="setFieldValue(field.name, $event)"
            />

            <!-- DateTime Local Input -->
            <Input
              v-else-if="field.type === 'datetime-local'"
              :id="fieldId"
              :model-value="getFieldValue(field.name)"
              type="datetime-local"
              :disabled="isLoading || field.disabled"
              :class="hasError ? 'border-red-500' : 'border-slate-300'"
              :aria-describedby="ariaDescribedBy"
              @update:model-value="setFieldValue(field.name, $event)"
            />

            <!-- Month Input -->
            <Input
              v-else-if="field.type === 'month'"
              :id="fieldId"
              :model-value="getFieldValue(field.name)"
              type="month"
              :disabled="isLoading || field.disabled"
              :class="hasError ? 'border-red-500' : 'border-slate-300'"
              :aria-describedby="ariaDescribedBy"
              @update:model-value="setFieldValue(field.name, $event)"
            />

            <!-- Week Input -->
            <Input
              v-else-if="field.type === 'week'"
              :id="fieldId"
              :model-value="getFieldValue(field.name)"
              type="week"
              :disabled="isLoading || field.disabled"
              :class="hasError ? 'border-red-500' : 'border-slate-300'"
              :aria-describedby="ariaDescribedBy"
              @update:model-value="setFieldValue(field.name, $event)"
            />
          </template>
        </FormField>
      </div>

      <div class="flex justify-end gap-3 pt-6">
        <Button
          type="button"
          variant="outline"
          :disabled="isLoading"
          @click="handleClose"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          :disabled="isLoading"
          :loading="isLoading"
          variant="default"
        >
          {{ modalType === 'create' ? `Create ${entityName}` : `Update ${entityName}` }}
        </Button>
      </div>
    </form>
  </Modal>
</template>