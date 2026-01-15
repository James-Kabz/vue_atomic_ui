<script setup>
import { ref } from 'vue'
import Icon from './Icon.vue'

const props = defineProps({
  models: {
    type: Array,
    default: () => []
  },
  availableRecipients: {
    type: Array,
    default: () => ['User 1', 'User 2', 'User 3', 'HOD', 'GM', 'CEO', 'All Users']
  },
  sendTypeOptions: {
    type: Array,
    default: () => [
      { value: 'Email', label: 'Email' },
      { value: 'SMS', label: 'SMS' }
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
      id: model.reminders.length + 1,
      days: 0,
      recipients: [],
      sendType: 'Email',
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

const updateSendType = (modelId, reminderId, sendType) => {
  const model = props.models.find((m) => m.id === modelId)
  if (model) {
    const reminder = model.reminders.find((r) => r.id === reminderId)
    if (reminder) {
      reminder.sendType = sendType
      emit('update:models', [...props.models])
    }
  }
}

const openRecipientModal = (modelId, reminderId) => {
  const model = props.models.find((m) => m.id === modelId)
  const reminder = model.reminders.find((r) => r.id === reminderId)
  selectedModel.value = modelId
  currentReminder.value = { ...reminder, recipients: [...reminder.recipients] }
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
  <div class="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
    <div class="mx-auto">
      <!-- Header -->
      <div class="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl p-8 mb-8">
        <div class="flex items-center gap-4 mb-3">
          <div class="w-12 h-12 bg-linear-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <Icon
              icon="mail"
              class="w-6 h-6 text-white"
            />
          </div>
          <div>
            <h1 class="text-3xl font-bold bg-linear-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Reminder Configuration
            </h1>
            <p class="text-slate-600 mt-1">
              Configure reminder schedules for different models
            </p>
          </div>
        </div>
      </div>

      <!-- Models Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          v-for="model in models"
          :key="model.id"
          class="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300"
        >
          <!-- Model Header -->
          <div
            class="p-6 cursor-pointer hover:bg-linear-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 border-b border-slate-100"
            @click="toggleModel(model.id)"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 bg-linear-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                  <span class="text-white font-bold text-sm">
                    {{ model.name.split(' ')[1]?.[0] || 'M' }}
                  </span>
                </div>
                <div>
                  <h2 class="text-lg font-bold text-slate-800">
                    {{ model.name }}
                  </h2>
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-linear-to-r from-blue-100 to-indigo-100 text-blue-700 text-xs font-semibold rounded-full mt-1">
                    <div class="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                    {{ model.reminders.length }} reminder{{ model.reminders.length !== 1 ? 's' : '' }}
                  </span>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <button
                  class="px-4 py-2 bg-linear-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold text-sm hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
                  @click.stop="addReminder(model.id)"
                >
                  <Icon
                    icon="plus"
                    class="w-4 h-4"
                  />
                  Add
                </button>
                <Icon
                  :icon="model.expanded ? 'chevron-up' : 'chevron-down'"
                  class="w-5 h-5 text-slate-400"
                />
              </div>
            </div>
          </div>

          <!-- Model Content -->
          <div
            v-if="model.expanded"
            class="p-6 bg-linear-to-br from-slate-50/50 to-blue-50/30"
          >
            <div
              v-if="model.reminders.length === 0"
              class="text-center py-12"
            >
              <div class="w-16 h-16 bg-linear-to-br from-slate-200 to-slate-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Icon
                  icon="mail"
                  class="w-8 h-8 text-slate-400"
                />
              </div>
              <p class="text-slate-500 font-medium">
                No reminders configured yet
              </p>
              <p class="text-slate-400 text-sm mt-1">
                Click "Add" to create your first reminder
              </p>
            </div>
            
            <div
              v-else
              class="space-y-4"
            >
              <div
                v-for="reminder in model.reminders"
                :key="reminder.id"
                class="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg transition-all duration-300"
              >
                <div class="flex items-start gap-4">
                  <div class="flex-1 space-y-4">
                    <!-- Days Input -->
                    <div>
                      <label class="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
                        Days Before
                      </label>
                      <div class="relative">
                        <input
                          type="number"
                          min="0"
                          :value="reminder.days"
                          class="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 font-semibold text-slate-800"
                          placeholder="0"
                          @input="updateReminderDays(model.id, reminder.id, $event.target.value)"
                        >
                        <div class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">
                          days
                        </div>
                      </div>
                    </div>

                    <!-- Send Type -->
                    <div>
                      <label class="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
                        Send Type
                      </label>
                      <div class="flex gap-2">
                        <button
                          v-for="option in sendTypeOptions"
                          :key="option.value"
                          :class="[
                            'flex-1 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2',
                            reminder.sendType === option.value
                              ? 'bg-linear-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          ]"
                          @click="updateSendType(model.id, reminder.id, option.value)"
                        >
                          <Icon
                            :icon="option.value === 'Email' ? 'mail' : 'message-square'"
                            class="w-4 h-4"
                          />
                          {{ option.label }}
                        </button>
                      </div>
                    </div>

                    <!-- Recipients -->
                    <div>
                      <label class="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
                        Recipients
                      </label>
                      <button
                        class="w-full px-4 py-3 bg-linear-to-r from-slate-50 to-blue-50 border-2 border-slate-200 rounded-xl hover:border-blue-400 transition-all duration-300 flex items-center justify-between group"
                        @click="openRecipientModal(model.id, reminder.id)"
                      >
                        <div class="flex items-center gap-2">
                          <Icon
                            icon="users"
                            class="w-4 h-4 text-slate-600 group-hover:text-blue-600 transition-colors"
                          />
                          <span class="text-sm font-semibold text-slate-700">
                            {{ reminder.recipients.length === 0 ? 'Select recipients' : `${reminder.recipients.length} selected` }}
                          </span>
                        </div>
                        <Icon
                          icon="chevron-down"
                          class="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors"
                        />
                      </button>
                      <div
                        v-if="reminder.recipients.length > 0"
                        class="mt-3 flex flex-wrap gap-2"
                      >
                        <span
                          v-for="recipient in reminder.recipients"
                          :key="recipient"
                          class="px-3 py-1.5 bg-linear-to-r from-blue-100 to-indigo-100 text-blue-700 text-xs font-semibold rounded-lg"
                        >
                          {{ recipient }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Delete Button -->
                  <button
                    class="p-3 bg-linear-to-r from-red-500 to-rose-600 text-white rounded-xl hover:from-red-600 hover:to-rose-700 transition-all duration-300 shadow-md hover:shadow-lg"
                    @click="deleteReminder(model.id, reminder.id)"
                  >
                    <Icon
                      icon="trash"
                      class="w-4 h-4"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recipient Modal -->
      <Teleport to="body">
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div
            v-if="showRecipientModal"
            class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <Transition
              enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="opacity-0 scale-95"
              enter-to-class="opacity-100 scale-100"
              leave-active-class="transition-all duration-200 ease-in"
              leave-from-class="opacity-100 scale-100"
              leave-to-class="opacity-0 scale-95"
            >
              <div
                v-if="showRecipientModal"
                class="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
              >
                <!-- Modal Header -->
                <div class="bg-linear-to-r from-blue-500 to-indigo-600 p-6 text-white">
                  <div class="flex items-center justify-between">
                    <div>
                      <h3 class="text-xl font-bold">
                        Select Recipients
                      </h3>
                      <p class="text-blue-100 text-sm mt-1">
                        Choose who should receive this reminder
                      </p>
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
                  <div class="space-y-2">
                    <label
                      v-for="recipient in availableRecipients"
                      :key="recipient"
                      :class="[
                        'flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all duration-300',
                        currentReminder?.recipients.includes(recipient)
                          ? 'bg-linear-to-r from-blue-50 to-indigo-50 border-2 border-blue-300'
                          : 'bg-slate-50 border-2 border-transparent hover:border-slate-200'
                      ]"
                    >
                      <div class="relative">
                        <input
                          type="checkbox"
                          :checked="currentReminder?.recipients.includes(recipient)"
                          class="w-5 h-5 text-blue-600 rounded-md border-2 border-slate-300 focus:ring-4 focus:ring-blue-100 transition-all"
                          @change="toggleRecipient(recipient)"
                        >
                        <Icon
                          v-if="currentReminder?.recipients.includes(recipient)"
                          icon="check"
                          class="w-3 h-3 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                        />
                      </div>
                      <span
                        :class="[
                          'text-sm font-semibold',
                          currentReminder?.recipients.includes(recipient) ? 'text-blue-700' : 'text-slate-700'
                        ]"
                      >
                        {{ recipient }}
                      </span>
                    </label>
                  </div>
                </div>

                <!-- Modal Footer -->
                <div class="p-6 bg-slate-50 border-t border-slate-200 flex gap-3">
                  <button
                    class="flex-1 px-6 py-3 bg-white border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-all duration-300"
                    @click="showRecipientModal = false"
                  >
                    Cancel
                  </button>
                  <button
                    class="flex-1 px-6 py-3 bg-linear-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg"
                    @click="saveRecipients"
                  >
                    Save Recipients
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </Transition>
      </Teleport>
    </div>
  </div>
</template>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
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