<template>
  <div class="relative w-full">
    <div class="relative">
      <input
        :id="id"
        ref="inputRef"
        :value="formattedValue"
        type="text"
        :placeholder="placeholder"
        :class="inputClasses"
        :disabled="disabled"
        :required="required"
        :readonly="readonly"
        @click="toggleCalendar"
        @focus="showCalendar = true"
        @blur="handleBlur"
        @input="handleManualInput"
      />
      <button
        type="button"
        :disabled="disabled"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        @click="toggleCalendar"
        tabindex="-1"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
          <line x1="16" x2="16" y1="2" y2="6" />
          <line x1="8" x2="8" y1="2" y2="6" />
          <line x1="3" x2="21" y1="10" y2="10" />
        </svg>
      </button>
      
      <button
        v-if="clearable && modelValue && !disabled"
        type="button"
        class="absolute right-10 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900 transition-colors"
        @click.stop="clearDate"
        tabindex="-1"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="m15 9-6 6" />
          <path d="m9 9 6 6" />
        </svg>
      </button>
    </div>

    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <div
        v-if="showCalendar"
        ref="calendarRef"
        class="absolute z-50 mt-2 p-3 bg-white border border-gray-300 rounded-md shadow-lg"
        :class="calendarPosition"
      >
        <div class="flex items-center justify-between mb-3">
          <button
            type="button"
            class="p-1 hover:bg-accent rounded transition-colors"
            @click="previousMonth"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          
          <div class="flex gap-2">
            <select
              v-model="viewMonth"
              class="px-2 py-1 text-sm font-medium bg-background border border-input rounded hover:bg-accent transition-colors"
            >
              <option v-for="(month, index) in monthNames" :key="index" :value="index">
                {{ month }}
              </option>
            </select>
            
            <select
              v-model="viewYear"
              class="px-2 py-1 text-sm font-medium bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
            >
              <option v-for="year in yearRange" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
          </div>
          
          <button
            type="button"
            class="p-1 hover:bg-gray-100 rounded transition-colors"
            @click="nextMonth"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>

        <div class="grid grid-cols-7 gap-1 mb-2">
          <div
            v-for="day in weekDays"
            :key="day"
            class="text-center text-xs font-medium text-gray-500 py-2"
          >
            {{ day }}
          </div>
        </div>

        <div class="grid grid-cols-7 gap-1">
          <button
            v-for="date in calendarDays"
            :key="date.date"
            type="button"
            :disabled="isDateDisabled(date)"
            :class="[
              'aspect-square p-0 text-sm rounded hover:bg-gray-100 transition-colors',
              {
                'text-gray-400': !date.isCurrentMonth,
                'bg-blue-600 text-white hover:bg-blue-700': isSelectedDate(date),
                'bg-gray-100 font-semibold': isToday(date) && !isSelectedDate(date),
                'opacity-50 cursor-not-allowed': isDateDisabled(date)
              }
            ]"
            @click="selectDate(date)"
          >
            {{ date.day }}
          </button>
        </div>

        <div v-if="showToday" class="mt-3 pt-3 border-t border-gray-300">
          <button
            type="button"
            class="w-full px-3 py-2 text-sm font-medium bg-gray-200 hover:bg-gray-300 rounded transition-colors"
            @click="selectToday"
          >
            Today
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { cva } from 'class-variance-authority'
import { cn } from '../utils/cn.js'

const props = defineProps({
  modelValue: String,
  id: String,
  disabled: Boolean,
  required: Boolean,
  readonly: {
    type: Boolean,
    default: true
  },
  clearable: {
    type: Boolean,
    default: true
  },
  min: String,
  max: String,
  placeholder: {
    type: String,
    default: 'Select date'
  },
  format: {
    type: String,
    default: 'MM/DD/YYYY',
    validator: (value) => ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'].includes(value)
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'outline', 'ghost'].includes(value)
  },
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['sm', 'default', 'lg'].includes(value)
  },
  showToday: {
    type: Boolean,
    default: true
  },
  calendarPosition: {
    type: String,
    default: 'left-0',
    validator: (value) => ['left-0', 'right-0'].includes(value)
  }
})

const emit = defineEmits(['update:modelValue'])

const inputRef = ref(null)
const calendarRef = ref(null)
const showCalendar = ref(false)
const viewMonth = ref(new Date().getMonth())
const viewYear = ref(new Date().getFullYear())

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

const yearRange = computed(() => {
  const currentYear = new Date().getFullYear()
  const start = currentYear - 100
  const end = currentYear + 10
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

const formattedValue = computed(() => {
  if (!props.modelValue) return ''
  
  const date = new Date(props.modelValue)
  if (isNaN(date.getTime())) return props.modelValue
  
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  
  switch (props.format) {
    case 'DD/MM/YYYY':
      return `${day}/${month}/${year}`
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`
    case 'MM/DD/YYYY':
    default:
      return `${month}/${day}/${year}`
  }
})

const calendarDays = computed(() => {
  const firstDay = new Date(viewYear.value, viewMonth.value, 1)
  const lastDay = new Date(viewYear.value, viewMonth.value + 1, 0)
  const prevLastDay = new Date(viewYear.value, viewMonth.value, 0)
  
  const firstDayWeekday = firstDay.getDay()
  const lastDayDate = lastDay.getDate()
  const prevLastDayDate = prevLastDay.getDate()
  
  const days = []
  
  // Previous month days
  for (let i = firstDayWeekday - 1; i >= 0; i--) {
    days.push({
      day: prevLastDayDate - i,
      month: viewMonth.value - 1,
      year: viewMonth.value === 0 ? viewYear.value - 1 : viewYear.value,
      isCurrentMonth: false,
      date: new Date(
        viewMonth.value === 0 ? viewYear.value - 1 : viewYear.value,
        viewMonth.value === 0 ? 11 : viewMonth.value - 1,
        prevLastDayDate - i
      )
    })
  }
  
  // Current month days
  for (let i = 1; i <= lastDayDate; i++) {
    days.push({
      day: i,
      month: viewMonth.value,
      year: viewYear.value,
      isCurrentMonth: true,
      date: new Date(viewYear.value, viewMonth.value, i)
    })
  }
  
  // Next month days
  const remainingDays = 42 - days.length // 6 rows × 7 days
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      day: i,
      month: viewMonth.value + 1,
      year: viewMonth.value === 11 ? viewYear.value + 1 : viewYear.value,
      isCurrentMonth: false,
      date: new Date(
        viewMonth.value === 11 ? viewYear.value + 1 : viewYear.value,
        viewMonth.value === 11 ? 0 : viewMonth.value + 1,
        i
      )
    })
  }
  
  return days
})

const inputVariants = cva(
  'flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer',
  {
    variants: {
      variant: {
        default: 'border-gray-300',
        outline: 'border-2 border-blue-600',
        ghost: 'border-transparent bg-transparent'
      },
      size: {
        sm: 'h-9 px-2 pr-8 text-xs',
        default: 'h-10 px-3 pr-10',
        lg: 'h-11 px-4 pr-12 text-base'
      }
    }
  }
)

const inputClasses = computed(() => 
  cn(inputVariants({ variant: props.variant, size: props.size }))
)

function toggleCalendar() {
  if (!props.disabled) {
    showCalendar.value = !showCalendar.value
  }
}

function selectDate(dateObj) {
  if (isDateDisabled(dateObj)) return
  
  const date = dateObj.date
  const isoString = date.toISOString().split('T')[0]
  emit('update:modelValue', isoString)
  showCalendar.value = false
}

function selectToday() {
  const today = new Date()
  const isoString = today.toISOString().split('T')[0]
  emit('update:modelValue', isoString)
  showCalendar.value = false
}

function clearDate() {
  emit('update:modelValue', '')
  showCalendar.value = false
}

function isSelectedDate(dateObj) {
  if (!props.modelValue) return false
  const selected = new Date(props.modelValue)
  const date = dateObj.date
  return (
    selected.getFullYear() === date.getFullYear() &&
    selected.getMonth() === date.getMonth() &&
    selected.getDate() === date.getDate()
  )
}

function isToday(dateObj) {
  const today = new Date()
  const date = dateObj.date
  return (
    today.getFullYear() === date.getFullYear() &&
    today.getMonth() === date.getMonth() &&
    today.getDate() === date.getDate()
  )
}

function isDateDisabled(dateObj) {
  const date = dateObj.date
  
  if (props.min) {
    const minDate = new Date(props.min)
    if (date < minDate) return true
  }
  
  if (props.max) {
    const maxDate = new Date(props.max)
    if (date > maxDate) return true
  }
  
  return false
}

function previousMonth() {
  if (viewMonth.value === 0) {
    viewMonth.value = 11
    viewYear.value--
  } else {
    viewMonth.value--
  }
}

function nextMonth() {
  if (viewMonth.value === 11) {
    viewMonth.value = 0
    viewYear.value++
  } else {
    viewMonth.value++
  }
}

function handleManualInput(event) {
  if (props.readonly) return
  
  const value = event.target.value
  // Allow manual typing if not readonly
  emit('update:modelValue', value)
}

function handleBlur(event) {
  setTimeout(() => {
    if (calendarRef.value && !calendarRef.value.contains(document.activeElement)) {
      showCalendar.value = false
    }
  }, 200)
}

function handleClickOutside(event) {
  if (
    inputRef.value &&
    calendarRef.value &&
    !inputRef.value.contains(event.target) &&
    !calendarRef.value.contains(event.target)
  ) {
    showCalendar.value = false
  }
}

watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    const date = new Date(newValue)
    if (!isNaN(date.getTime())) {
      viewMonth.value = date.getMonth()
      viewYear.value = date.getFullYear()
    }
  }
})

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  
  if (props.modelValue) {
    const date = new Date(props.modelValue)
    if (!isNaN(date.getTime())) {
      viewMonth.value = date.getMonth()
      viewYear.value = date.getFullYear()
    }
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>