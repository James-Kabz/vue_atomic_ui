<script setup>
import { Button, FormField, Input, Label, Modal, Select, Textarea, toast } from '@stlhorizon/vue-ui'
import { ref, watch, computed } from 'vue'

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
    required: true,
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
          ['text', 'number', 'password', 'textarea', 'select', 'checkbox'].includes(field.type),
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
})

const emit = defineEmits(['update:modelValue', 'submit', 'close'])

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const isLoading = computed(() => props.loading)

const formData = ref({})
const errors = ref({})

// Initialize form data based on fields
const initializeFormData = () => {
  const data = {}
  props.fields.forEach((field) => {
    if (field.type === 'checkbox') {
      data[field.name] = false
    } else if (field.type === 'number') {
      data[field.name] = ''
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
        data[field.name] = newData[field.name] ?? (field.type === 'checkbox' ? false : '')
      })
      formData.value = data
    } else if (props.modalType === 'create') {
      formData.value = initializeFormData()
    }
  },
  { immediate: true },
)

// Watch for modal open to reset form
watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      errors.value = {}
      if (props.modalType === 'create') {
        formData.value = initializeFormData()
      }
    }
  },
)

const validateForm = () => {
  errors.value = {}

  props.fields.forEach((field) => {
    if (field.required) {
      const value = formData.value[field.name]

      // Handle different field types
      if (field.type === 'checkbox') {
        // Checkbox validation (if required means must be checked)
        if (field.required && !value) {
          errors.value[field.name] = field.errorMessage || `${field.label} is required`
        }
      } else if (field.type === 'number') {
        // Number validation
        if (value === '' || value === null || value === undefined) {
          errors.value[field.name] = field.errorMessage || `${field.label} is required`
        } else if (field.min !== undefined && Number(value) < field.min) {
          errors.value[field.name] = `${field.label} must be at least ${field.min}`
        } else if (field.max !== undefined && Number(value) > field.max) {
          errors.value[field.name] = `${field.label} must be at most ${field.max}`
        }
      } else if (field.type === 'password') {
        // Password validation
        if (!value || (typeof value === 'string' && !value.trim())) {
          errors.value[field.name] = field.errorMessage || `${field.label} is required`
        }
      } else {
        // Text/textarea/select validation
        if (!value || (typeof value === 'string' && !value.trim())) {
          errors.value[field.name] = field.errorMessage || `${field.label} is required`
        }
      }
    }

    // Custom field validation
    if (field.validate && typeof field.validate === 'function') {
      const customError = field.validate(formData.value[field.name], formData.value)
      if (customError) {
        errors.value[field.name] = customError
      }
    }
  })

  // Run custom validation function if provided
  if (props.customValidation) {
    const customErrors = props.customValidation(formData.value)
    if (customErrors && Object.keys(customErrors).length > 0) {
      errors.value = { ...errors.value, ...customErrors }
    }
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) {
    toast.error('Please fix the validation errors before submitting')
    return
  }

  // Prepare form data - trim strings and convert numbers
  const preparedData = {}
  props.fields.forEach((field) => {
    const value = formData.value[field.name]

    if (field.type === 'number') {
      preparedData[field.name] = Number(value)
    } else if (field.type === 'text' || field.type === 'textarea') {
      preparedData[field.name] = typeof value === 'string' ? value.trim() : value
    } else if (field.type === 'password') {
      // Keep password as-is, don't trim
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
}

const handleClose = () => {
  formData.value = initializeFormData()
  errors.value = {}
  emit('close')
}
</script>

<template>
  <Modal v-model="isOpen" :showClose="true" :closeOnBackdrop="true" @close="handleClose">
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

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div v-for="field in fields" :key="field.name">
        <FormField
          :label="field.label"
          :required="field.required"
          :error="errors[field.name]"
          :errorMessage="errors[field.name]"
          :id="`form-${entityName}-${field.name}-${Math.random().toString(36).slice(2, 5)}`"
        >
          <template #default="{ fieldId, hasError, ariaDescribedBy }">
            <!-- Text/Number/Password Input -->
            <Input
              v-if="field.type === 'text' || field.type === 'number' || field.type === 'password'"
              :id="fieldId"
              v-model="formData[field.name]"
              :type="field.type"
              :placeholder="field.placeholder"
              :disabled="isLoading"
              :class="hasError ? 'border-red-500' : 'border-slate-300'"
              :aria-describedby="ariaDescribedBy"
            />

            <!-- Textarea -->
            <Textarea
              v-else-if="field.type === 'textarea'"
              :id="fieldId"
              v-model="formData[field.name]"
              :placeholder="field.placeholder"
              :disabled="isLoading"
              :rows="field.rows || 3"
              :class="[
                'w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
                hasError ? 'border-red-500' : 'border-slate-300',
              ]"
              :aria-describedby="ariaDescribedBy"
            />

            <!-- Select Dropdown -->
            <Select
              v-else-if="field.type === 'select'"
              :id="fieldId"
              v-model="formData[field.name]"
              :disabled="isLoading"
              :class="[
                'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
                hasError ? 'border-red-500' : 'border-slate-300',
              ]"
              :aria-describedby="ariaDescribedBy"
            >
              <option value="" disabled>{{ field.placeholder || 'Select an option' }}</option>
              <option v-for="option in field.options" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </Select>

            <!-- Checkbox -->
            <div v-else-if="field.type === 'checkbox'" class="flex items-center">
              <Input
                :id="fieldId"
                v-model="formData[field.name]"
                type="checkbox"
                :disabled="isLoading"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                :aria-describedby="ariaDescribedBy"
              />
              <Label :for="fieldId" class="ml-2 text-sm text-gray-700">
                {{ field.checkboxLabel }}
              </Label>
            </div>
          </template>
        </FormField>
      </div>

      <div class="flex justify-end gap-3 pt-4">
        <Button type="button" @click="handleClose" variant="outline" :disabled="isLoading">
          Cancel
        </Button>
        <Button type="submit" :disabled="isLoading" :loading="isLoading" variant="default">
          {{ modalType === 'create' ? `Create ${entityName}` : `Update ${entityName}` }}
        </Button>
      </div>
    </form>
  </Modal>
</template>