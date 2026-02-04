<script setup>
import { ref } from 'vue'
import { getMode, getTheme, setMode, setTheme } from '../lib/theme'

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

const applyTheme = () => {
  setTheme(currentTheme.value)
}

const applyMode = () => {
  setMode(currentMode.value)
}
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
        <label class="block text-xs font-medium text-(--ui-text-muted)">
          Mode
          <select
            v-model="currentMode"
            class="mt-1 w-full rounded-lg border border-(--ui-border) bg-(--ui-surface) px-3 py-2 text-sm"
            @change="applyMode"
          >
            <option
              v-for="mode in modes"
              :key="mode"
              :value="mode"
            >
              {{ mode }}
            </option>
          </select>
        </label>

        <label class="block text-xs font-medium text-(--ui-text-muted)">
          Theme
          <select
            v-model="currentTheme"
            class="mt-1 w-full rounded-lg border border-(--ui-border) bg-(--ui-surface) px-3 py-2 text-sm"
            @change="applyTheme"
          >
            <option
              v-for="theme in themes"
              :key="theme"
              :value="theme"
            >
              {{ theme }}
            </option>
          </select>
        </label>
      </div>
    </div>
  </div>
</template>
