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
        blue: 'ui-primary-bg border-(--ui-primary) ui-text',
        red: 'ui-danger-bg border-(--ui-danger) ui-text',
        green: 'ui-success-bg border-(--ui-success) ui-text',
        purple: 'ui-accent-bg border-(--ui-accent) ui-text',
        orange: 'ui-warning-bg border-(--ui-warning) ui-text',
      }
      return colorMap[color] || 'ui-bg ui-border-strong ui-text'
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
  <div class="flex gap-0 h-full ui-bg  rounded-lg shadow-sm border ui-border-strong ">
    <!-- Calendar Container -->
    <div class="flex-1 flex flex-col">
      <!-- Toolbar -->
      <div class="flex items-center justify-between px-6 py-4 border-b ui-border-strong ">
        <div class="flex items-center gap-3">
          <button
            class="px-4 py-2 text-sm font-medium ui-text ui-surface-strong  border ui-border-strong  rounded hover:bg-(--ui-surface-strong) transition-colors"
            @click="goToToday"
          >
            Today
          </button>

          <div class="flex items-center gap-1">
            <button
              class="p-2 ui-text hover:bg-(--ui-surface-strong) rounded transition-colors"
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
              class="p-2 ui-text hover:bg-(--ui-surface-strong) rounded transition-colors"
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

          <h2 class="text-xl font-semibold ui-text ml-2">
            {{ displayTitle }}
          </h2>
        </div>

        <div class="flex items-center gap-2">
          <button
            class="px-3 py-2 text-sm font-medium rounded transition-colors"
            :class="viewMode === 'year' ? 'ui-primary-soft ui-primary' : 'ui-text hover:bg-(--ui-surface-strong)'"
            @click="viewMode = 'year'"
          >
            Year
          </button>
          <button
            class="px-3 py-2 text-sm font-medium rounded transition-colors"
            :class="viewMode === 'month' ? 'ui-primary-soft ui-primary' : 'ui-text hover:bg-(--ui-surface-strong)'"
            @click="viewMode = 'month'"
          >
            Month
          </button>
          <button
            class="px-3 py-2 text-sm font-medium rounded transition-colors"
            :class="viewMode === 'week' ? 'ui-primary-soft ui-primary' : 'ui-text hover:bg-(--ui-surface-strong)'"
            @click="viewMode = 'week'"
          >
            Week
          </button>
          <button
            class="px-3 py-2 text-sm font-medium rounded transition-colors"
            :class="viewMode === 'day' ? 'ui-primary-soft ui-primary' : 'ui-text hover:bg-(--ui-surface-strong)'"
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
              class="ui-bg rounded-lg border ui-border-strong  overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              @click="selectMonthFromYear(month.index)"
            >
              <!-- Month Header -->
              <div class="bg-linear-to-r from-(--ui-primary-soft) to-(--ui-primary-soft) px-3 py-3">
                <h3 class="text-md font-bold ui-text text-center">
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
                    class="text-center text-xl font-black ui-text"
                  >
                    {{ day }}
                  </div>
                </div>

                <!-- Days Grid -->
                <div class="grid grid-cols-7 gap-1">
                  <div
                    v-for="(day, index) in month.days"
                    :key="index"
                    class="aspect-square flex items-center justify-center text-lg font-normal rounded-md relative transition-all hover:scale-110"
                    :class="[
                      // Base styles
                      !day.isCurrentMonth ? 'ui-text' : 'text-(--ui-muted)',

                      // Today styling
                      day.isToday ? 'ui-primary-soft ui-text font-extrabold shadow-md ring-2 ring-(--ui-primary)' : '',

                      // Event styling - highly visible
                      day.events.length > 0 && !day.isToday && day.isCurrentMonth ? 'ui-danger-bg ui-danger font-bold border-2 border-(--ui-danger) shadow-sm' : '',

                      // Regular styling
                      day.events.length === 0 && !day.isToday && day.isCurrentMonth ? 'hover:bg-(--ui-surface-strong)' : ''
                    ]"
                  >
                    {{ day.dayNumber }}

                    <!-- Event count badge for multiple events -->
                    <div
                      v-if="day.events.length > 1 && day.isCurrentMonth"
                      class="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-sm font-black shadow-md"
                      :class="day.isToday ? 'bg-(--ui-warning-strong) ui-primary' : 'ui-danger-bg ui-text'"
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
          <div class="grid grid-cols-7 border-b ui-border-strong ">
            <div
              v-for="day in weekDays"
              :key="day"
              class="text-center text-xl font-semibold ui-text py-3 uppercase tracking-wider"
            >
              {{ day }}
            </div>
          </div>

          <!-- Days Grid -->
          <div class="ui-bg grid grid-cols-7 flex-1 border-l border-t ui-border-strong ">
            <div
              v-for="(day, index) in calendarDays"
              :key="index"
              class="border-r border-b ui-border-strong  p-1 min-h-[120px] relative cursor-pointer hover:bg-(--ui-surface-strong) transition-colors"
              :class="[
                !day.isCurrentMonth ? 'ui-surface-strong' : 'ui-bg ',
                day.isToday ? 'ui-primary-soft' : '',
                selectedDate === day.date ? 'ring-2 ring-(--ui-primary) ring-inset' : ''
              ]"
              @click="selectDay(day)"
            >
              <!-- Date Number -->
              <div class="flex items-center justify-between mb-1 px-1">
                <span
                  class="text-2xl font-light"
                  :class="[
                    day.isCurrentMonth ? 'ui-text' : 'ui-text-muted',
                    day.isToday ? 'ui-primary-soft ui-text w-6 h-6 flex items-center justify-center rounded-full text-xs' : ''
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
                  class="text-xl px-2 py-1 rounded cursor-pointer truncate border-l-2 ui-text font-medium hover:opacity-190 transition-opacity"
                  :class="getEventColorClass(event.color)"
                  @click.stop="selectEvent(event, day)"
                >
                  {{ event.title }}
                </div>

                <div
                  v-if="day.events.length > 3"
                  class="text-lg px-2 py-1 ui-text font-medium cursor-pointer hover:text-(--ui-text)"
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
          <div class="grid grid-cols-8 border-b ui-border-strong  ui-surface-strong">
            <div class="border-r ui-border-strong  p-2" />
            <div
              v-for="day in weekViewDays"
              :key="day.date"
              class="text-center p-2 border-r ui-border-strong "
              :class="day.isToday ? 'ui-primary-soft' : ''"
            >
              <div class="text-lg font-semibold ui-text uppercase">
                {{ day.dayName }}
              </div>
              <div
                class="text-lg font-bold mt-1"
                :class="[
                  day.isToday ? 'ui-primary ui-text w-8 h-8 flex items-center justify-center rounded-full mx-auto' : 'ui-text'
                ]"
              >
                {{ day.dayNumber }}
              </div>
            </div>
          </div>

          <!-- All-Day Events Row -->
          <div class="grid grid-cols-8 border-b ui-border-strong ui-surface-strong min-h-[60px]">
            <div
              class="border-r ui-border-strong  px-2 py-1 text-lg ui-text text-right flex items-center justify-end"
            >
              All Day
            </div>
            <div
              v-for="day in weekViewDays"
              :key="'allday-' + day.date"
              class="border-r ui-border-strong  p-1 space-y-1"
              :class="day.isToday ? 'ui-primary-soft' : ''"
            >
              <div
                v-for="event in getAllDayEvents(day.events)"
                :key="event.id"
                class="rounded border-l-2 p-1 text-lg font-medium ui-text cursor-pointer hover:opacity-90 transition-opacity"
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
              <div class="border-r ui-border-strong  ui-surface-strong">
                <div
                  v-for="slot in timeSlots"
                  :key="slot.time"
                  class="h-16 border-b ui-border-strong  px-2 py-1 text-lg ui-text text-right"
                >
                  {{ slot.display }}
                </div>
              </div>

              <!-- Day Columns -->
              <div
                v-for="day in weekViewDays"
                :key="day.date"
                class="border-r ui-border-strong relative"
              >
                <div
                  v-for="slot in timeSlots"
                  :key="slot.time"
                  class="h-16 ui-surface-strong border-b ui-border-strong  hover:bg-(--ui-surface-strong) transition-colors cursor-pointer relative"
                  :class="day.isToday ? 'ui-primary-soft' : ''"
                >
                  <!-- Events at this time -->
                  <div
                    v-for="event in getEventsAtTime(day.events, slot)"
                    :key="event.id"
                    class="absolute inset-x-1 top-1 bottom-1 rounded border-l-2 p-1 text-xs font-medium ui-text cursor-pointer hover:opacity-90 transition-opacity overflow-hidden"
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
          <div class="border-b ui-border-strong  ui-surface-strong p-4">
            <div class="text-center">
              <div class="text-sm font-semibold ui-text uppercase">
                {{ dayViewDate.dayName }}
              </div>
              <div
                class="text-2xl font-bold mt-2"
                :class="[
                  dayViewDate.isToday ? 'ui-primary' : 'ui-text'
                ]"
              >
                {{ dayViewDate.dayNumber }}
              </div>
            </div>
          </div>

          <!-- All-Day Events Section -->
          <div
            v-if="getAllDayEvents(dayViewDate.events).length > 0"
            class="border-b ui-border-strong  ui-surface-strong p-4"
          >
            <h4 class="text-xs font-semibold ui-text uppercase tracking-wide mb-2">
              All Day Events
            </h4>
            <div class="space-y-2">
              <div
                v-for="event in getAllDayEvents(dayViewDate.events)"
                :key="event.id"
                class="rounded border-l-4 p-3 text-sm font-medium ui-text cursor-pointer hover:opacity-90 transition-opacity shadow-sm"
                :class="getEventColorClass(event.color)"
                @click="selectEvent(event, dayViewDate)"
              >
                <div class="font-extrabold">
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
              <div class="w-24 border-r ui-border-strong shrink-0">
                <div
                  v-for="slot in timeSlots"
                  :key="slot.time"
                  class="ui-surface-strong h-16 border-b ui-border-strong  px-2 py-1 text-lg ui-text text-right"
                >
                  {{ slot.display }}
                </div>
              </div>

              <!-- Events Column -->
              <div class="ui-surface-strong flex-1 relative">
                <div
                  v-for="slot in timeSlots"
                  :key="slot.time"
                  class=" h-16 border-b ui-border-strong  hover:bg-(--ui-surface-strong) transition-colors cursor-pointer relative"
                  :class="dayViewDate.isToday ? 'ui-primary-soft' : ''"
                >
                  <!-- Events at this time -->
                  <div
                    v-for="event in getEventsAtTime(dayViewDate.events, slot)"
                    :key="event.id"
                    class="absolute inset-x-2 top-1 bottom-1 rounded border-l-4 p-2 text-sm font-medium ui-text cursor-pointer hover:opacity-90 transition-opacity shadow-sm"
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
          class="w-80 border-l ui-border-strong  ui-surface-strong  flex flex-col"
        >
          <!-- Sidebar Header -->
          <div class="px-6 py-4 border-b ui-border-strong  flex items-start justify-between">
            <h3 class="text-lg font-semibold ui-text">
              Event Details
            </h3>
            <button
              class="ui-text hover:text-(--ui-text) transition-colors"
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
              <h4 class="text-xl font-bold ui-text">
                {{ selectedEvent.title }}
              </h4>
            </div>

            <!-- Status Badge -->
            <div v-if="selectedEvent.status">
              <span
                class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium"
                :class="selectedEvent.status === 'complied'
                  ? 'ui-success-soft ui-success border border-(--ui-success-soft)'
                  : 'ui-warning-soft ui-warning border border-(--ui-warning-soft)'"
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
                  class="w-5 h-5 ui-text mt-0.5"
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
                  <p class="text-sm font-medium ui-text">
                    {{ formatEventDate(selectedEvent.date, 'full') }}
                  </p>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <svg
                  class="w-5 h-5 ui-text mt-0.5"
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
                <p class="text-sm ui-text">
                  {{ selectedEvent.time }}
                </p>
              </div>
            </div>

            <!-- Description -->
            <div
              v-if="selectedEvent.description"
              class="pt-4 border-t ui-border-strong "
            >
              <h5 class="text-sm font-semibold ui-text mb-2">
                Description
              </h5>
              <p class="text-sm ui-text leading-relaxed">
                {{ selectedEvent.description }}
              </p>
            </div>

            <!-- Additional Details from Compliance -->
            <div
              v-if="selectedEvent.compliance"
              class="pt-4 border-t ui-border-strong  space-y-3"
            >
              <h5 class="text-sm font-semibold ui-text mb-2">
                Compliance Details
              </h5>

              <div
                v-if="selectedEvent.compliance.remarks"
                class="text-sm"
              >
                <span class="font-medium ui-text">Remarks:</span>
                <p class="ui-text mt-1">
                  {{ selectedEvent.compliance.remarks }}
                </p>
              </div>

              <div
                v-if="selectedEvent.compliance.compliance_documents?.length"
                class="text-sm"
              >
                <span class="font-medium ui-text">Documents:</span>
                <p class="ui-text mt-1">
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
