<script setup>
import { ref, watch } from 'vue'
import { getMode, getTheme, setMode, setTheme } from '../lib/theme'
import Option from './Option.vue'
import Select from './Select.vue'

const themes = [
  'ocean',
  'aurora',
  'ember',
  'cosmic',
  'forest',
  'sunset',
  'midnight'
]

const modes = ['light', 'dark']

const open = ref(false)
const currentTheme = ref(getTheme() || 'ocean')
const currentMode = ref(getMode() || 'light')

watch(currentTheme, (value) => {
  setTheme(value)
})

watch(currentMode, (value) => {
  setMode(value)
})
</script>

<template>
  <div class="fixed bottom-5 right-5 z-50">
    <button
      class="rounded-full border ui-glossy-border ui-glossy-button px-4 py-2 text-sm font-semibold shadow-sm hover:brightness-105"
      @click="open = !open"
    >
      Theme
    </button>

    <div
      v-if="open"
      class="mt-3 w-72 rounded-2xl border ui-glossy-border ui-glossy-popover p-4 shadow-xl"
    >
      <div class="text-sm font-semibold text-(--ui-text)">
        Appearance
      </div>
      <div class="mt-3 space-y-3">
        <label class="block text-xs font-medium text-(--ui-text)">
          Mode
          <Select
            v-model="currentMode"
            class="mt-1 w-full"
          >
            <Option
              v-for="mode in modes"
              :key="mode"
              :value="mode"
            >
              {{ mode }}
            </Option>
          </Select>
        </label>

        <label class="block text-xs font-medium text-(--ui-text)">
          Theme
          <Select
            v-model="currentTheme"
            class="mt-1 w-full"
          >
            <Option
              v-for="theme in themes"
              :key="theme"
              :value="theme"
            >
              {{ theme }}
            </Option>
          </Select>
        </label>
      </div>
    </div>
  </div>
</template>
