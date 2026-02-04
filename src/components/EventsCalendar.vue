<script>
import {
  formatDateToISO,
  getTodayISO,
  getMonthCalendarDays,
  getWeekDays,
  getWeekBounds,
  formatEventDate,
  getTimeSlots,
  isSameDay,
  getMonthName,
  getYear
} from '../helpers/calendarHelper.js'

export default {
  name: 'EventsCalendar',
  props: {
    events: {
      type: Array,
      default: () => []
    },
    size: {
      type: String,
      default: 'default'
    }
  },
  emits: ['select-date', 'select-event'],
  data() {
    return {
      currentDate: new Date(),
      selectedDate: null,
      viewMode: 'month',
      selectedEvent: null,
      weekDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      weekDaysShort: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
      timeSlots: getTimeSlots(0, 23, 60),
      monthNames: ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December']
    }
  },
  computed: {
    displayTitle() {
      if (this.viewMode === 'year') {
        return getYear(this.currentDate)
      } else if (this.viewMode === 'day') {
        return formatEventDate(this.currentDate, 'full')
      } else if (this.viewMode === 'week') {
        const { startDate, endDate } = getWeekBounds(this.currentDate)
        const startMonth = getMonthName(startDate, 'short')
        const endMonth = getMonthName(endDate, 'short')
        const year = getYear(this.currentDate)

        if (startDate.getMonth() === endDate.getMonth()) {
          return `${startMonth} ${startDate.getDate()} - ${endDate.getDate()}, ${year}`
        } else {
          return `${startMonth} ${startDate.getDate()} - ${endMonth} ${endDate.getDate()}, ${year}`
        }
      } else {
        return `${getMonthName(this.currentDate)} ${getYear(this.currentDate)}`
      }
    },
    calendarDays() {
      const days = getMonthCalendarDays(this.currentDate)
      return days.map(day => ({
        ...day,
        events: this.getEventsForDate(day.date)
      }))
    },
    weekViewDays() {
      const days = getWeekDays(this.currentDate)
      return days.map(dateObj => {
        const date = formatDateToISO(dateObj)
        return {
          dateObj,
          date,
          dayNumber: dateObj.getDate(),
          dayName: this.weekDays[dateObj.getDay()],
          isToday: isSameDay(dateObj, getTodayISO()),
          events: this.getEventsForDate(date)
        }
      })
    },
    dayViewDate() {
      const date = formatDateToISO(this.currentDate)
      return {
        dateObj: this.currentDate,
        date,
        dayNumber: this.currentDate.getDate(),
        dayName: this.weekDays[this.currentDate.getDay()],
        isToday: isSameDay(this.currentDate, getTodayISO()),
        events: this.getEventsForDate(date)
      }
    },
    yearViewMonths() {
      const year = this.currentDate.getFullYear()
      return this.monthNames.map((monthName, index) => {
        const monthDate = new Date(year, index, 1)
        const days = getMonthCalendarDays(monthDate)
        return {
          name: monthName,
          index,
          days: days.map(day => ({
            ...day,
            events: this.getEventsForDate(day.date)
          }))
        }
      })
    }
  },
  methods: {
    formatEventDate,
    getEventsForDate(date) {
      return this.events.filter(event => event.date === date)
    },
    previousPeriod() {
      if (this.viewMode === 'year') {
        this.currentDate = new Date(
          this.currentDate.getFullYear() - 1,
          0,
          1
        )
      } else if (this.viewMode === 'day') {
        this.currentDate = new Date(
          this.currentDate.getFullYear(),
          this.currentDate.getMonth(),
          this.currentDate.getDate() - 1
        )
      } else if (this.viewMode === 'week') {
        this.currentDate = new Date(
          this.currentDate.getFullYear(),
          this.currentDate.getMonth(),
          this.currentDate.getDate() - 7
        )
      } else {
        this.currentDate = new Date(
          this.currentDate.getFullYear(),
          this.currentDate.getMonth() - 1,
          1
        )
      }
    },
    nextPeriod() {
      if (this.viewMode === 'year') {
        this.currentDate = new Date(
          this.currentDate.getFullYear() + 1,
          0,
          1
        )
      } else if (this.viewMode === 'day') {
        this.currentDate = new Date(
          this.currentDate.getFullYear(),
          this.currentDate.getMonth(),
          this.currentDate.getDate() + 1
        )
      } else if (this.viewMode === 'week') {
        this.currentDate = new Date(
          this.currentDate.getFullYear(),
          this.currentDate.getMonth(),
          this.currentDate.getDate() + 7
        )
      } else {
        this.currentDate = new Date(
          this.currentDate.getFullYear(),
          this.currentDate.getMonth() + 1,
          1
        )
      }
    },
    goToToday() {
      this.currentDate = new Date()
      this.selectedDate = getTodayISO()
      this.$emit('select-date', { date: this.selectedDate, events: this.getEventsForDate(this.selectedDate) })
    },
    selectDay(day) {
      this.selectedDate = day.date

      const [year, month, dayNum] = day.date.split('-').map(Number)
      this.currentDate = new Date(year, month - 1, dayNum)

      this.$emit('select-date', { date: day.date, events: day.events })
    },
    selectEvent(event, day) {
      this.selectedEvent = event
      this.selectedDate = day.date

      const [year, month, dayNum] = day.date.split('-').map(Number)
      this.currentDate = new Date(year, month - 1, dayNum)

      this.viewMode = 'month'

      this.$emit('select-event', event)
    },
    getEventColorClass(color) {
      const colorMap = {
        blue: 'bg-(--ui-primary) border-(--ui-primary)',
        red: 'bg-(--ui-danger) border-(--ui-danger)',
        green: 'bg-(--ui-success) border-(--ui-success)',
        purple: 'bg-(--ui-accent) border-(--ui-accent)',
        orange: 'bg-(--ui-warning) border-(--ui-warning)',
      }
      return colorMap[color] || 'bg-(--ui-surface-soft) border-(--ui-border-strong)'
    },
    getEventsAtTime(events, timeSlot) {
      const eventsWithTime = events.filter(event => {
        if (!event.time) return false
        if (!/^\d{1,2}:\d{2}/.test(event.time)) return false
        const eventTime = event.time.split(':')[0].padStart(2, '0')
        return timeSlot.time.startsWith(eventTime)
      })

      return eventsWithTime
    },
    getAllDayEvents(events) {
      return events.filter(event => {
        if (!event.time) return true
        return !/^\d{1,2}:\d{2}/.test(event.time)
      })
    },
    selectMonthFromYear(monthIndex) {
      this.currentDate = new Date(this.currentDate.getFullYear(), monthIndex, 1)
      this.viewMode = 'month'
    }
  }
}
</script>

<template>
  <div class="flex gap-0 h-full bg-(--ui-surface) rounded-lg shadow-sm border border-(--ui-border)">
    <!-- Calendar Container -->
    <div class="flex-1 flex flex-col">
      <!-- Toolbar -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-(--ui-border)">
        <div class="flex items-center gap-3">
          <button
            class="px-4 py-2 text-sm font-medium text-(--ui-text-muted) bg-(--ui-surface) border border-(--ui-border) rounded hover:bg-(--ui-surface-muted) transition-colors"
            @click="goToToday"
          >
            Today
          </button>

          <div class="flex items-center gap-1">
            <button
              class="p-2 text-(--ui-text-muted) hover:bg-(--ui-surface-muted) rounded transition-colors"
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
              class="p-2 text-(--ui-text-muted) hover:bg-(--ui-surface-muted) rounded transition-colors"
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

          <h2 class="text-xl font-semibold text-(--ui-text) ml-2">
            {{ displayTitle }}
          </h2>
        </div>

        <div class="flex items-center gap-2">
          <button
            class="px-3 py-2 text-sm font-medium rounded transition-colors"
            :class="viewMode === 'year' ? 'bg-(--ui-primary-soft) text-(--ui-primary)' : 'text-(--ui-text-muted) hover:bg-(--ui-surface-muted)'"
            @click="viewMode = 'year'"
          >
            Year
          </button>
          <button
            class="px-3 py-2 text-sm font-medium rounded transition-colors"
            :class="viewMode === 'month' ? 'bg-(--ui-primary-soft) text-(--ui-primary)' : 'text-(--ui-text-muted) hover:bg-(--ui-surface-muted)'"
            @click="viewMode = 'month'"
          >
            Month
          </button>
          <button
            class="px-3 py-2 text-sm font-medium rounded transition-colors"
            :class="viewMode === 'week' ? 'bg-(--ui-primary-soft) text-(--ui-primary)' : 'text-(--ui-text-muted) hover:bg-(--ui-surface-muted)'"
            @click="viewMode = 'week'"
          >
            Week
          </button>
          <button
            class="px-3 py-2 text-sm font-medium rounded transition-colors"
            :class="viewMode === 'day' ? 'bg-(--ui-primary-soft) text-(--ui-primary)' : 'text-(--ui-text-muted) hover:bg-(--ui-surface-muted)'"
            @click="viewMode = 'day'"
          >
            Day
          </button>
        </div>
      </div>

      <!-- Calendar Grid -->
      <div class="flex-1 flex flex-col p-4">
        <!-- Year View -->
        <div
          v-if="viewMode === 'year'"
          class="flex-1 overflow-y-auto"
        >
          <div class="grid grid-cols-3 gap-6 pb-6">
            <div
              v-for="month in yearViewMonths"
              :key="month.index"
              class="bg-(--ui-surface) rounded-lg border border-(--ui-border) overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              @click="selectMonthFromYear(month.index)"
            >
              <!-- Month Header -->
              <div class="bg-linear-to-r from-(--ui-primary) to-(--ui-primary) px-3 py-3">
                <h3 class="text-sm font-bold text-(--ui-text-inverse) text-center">
                  {{ month.name }}
                </h3>
              </div>

              <!-- Mini Calendar -->
              <div class="p-3">
                <!-- Weekday Headers -->
                <div class="grid grid-cols-7 mb-2">
                  <div
                    v-for="day in weekDaysShort"
                    :key="day"
                    class="text-center text-[10px] font-bold text-(--ui-text-muted)"
                  >
                    {{ day }}
                  </div>
                </div>

                <!-- Days Grid -->
                <div class="grid grid-cols-7 gap-1">
                  <div
                    v-for="(day, index) in month.days"
                    :key="index"
                    class="aspect-square flex items-center justify-center text-xs rounded-md relative transition-all hover:scale-110"
                    :class="[
                      // Base styles
                      !day.isCurrentMonth ? 'text-(--ui-text-soft)' : 'text-(--ui-text)',

                      // Today styling
                      day.isToday ? 'bg-(--ui-primary) text-(--ui-text-inverse) font-extrabold shadow-md ring-2 ring-(--ui-primary)' : '',

                      // Event styling - highly visible
                      day.events.length > 0 && !day.isToday && day.isCurrentMonth ? 'bg-(--ui-danger-soft) text-(--ui-danger) font-bold border-2 border-(--ui-danger-soft) shadow-sm' : '',

                      // Regular styling
                      day.events.length === 0 && !day.isToday && day.isCurrentMonth ? 'hover:bg-(--ui-surface-muted)' : ''
                    ]"
                  >
                    {{ day.dayNumber }}

                    <!-- Event count badge for multiple events -->
                    <div
                      v-if="day.events.length > 1 && day.isCurrentMonth"
                      class="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black shadow-md"
                      :class="day.isToday ? 'bg-(--ui-warning-soft) text-(--ui-primary)' : 'bg-(--ui-danger) text-(--ui-text-inverse)'"
                    >
                      {{ day.events.length }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Month View -->
        <div
          v-if="viewMode === 'month'"
          class="flex-1 flex flex-col"
        >
          <!-- Weekday Headers -->
          <div class="grid grid-cols-7 border-b border-(--ui-border)">
            <div
              v-for="day in weekDays"
              :key="day"
              class="text-center text-xs font-semibold text-(--ui-text-muted) py-3 uppercase tracking-wider"
            >
              {{ day }}
            </div>
          </div>

          <!-- Days Grid -->
          <div class="grid grid-cols-7 flex-1 border-l border-t border-(--ui-border)">
            <div
              v-for="(day, index) in calendarDays"
              :key="index"
              class="border-r border-b border-(--ui-border) p-1 min-h-[120px] relative cursor-pointer hover:bg-(--ui-surface-muted) transition-colors"
              :class="[
                !day.isCurrentMonth ? 'bg-(--ui-surface-muted)' : 'bg-(--ui-surface)',
                day.isToday ? 'bg-(--ui-primary-soft)' : '',
                selectedDate === day.date ? 'ring-2 ring-(--ui-primary) ring-inset' : ''
              ]"
              @click="selectDay(day)"
            >
              <!-- Date Number -->
              <div class="flex items-center justify-between mb-1 px-1">
                <span
                  class="text-sm font-medium"
                  :class="[
                    day.isCurrentMonth ? 'text-(--ui-text)' : 'text-(--ui-text-soft)',
                    day.isToday ? 'bg-(--ui-primary) text-(--ui-text-inverse) w-6 h-6 flex items-center justify-center rounded-full text-xs' : ''
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
                  class="text-xs px-2 py-1 rounded cursor-pointer truncate border-l-2 text-(--ui-text-inverse) font-medium hover:opacity-90 transition-opacity"
                  :class="getEventColorClass(event.color)"
                  @click.stop="selectEvent(event, day)"
                >
                  {{ event.title }}
                </div>

                <div
                  v-if="day.events.length > 3"
                  class="text-xs px-2 py-1 text-(--ui-text-muted) font-medium cursor-pointer hover:text-(--ui-text)"
                >
                  +{{ day.events.length - 3 }} more
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Week View -->
        <div
          v-else-if="viewMode === 'week'"
          class="flex-1 flex flex-col overflow-hidden"
        >
          <!-- Day Headers -->
          <div class="grid grid-cols-8 border-b border-(--ui-border) bg-(--ui-surface-muted)">
            <div class="border-r border-(--ui-border) p-2" />
            <div
              v-for="day in weekViewDays"
              :key="day.date"
              class="text-center p-2 border-r border-(--ui-border)"
              :class="day.isToday ? 'bg-(--ui-primary-soft)' : ''"
            >
              <div class="text-xs font-semibold text-(--ui-text-muted) uppercase">
                {{ day.dayName }}
              </div>
              <div
                class="text-lg font-bold mt-1"
                :class="[
                  day.isToday ? 'bg-(--ui-primary) text-(--ui-text-inverse) w-8 h-8 flex items-center justify-center rounded-full mx-auto' : 'text-(--ui-text)'
                ]"
              >
                {{ day.dayNumber }}
              </div>
            </div>
          </div>

          <!-- All-Day Events Row -->
          <div class="grid grid-cols-8 border-b border-(--ui-border) bg-(--ui-surface-muted) min-h-[60px]">
            <div
              class="border-r border-(--ui-border) px-2 py-1 text-xs text-(--ui-text-muted) text-right flex items-center justify-end"
            >
              All Day
            </div>
            <div
              v-for="day in weekViewDays"
              :key="'allday-' + day.date"
              class="border-r border-(--ui-border) p-1 space-y-1"
              :class="day.isToday ? 'bg-(--ui-primary-soft)' : ''"
            >
              <div
                v-for="event in getAllDayEvents(day.events)"
                :key="event.id"
                class="rounded border-l-2 p-1 text-xs font-medium text-(--ui-text-inverse) cursor-pointer hover:opacity-90 transition-opacity"
                :class="getEventColorClass(event.color)"
                @click="selectEvent(event, day)"
              >
                <div class="font-semibold truncate">
                  {{ event.title }}
                </div>
              </div>
            </div>
          </div>

          <!-- Time Grid -->
          <div class="flex-1 overflow-y-auto">
            <div class="grid grid-cols-8">
              <!-- Time Column -->
              <div class="border-r border-(--ui-border) bg-(--ui-surface-muted)">
                <div
                  v-for="slot in timeSlots"
                  :key="slot.time"
                  class="h-16 border-b border-(--ui-border) px-2 py-1 text-xs text-(--ui-text-muted) text-right"
                >
                  {{ slot.display }}
                </div>
              </div>

              <!-- Day Columns -->
              <div
                v-for="day in weekViewDays"
                :key="day.date"
                class="border-r border-(--ui-border) relative"
              >
                <div
                  v-for="slot in timeSlots"
                  :key="slot.time"
                  class="h-16 border-b border-(--ui-border) hover:bg-(--ui-surface-muted) transition-colors cursor-pointer relative"
                  :class="day.isToday ? 'bg-(--ui-primary-soft)' : ''"
                >
                  <!-- Events at this time -->
                  <div
                    v-for="event in getEventsAtTime(day.events, slot)"
                    :key="event.id"
                    class="absolute inset-x-1 top-1 bottom-1 rounded border-l-2 p-1 text-xs font-medium text-(--ui-text-inverse) cursor-pointer hover:opacity-90 transition-opacity overflow-hidden"
                    :class="getEventColorClass(event.color)"
                    @click="selectEvent(event, day)"
                  >
                    <div class="font-semibold truncate">
                      {{ event.title }}
                    </div>
                    <div class="text-xs opacity-90 truncate">
                      {{ event.time }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Day View -->
        <div
          v-else-if="viewMode === 'day'"
          class="flex-1 flex flex-col overflow-hidden"
        >
          <!-- Day Header -->
          <div class="border-b border-(--ui-border) bg-(--ui-surface-muted) p-4">
            <div class="text-center">
              <div class="text-sm font-semibold text-(--ui-text-muted) uppercase">
                {{ dayViewDate.dayName }}
              </div>
              <div
                class="text-3xl font-bold mt-2"
                :class="[
                  dayViewDate.isToday ? 'text-(--ui-primary)' : 'text-(--ui-text)'
                ]"
              >
                {{ dayViewDate.dayNumber }}
              </div>
            </div>
          </div>

          <!-- All-Day Events Section -->
          <div
            v-if="getAllDayEvents(dayViewDate.events).length > 0"
            class="border-b border-(--ui-border) bg-(--ui-surface-muted) p-4"
          >
            <h4 class="text-xs font-semibold text-(--ui-text-muted) uppercase tracking-wide mb-2">
              All Day Events
            </h4>
            <div class="space-y-2">
              <div
                v-for="event in getAllDayEvents(dayViewDate.events)"
                :key="event.id"
                class="rounded border-l-4 p-3 text-sm font-medium text-(--ui-text-inverse) cursor-pointer hover:opacity-90 transition-opacity shadow-sm"
                :class="getEventColorClass(event.color)"
                @click="selectEvent(event, dayViewDate)"
              >
                <div class="font-semibold">
                  {{ event.title }}
                </div>
                <div
                  v-if="event.description"
                  class="text-xs opacity-80 mt-1"
                >
                  {{ event.description }}
                </div>
              </div>
            </div>
          </div>

          <!-- Time Grid -->
          <div class="flex-1 overflow-y-auto">
            <div class="flex">
              <!-- Time Column -->
              <div class="w-24 border-r border-(--ui-border) bg-(--ui-surface-muted) shrink-0">
                <div
                  v-for="slot in timeSlots"
                  :key="slot.time"
                  class="h-16 border-b border-(--ui-border) px-2 py-1 text-xs text-(--ui-text-muted) text-right"
                >
                  {{ slot.display }}
                </div>
              </div>

              <!-- Events Column -->
              <div class="flex-1 relative">
                <div
                  v-for="slot in timeSlots"
                  :key="slot.time"
                  class="h-16 border-b border-(--ui-border) hover:bg-(--ui-surface-muted) transition-colors cursor-pointer relative"
                  :class="dayViewDate.isToday ? 'bg-(--ui-primary-soft)' : ''"
                >
                  <!-- Events at this time -->
                  <div
                    v-for="event in getEventsAtTime(dayViewDate.events, slot)"
                    :key="event.id"
                    class="absolute inset-x-2 top-1 bottom-1 rounded border-l-4 p-2 text-sm font-medium text-(--ui-text-inverse) cursor-pointer hover:opacity-90 transition-opacity shadow-sm"
                    :class="getEventColorClass(event.color)"
                    @click="selectEvent(event, dayViewDate)"
                  >
                    <div class="font-semibold">
                      {{ event.title }}
                    </div>
                    <div class="text-xs opacity-90 mt-1">
                      {{ event.time }}
                    </div>
                    <div
                      v-if="event.description"
                      class="text-xs opacity-80 mt-1 line-clamp-2"
                    >
                      {{ event.description }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Event Details Sidebar -->
    <slot
      name="sidebar"
      :selected-event="selectedEvent"
      :close-event="() => selectedEvent = null"
    >
      <transition
        enter-active-class="transition-all duration-200"
        leave-active-class="transition-all duration-200"
        enter-from-class="opacity-0 translate-x-4"
        leave-to-class="opacity-0 translate-x-4"
      >
        <div
          v-if="selectedEvent"
          class="w-80 border-l border-(--ui-border) bg-(--ui-surface) flex flex-col"
        >
          <!-- Sidebar Header -->
          <div class="px-6 py-4 border-b border-(--ui-border) flex items-start justify-between">
            <h3 class="text-lg font-semibold text-(--ui-text)">
              Event Details
            </h3>
            <button
              class="text-(--ui-text-soft) hover:text-(--ui-text-muted) transition-colors"
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
              <h4 class="text-xl font-bold text-(--ui-text)">
                {{ selectedEvent.title }}
              </h4>
            </div>

            <!-- Status Badge -->
            <div v-if="selectedEvent.status">
              <span
                class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium"
                :class="selectedEvent.status === 'complied'
                  ? 'bg-(--ui-success-soft) text-(--ui-success) border border-(--ui-success-soft)'
                  : 'bg-(--ui-warning-soft) text-(--ui-warning) border border-(--ui-warning-soft)'"
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
                  class="w-5 h-5 text-(--ui-text-soft) mt-0.5"
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
                  <p class="text-sm font-medium text-(--ui-text)">
                    {{ formatEventDate(selectedEvent.date, 'full') }}
                  </p>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <svg
                  class="w-5 h-5 text-(--ui-text-soft) mt-0.5"
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
                <p class="text-sm text-(--ui-text-muted)">
                  {{ selectedEvent.time }}
                </p>
              </div>
            </div>

            <!-- Description -->
            <div
              v-if="selectedEvent.description"
              class="pt-4 border-t border-(--ui-border)"
            >
              <h5 class="text-sm font-semibold text-(--ui-text) mb-2">
                Description
              </h5>
              <p class="text-sm text-(--ui-text-muted) leading-relaxed">
                {{ selectedEvent.description }}
              </p>
            </div>

            <!-- Additional Details from Compliance -->
            <div
              v-if="selectedEvent.compliance"
              class="pt-4 border-t border-(--ui-border) space-y-3"
            >
              <h5 class="text-sm font-semibold text-(--ui-text) mb-2">
                Compliance Details
              </h5>

              <div
                v-if="selectedEvent.compliance.remarks"
                class="text-sm"
              >
                <span class="font-medium text-(--ui-text-muted)">Remarks:</span>
                <p class="text-(--ui-text-muted) mt-1">
                  {{ selectedEvent.compliance.remarks }}
                </p>
              </div>

              <div
                v-if="selectedEvent.compliance.compliance_documents?.length"
                class="text-sm"
              >
                <span class="font-medium text-(--ui-text-muted)">Documents:</span>
                <p class="text-(--ui-text-muted) mt-1">
                  {{ selectedEvent.compliance.compliance_documents.length }} document(s) attached
                </p>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </slot>
  </div>
</template>

<style scoped>
/* Ensure consistent border spacing */
.grid>div {
  position: relative;
}

/* Smooth transitions */
* {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>
