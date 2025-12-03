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
const viewMode = ref('month') // 'month', 'week', 'day'
const selectedEvent = ref(null)

// Constants
const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// Helper Functions
function formatDateToISO(date) {
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
  if (!dateString) return null
  
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    const [year, month, day] = dateString.split('-').map(Number)
    return new Date(year, month - 1, day)
  }
  
  return new Date(dateString)
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

// Methods
function getEventsForDate(date) {
  return props.events.filter(event => event.date === date)
}

function previousPeriod() {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() - 1,
    1
  )
}

function nextPeriod() {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + 1,
    1
  )
}

function goToToday() {
  currentDate.value = new Date()
  selectedDate.value = getTodayISO()
}

function selectEvent(event, day) {
  selectedEvent.value = event
  selectedDate.value = day.date
  emit('select-event', event)
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

function getEventColorClass(color) {
  const colorMap = {
    blue: 'bg-blue-500 border-blue-600',
    red: 'bg-red-500 border-red-600',
    green: 'bg-green-500 border-green-600',
    purple: 'bg-purple-500 border-purple-600',
    orange: 'bg-orange-500 border-orange-600',
  }
  return colorMap[color] || 'bg-gray-500 border-gray-600'
}
</script>

<template>
  <div class="flex gap-0 h-full bg-white rounded-lg shadow-sm border border-gray-200">
    <!-- Calendar Container -->
    <div class="flex-1 flex flex-col">
      <!-- Toolbar -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div class="flex items-center gap-3">
          <button
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            @click="goToToday"
          >
            Today
          </button>
          
          <div class="flex items-center gap-1">
            <button
              class="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
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
            <button
              class="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
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

          <h2 class="text-xl font-semibold text-gray-900 ml-2">
            {{ monthYear }}
          </h2>
        </div>

        <div class="flex items-center gap-2">
          <button
            class="px-3 py-2 text-sm font-medium rounded transition-colors"
            :class="viewMode === 'month' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'"
            @click="viewMode = 'month'"
          >
            Month
          </button>
          <button
            class="px-3 py-2 text-sm font-medium rounded transition-colors"
            :class="viewMode === 'week' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'"
            @click="viewMode = 'week'"
          >
            Week
          </button>
          <button
            class="px-3 py-2 text-sm font-medium rounded transition-colors"
            :class="viewMode === 'day' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'"
            @click="viewMode = 'day'"
          >
            Day
          </button>
        </div>
      </div>

      <!-- Calendar Grid -->
      <div class="flex-1 flex flex-col p-4">
        <!-- Weekday Headers -->
        <div class="grid grid-cols-7 border-b border-gray-200">
          <div
            v-for="day in weekDays"
            :key="day"
            class="text-center text-xs font-semibold text-gray-600 py-3 uppercase tracking-wider"
          >
            {{ day }}
          </div>
        </div>

        <!-- Days Grid -->
        <div class="grid grid-cols-7 flex-1 border-l border-t border-gray-200">
          <div
            v-for="(day, index) in calendarDays"
            :key="index"
            class="border-r border-b border-gray-200 p-1 min-h-[120px] relative"
            :class="[
              !day.isCurrentMonth ? 'bg-gray-50' : 'bg-white',
              day.isToday ? 'bg-blue-50' : ''
            ]"
          >
            <!-- Date Number -->
            <div class="flex items-center justify-between mb-1 px-1">
              <span
                class="text-sm font-medium"
                :class="[
                  day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400',
                  day.isToday ? 'bg-blue-600 text-white w-6 h-6 flex items-center justify-center rounded-full text-xs' : ''
                ]"
              >
                {{ day.dayNumber }}
              </span>
            </div>

            <!-- Events List -->
            <div class="space-y-1">
              <div
                v-for="(event, eventIndex) in day.events.slice(0, 3)"
                :key="eventIndex"
                class="text-xs px-2 py-1 rounded cursor-pointer truncate border-l-2 text-white font-medium hover:opacity-90 transition-opacity"
                :class="getEventColorClass(event.color)"
                @click="selectEvent(event, day)"
              >
                {{ event.title }}
              </div>
              
              <div
                v-if="day.events.length > 3"
                class="text-xs px-2 py-1 text-gray-600 font-medium cursor-pointer hover:text-gray-900"
              >
                +{{ day.events.length - 3 }} more
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Event Details Sidebar -->
    <transition
      enter-active-class="transition-all duration-200"
      leave-active-class="transition-all duration-200"
      enter-from-class="opacity-0 translate-x-4"
      leave-to-class="opacity-0 translate-x-4"
    >
      <div
        v-if="selectedEvent"
        class="w-80 border-l border-gray-200 bg-white flex flex-col"
      >
        <!-- Sidebar Header -->
        <div class="px-6 py-4 border-b border-gray-200 flex items-start justify-between">
          <h3 class="text-lg font-semibold text-gray-900">
            Event Details
          </h3>
          <button
            class="text-gray-400 hover:text-gray-600 transition-colors"
            @click="selectedEvent = null"
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
        <div class="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          <!-- Color Bar -->
          <div
            class="h-1 w-full rounded-full"
            :class="getEventColorClass(selectedEvent.color)"
          />

          <!-- Title -->
          <div>
            <h4 class="text-xl font-bold text-gray-900">
              {{ selectedEvent.title }}
            </h4>
          </div>

          <!-- Status Badge -->
          <div v-if="selectedEvent.status">
            <span
              class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium"
              :class="selectedEvent.status === 'complied'
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-orange-100 text-orange-800 border border-orange-200'"
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
          <div class="space-y-3 pt-2">
            <div class="flex items-start gap-3">
              <svg
                class="w-5 h-5 text-gray-400 mt-0.5"
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
              <div>
                <p class="text-sm font-medium text-gray-900">
                  {{ formatEventDate(selectedEvent.date) }}
                </p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <svg
                class="w-5 h-5 text-gray-400 mt-0.5"
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
              <p class="text-sm text-gray-600">
                {{ selectedEvent.time }}
              </p>
            </div>
          </div>

          <!-- Description -->
          <div
            v-if="selectedEvent.description"
            class="pt-4 border-t border-gray-200"
          >
            <h5 class="text-sm font-semibold text-gray-900 mb-2">
              Description
            </h5>
            <p class="text-sm text-gray-600 leading-relaxed">
              {{ selectedEvent.description }}
            </p>
          </div>

          <!-- Additional Details from Compliance -->
          <div
            v-if="selectedEvent.compliance"
            class="pt-4 border-t border-gray-200 space-y-3"
          >
            <h5 class="text-sm font-semibold text-gray-900 mb-2">
              Compliance Details
            </h5>
            
            <div
              v-if="selectedEvent.compliance.remarks"
              class="text-sm"
            >
              <span class="font-medium text-gray-700">Remarks:</span>
              <p class="text-gray-600 mt-1">
                {{ selectedEvent.compliance.remarks }}
              </p>
            </div>
            
            <div
              v-if="selectedEvent.compliance.compliance_documents?.length"
              class="text-sm"
            >
              <span class="font-medium text-gray-700">Documents:</span>
              <p class="text-gray-600 mt-1">
                {{ selectedEvent.compliance.compliance_documents.length }} document(s) attached
              </p>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="px-6 py-4 border-t border-gray-200 space-y-2">
          <button
            class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
          >
            View Full Details
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
/* Ensure consistent border spacing */
.grid > div {
  position: relative;
}

/* Smooth transitions */
* {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>