<script setup>
import { ref, computed } from 'vue'
import { cva } from 'class-variance-authority'
import Icon from './Icon.vue'

// Props
const props = defineProps({
  events: {
    type: Array,
    default: () => [
      { id: 1, title: 'Team Meeting', date: '2025-06-05', time: '10:00 AM', color: 'blue' },
      { id: 2, title: 'Project Deadline', date: '2025-06-12', time: '5:00 PM', color: 'red' },
      { id: 3, title: 'Lunch with Client', date: '2025-06-12', time: '12:30 PM', color: 'green' },
      { id: 4, title: 'Code Review', date: '2025-06-18', time: '2:00 PM', color: 'purple' },
      { id: 5, title: 'Sprint Planning', date: '2025-06-20', time: '9:00 AM', color: 'orange' },
      { id: 6, title: 'Workshop', date: '2025-06-20', time: '3:00 PM', color: 'blue' },
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
  'bg-white rounded-xl shadow-lg border border-gray-100',
  {
    variants: {
      size: {
        sm: 'p-3 max-w-xs',
        default: 'p-5 max-w-md',
        lg: 'p-6 max-w-lg'
      }
    },
    defaultVariants: {
      size: 'default'
    }
  }
)

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-300',
        outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-300'
      },
      size: {
        sm: 'h-8 w-8',
        default: 'h-10 w-10',
        lg: 'h-12 w-12'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

const dayVariants = cva(
  'relative flex flex-col items-center justify-start p-2 min-h-[52px] rounded-lg cursor-pointer transition-all duration-200',
  {
    variants: {
      isCurrentMonth: {
        true: 'text-gray-900',
        false: 'text-gray-300'
      },
      isToday: {
        true: 'bg-blue-50 ring-2 ring-blue-500 ring-inset font-bold',
        false: ''
      },
      isSelected: {
        true: 'bg-blue-600 text-white hover:bg-blue-700',
        false: 'hover:bg-gray-100'
      },
      hasEvents: {
        true: '',
        false: ''
      }
    },
    compoundVariants: [
      {
        isSelected: true,
        isToday: true,
        class: 'ring-white'
      }
    ],
    defaultVariants: {
      isCurrentMonth: true,
      isToday: false,
      isSelected: false,
      hasEvents: false
    }
  }
)

const eventDotVariants = cva(
  'rounded-full',
  {
    variants: {
      color: {
        blue: 'bg-blue-500',
        red: 'bg-red-500',
        green: 'bg-green-500',
        purple: 'bg-purple-500',
        orange: 'bg-orange-500',
        pink: 'bg-pink-500',
        yellow: 'bg-yellow-500',
        gray: 'bg-gray-500'
      },
      size: {
        sm: 'w-1.5 h-1.5',
        default: 'w-2 h-2',
        lg: 'w-2.5 h-2.5'
      }
    },
    defaultVariants: {
      color: 'blue',
      size: 'default'
    }
  }
)

const eventCardVariants = cva(
  'p-3 rounded-lg border transition-colors cursor-pointer',
  {
    variants: {
      color: {
        blue: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
        red: 'bg-red-50 border-red-200 hover:bg-red-100',
        green: 'bg-green-50 border-green-200 hover:bg-green-100',
        purple: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
        orange: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
        pink: 'bg-pink-50 border-pink-200 hover:bg-pink-100',
        yellow: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
        gray: 'bg-gray-50 border-gray-200 hover:bg-gray-100'
      }
    },
    defaultVariants: {
      color: 'blue'
    }
  }
)

// State
const currentDate = ref(new Date())
const selectedDate = ref(null)

// Constants
const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

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
    day: 'numeric'
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

function selectDate(day) {
  selectedDate.value = day.date
  emit('select-date', {
    date: day.date,
    events: day.events
  })
}
</script>

<template>
  <div :class="calendarVariants({ size })">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <button
        :class="buttonVariants({ variant: 'ghost' })"
        @click="previousMonth"
      >
        <Icon
          icon="chevron-left"
          class="w-5 h-5"
        />
      </button>
      <h2 class="text-lg font-semibold text-gray-900">
        {{ monthYear }}
      </h2>
      <button
        :class="buttonVariants({ variant: 'ghost' })"
        @click="nextMonth"
      >
        <Icon
          icon="chevron-right"
          class="w-5 h-5"
        />
      </button>
    </div>

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
        :class="dayVariants({ 
          isCurrentMonth: day.isCurrentMonth, 
          isToday: day.isToday,
          isSelected: day.date === selectedDate,
          hasEvents: day.events.length > 0
        })"
        @click="selectDate(day)"
      >
        <span class="text-sm">{{ day.dayNumber }}</span>
        
        <!-- Event Indicators -->
        <div
          v-if="day.events.length > 0"
          class="flex gap-0.5 mt-1 justify-center flex-wrap"
        >
          <span
            v-for="(event, eventIndex) in day.events.slice(0, 3)"
            :key="eventIndex"
            :class="eventDotVariants({ color: event.color })"
          />
          <span
            v-if="day.events.length > 3"
            class="text-xs text-gray-400"
          >
            +{{ day.events.length - 3 }}
          </span>
        </div>
      </div>
    </div>

    <!-- Selected Date Events -->
    <div
      v-if="selectedDateEvents.length > 0"
      class="mt-4 border-t pt-4"
    >
      <h3 class="text-sm font-semibold text-gray-700 mb-2">
        Events for {{ formatSelectedDate }}
      </h3>
      <div class="space-y-2">
        <div
          v-for="event in selectedDateEvents"
          :key="event.id"
          :class="eventCardVariants({ color: event.color })"
        >
          <div class="flex items-center gap-2">
            <span :class="eventDotVariants({ color: event.color, size: 'lg' })" />
            <span class="font-medium">{{ event.title }}</span>
          </div>
          <p
            v-if="event.time"
            class="text-xs text-gray-500 mt-1 ml-5"
          >
            {{ event.time }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
