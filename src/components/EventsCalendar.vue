<script setup>
import { ref, computed } from 'vue'

// Props
const props = defineProps({
  events: {
    type: Array,
    default: () => []
  },
  size: {
    type: String,
    default: 'default'
  }
})

// Emits
const emit = defineEmits(['select-date', 'select-event'])

// State
const currentDate = ref(new Date())
const selectedDate = ref(null)
const viewMode = ref('month') // 'month', 'year', or 'day'
const selectedEvent = ref(null)
const showEventPanel = ref(false)

// Constants
const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December']

// Helper Functions - All timezone-safe
function formatDateToISO(date) {
  // Format date to YYYY-MM-DD without timezone conversion
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date
  }
  
  if (date instanceof Date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }
  
  return null
}

function parseDateSafe(dateString) {
  // Parse YYYY-MM-DD string to Date object in local timezone
  if (!dateString) return null
  
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    const [year, month, day] = dateString.split('-').map(Number)
    return new Date(year, month - 1, day)
  }
  
  return new Date(dateString)
}

function isSameDay(date1, date2) {
  if (!date1 || !date2) return false
  const d1 = date1 instanceof Date ? date1 : parseDateSafe(date1)
  const d2 = date2 instanceof Date ? date2 : parseDateSafe(date2)
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate()
}

function getTodayISO() {
  const today = new Date()
  return formatDateToISO(today)
}

// Computed
const monthYear = computed(() => {
  return currentDate.value.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  })
})

const currentYear = computed(() => {
  return currentDate.value.getFullYear()
})

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)

  const startingDayOfWeek = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  const days = []
  const todayISO = getTodayISO()

  // Previous month days
  const prevMonthLastDay = new Date(year, month, 0).getDate()
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const dayNumber = prevMonthLastDay - i
    const dateObj = new Date(year, month - 1, dayNumber)
    const date = formatDateToISO(dateObj)
    days.push({
      dayNumber,
      date,
      dateObj,
      isCurrentMonth: false,
      isToday: date === todayISO,
      events: getEventsForDate(date)
    })
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const dateObj = new Date(year, month, i)
    const date = formatDateToISO(dateObj)

    days.push({
      dayNumber: i,
      date,
      dateObj,
      isCurrentMonth: true,
      isToday: date === todayISO,
      events: getEventsForDate(date)
    })
  }

  // Next month days
  const remainingDays = 42 - days.length
  for (let i = 1; i <= remainingDays; i++) {
    const dateObj = new Date(year, month + 1, i)
    const date = formatDateToISO(dateObj)
    days.push({
      dayNumber: i,
      date,
      dateObj,
      isCurrentMonth: false,
      isToday: date === todayISO,
      events: getEventsForDate(date)
    })
  }

  return days
})

const getMonthDays = (year, month) => {
  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)

  const startingDayOfWeek = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  const days = []
  const todayISO = getTodayISO()

  const prevMonthLastDay = new Date(year, month, 0).getDate()
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const dayNumber = prevMonthLastDay - i
    const dateObj = new Date(year, month - 1, dayNumber)
    const date = formatDateToISO(dateObj)
    days.push({
      dayNumber,
      date,
      dateObj,
      isCurrentMonth: false,
      isToday: date === todayISO,
      events: getEventsForDate(date)
    })
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const dateObj = new Date(year, month, i)
    const date = formatDateToISO(dateObj)

    days.push({
      dayNumber: i,
      date,
      dateObj,
      isCurrentMonth: true,
      isToday: date === todayISO,
      events: getEventsForDate(date)
    })
  }

  const remainingDays = 35 - days.length
  for (let i = 1; i <= remainingDays; i++) {
    const dateObj = new Date(year, month + 1, i)
    const date = formatDateToISO(dateObj)
    days.push({
      dayNumber: i,
      date,
      dateObj,
      isCurrentMonth: false,
      isToday: date === todayISO,
      events: getEventsForDate(date)
    })
  }

  return days.slice(0, 35)
}

const dayViewDate = computed(() => {
  if (viewMode.value !== 'day') return null
  return currentDate.value.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
})

const dayViewEvents = computed(() => {
  if (viewMode.value !== 'day') return []
  const dateStr = formatDateToISO(currentDate.value)
  return props.events.filter(event => event.date === dateStr).sort((a, b) => {
    return a.time.localeCompare(b.time)
  })
})

// Methods
function getEventsForDate(date) {
  return props.events.filter(event => event.date === date)
}

function previousPeriod() {
  if (viewMode.value === 'month') {
    currentDate.value = new Date(
      currentDate.value.getFullYear(),
      currentDate.value.getMonth() - 1,
      1
    )
  } else if (viewMode.value === 'year') {
    currentDate.value = new Date(
      currentDate.value.getFullYear() - 1,
      currentDate.value.getMonth(),
      1
    )
  } else if (viewMode.value === 'day') {
    currentDate.value = new Date(
      currentDate.value.getFullYear(),
      currentDate.value.getMonth(),
      currentDate.value.getDate() - 1
    )
  }
}

function nextPeriod() {
  if (viewMode.value === 'month') {
    currentDate.value = new Date(
      currentDate.value.getFullYear(),
      currentDate.value.getMonth() + 1,
      1
    )
  } else if (viewMode.value === 'year') {
    currentDate.value = new Date(
      currentDate.value.getFullYear() + 1,
      currentDate.value.getMonth(),
      1
    )
  } else if (viewMode.value === 'day') {
    currentDate.value = new Date(
      currentDate.value.getFullYear(),
      currentDate.value.getMonth(),
      currentDate.value.getDate() + 1
    )
  }
}

function selectDate(day) {
  selectedDate.value = day.date
  // Use the dateObj which is already in local timezone
  currentDate.value = new Date(day.dateObj)
  viewMode.value = 'day'
  emit('select-date', {
    date: day.date,
    events: day.events
  })
}

function selectEvent(event) {
  selectedEvent.value = event
  showEventPanel.value = true
  emit('select-event', event)
}

function closeEventPanel() {
  showEventPanel.value = false
  selectedEvent.value = null
}

function selectMonth(monthIndex) {
  currentDate.value = new Date(currentDate.value.getFullYear(), monthIndex, 1)
  viewMode.value = 'month'
}

function setViewMode(mode) {
  viewMode.value = mode
  if (mode === 'day' && !selectedDate.value) {
    selectedDate.value = getTodayISO()
    currentDate.value = new Date()
  }
}

function getStatusForDate(date) {
  const events = getEventsForDate(date)
  if (events.length === 0) return null
  const hasComplied = events.some(e => e.status === 'complied')
  const hasPending = events.some(e => e.status === 'pending')
  if (hasPending) return 'pending'
  if (hasComplied) return 'complied'
  return null
}

function formatEventDate(dateString) {
  if (!dateString) return ''
  const date = parseDateSafe(dateString)
  if (!date) return dateString
  
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<template>
  <div class="flex gap-4 h-full">
    <!-- Calendar Container -->
    <div class="flex-1 bg-white rounded-xl shadow-lg border border-gray-100 p-5">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <button
          class="inline-flex items-center justify-center rounded-lg h-10 w-10 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          @click="previousPeriod"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <div class="flex items-center gap-3">
          <h2 class="text-lg font-semibold text-gray-900">
            {{ viewMode === 'month' ? monthYear : viewMode === 'year' ? currentYear : dayViewDate }}
          </h2>

          <!-- View Mode Selector -->
          <div class="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg">
            <button
              class="px-3 py-1 text-xs font-medium rounded transition-all"
              :class="viewMode === 'day' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'"
              @click="setViewMode('day')"
            >
              Day
            </button>
            <button
              class="px-3 py-1 text-xs font-medium rounded transition-all"
              :class="viewMode === 'month' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'"
              @click="setViewMode('month')"
            >
              Month
            </button>
            <button
              class="px-3 py-1 text-xs font-medium rounded transition-all"
              :class="viewMode === 'year' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'"
              @click="setViewMode('year')"
            >
              Year
            </button>
          </div>
        </div>

        <button
          class="inline-flex items-center justify-center rounded-lg h-10 w-10 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          @click="nextPeriod"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      <!-- Day View -->
      <div
        v-if="viewMode === 'day'"
        class="space-y-3"
      >
        <div
          v-if="dayViewEvents.length === 0"
          class="text-center py-12 text-gray-500"
        >
          <svg
            class="w-16 h-16 mx-auto mb-3 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p class="text-lg font-medium">
            No events scheduled
          </p>
          <p class="text-sm">
            This day is free
          </p>
        </div>

        <div
          v-else
          class="space-y-3"
        >
          <div
            v-for="event in dayViewEvents"
            :key="event.id"
            class="p-4 rounded-lg border-l-4 cursor-pointer transition-all hover:shadow-md"
            :class="{
              'bg-blue-50 border-blue-500': event.color === 'blue',
              'bg-red-50 border-red-500': event.color === 'red',
              'bg-green-50 border-green-500': event.color === 'green',
              'bg-purple-50 border-purple-500': event.color === 'purple',
              'bg-orange-50 border-orange-500': event.color === 'orange',
            }"
            @click="selectEvent(event)"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <span class="font-semibold text-gray-900">{{ event.title }}</span>
                  <span
                    v-if="event.status"
                    class="px-2 py-0.5 text-xs font-medium rounded-full"
                    :class="event.status === 'complied' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'"
                  >
                    {{ event.status }}
                  </span>
                </div>
                <p class="text-sm text-gray-600 mb-2">
                  {{ event.time }}
                </p>
                <p
                  v-if="event.description"
                  class="text-sm text-gray-700"
                >
                  {{ event.description }}
                </p>
              </div>
              <svg
                class="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Month View -->
      <div v-if="viewMode === 'month'">
        <!-- Weekday Headers -->
        <div class="grid grid-cols-7 mb-2">
          <div
            v-for="day in weekDays"
            :key="day"
            class="text-center text-sm font-medium text-gray-500 py-2"
          >
            {{ day }}
          </div>
        </div>

        <!-- Calendar Grid -->
        <div class="grid grid-cols-7 gap-1">
          <div
            v-for="(day, index) in calendarDays"
            :key="index"
            class="relative flex flex-col items-center justify-start p-2 rounded-lg cursor-pointer transition-all duration-200 min-h-[70px]"
            :class="[
              day.isCurrentMonth ? 'text-gray-900' : 'text-gray-300',
              day.isToday ? 'bg-blue-50 ring-2 ring-blue-500 ring-inset font-bold' : '',
              day.date === selectedDate ? 'bg-blue-600 text-white hover:bg-blue-700' : 'hover:bg-gray-100'
            ]"
            @click="selectDate(day)"
          >
            <!-- Date -->
            <span class="text-sm font-medium mb-1 z-10">
              {{ day.dayNumber }}
            </span>

            <!-- Status Badge -->
            <div
              v-if="day.events.length > 0 && day.isCurrentMonth"
              class="absolute top-1 right-1 w-2 h-2 rounded-full"
              :class="{
                'bg-green-500': getStatusForDate(day.date) === 'complied',
                'bg-orange-500': getStatusForDate(day.date) === 'pending',
              }"
            />

            <!-- Event Dots -->
            <div
              v-if="day.events.length > 0"
              class="flex gap-1 mt-1"
            >
              <span
                v-for="(event, idx) in day.events.slice(0, 3)"
                :key="idx"
                class="w-1.5 h-1.5 rounded-full"
                :class="{
                  'bg-blue-500': event.color === 'blue',
                  'bg-red-500': event.color === 'red',
                  'bg-green-500': event.color === 'green',
                  'bg-purple-500': event.color === 'purple',
                  'bg-orange-500': event.color === 'orange',
                }"
              />
            </div>

            <!-- Event count -->
            <div
              v-if="day.events.length > 0"
              class="mt-1 text-[10px] font-medium"
              :class="day.date === selectedDate ? 'text-white' : 'text-gray-600'"
            >
              {{ day.events.length }}
            </div>
          </div>
        </div>

        <!-- Legend -->
        <div class="mt-4 pt-4 border-t flex items-center justify-center gap-6">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-green-500" />
            <span class="text-xs text-gray-600 font-medium">Complied</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-orange-500" />
            <span class="text-xs text-gray-600 font-medium">Pending</span>
          </div>
        </div>
      </div>

      <!-- Year View -->
      <div
        v-if="viewMode === 'year'"
        class="grid grid-cols-3 gap-4"
      >
        <div
          v-for="(monthName, monthIndex) in monthNames"
          :key="monthIndex"
          class="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors cursor-pointer"
          @click="selectMonth(monthIndex)"
        >
          <h3 class="text-sm font-semibold text-gray-700 mb-2 text-center">
            {{ monthName }}
          </h3>

          <div class="grid grid-cols-7 gap-0.5">
            <div
              v-for="(day, dayIndex) in getMonthDays(currentYear, monthIndex)"
              :key="dayIndex"
              class="aspect-square flex items-center justify-center relative"
            >
              <span
                :class="[
                  'text-[10px]',
                  !day.isCurrentMonth ? 'text-gray-300' : 'text-gray-600',
                  day.isToday ? 'font-bold text-blue-600' : ''
                ]"
              >
                {{ day.dayNumber }}
              </span>

              <span
                v-if="day.events.length > 0 && day.isCurrentMonth"
                class="absolute top-0 right-0 w-1 h-1 rounded-full"
                :class="{
                  'bg-green-400': getStatusForDate(day.date) === 'complied',
                  'bg-orange-400': getStatusForDate(day.date) === 'pending',
                }"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Event Details Panel -->
    <transition
      enter-active-class="transition-all duration-300"
      leave-active-class="transition-all duration-300"
      enter-from-class="opacity-0 translate-x-4"
      leave-to-class="opacity-0 translate-x-4"
    >
      <div
        v-if="showEventPanel && selectedEvent"
        class="w-80 bg-white rounded-xl shadow-lg border border-gray-100 p-6"
      >
        <!-- Panel Header -->
        <div class="flex items-start justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">
            Event Details
          </h3>
          <button
            class="text-gray-400 hover:text-gray-600 transition-colors"
            @click="closeEventPanel"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- Event Content -->
        <div class="space-y-4">
          <!-- Title with Color Indicator -->
          <div class="flex items-start gap-3">
            <span
              class="w-3 h-3 rounded-full mt-1 flex-shrink-0"
              :class="{
                'bg-blue-500': selectedEvent.color === 'blue',
                'bg-red-500': selectedEvent.color === 'red',
                'bg-green-500': selectedEvent.color === 'green',
                'bg-purple-500': selectedEvent.color === 'purple',
                'bg-orange-500': selectedEvent.color === 'orange',
              }"
            />
            <h4 class="text-xl font-semibold text-gray-900">
              {{ selectedEvent.title }}
            </h4>
          </div>

          <!-- Status Badge -->
          <div v-if="selectedEvent.status">
            <span
              class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium"
              :class="selectedEvent.status === 'complied'
                ? 'bg-green-100 text-green-700 ring-1 ring-green-200'
                : 'bg-orange-100 text-orange-700 ring-1 ring-orange-200'"
            >
              <svg
                v-if="selectedEvent.status === 'complied'"
                class="w-4 h-4 mr-1.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
              <svg
                v-else
                class="w-4 h-4 mr-1.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clip-rule="evenodd"
                />
              </svg>
              {{ selectedEvent.status === 'complied' ? 'Complied' : 'Pending' }}
            </span>
          </div>

          <!-- Date & Time -->
          <div class="space-y-2">
            <div class="flex items-center gap-2 text-gray-600">
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span class="text-sm">
                {{ formatEventDate(selectedEvent.date) }}
              </span>
            </div>

            <div class="flex items-center gap-2 text-gray-600">
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span class="text-sm">{{ selectedEvent.time }}</span>
            </div>
          </div>

          <!-- Description -->
          <div
            v-if="selectedEvent.description"
            class="pt-4 border-t"
          >
            <h5 class="text-sm font-semibold text-gray-700 mb-2">
              Description
            </h5>
            <p class="text-sm text-gray-600 leading-relaxed">
              {{ selectedEvent.description }}
            </p>
          </div>

          <!-- Actions (can be customized via slots) -->
          <div class="pt-4 border-t space-y-2">
            <button
              class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>