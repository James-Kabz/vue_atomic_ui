<script setup>
import { ref, computed } from 'vue'
import { cva } from 'class-variance-authority'
import Icon from './Icon.vue'

// Props
const props = defineProps({
  events: {
    type: Array,
    default: () => [
      { id: 1, title: 'Team Meeting', date: '2025-12-05', time: '10:00 AM', color: 'blue' },
      { id: 2, title: 'Project Deadline', date: '2025-12-12', time: '5:00 PM', color: 'red' },
      { id: 3, title: 'Lunch with Client', date: '2025-12-12', time: '12:30 PM', color: 'green' },
      { id: 4, title: 'Code Review', date: '2025-12-18', time: '2:00 PM', color: 'blue' },
      { id: 5, title: 'Sprint Planning', date: '2025-12-20', time: '9:00 AM', color: 'orange' },
      { id: 6, title: 'Workshop', date: '2025-12-20', time: '3:00 PM', color: 'blue' },
    ]
  },
  size: {
    type: String,
    default: 'default'
  }
})

// Emits
const emit = defineEmits(['select-date', 'select-event'])

// CVA Variants
const calendarVariants = cva(
  'bg-white rounded-3xl shadow-2xl overflow-hidden',
  {
    variants: {
      size: {
        sm: 'max-w-xs',
        default: 'max-w-md',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'w-full max-w-6xl'
      }
    },
    defaultVariants: {
      size: 'default'
    }
  }
)

// State
const currentDate = ref(new Date())
const selectedDate = ref(null)
const viewMode = ref('month') // 'month' or 'year'

// Constants
const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December']

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
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  // Previous month days
  const prevMonthLastDay = new Date(year, month, 0).getDate()
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const dayNumber = prevMonthLastDay - i
    const date = formatDate(new Date(year, month - 1, dayNumber))
    days.push({
      dayNumber,
      date,
      isCurrentMonth: false,
      isToday: false,
      events: getEventsForDate(date)
    })
  }
  
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const dateObj = new Date(year, month, i)
    const date = formatDate(dateObj)
    dateObj.setHours(0, 0, 0, 0)
    
    days.push({
      dayNumber: i,
      date,
      isCurrentMonth: true,
      isToday: dateObj.getTime() === today.getTime(),
      events: getEventsForDate(date)
    })
  }
  
  // Next month days
  const remainingDays = 42 - days.length
  for (let i = 1; i <= remainingDays; i++) {
    const date = formatDate(new Date(year, month + 1, i))
    days.push({
      dayNumber: i,
      date,
      isCurrentMonth: false,
      isToday: false,
      events: getEventsForDate(date)
    })
  }
  
  return days
})

// Get calendar days for a specific month (for year view)
const getMonthDays = (year, month) => {
  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  
  const startingDayOfWeek = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()
  
  const days = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  // Previous month days
  const prevMonthLastDay = new Date(year, month, 0).getDate()
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const dayNumber = prevMonthLastDay - i
    const date = formatDate(new Date(year, month - 1, dayNumber))
    days.push({
      dayNumber,
      date,
      isCurrentMonth: false,
      isToday: false,
      events: getEventsForDate(date)
    })
  }
  
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const dateObj = new Date(year, month, i)
    const date = formatDate(dateObj)
    dateObj.setHours(0, 0, 0, 0)
    
    days.push({
      dayNumber: i,
      date,
      isCurrentMonth: true,
      isToday: dateObj.getTime() === today.getTime(),
      events: getEventsForDate(date)
    })
  }
  
  // Next month days
  const remainingDays = 35 - days.length
  for (let i = 1; i <= remainingDays; i++) {
    const date = formatDate(new Date(year, month + 1, i))
    days.push({
      dayNumber: i,
      date,
      isCurrentMonth: false,
      isToday: false,
      events: getEventsForDate(date)
    })
  }
  
  return days.slice(0, 35)
}

const selectedDateEvents = computed(() => {
  if (!selectedDate.value) return []
  return props.events.filter(event => event.date === selectedDate.value)
})

const formatSelectedDate = computed(() => {
  if (!selectedDate.value) return ''
  const date = new Date(selectedDate.value + 'T00:00:00')
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
})

// Methods
function formatDate(date) {
  return date.toISOString().split('T')[0]
}

function getEventsForDate(date) {
  return props.events.filter(event => event.date === date)
}

function previousMonth() {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() - 1,
    1
  )
}

function nextMonth() {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + 1,
    1
  )
}

function previousYear() {
  currentDate.value = new Date(
    currentDate.value.getFullYear() - 1,
    currentDate.value.getMonth(),
    1
  )
}

function nextYear() {
  currentDate.value = new Date(
    currentDate.value.getFullYear() + 1,
    currentDate.value.getMonth(),
    1
  )
}

function selectDate(day) {
  if (!day.isCurrentMonth) return
  selectedDate.value = day.date
  emit('select-date', {
    date: day.date,
    events: day.events
  })
}

function selectEvent(event) {
  emit('select-event', event)
}

function selectMonth(monthIndex) {
  currentDate.value = new Date(currentDate.value.getFullYear(), monthIndex, 1)
  viewMode.value = 'month'
}

function toggleViewMode() {
  viewMode.value = viewMode.value === 'month' ? 'year' : 'month'
}

function goToToday() {
  currentDate.value = new Date()
  selectedDate.value = formatDate(new Date())
  viewMode.value = 'month'
}

function getEventColorForDate(date) {
  const events = getEventsForDate(date)
  if (events.length === 0) return null
  return events[0].color
}

function isCurrentMonthInYear(monthIndex) {
  const now = new Date()
  return monthIndex === now.getMonth() && currentYear.value === now.getFullYear()
}
</script>

<template>
  <div :class="calendarVariants({ size })">
    <!-- Header with gradient -->
    <div class="bg-gradient-to-br from-slate-700 via-slate-600 to-blue-600 px-6 py-5">
      <div class="flex items-center justify-between mb-4">
        <button
          @click="viewMode === 'month' ? previousMonth() : previousYear()"
          class="p-2 hover:bg-white/10 rounded-full transition-all duration-200"
        >
          <Icon icon="chevron-left" class="w-5 h-5 text-white" />
        </button>
        
        <button
          @click="toggleViewMode"
          class="text-white font-semibold text-xl hover:bg-white/10 px-5 py-2 rounded-full transition-all duration-200"
        >
          {{ viewMode === 'month' ? monthYear : currentYear }}
        </button>
        
        <button
          @click="viewMode === 'month' ? nextMonth() : nextYear()"
          class="p-2 hover:bg-white/10 rounded-full transition-all duration-200"
        >
          <Icon icon="chevron-right" class="w-5 h-5 text-white" />
        </button>
      </div>

      <!-- Weekday headers for month view -->
      <div v-if="viewMode === 'month'" class="grid grid-cols-7 gap-2">
        <div
          v-for="day in weekDays"
          :key="day"
          class="text-center text-white/80 text-xs font-semibold uppercase tracking-wider"
        >
          {{ day }}
        </div>
      </div>
    </div>

    <!-- Month View -->
    <div v-if="viewMode === 'month'" class="p-5">
      <div class="grid grid-cols-7 gap-2">
        <button
          v-for="(day, index) in calendarDays"
          :key="index"
          @click="selectDate(day)"
          :disabled="!day.isCurrentMonth"
          class="relative aspect-square rounded-xl flex items-center justify-center text-sm font-medium transition-all duration-200"
          :class="{
            'text-gray-300 cursor-not-allowed': !day.isCurrentMonth,
            'text-gray-800 hover:bg-gray-100 hover:scale-105': day.isCurrentMonth && !day.isToday && day.date !== selectedDate,
            'bg-blue-50 text-blue-700 ring-2 ring-blue-500 ring-inset font-bold': day.isToday && day.date !== selectedDate,
            'bg-gradient-to-br from-slate-600 to-blue-600 text-white shadow-lg scale-105 ring-2 ring-blue-400': day.date === selectedDate,
            'cursor-pointer': day.isCurrentMonth
          }"
        >
          <span class="z-10">{{ day.dayNumber }}</span>
          
          <!-- Event indicator dot -->
          <span
            v-if="day.events.length > 0 && day.isCurrentMonth"
            class="absolute bottom-1 w-1 h-1 rounded-full z-10"
            :class="{
              'bg-blue-500': getEventColorForDate(day.date) === 'blue' && day.date !== selectedDate,
              'bg-red-500': getEventColorForDate(day.date) === 'red' && day.date !== selectedDate,
              'bg-green-500': getEventColorForDate(day.date) === 'green' && day.date !== selectedDate,
              'bg-purple-500': getEventColorForDate(day.date) === 'purple' && day.date !== selectedDate,
              'bg-orange-500': getEventColorForDate(day.date) === 'orange' && day.date !== selectedDate,
              'bg-white': day.date === selectedDate
            }"
          />
        </button>
      </div>

      <!-- Today button -->
      <button
        @click="goToToday"
        class="w-full mt-6 py-3 bg-gradient-to-r from-slate-600 to-blue-600 text-white rounded-2xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
      >
        <Icon icon="calendar" class="w-4 h-4" />
        Today
      </button>

      <!-- Selected Date Events -->
      <div
        v-if="selectedDateEvents.length > 0"
        class="mt-6 border-t border-gray-200 pt-6"
      >
        <h3 class="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
          {{ formatSelectedDate }}
        </h3>
        <div class="space-y-2">
          <button
            v-for="event in selectedDateEvents"
            :key="event.id"
            @click="selectEvent(event)"
            class="w-full text-left p-4 rounded-xl border-2 transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
            :class="{
              'bg-blue-50 border-blue-200 hover:border-blue-300': event.color === 'blue',
              'bg-red-50 border-red-200 hover:border-red-300': event.color === 'red',
              'bg-green-50 border-green-200 hover:border-green-300': event.color === 'green',
              'bg-purple-50 border-purple-200 hover:border-purple-300': event.color === 'purple',
              'bg-orange-50 border-orange-200 hover:border-orange-300': event.color === 'orange',
            }"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-3 h-3 rounded-full flex-shrink-0"
                :class="{
                  'bg-blue-500': event.color === 'blue',
                  'bg-red-500': event.color === 'red',
                  'bg-green-500': event.color === 'green',
                  'bg-purple-500': event.color === 'purple',
                  'bg-orange-500': event.color === 'orange',
                }"
              />
              <div class="flex-1">
                <p class="font-semibold text-gray-900">{{ event.title }}</p>
                <p v-if="event.time" class="text-xs text-gray-600 mt-1">{{ event.time }}</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Year View -->
    <div v-else class="p-6">
      <div class="grid grid-cols-3 gap-6">
        <button
          v-for="(monthName, monthIndex) in monthNames"
          :key="monthIndex"
          @click="selectMonth(monthIndex)"
          class="p-4 rounded-2xl transition-all duration-200 hover:shadow-lg hover:scale-105"
          :class="{
            'bg-blue-50 ring-2 ring-blue-500': isCurrentMonthInYear(monthIndex),
            'bg-gray-50 hover:bg-gray-100': !isCurrentMonthInYear(monthIndex)
          }"
        >
          <h3 
            class="font-bold text-sm mb-3 text-center"
            :class="{
              'text-blue-700': isCurrentMonthInYear(monthIndex),
              'text-gray-700': !isCurrentMonthInYear(monthIndex)
            }"
          >
            {{ monthName }}
          </h3>
          
          <!-- Mini calendar grid -->
          <div class="grid grid-cols-7 gap-1">
            <div
              v-for="(day, dayIndex) in getMonthDays(currentYear, monthIndex)"
              :key="dayIndex"
              class="aspect-square flex items-center justify-center relative text-[10px] rounded-md"
              :class="{
                'text-gray-300': !day.isCurrentMonth,
                'text-gray-600': day.isCurrentMonth && !day.isToday,
                'bg-gradient-to-br from-slate-600 to-blue-600 text-white font-bold': day.isToday
              }"
            >
              {{ day.dayNumber }}
              
              <!-- Mini event dot -->
              <span
                v-if="day.events.length > 0 && day.isCurrentMonth && !day.isToday"
                class="absolute bottom-0 w-0.5 h-0.5 rounded-full"
                :class="{
                  'bg-blue-400': getEventColorForDate(day.date) === 'blue',
                  'bg-red-400': getEventColorForDate(day.date) === 'red',
                  'bg-green-400': getEventColorForDate(day.date) === 'green',
                  'bg-purple-400': getEventColorForDate(day.date) === 'purple',
                  'bg-orange-400': getEventColorForDate(day.date) === 'orange',
                }"
              />
            </div>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>