<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Badge from '../../../components/Badge.vue'
import Button from '../../../components/Button.vue'
import Checkbox from '../../../components/Checkbox.vue'
import Input from '../../../components/Input.vue'
import Select from '../../../components/Select.vue'

const route = useRoute()
const router = useRouter()

const searchQuery = ref((route.query.q || '').toString())
const copiedKey = ref('')
const liveQuery = ref('Policy reminder')
const demoPlan = ref('starter')
const demoNotifications = ref(false)
const demoButtonLoading = ref(false)

const demoPlanOptions = [
  { value: 'starter', label: 'Starter' },
  { value: 'growth', label: 'Growth' },
  { value: 'enterprise', label: 'Enterprise' }
]

const componentGroups = [
  {
    title: 'Core UI',
    description: 'Foundational visual elements and primitives.',
    items: ['Avatar', 'Badge', 'Button', 'Divider', 'Icon', 'Image', 'Label', 'Link', 'Logo', 'Option', 'Text', 'Typography', 'ThemeConfigurator']
  },
  {
    title: 'Forms and Inputs',
    description: 'Data entry and selection controls.',
    items: ['Input', 'Textarea', 'Select', 'Checkbox', 'Radio', 'Switch', 'DatePicker', 'Slider', 'FileUpload', 'Search', 'FormField', 'InputGroup']
  },
  {
    title: 'Feedback and Overlay',
    description: 'Status communication and modal/notification patterns.',
    items: ['Alert', 'Notification', 'Toast', 'Loader', 'Spinner', 'Progress', 'ProgressBar', 'CircularProgress', 'Tooltip', 'Modal', 'ModalHeader', 'ModalBody', 'ModalFooter']
  },
  {
    title: 'Surface and Navigation',
    description: 'Navigation shells and composable container components.',
    items: ['Breadcrumb', 'ButtonGroup', 'Card', 'CardHeader', 'CardBody', 'CardFooter', 'CardContent', 'CardTitle', 'Dropdown', 'DropdownItem', 'ListItem', 'MenuItem', 'Sidebar', 'Header', 'Footer', 'Tab', 'TabPanel', 'Accordion', 'AccordionItem', 'Timeline', 'TimelineItem']
  },
  {
    title: 'Data and Visualization',
    description: 'Tables, calendar, and charting building blocks.',
    items: ['DataTable', 'DataTableHeader', 'DataTableRow', 'DataTableCell', 'DataTablePagination', 'DataTableFilters', 'DataTableToolBar', 'Calendar', 'EventsCalendar', 'Graph', 'GraphFilters', 'BarChart', 'LineChart', 'StackedBarChart', 'DashboardWidget']
  },
  {
    title: 'Workflow and Layouts',
    description: 'Workflow utilities and layout wrappers.',
    items: ['Stepper', 'StepperItem', 'ReusableForm', 'ReusableFormModal', 'ReminderConfig', 'AuthLayout', 'DefaultLayout', 'ErrorLayout']
  }
]

const usageExamples = {
  Toast: 'toast.success("Saved successfully")',
  Tooltip: '<Button v-tooltip="\'Helpful hint\'">Hover me</Button>'
}

const componentNotes = {
  Toast: 'Import toast utility: import { toast } from @stlhorizon/vue-ui',
  Tooltip: 'Use after registering plugin/directive.'
}

const componentsPlayground = `<template>\n  <div class="space-y-3">\n    <Input v-model="keyword" placeholder="Search keyword" />\n    <Select v-model="plan" :options="planOptions" placeholder="Choose plan" />\n    <Checkbox v-model="notify" label="Enable notifications" />\n    <Button :loading="saving" @click="save">Save Preferences</Button>\n  </div>\n</template>`

watch(
  () => route.query.q,
  (value) => {
    const incoming = (value || '').toString()
    if (incoming !== searchQuery.value) {
      searchQuery.value = incoming
    }
  }
)

watch(searchQuery, (value) => {
  const q = value.trim() || undefined
  if ((route.query.q || undefined) === q) return

  router.replace({
    query: {
      ...route.query,
      q
    }
  })
})

const normalizedSearch = computed(() => searchQuery.value.trim().toLowerCase())

const filteredGroups = computed(() => {
  return componentGroups
    .map((group) => {
      const filteredItems = group.items.filter((item) => item.toLowerCase().includes(normalizedSearch.value))
      return { ...group, filteredItems }
    })
    .filter((group) => group.filteredItems.length > 0)
})

const filteredComponentsCount = computed(() => {
  return filteredGroups.value.reduce((sum, group) => sum + group.filteredItems.length, 0)
})

const runDemoAction = () => {
  demoButtonLoading.value = true
  window.setTimeout(() => {
    demoButtonLoading.value = false
  }, 900)
}

const copySnippet = async (key, content) => {
  if (!navigator?.clipboard) return
  await navigator.clipboard.writeText(content)
  copiedKey.value = key
  window.setTimeout(() => {
    if (copiedKey.value === key) copiedKey.value = ''
  }, 1200)
}

const componentImportSnippet = (name) => `import { ${name} } from '@stlhorizon/vue-ui'`
const componentUsageSnippet = (name) => usageExamples[name] || `<${name} />`
</script>

<template>
  <div class="space-y-8">
    <article class="rounded-2xl border ui-border-strong ui-surface p-6">
      <h1 class="text-3xl font-bold">
        Components
      </h1>
      <p class="mt-3 text-lg leading-8 ui-text-muted">
        Try live controls and inspect usage snippets per component.
      </p>

      <div class="mt-4 grid gap-4 lg:grid-cols-2">
        <div class="rounded-xl border ui-border-strong ui-surface-soft p-4">
          <p class="text-xs font-semibold uppercase tracking-wide ui-text-muted">
            Interactive Playground
          </p>
          <div class="mt-3 space-y-3">
            <Input
              v-model="liveQuery"
              placeholder="Search reminders"
              clearable
            />
            <Select
              v-model="demoPlan"
              :options="demoPlanOptions"
              placeholder="Choose plan"
            />
            <Checkbox
              v-model="demoNotifications"
              label="Enable notifications"
              description="Toggle to test component state"
            />
            <div class="flex flex-wrap items-center gap-2">
              <Button
                variant="primary"
                :loading="demoButtonLoading"
                loading-text="Saving..."
                @click="runDemoAction"
              >
                Save Preferences
              </Button>
              <Badge variant="secondary">
                {{ liveQuery }}
              </Badge>
              <Badge variant="info">
                {{ demoPlan }}
              </Badge>
              <Badge :variant="demoNotifications ? 'success' : 'warning'">
                {{ demoNotifications ? 'On' : 'Off' }}
              </Badge>
            </div>
          </div>
        </div>

        <div class="rounded-xl border ui-border-strong bg-black/92 p-4">
          <div class="mb-2 flex items-center justify-between gap-3">
            <p class="text-xs font-semibold uppercase tracking-wide text-white/80">
              Playground Snippet
            </p>
            <button
              type="button"
              class="rounded-md border border-white/30 px-3 py-1 text-xs font-medium text-white hover:bg-white/10"
              @click="copySnippet('componentsPlayground', componentsPlayground)"
            >
              {{ copiedKey === 'componentsPlayground' ? 'Copied' : 'Copy' }}
            </button>
          </div>
          <pre class="overflow-x-auto text-sm text-white"><code>{{ componentsPlayground }}</code></pre>
        </div>
      </div>
    </article>

    <article class="rounded-2xl border ui-border-strong ui-surface p-6">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold">
            Reference
          </h2>
          <p class="mt-1 text-sm ui-text-muted">
            Showing {{ filteredComponentsCount }} components.
          </p>
        </div>
        <div class="w-full max-w-xs">
          <Input
            v-model="searchQuery"
            placeholder="Search components"
            clearable
          />
        </div>
      </div>

      <div class="mt-5 space-y-5">
        <article
          v-for="group in filteredGroups"
          :key="group.title"
          class="rounded-xl border ui-border-strong ui-surface-soft p-4"
        >
          <h3 class="text-lg font-semibold">
            {{ group.title }}
          </h3>
          <p class="mt-1 text-sm ui-text-muted">
            {{ group.description }}
          </p>

          <div class="mt-4 space-y-2">
            <details
              v-for="name in group.filteredItems"
              :key="name"
              class="rounded-lg border ui-border-strong ui-surface"
            >
              <summary class="cursor-pointer list-none px-3 py-2.5">
                <div class="flex items-center justify-between gap-3">
                  <span class="font-medium">{{ name }}</span>
                  <span class="text-xs ui-text-muted">View import and usage</span>
                </div>
              </summary>

              <div class="border-t ui-border-strong px-3 py-3">
                <p class="mb-2 text-xs font-semibold uppercase tracking-wide ui-text-muted">
                  Import
                </p>
                <div class="rounded-md border ui-border-strong bg-black/90 p-2.5">
                  <div class="mb-2 flex justify-end">
                    <button
                      type="button"
                      class="rounded-md border border-white/30 px-2 py-1 text-[11px] font-medium text-white hover:bg-white/10"
                      @click="copySnippet(`import-${name}`, componentImportSnippet(name))"
                    >
                      {{ copiedKey === `import-${name}` ? 'Copied' : 'Copy' }}
                    </button>
                  </div>
                  <pre class="overflow-x-auto text-xs text-white"><code>{{ componentImportSnippet(name) }}</code></pre>
                </div>

                <p class="mb-2 mt-3 text-xs font-semibold uppercase tracking-wide ui-text-muted">
                  Usage
                </p>
                <div class="rounded-md border ui-border-strong bg-black/90 p-2.5">
                  <div class="mb-2 flex justify-end">
                    <button
                      type="button"
                      class="rounded-md border border-white/30 px-2 py-1 text-[11px] font-medium text-white hover:bg-white/10"
                      @click="copySnippet(`usage-${name}`, componentUsageSnippet(name))"
                    >
                      {{ copiedKey === `usage-${name}` ? 'Copied' : 'Copy' }}
                    </button>
                  </div>
                  <pre class="overflow-x-auto text-xs text-white"><code>{{ componentUsageSnippet(name) }}</code></pre>
                </div>

                <p
                  v-if="componentNotes[name]"
                  class="mt-2 text-xs ui-text-muted"
                >
                  {{ componentNotes[name] }}
                </p>
              </div>
            </details>
          </div>
        </article>
      </div>
    </article>
  </div>
</template>

<style scoped>
summary::-webkit-details-marker {
  display: none;
}
</style>
