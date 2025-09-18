<template>
  <div class="w-full max-w-md bg-white border rounded-xl shadow-sm p-4">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <Button
        class="p-2 rounded-lg hover:bg-slate-100"
        @click="prevMonth"
        aria-label="Previous Month"
      >
        <Icon :icon="chevron-left" class="w-5 h-5" />
      </Button>
      <div class="text-lg font-semibold text-slate-900">
        {{ monthName }} {{ currentYear }}
      </div>
      <Button
        class="p-2 rounded-lg hover:bg-slate-100"
        @click="nextMonth"
        aria-label="Next Month"
      >
        <Icon :icon="chevron-right" class="w-5 h-5" />
      </Button>
    </div>

    <!-- Weekdays -->
    <div class="grid grid-cols-7 text-center text-sm font-medium text-slate-500 mb-2">
      <div v-for="day in weekdays" :key="day">{{ day }}</div>
    </div>

    <!-- Dates -->
    <div class="grid grid-cols-7 gap-y-2 text-center">
      <!-- Previous month's trailing days -->
      <div
        v-for="day in leadingDays"
        :key="'prev-' + day"
        class="text-slate-400 text-sm"
      >
        {{ day }}
      </div>

      <!-- Current month -->
      <Button
        v-for="day in daysInMonth"
        :key="day"
        @click="selectDate(day)"
        :class="[
          'w-10 h-10 rounded-full flex items-center justify-center mx-auto',
          isToday(day) ? 'bg-blue-500 text-white font-semibold' : '',
          isSelected(day) ? 'bg-blue-100 text-blue-600 font-semibold' : 'hover:bg-slate-100'
        ]"
      >
        {{ day }}
      </Button>

      <!-- Next month's leading days -->
      <div
        v-for="day in trailingDays"
        :key="'next-' + day"
        class="text-slate-400 text-sm"
      >
        {{ day }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { cn } from '../utils/cn.js'
import Button from './Button.vue'
import Icon from './Icon.vue'


const today = new Date()
const currentMonth = ref(today.getMonth())
const currentYear = ref(today.getFullYear())
const selectedDate = ref(null)

const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

const monthName = computed(() =>
  new Date(currentYear.value, currentMonth.value).toLocaleString('default', {
    month: 'long'
  })
)

const daysInMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
})

const firstDayOfMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value, 1).getDay()
})

const leadingDays = computed(() => {
  return Array.from({ length: firstDayOfMonth.value }, (_, i) =>
    new Date(currentYear.value, currentMonth.value, -i).getDate()
  ).reverse()
})

const trailingDays = computed(() => {
  const totalCells = leadingDays.value.length + daysInMonth.value
  const remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7)
  return Array.from({ length: remaining }, (_, i) => i + 1)
})

function prevMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

function isToday(day) {
  return (
    today.getDate() === day &&
    today.getMonth() === currentMonth.value &&
    today.getFullYear() === currentYear.value
  )
}

function isSelected(day) {
  return (
    selectedDate.value &&
    selectedDate.value.getDate() === day &&
    selectedDate.value.getMonth() === currentMonth.value &&
    selectedDate.value.getFullYear() === currentYear.value
  )
}

function selectDate(day) {
  selectedDate.value = new Date(currentYear.value, currentMonth.value, day)
  // Emit so parent can listen
  emit('update:modelValue', selectedDate.value)
}

defineEmits(['update:modelValue'])
</script>
