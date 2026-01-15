<script setup>
import { ref } from 'vue'
import Button from './Button.vue'
import Icon from './Icon.vue'
import Modal from './Modal.vue'
import Accordion from './Accordion.vue'
import Select from './Select.vue'

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
  <div class="min-h-screen bg-gray-50 p-6">
    <div class=" mx-auto">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h1 class="text-2xl font-semibold text-gray-900 mb-2">Reminder Configuration</h1>
        <p class="text-gray-600">Configure reminder schedules for different models</p>
      </div>

      <Accordion :items="models" variant="bordered" class="grid grid-cols-2 gap-1">
        <template v-for="(model, index) in models" :key="model.id" #[`header-${index}`]>
          <div class="flex items-center justify-between w-full gap-4">
            <div class="flex items-center gap-3">
              <h2 class="text-lg font-semibold text-gray-900">{{ model.name }}</h2>
              <span class="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                {{ model.reminders.length }} reminders
              </span>
            </div>
            <Button @click.stop="addReminder(model.id)" variant="success" size="sm">
              <template #icon>
                <Icon icon="plus" />
              </template>
              Add Reminder
            </Button>
          </div>
        </template>
        <template v-for="(model, index) in models" :key="model.id" #[`content-${index}`]>
          <div class="p-4 bg-gray-50">
            <p v-if="model.reminders.length === 0" class="text-gray-500 text-center py-8">
              No reminders configured yet
            </p>
            <div v-else class="space-y-3">
              <div
                v-for="reminder in model.reminders"
                :key="reminder.id"
                class="bg-white rounded-md border border-gray-200 p-4"
              >
                <div class="flex items-center gap-4">
                  <div class="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label class="block text-xs font-medium text-gray-700 mb-1">
                        Days Before
                      </label>
                      <input
                        type="number"
                        min="0"
                        :value="reminder.days"
                        @input="updateReminderDays(model.id, reminder.id, $event.target.value)"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label class="block text-xs font-medium text-gray-700 mb-1">
                        Send Type
                      </label>
                      <Select
                        :options="sendTypeOptions"
                        :model-value="reminder.sendType"
                        @update:model-value="updateSendType(model.id, reminder.id, $event)"
                        placeholder="Select send type"
                      />
                    </div>

                    <div>
                      <label class="block text-xs font-medium text-gray-700 mb-1">
                        Recipients
                      </label>
                      <Button
                        @click="openRecipientModal(model.id, reminder.id)"
                        variant="outline"
                        class="w-full justify-between"
                      >
                        <div class="flex items-center gap-2">
                          <Icon icon="users" />
                          <span class="text-sm">
                            {{
                              reminder.recipients.length === 0
                                ? 'Select recipients'
                                : `${reminder.recipients.length} selected`
                            }}
                          </span>
                        </div>
                        <Icon icon="chevron-down" />
                      </Button>
                      <div v-if="reminder.recipients.length > 0" class="mt-2 flex flex-wrap gap-1">
                        <span
                          v-for="recipient in reminder.recipients"
                          :key="recipient"
                          class="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                        >
                          {{ recipient }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button @click="deleteReminder(model.id, reminder.id)" variant="danger" size="sm">
                    <template #icon>
                      <Icon icon="trash" />
                    </template>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Accordion>

      <Modal v-model="showRecipientModal" size="md" :showClose="true" :closeOnBackdrop="true">
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Select Recipients</h3>
          <p class="text-sm text-gray-600 mb-4">Choose who should receive this reminder</p>

          <div class="max-h-96 overflow-y-auto space-y-2">
            <label
              v-for="recipient in availableRecipients"
              :key="recipient"
              class="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-md cursor-pointer"
            >
              <input
                type="checkbox"
                :checked="currentReminder?.recipients.includes(recipient)"
                @change="toggleRecipient(recipient)"
                class="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span class="text-sm text-gray-700">{{ recipient }}</span>
            </label>
          </div>

          <div class="flex gap-3 justify-end mt-6">
            <Button @click="showRecipientModal = false" variant="outline"> Cancel </Button>
            <Button @click="saveRecipients" variant="success"> Save Recipients </Button>
          </div>
        </div>
      </Modal>
    </div>
  </div>
</template>

<style scoped>
/* Add any component-specific styles here if needed */
</style>