<script setup>
import Modal from './Modal.vue'
import Slider from './Slider.vue'
import DatePicker from './DatePicker.vue'
import { ref, watch, computed } from 'vue'
import FormField from './FormField.vue'
import Input from './Input.vue'
import Textarea from './Textarea.vue'
import Select from './Select.vue'
import Button from './Button.vue'
import { toast } from '../lib/toast'
import Label from './Label.vue'

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
            'email',          // NEW
            'tel',            // NEW
            'url',            // NEW
            'time',           // NEW
            'datetime-local', // NEW
            'month',          // NEW
            'week',           // NEW
            'file',           // NEW
            'radio',          // NEW
            'switch',         // NEW (alternative to checkbox)
            'range',          // NEW (alternative to slider)
            'search',         // NEW
            'hidden',         // NEW
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
    validator: (value) => ['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', 'full'].includes(value)
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
    } else if (field.type === 'radio') {
      data[field.name] = field.options?.[0]?.value || ''
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
    if (props.modalType === 'edit' && newData) {
      const data = {}
      props.fields.forEach((field) => {
        if (field.type === 'checkbox' || field.type === 'switch') {
          data[field.name] = newData[field.name] ?? false
        } else if (field.type === 'number' || field.type === 'slider' || field.type === 'range') {
          data[field.name] = newData[field.name] ?? (field.min !== undefined ? field.min : 0)
        } else if (field.type === 'file') {
          data[field.name] = null
        } else {
          data[field.name] = newData[field.name] ?? ''
        }
      })
      formData.value = data
      isInitialized.value = true
    } else if (props.modalType === 'create' && newData && !isInitialized.value) {
      const data = {}
      props.fields.forEach((field) => {
        if (newData[field.name] !== undefined && newData[field.name] !== null) {
          data[field.name] = newData[field.name]
        } else if (field.type === 'checkbox' || field.type === 'switch') {
          data[field.name] = false
        } else if (field.type === 'number' || field.type === 'slider' || field.type === 'range') {
          data[field.name] = field.min !== undefined ? field.min : 0
        } else if (field.type === 'file') {
          data[field.name] = null
        } else if (field.type === 'radio') {
          data[field.name] = field.options?.[0]?.value || ''
        } else {
          data[field.name] = ''
        }
      })
      formData.value = data
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
          const data = {}
          props.fields.forEach((field) => {
            if (props.initialData[field.name] !== undefined && props.initialData[field.name] !== null) {
              data[field.name] = props.initialData[field.name]
            } else if (field.type === 'checkbox' || field.type === 'switch') {
              data[field.name] = false
            } else if (field.type === 'number' || field.type === 'slider' || field.type === 'range') {
              data[field.name] = field.min !== undefined ? field.min : 0
            } else if (field.type === 'file') {
              data[field.name] = null
            } else if (field.type === 'radio') {
              data[field.name] = field.options?.[0]?.value || ''
            } else {
              data[field.name] = ''
            }
          })
          formData.value = data
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
      } else if (field.type === 'radio') {
        if (!value) {
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

const handleSubmit = async () => {
  try {
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
      } else if (field.type === 'file') {
        preparedData[field.name] = value
      } else {
        preparedData[field.name] = value
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
  emit('close')
}
</script>

<template>
  <Modal v-model="isOpen" :show-close="true" :close-on-backdrop="true" :size="modalSize" :resizable="modalResizable"
    @close="handleClose">
    <div class="mb-4">
      <h2 class="text-lg font-semibold text-gray-900">
        {{ modalType === 'create' ? `Add New ${entityName}` : `Edit ${entityName}` }}
      </h2>
      <p class="text-sm text-gray-600">
        {{
          modalType === 'create'
            ? `Fill in the details to create a new ${entityName.toLowerCase()}.`
            : `Update the ${entityName.toLowerCase()} information below.`
        }}
      </p>
    </div>

    <form class="space-y-4" @submit.prevent="handleSubmit">
      <div v-for="field in fields" :key="field.name">
        <!-- Hidden fields don't need FormField wrapper -->
        <template v-if="field.type === 'hidden'">
          <input type="hidden" v-model="formData[field.name]" />
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
              :disabled="isLoading || field.disabled" :class="[
                'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
                hasError ? 'border-red-500' : 'border-slate-300',
              ]" :aria-describedby="ariaDescribedBy" @update:model-value="handleSelectChange(field, $event)">
              <option value="" disabled>
                {{ field.placeholder || 'Select an option' }}
              </option>
              <option v-for="option in field.options" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </Select>

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

            <!-- File Input -->
            <div v-else-if="field.type === 'file'" class="space-y-2">
              <Input :id="fieldId" type="file" :accept="field.accept" :disabled="isLoading || field.disabled" :class="[
                'w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100',
                hasError ? 'border-red-500' : 'border-slate-300'
              ]" :aria-describedby="ariaDescribedBy" @change="handleFileChange(field, $event)" />
              <p v-if="field.helpText" class="text-xs text-gray-500">
                {{ field.helpText }}
              </p>
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

      <div class="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" :disabled="isLoading" @click="handleClose">
          Cancel
        </Button>
        <Button type="submit" :disabled="isLoading" :loading="isLoading" variant="default">
          {{ modalType === 'create' ? `Create ${entityName}` : `Update ${entityName}` }}
        </Button>
      </div>
    </form>
  </Modal>
</template>