<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import Input from '../../components/Input.vue'
import DevComponentPreview from './DevComponentPreview.vue'
import { categoryOrder, getComponentDocs, loadComponentBySlug } from '../docs/componentDocs.js'

const searchQuery = ref('')
const loading = ref(true)
const entries = ref([])

const sampleOptions = [
  { label: 'Option A', value: 'a' },
  { label: 'Option B', value: 'b' },
  { label: 'Option C', value: 'c' }
]

const sampleRows = [
  { id: 1, name: 'Jordan Blake', email: 'jordan@example.com', role: 'Admin', status: 'active' },
  { id: 2, name: 'Casey Moore', email: 'casey@example.com', role: 'Manager', status: 'pending' }
]

const sampleColumns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' }
]

const sampleFields = [
  {
    name: 'name',
    label: 'Full Name',
    type: 'text',
    required: true,
    placeholder: 'Jordan Blake',
    wrapperClass: 'col-span-12 md:col-span-6'
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    required: true,
    placeholder: 'jordan@example.com',
    wrapperClass: 'col-span-12 md:col-span-6'
  }
]

const componentExamplePresets = {
  Button: [
    { label: 'Primary', props: { variant: 'primary', size: 'default' }, slot: 'Save' },
    { label: 'Outline', props: { variant: 'outline', size: 'default' }, slot: 'Cancel' }
  ],
  Badge: [
    { label: 'Info', props: { variant: 'info' }, slot: 'Info' },
    { label: 'Success', props: { variant: 'success' }, slot: 'Success' }
  ],
  Input: [
    { label: 'Text', props: { modelValue: 'Preview text', placeholder: 'Type here', clearable: true } }
  ],
  Select: [
    { label: 'Select', props: { modelValue: 'a', options: sampleOptions, placeholder: 'Pick an option' } }
  ],
  Checkbox: [
    { label: 'Unchecked', props: { modelValue: false, label: 'Enable notifications' } },
    { label: 'Checked', props: { modelValue: true, label: 'Enable notifications' } }
  ],
  Progress: [
    { label: 'Progress', props: { value: 45 } }
  ],
  Avatar: [
    { label: 'Initials', props: { initials: 'KV' } }
  ],
  Alert: [
    { label: 'Info', props: { title: 'Heads up', description: 'Alert preview', variant: 'info' } }
  ],
  DataTable: [
    { label: 'DataTable', props: { data: sampleRows, columns: sampleColumns, showPagination: false } }
  ],
  ReusableFormModal: [
    { label: 'Modal Closed', props: { modelValue: false, modalType: 'create', entityName: 'User', fields: sampleFields } }
  ]
}

const slotComponents = new Set(['Button', 'Badge', 'Text', 'Link', 'Option'])

const specialDefaults = {
  options: () => sampleOptions,
  items: () => [
    { id: 'item-1', title: 'First item', content: 'Item content' },
    { id: 'item-2', title: 'Second item', content: 'Another item content' }
  ],
  columns: () => sampleColumns,
  data: () => sampleRows,
  fields: () => sampleFields,
  modalType: () => 'create',
  entityName: () => 'Item',
  title: () => 'Sample title',
  description: () => 'Sample description',
  label: () => 'Sample label',
  placeholder: () => 'Sample placeholder',
  src: () => 'https://via.placeholder.com/64',
  initials: () => 'KV',
  show: () => false,
  modelValue: (types) => {
    if (types.includes('Boolean')) return false
    if (types.includes('Number')) return 10
    if (types.includes('Array')) return []
    if (types.includes('Object')) return {}
    return 'Sample value'
  }
}

const parseTypeName = (typeValue) => {
  if (!typeValue) return 'any'

  if (Array.isArray(typeValue)) {
    return typeValue.flatMap((entry) => parseTypeName(entry))
  }

  if (typeof typeValue === 'function') {
    return [typeValue.name || 'Function']
  }

  if (typeof typeValue === 'string') {
    return [typeValue]
  }

  return [typeValue.constructor?.name || 'Object']
}

const resolveTypeList = (definition) => {
  if (!definition) return ['any']

  if (Array.isArray(definition) || typeof definition === 'function') {
    return parseTypeName(definition)
  }

  if (definition.type) {
    return parseTypeName(definition.type)
  }

  return ['any']
}

const cloneValue = (value) => {
  if (value === undefined || value === null) return value
  if (typeof value !== 'object') return value

  try {
    return JSON.parse(JSON.stringify(value))
  } catch {
    return value
  }
}

const defaultByTypes = (types) => {
  if (types.includes('Boolean')) return false
  if (types.includes('Number')) return 0
  if (types.includes('Array')) return []
  if (types.includes('Object')) return {}
  return ''
}

const readRuntimeDefault = (definition, types) => {
  if (!definition || typeof definition !== 'object') return undefined
  if (!Object.prototype.hasOwnProperty.call(definition, 'default')) return undefined

  const runtimeDefault = definition.default

  if (typeof runtimeDefault !== 'function') return cloneValue(runtimeDefault)
  if (types.includes('Function')) return runtimeDefault

  try {
    return cloneValue(runtimeDefault())
  } catch {
    return undefined
  }
}

const buildAutoBindings = (componentName, propsDefinition) => {
  if (!propsDefinition) return {}

  const output = {}

  const normalizedEntries = Array.isArray(propsDefinition)
    ? propsDefinition.map((name) => [name, null])
    : Object.entries(propsDefinition)

  for (const [propName, definition] of normalizedEntries) {
    const types = resolveTypeList(definition)
    const required = Boolean(definition?.required)

    let value

    if (specialDefaults[propName]) {
      const resolver = specialDefaults[propName]
      value = cloneValue(typeof resolver === 'function' ? resolver(types, componentName) : resolver)
    } else {
      value = readRuntimeDefault(definition, types)

      if (value === undefined && required) {
        value = defaultByTypes(types)
      }
    }

    if (value !== undefined) {
      output[propName] = value
    }
  }

  return output
}

const defaultSlotText = (componentName) => {
  if (!slotComponents.has(componentName)) return ''
  return `${componentName} example`
}

const loadEntries = async () => {
  loading.value = true

  const docs = getComponentDocs()

  const loadedEntries = await Promise.all(
    docs.map(async (docEntry) => {
      try {
        const loadedComponent = await loadComponentBySlug(docEntry.slug)
        const runtimeComponent = loadedComponent?.__vccOpts || loadedComponent || null

        const presetExamples = componentExamplePresets[docEntry.name]
        const examples = presetExamples
          ? presetExamples.map((example) => ({
              label: example.label,
              props: { ...example.props },
              slot: example.slot || defaultSlotText(docEntry.name)
            }))
          : [
              {
                label: 'Default',
                props: buildAutoBindings(docEntry.name, runtimeComponent?.props),
                slot: defaultSlotText(docEntry.name)
              }
            ]

        return {
          ...docEntry,
          loadedComponent,
          examples,
          loadError: ''
        }
      } catch (error) {
        return {
          ...docEntry,
          loadedComponent: null,
          examples: [],
          loadError: error instanceof Error ? error.message : 'Failed to load component.'
        }
      }
    })
  )

  entries.value = loadedEntries
  loading.value = false
}

const normalizedSearch = computed(() => searchQuery.value.trim().toLowerCase())

const groupedEntries = computed(() => {
  return categoryOrder
    .map((category) => {
      const items = entries.value.filter((entry) => {
        if (entry.category !== category) return false
        if (!normalizedSearch.value) return true
        return entry.name.toLowerCase().includes(normalizedSearch.value)
      })

      return {
        category,
        items
      }
    })
    .filter((group) => group.items.length > 0)
})

onMounted(loadEntries)
</script>

<template>
  <div class="min-h-screen ui-bg p-5 sm:p-8">
    <div class="mx-auto max-w-[1700px] space-y-6">
      <header class="rounded-2xl border ui-border-strong ui-surface p-6">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.16em] ui-text-muted">
              Local Development
            </p>
            <h1 class="mt-2 text-3xl font-bold">
              Components Dev Showcase
            </h1>
            <p class="mt-2 max-w-3xl text-sm ui-text-muted">
              This page is local-only (`/dev/showcase`) so you can preview component behavior quickly while editing.
              It uses preset/default props and does not require manual JSON typing.
            </p>
          </div>

          <RouterLink
            to="/components/components"
            class="rounded-md border ui-border-strong px-3 py-1.5 text-sm font-medium hover:bg-(--ui-surface-soft)"
          >
            Open Docs Components Page
          </RouterLink>
        </div>

        <div class="mt-4 max-w-sm">
          <Input
            v-model="searchQuery"
            placeholder="Filter components"
            clearable
          />
        </div>
      </header>

      <article
        v-if="loading"
        class="rounded-2xl border ui-border-strong ui-surface p-6"
      >
        <p class="text-sm ui-text-muted">
          Loading components...
        </p>
      </article>

      <section
        v-for="group in groupedEntries"
        :key="group.category"
        class="space-y-3"
      >
        <h2 class="text-xl font-semibold">
          {{ group.category }}
        </h2>

        <div class="grid gap-4 xl:grid-cols-2">
          <article
            v-for="entry in group.items"
            :key="entry.slug"
            class="rounded-2xl border ui-border-strong ui-surface p-4"
          >
            <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 class="text-lg font-semibold">
                  {{ entry.name }}
                </h3>
                <p class="text-xs ui-text-muted">
                  {{ entry.sourcePath || 'Source path unavailable' }}
                </p>
              </div>

              <RouterLink
                :to="`/components/components/${entry.slug}`"
                class="rounded-md border ui-border-strong px-2.5 py-1 text-xs font-medium hover:bg-(--ui-surface-soft)"
              >
                Detailed Playground
              </RouterLink>
            </div>

            <p
              v-if="entry.loadError"
              class="text-xs ui-danger"
            >
              Failed to load component: {{ entry.loadError }}
            </p>

            <div
              v-else
              class="space-y-2"
            >
              <section
                v-for="(example, index) in entry.examples"
                :key="`${entry.slug}-${index}`"
                class="space-y-1"
              >
                <p class="text-[11px] font-semibold uppercase tracking-wide ui-text-muted">
                  {{ example.label }}
                </p>
                <DevComponentPreview
                  :component="entry.loadedComponent"
                  :component-name="entry.name"
                  :bindings="example.props"
                  :slot-text="example.slot"
                />
              </section>
            </div>
          </article>
        </div>
      </section>
    </div>
  </div>
</template>
