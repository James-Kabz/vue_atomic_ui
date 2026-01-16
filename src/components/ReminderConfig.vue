<script setup>
import { ref } from 'vue'
import Icon from './Icon.vue'
import Modal from './Modal.vue'

const props = defineProps({
  models: {
    type: Array,
    default: () => []
  },
  availableRecipients: {
    type: Array,
    default: () => []
  },
  sendTypeOptions: {
    type: Array,
    default: () => [
      { value: 'email', label: 'Email' },
      { value: 'in-app', label: 'In-App' }
    ]
  }
})

const emit = defineEmits(['update:models'])

const selectedModel = ref(null)
const showRecipientModal = ref(false)
const currentReminder = ref(null)

const toggleModel = (modelId) => {
  const model = props.models.find((m) => m.id === modelId)
  if (model) {
    model.expanded = !model.expanded
    emit('update:models', [...props.models])
  }
}

const addReminder = (modelId) => {
  const model = props.models.find((m) => m.id === modelId)
  if (model) {
    const newReminder = {
      id: Date.now(),
      days: 0,
      recipients: [],
      sendTypes: [],
      isDaily: false
    }
    model.reminders.push(newReminder)
    emit('update:models', [...props.models])
  }
}

const deleteReminder = (modelId, reminderId) => {
  const model = props.models.find((m) => m.id === modelId)
  if (model) {
    model.reminders = model.reminders.filter((r) => r.id !== reminderId)
    emit('update:models', [...props.models])
  }
}

const updateReminderDays = (modelId, reminderId, days) => {
  const model = props.models.find((m) => m.id === modelId)
  if (model) {
    const reminder = model.reminders.find((r) => r.id === reminderId)
    if (reminder) {
      reminder.days = parseInt(days) || 0
      emit('update:models', [...props.models])
    }
  }
}

const toggleSendType = (modelId, reminderId, sendTypeValue) => {
  const model = props.models.find((m) => m.id === modelId)
  if (model) {
    const reminder = model.reminders.find((r) => r.id === reminderId)
    if (reminder) {
      if (!reminder.sendTypes) {
        reminder.sendTypes = []
      }
      const index = reminder.sendTypes.indexOf(sendTypeValue)
      if (index > -1) {
        reminder.sendTypes.splice(index, 1)
      } else {
        reminder.sendTypes.push(sendTypeValue)
      }
      emit('update:models', [...props.models])
    }
  }
}

const toggleIsDaily = (modelId, reminderId) => {
  const model = props.models.find((m) => m.id === modelId)
  if (model) {
    const reminder = model.reminders.find((r) => r.id === reminderId)
    if (reminder) {
      reminder.isDaily = !reminder.isDaily
      emit('update:models', [...props.models])
    }
  }
}

const openRecipientModal = (modelId, reminderId) => {
  const model = props.models.find((m) => m.id === modelId)
  const reminder = model.reminders.find((r) => r.id === reminderId)
  selectedModel.value = modelId
  currentReminder.value = { ...reminder, recipients: [...(reminder.recipients || [])] }
  showRecipientModal.value = true
}

const toggleRecipient = (recipient) => {
  const index = currentReminder.value.recipients.indexOf(recipient)
  if (index > -1) {
    currentReminder.value.recipients.splice(index, 1)
  } else {
    currentReminder.value.recipients.push(recipient)
  }
}

const saveRecipients = () => {
  const model = props.models.find((m) => m.id === selectedModel.value)
  if (model) {
    const reminder = model.reminders.find((r) => r.id === currentReminder.value.id)
    if (reminder) {
      reminder.recipients = [...currentReminder.value.recipients]
      emit('update:models', [...props.models])
    }
  }
  showRecipientModal.value = false
}
</script>

<template>
  <div class="reminder-config-wrapper">
    <!-- Models Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div
        v-for="model in models"
        :key="model.id"
        class="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300"
      >
        <!-- Model Header -->
        <div
          class="p-6 cursor-pointer hover:bg-linear-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 border-b border-slate-200"
          @click="toggleModel(model.id)"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div
                class="w-12 h-12 bg-linear-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md"
              >
                <span class="text-white font-bold text-lg">
                  {{ model.name[0] }}
                </span>
              </div>
              <div>
                <h2 class="text-xl font-bold text-slate-800">
                  {{ model.name }}
                </h2>
                <div class="flex items-center gap-2 mt-1">
                  <span
                    class="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full"
                  >
                    <div class="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    {{ model.reminders.length }} reminder{{ model.reminders.length !== 1 ? 's' : '' }}
                  </span>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <button
                class="px-4 py-2.5 bg-linear-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold text-sm hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
                @click.stop="addReminder(model.id)"
              >
                <Icon
                  icon="plus"
                  class="w-4 h-4"
                />
                Add Reminder
              </button>
              <Icon
                :icon="model.expanded ? 'chevron-up' : 'chevron-down'"
                class="w-6 h-6 text-slate-400 transition-transform duration-300"
                :class="{ 'rotate-180': model.expanded }"
              />
            </div>
          </div>
        </div>

        <!-- Model Content -->
        <transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 max-h-0"
          enter-to-class="opacity-100 max-h-screen"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 max-h-screen"
          leave-to-class="opacity-0 max-h-0"
        >
          <div
            v-if="model.expanded"
            class="p-6 bg-linear-to-br from-slate-50 to-blue-50/30"
          >
            <!-- Empty State -->
            <div
              v-if="model.reminders.length === 0"
              class="text-center py-16"
            >
              <div
                class="w-20 h-20 bg-linear-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-4"
              >
                <Icon
                  icon="bell"
                  class="w-10 h-10 text-slate-400"
                />
              </div>
              <h3 class="text-lg font-semibold text-slate-700 mb-2">
                No reminders configured
              </h3>
              <p class="text-slate-500 text-sm mb-4">
                Click "Add Reminder" to create your first reminder
              </p>
            </div>

            <!-- Reminders List -->
            <div
              v-else
              class="space-y-4"
            >
              <div
                v-for="reminder in model.reminders"
                :key="reminder.id"
                class="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-all duration-300"
              >
                <div class="flex items-start gap-4">
                  <div class="flex-1 space-y-5">
                    <!-- Days Input -->
                    <div>
                      <label class="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                        Days Before Event
                      </label>
                      <div class="relative">
                        <input
                          type="number"
                          min="0"
                          :value="reminder.days"
                          class="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 font-semibold text-slate-800 text-lg"
                          placeholder="0"
                          @input="updateReminderDays(model.id, reminder.id, $event.target.value)"
                        >
                        <div class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">
                          days
                        </div>
                      </div>
                    </div>

                    <!-- Daily Reminder Toggle -->
                    <div class="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <input
                        :id="`daily-${reminder.id}`"
                        type="checkbox"
                        :checked="reminder.isDaily"
                        class="w-5 h-5 text-blue-600 rounded border-2 border-slate-300 focus:ring-4 focus:ring-blue-100 transition-all cursor-pointer"
                        @change="toggleIsDaily(model.id, reminder.id)"
                      >
                      <label
                        :for="`daily-${reminder.id}`"
                        class="flex-1 cursor-pointer"
                      >
                        <span class="text-sm font-semibold text-slate-700 block">
                          Send Daily Reminder
                        </span>
                        <span class="text-xs text-slate-500">
                          Repeat this reminder every day
                        </span>
                      </label>
                    </div>

                    <!-- Send Type (Multi-select) -->
                    <div>
                      <label class="block text-xs font-bold text-slate-700 mb-3 uppercase tracking-wider">
                        Notification Methods
                      </label>
                      <div class="grid grid-cols-2 gap-3">
                        <button
                          v-for="option in sendTypeOptions"
                          :key="option.value"
                          :class="[
                            'relative px-4 py-3.5 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 border-2',
                            (reminder.sendTypes || []).includes(option.value)
                              ? 'bg-linear-to-r from-blue-500 to-indigo-600 text-white border-transparent shadow-md'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50'
                          ]"
                          @click="toggleSendType(model.id, reminder.id, option.value)"
                        >
                          <Icon
                            :icon="option.value === 'email' ? 'envelope' : 'bell'"
                            class="w-4 h-4"
                          />
                          {{ option.label }}
                          <Icon
                            v-if="(reminder.sendTypes || []).includes(option.value)"
                            icon="check-circle"
                            class="w-4 h-4 absolute top-2 right-2"
                          />
                        </button>
                      </div>
                    </div>

                    <!-- Recipients -->
                    <div>
                      <label class="block text-xs font-bold text-slate-700 mb-3 uppercase tracking-wider">
                        Recipients
                      </label>
                      <button
                        class="w-full px-4 py-3.5 bg-white border-2 border-slate-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 flex items-center justify-between group"
                        @click="openRecipientModal(model.id, reminder.id)"
                      >
                        <div class="flex items-center gap-3">
                          <div
                            class="w-10 h-10 bg-linear-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center group-hover:from-blue-200 group-hover:to-indigo-200 transition-all"
                          >
                            <Icon
                              icon="users"
                              class="w-5 h-5 text-blue-600"
                            />
                          </div>
                          <div class="text-left">
                            <span class="text-sm font-semibold text-slate-800 block">
                              {{ (reminder.recipients || []).length === 0 ? 'Select recipients' :
                                `${(reminder.recipients || []).length} recipient${(reminder.recipients || []).length !== 1
                                  ? 's' : ''} selected` }}
                            </span>
                            <span class="text-xs text-slate-500">
                              Click to manage
                            </span>
                          </div>
                        </div>
                        <Icon
                          icon="chevron-right"
                          class="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all"
                        />
                      </button>

                      <!-- Selected Recipients -->
                      <div
                        v-if="(reminder.recipients || []).length > 0"
                        class="mt-3 p-4 bg-slate-50 rounded-lg border border-slate-200"
                      >
                        <div class="flex flex-wrap gap-2">
                          <span
                            v-for="recipient in reminder.recipients"
                            :key="recipient"
                            class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-blue-200 text-blue-700 text-xs font-semibold rounded-lg shadow-sm"
                          >
                            <Icon
                              icon="user"
                              class="w-3 h-3"
                            />
                            {{ recipient }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Delete Button -->
                  <button
                    class="p-3 bg-linear-to-r from-red-500 to-rose-600 text-white rounded-lg hover:from-red-600 hover:to-rose-700 transition-all duration-300 shadow-md hover:shadow-lg self-start"
                    title="Delete reminder"
                    @click="deleteReminder(model.id, reminder.id)"
                  >
                    <Icon
                      icon="trash"
                      class="w-5 h-5"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <!-- Recipient Modal -->
    <Modal
      v-model="showRecipientModal"
      size="md"
      :show-close="false"
    >
      <!-- Modal Header -->
      <div class="bg-linear-to-r from-blue-500 to-indigo-600 p-6 text-white">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Icon
                icon="users"
                class="w-6 h-6"
              />
            </div>
            <div>
              <h3 class="text-xl font-bold">
                Select Recipients
              </h3>
              <p class="text-blue-100 text-sm mt-1">
                Choose who should receive this reminder
              </p>
            </div>
          </div>
          <button
            class="p-2 hover:bg-white/20 rounded-lg transition-colors"
            @click="showRecipientModal = false"
          >
            <Icon
              icon="x"
              class="w-5 h-5"
            />
          </button>
        </div>
      </div>

      <!-- Modal Body -->
      <div class="p-6 max-h-96 overflow-y-auto">
        <div
          v-if="availableRecipients.length === 0"
          class="text-center py-8"
        >
          <Icon
            icon="users"
            class="w-12 h-12 text-slate-300 mx-auto mb-3"
          />
          <p class="text-slate-500 text-sm">
            No recipients available
          </p>
        </div>
        <div
          v-else
          class="space-y-2"
        >
          <label
            v-for="recipient in availableRecipients"
            :key="recipient"
            :class="[
              'flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all duration-300 border-2',
              currentReminder?.recipients.includes(recipient)
                ? 'bg-linear-to-r from-blue-50 to-indigo-50 border-blue-300 shadow-sm'
                : 'bg-white border-slate-200 hover:border-blue-200 hover:bg-slate-50'
            ]"
          >
            <div class="relative shrink-0">
              <input
                type="checkbox"
                :checked="currentReminder?.recipients.includes(recipient)"
                class="w-5 h-5 text-blue-600 rounded border-2 border-slate-300 focus:ring-4 focus:ring-blue-100 transition-all cursor-pointer"
                @change="toggleRecipient(recipient)"
              >
            </div>
            <div class="flex-1 min-w-0">
              <span
                :class="[
                  'text-sm font-semibold block truncate',
                  currentReminder?.recipients.includes(recipient) ? 'text-blue-700' : 'text-slate-700'
                ]"
              >
                {{ recipient }}
              </span>
            </div>
            <Icon
              v-if="currentReminder?.recipients.includes(recipient)"
              icon="check-circle"
              class="w-5 h-5 text-blue-600 shrink-0"
            />
          </label>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="p-6 bg-slate-50 border-t border-slate-200 flex gap-3">
        <button
          class="flex-1 px-6 py-3 bg-white border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-100 transition-all duration-300"
          @click="showRecipientModal = false"
        >
          Cancel
        </button>
        <button
          class="flex-1 px-6 py-3 bg-linear-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
          @click="saveRecipients"
        >
          <Icon
            icon="check"
            class="w-4 h-4"
          />
          Save Recipients
        </button>
      </div>
    </Modal>
  </div>
</template>

<style scoped>
.reminder-config-wrapper {
  @apply w-full;
}

/* Custom scrollbar for modal */
.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>