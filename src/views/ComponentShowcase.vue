<script setup>
import { computed, ref } from 'vue'
import Badge from '../components/Badge.vue'
import Button from '../components/Button.vue'
import Input from '../components/Input.vue'

const packageName = '@stlhorizon/vue-ui'
const packageVersion = '3.27.10'

const sectionLinks = [
  { id: 'setup-intro', label: 'Setup' },
  { id: 'download', label: 'Download' },
  { id: 'plugin', label: 'Plugin' },
  { id: 'theme', label: 'Theme' },
  { id: 'verify', label: 'Verify' },
  { id: 'deployment', label: 'Deploy' },
  { id: 'component-reference', label: 'Components' }
]

const selectedManager = ref('npm')
const copiedKey = ref('')
const componentSearch = ref('')
const liveQuery = ref('Policy reminder')

const installCommands = {
  npm: `npm install ${packageName}`,
  pnpm: `pnpm add ${packageName}`,
  yarn: `yarn add ${packageName}`,
  bun: `bun add ${packageName}`
}

const setupSnippets = {
  pluginInstall: `import { createApp } from 'vue'\nimport App from './App.vue'\nimport VueUI, { initTheme } from '${packageName}'\nimport '${packageName}/css'\n\nconst app = createApp(App)\n\ninitTheme()\napp.use(VueUI)\napp.mount('#app')`,
  prefixedPlugin: `import { createApp } from 'vue'\nimport App from './App.vue'\nimport VueUI from '${packageName}'\nimport '${packageName}/css'\n\nconst app = createApp(App)\n\napp.use(VueUI, { prefix: 'Ui' })\napp.mount('#app')`,
  treeShaking: `import { createApp } from 'vue'\nimport App from './App.vue'\nimport { Button, Input, Card } from '${packageName}'\nimport '${packageName}/css'\n\nconst app = createApp(App)\n\napp.component('Button', Button)\napp.component('Input', Input)\napp.component('Card', Card)\napp.mount('#app')`,
  verify: `# local check\nnpm run dev\n\n# build docs output\nnpm run build:docs`,
  deploy: `# for vercel\nnpm run build:docs\n\n# output folder\ndist-docs/`,
  firstUsage: `<template>\n  <div class=\"space-y-3\">\n    <Input v-model=\"query\" placeholder=\"Search reminders\" />\n    <Button variant=\"primary\">Run Search</Button>\n  </div>\n</template>\n\n<script setup>\nimport { ref } from 'vue'\nimport { Input, Button } from '${packageName}'\n\nconst query = ref('')\n<\\/script>`
}

const allExportedComponents = [
  'Avatar',
  'Badge',
  'Button',
  'Checkbox',
  'Divider',
  'Icon',
  'Image',
  'Input',
  'Label',
  'Link',
  'Logo',
  'Option',
  'CircularProgress',
  'Progress',
  'ProgressBar',
  'Radio',
  'Select',
  'Spinner',
  'Switch',
  'Text',
  'Textarea',
  'Tooltip',
  'Typography',
  'ThemeConfigurator',
  'Loader',
  'Alert',
  'Breadcrumb',
  'ButtonGroup',
  'Card',
  'CardHeader',
  'CardBody',
  'CardFooter',
  'CardContent',
  'CardTitle',
  'DatePicker',
  'Dropdown',
  'DropdownItem',
  'FileUpload',
  'FormField',
  'InputGroup',
  'ListItem',
  'MenuItem',
  'Modal',
  'ModalHeader',
  'ModalBody',
  'ModalFooter',
  'Notification',
  'Toast',
  'Search',
  'Slider',
  'BarChart',
  'GraphFilters',
  'LineChart',
  'StackedBarChart',
  'Stepper',
  'StepperItem',
  'Tab',
  'TabPanel',
  'Accordion',
  'Graph',
  'AccordionItem',
  'Calendar',
  'EventsCalendar',
  'DataTable',
  'DataTableHeader',
  'DataTableRow',
  'DataTableCell',
  'DataTablePagination',
  'DataTableFilters',
  'DataTableToolBar',
  'Footer',
  'Header',
  'ReusableFormModal',
  'ReusableForm',
  'Sidebar',
  'Timeline',
  'TimelineItem',
  'AuthLayout',
  'DefaultLayout',
  'ErrorLayout',
  'DashboardWidget',
  'ReminderConfig'
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
  Accordion: '<Accordion :items="items" />',
  AccordionItem: '<AccordionItem title="Section title">Content</AccordionItem>',
  Alert: '<Alert variant="success" title="Saved" message="Changes have been saved." />',
  AuthLayout: '<AuthLayout><LoginPage /></AuthLayout>',
  Avatar: '<Avatar initials="JD" size="md" />',
  Badge: '<Badge variant="success">Active</Badge>',
  BarChart: '<BarChart :data="data" :labels="labels" />',
  Breadcrumb: '<Breadcrumb :items="items" />',
  Button: '<Button variant="primary">Save</Button>',
  ButtonGroup: '<ButtonGroup><Button>Day</Button><Button>Week</Button></ButtonGroup>',
  Calendar: '<Calendar v-model="selectedDate" />',
  Card: '<Card title="Overview">Card content</Card>',
  CardBody: '<CardBody>Body content</CardBody>',
  CardContent: '<CardContent>Content area</CardContent>',
  CardFooter: '<CardFooter>Footer actions</CardFooter>',
  CardHeader: '<CardHeader>Header text</CardHeader>',
  CardTitle: '<CardTitle>Quarterly Summary</CardTitle>',
  Checkbox: '<Checkbox v-model="accepted" label="Accept policy" />',
  CircularProgress: '<CircularProgress :value="72" />',
  DashboardWidget: '<DashboardWidget title="Open tasks" :value="14" />',
  DataTable: '<DataTable :rows="rows" :columns="columns" />',
  DataTableCell: '<DataTableCell :value="row.name" />',
  DataTableFilters: '<DataTableFilters :filters="filters" />',
  DataTableHeader: '<DataTableHeader :columns="columns" />',
  DataTablePagination: '<DataTablePagination :page="1" :total="100" />',
  DataTableRow: '<DataTableRow :row="row" />',
  DataTableToolBar: '<DataTableToolBar title="Users" />',
  DatePicker: '<DatePicker v-model="date" />',
  DefaultLayout: '<DefaultLayout><RouterView /></DefaultLayout>',
  Divider: '<Divider />',
  Dropdown: '<Dropdown :items="items" />',
  DropdownItem: '<DropdownItem label="Edit" />',
  ErrorLayout: '<ErrorLayout code="404" title="Not Found" />',
  EventsCalendar: '<EventsCalendar :events="events" />',
  FileUpload: '<FileUpload @files-selected="onFiles" />',
  Footer: '<Footer company-name="STL Horizon" />',
  FormField: '<FormField label="Email"><Input v-model="email" /></FormField>',
  Graph: '<Graph :series="series" />',
  GraphFilters: '<GraphFilters :filters="filters" />',
  Header: '<Header :user="user" :profile-menu-items="menuItems" />',
  Icon: '<Icon icon="check" class="w-4 h-4" />',
  Image: '<Image src="/hero.png" alt="Hero image" />',
  Input: '<Input v-model="value" placeholder="Enter value" />',
  InputGroup: '<InputGroup><Input /><Button>Go</Button></InputGroup>',
  Label: '<Label for="name">Name</Label>',
  LineChart: '<LineChart :data="lineData" :labels="labels" />',
  Link: '<Link href="/dashboard">Open Dashboard</Link>',
  ListItem: '<ListItem>List content</ListItem>',
  Loader: '<Loader text="Loading data" />',
  Logo: '<Logo text="STL Horizon" />',
  MenuItem: '<MenuItem label="Settings" icon="cog" />',
  Modal: '<Modal v-model="open">Modal content</Modal>',
  ModalBody: '<ModalBody>Body text</ModalBody>',
  ModalFooter: '<ModalFooter><Button>Close</Button></ModalFooter>',
  ModalHeader: '<ModalHeader title="Confirm action" />',
  Notification: '<Notification title="Update" description="Profile updated." />',
  Option: '<Option value="active" label="Active" />',
  Progress: '<Progress :value="55" />',
  ProgressBar: '<ProgressBar :value="80" />',
  Radio: '<Radio v-model="plan" value="pro" label="Pro" />',
  ReminderConfig: '<ReminderConfig :models="models" />',
  ReusableForm: '<ReusableForm :fields="fields" @submit="onSubmit" />',
  ReusableFormModal: '<ReusableFormModal v-model="open" :fields="fields" />',
  Search: '<Search v-model="query" placeholder="Search" />',
  Select: '<Select v-model="selected" :options="options" />',
  Sidebar: '<Sidebar :items="navItems" />',
  Slider: '<Slider v-model="value" :min="0" :max="100" />',
  Spinner: '<Spinner size="md" />',
  StackedBarChart: '<StackedBarChart :series="series" :labels="labels" />',
  Stepper: '<Stepper :items="steps" :current-step="2" />',
  StepperItem: '<StepperItem :step="1" title="Draft" />',
  Switch: '<Switch v-model="enabled" label="Enable alerts" />',
  Tab: '<Tab label="Overview" />',
  TabPanel: '<TabPanel name="overview">Panel content</TabPanel>',
  Text: '<Text as="p">Supporting copy</Text>',
  Textarea: '<Textarea v-model="notes" rows="4" />',
  ThemeConfigurator: '<ThemeConfigurator />',
  Timeline: '<Timeline :items="items" />',
  TimelineItem: '<TimelineItem title="Submitted" />',
  Toast: 'toast.success("Saved successfully")',
  Tooltip: '<Button v-tooltip="\'Helpful hint\'">Hover me</Button>',
  Typography: '<Typography variant="body-sm">Readable text</Typography>'
}

const componentNotes = {
  Toast: 'Import the utility from the package: import { toast } from @stlhorizon/vue-ui',
  Tooltip: 'Use as a directive after registering plugin or directive.',
  AuthLayout: 'Layout wrapper for authentication pages.',
  DefaultLayout: 'Layout wrapper for standard application pages.',
  ErrorLayout: 'Layout wrapper for error states and fallback pages.'
}

const installCommand = computed(() => installCommands[selectedManager.value])
const groupedNames = computed(() => componentGroups.flatMap((group) => group.items))
const uncategorizedComponents = computed(() => allExportedComponents.filter((name) => !groupedNames.value.includes(name)))
const normalizedSearch = computed(() => componentSearch.value.trim().toLowerCase())

const filteredGroups = computed(() => {
  return componentGroups
    .map((group) => {
      const filteredItems = group.items.filter((item) => item.toLowerCase().includes(normalizedSearch.value))
      return { ...group, filteredItems }
    })
    .filter((group) => group.filteredItems.length > 0)
})

const filteredUncategorized = computed(() => {
  return uncategorizedComponents.value.filter((item) => item.toLowerCase().includes(normalizedSearch.value))
})

const filteredComponentsCount = computed(() => {
  const groupedCount = filteredGroups.value.reduce((sum, group) => sum + group.filteredItems.length, 0)
  return groupedCount + filteredUncategorized.value.length
})

const scrollToSection = (id) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const copySnippet = async (key, content) => {
  if (!navigator?.clipboard) return

  await navigator.clipboard.writeText(content)
  copiedKey.value = key

  window.setTimeout(() => {
    if (copiedKey.value === key) copiedKey.value = ''
  }, 1200)
}

const componentImportSnippet = (name) => `import { ${name} } from '${packageName}'`
const componentUsageSnippet = (name) => usageExamples[name] || `<${name} />`
</script>

<template>
  <div class="min-h-screen ui-bg docs-shell">
    <header class="sticky top-0 z-50 border-b ui-border-strong bg-[color:color-mix(in oklab, var(--ui-surface), transparent 6%)] backdrop-blur-md">
      <div class="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div class="flex items-center gap-3">
          <div class="flex h-9 w-9 items-center justify-center rounded-lg docs-brand-chip text-sm font-bold text-white">
            UI
          </div>
          <div>
            <p class="text-sm font-semibold">
              STL Horizon Vue UI
            </p>
            <p class="text-xs ui-text-muted">
              Setup Guide v{{ packageVersion }}
            </p>
          </div>
        </div>

        <div class="hidden items-center gap-2 md:flex">
          <button
            v-for="link in sectionLinks"
            :key="link.id"
            type="button"
            class="rounded-md border ui-border-strong px-3 py-1.5 text-xs font-medium hover:bg-(--ui-surface-soft)"
            @click="scrollToSection(link.id)"
          >
            {{ link.label }}
          </button>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
      <div class="grid gap-8 xl:grid-cols-[240px,minmax(0,1fr),220px]">
        <aside class="xl:sticky xl:top-24 xl:h-fit">
          <div class="rounded-2xl border ui-border-strong ui-surface p-4">
            <p class="text-xs font-semibold uppercase tracking-[0.16em] ui-text-muted">
              Getting Started
            </p>
            <div class="mt-3 space-y-1">
              <button
                v-for="link in sectionLinks"
                :key="`left-${link.id}`"
                type="button"
                class="block w-full rounded-md px-2 py-2 text-left text-sm font-medium hover:bg-(--ui-surface-soft)"
                @click="scrollToSection(link.id)"
              >
                {{ link.label }}
              </button>
            </div>
          </div>
        </aside>

        <div class="space-y-8">
          <section
            id="setup-intro"
            class="rounded-2xl border ui-border-strong ui-surface p-6 docs-hero"
          >
            <p class="text-xs font-semibold uppercase tracking-[0.18em] ui-text-muted">
              Setup
            </p>
            <h1 class="mt-2 text-3xl font-bold sm:text-4xl">
              Install and configure STL Horizon Vue UI
            </h1>
            <p class="mt-3 max-w-3xl text-sm sm:text-base ui-text-muted">
              This page is modeled after modern component-library documentation: quick install, plugin registration,
              theme setup, verification, and a complete component catalog with ready-to-copy usage snippets.
            </p>

            <div class="mt-5 flex flex-wrap items-center gap-2">
              <Badge variant="success">
                82 exported components
              </Badge>
              <Badge variant="primary">
                Global plugin + tree-shaking support
              </Badge>
              <Badge variant="warning">
                Vue 3.5+ peer dependency
              </Badge>
            </div>
          </section>

          <section
            id="download"
            class="rounded-2xl border ui-border-strong ui-surface p-6"
          >
            <p class="text-xs font-semibold uppercase tracking-[0.16em] ui-text-muted">
              Download
            </p>
            <h2 class="mt-2 text-2xl font-bold">
              Add package dependency
            </h2>

            <div class="mt-4 flex flex-wrap gap-2">
              <button
                v-for="manager in ['npm', 'pnpm', 'yarn', 'bun']"
                :key="manager"
                type="button"
                :class="[
                  'rounded-md border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide',
                  selectedManager === manager
                    ? 'ui-primary-bg border-(--ui-primary)'
                    : 'ui-border-strong hover:bg-(--ui-surface-soft)'
                ]"
                @click="selectedManager = manager"
              >
                {{ manager }}
              </button>
            </div>

            <div class="mt-4 rounded-xl border ui-border-strong bg-black/92 p-4">
              <div class="mb-2 flex items-center justify-between gap-3">
                <p class="text-xs font-semibold uppercase tracking-wide text-white/80">
                  Install Command
                </p>
                <button
                  type="button"
                  class="rounded-md border border-white/30 px-3 py-1 text-xs font-medium text-white hover:bg-white/10"
                  @click="copySnippet('install', installCommand)"
                >
                  {{ copiedKey === 'install' ? 'Copied' : 'Copy' }}
                </button>
              </div>
              <pre class="overflow-x-auto text-sm text-white"><code>{{ installCommand }}</code></pre>
            </div>
          </section>

          <section
            id="plugin"
            class="rounded-2xl border ui-border-strong ui-surface p-6"
          >
            <p class="text-xs font-semibold uppercase tracking-[0.16em] ui-text-muted">
              Plugin
            </p>
            <h2 class="mt-2 text-2xl font-bold">
              Register globally in <code class="font-mono">main.js</code>
            </h2>

            <div class="mt-4 rounded-xl border ui-border-strong bg-black/92 p-4">
              <div class="mb-2 flex items-center justify-between gap-3">
                <p class="text-xs font-semibold uppercase tracking-wide text-white/80">
                  Global Plugin Setup
                </p>
                <button
                  type="button"
                  class="rounded-md border border-white/30 px-3 py-1 text-xs font-medium text-white hover:bg-white/10"
                  @click="copySnippet('pluginInstall', setupSnippets.pluginInstall)"
                >
                  {{ copiedKey === 'pluginInstall' ? 'Copied' : 'Copy' }}
                </button>
              </div>
              <pre class="overflow-x-auto text-sm text-white"><code>{{ setupSnippets.pluginInstall }}</code></pre>
            </div>

            <div class="mt-4 rounded-xl border ui-border-strong ui-surface-soft p-4">
              <p class="text-sm font-semibold">
                Optional prefix strategy
              </p>
              <p class="mt-1 text-sm ui-text-muted">
                Use prefixes in large codebases to avoid global component name collisions.
              </p>
              <div class="mt-3 rounded-lg border ui-border-strong bg-black/92 p-3">
                <div class="mb-2 flex items-center justify-between gap-3">
                  <p class="text-xs font-semibold uppercase tracking-wide text-white/80">
                    Prefixed Plugin Setup
                  </p>
                  <button
                    type="button"
                    class="rounded-md border border-white/30 px-3 py-1 text-xs font-medium text-white hover:bg-white/10"
                    @click="copySnippet('prefixedPlugin', setupSnippets.prefixedPlugin)"
                  >
                    {{ copiedKey === 'prefixedPlugin' ? 'Copied' : 'Copy' }}
                  </button>
                </div>
                <pre class="overflow-x-auto text-sm text-white"><code>{{ setupSnippets.prefixedPlugin }}</code></pre>
              </div>
            </div>
          </section>

          <section
            id="theme"
            class="rounded-2xl border ui-border-strong ui-surface p-6"
          >
            <p class="text-xs font-semibold uppercase tracking-[0.16em] ui-text-muted">
              Theme
            </p>
            <h2 class="mt-2 text-2xl font-bold">
              Use component-level imports (tree-shaking)
            </h2>

            <div class="mt-4 rounded-xl border ui-border-strong bg-black/92 p-4">
              <div class="mb-2 flex items-center justify-between gap-3">
                <p class="text-xs font-semibold uppercase tracking-wide text-white/80">
                  Selective Import Pattern
                </p>
                <button
                  type="button"
                  class="rounded-md border border-white/30 px-3 py-1 text-xs font-medium text-white hover:bg-white/10"
                  @click="copySnippet('treeShaking', setupSnippets.treeShaking)"
                >
                  {{ copiedKey === 'treeShaking' ? 'Copied' : 'Copy' }}
                </button>
              </div>
              <pre class="overflow-x-auto text-sm text-white"><code>{{ setupSnippets.treeShaking }}</code></pre>
            </div>

            <p class="mt-4 text-sm ui-text-muted">
              Theme helpers are exported from the package: <code class="font-mono">initTheme</code>, <code class="font-mono">setTheme</code>,
              <code class="font-mono">setMode</code>, <code class="font-mono">getTheme</code>, and <code class="font-mono">getMode</code>.
            </p>
          </section>

          <section
            id="verify"
            class="rounded-2xl border ui-border-strong ui-surface p-6"
          >
            <p class="text-xs font-semibold uppercase tracking-[0.16em] ui-text-muted">
              Verify
            </p>
            <h2 class="mt-2 text-2xl font-bold">
              Validate setup with a first component
            </h2>

            <div class="mt-4 grid gap-4 lg:grid-cols-2">
              <div class="rounded-xl border ui-border-strong ui-surface-soft p-4">
                <p class="text-xs font-semibold uppercase tracking-wide ui-text-muted">
                  Live preview
                </p>
                <div class="mt-3 space-y-3">
                  <Input
                    v-model="liveQuery"
                    placeholder="Search reminders"
                    clearable
                  />
                  <div class="flex flex-wrap items-center gap-2">
                    <Button variant="primary">
                      Run Search
                    </Button>
                    <Badge variant="secondary">
                      Query: {{ liveQuery }}
                    </Badge>
                  </div>
                </div>
              </div>

              <div class="rounded-xl border ui-border-strong bg-black/92 p-4">
                <div class="mb-2 flex items-center justify-between gap-3">
                  <p class="text-xs font-semibold uppercase tracking-wide text-white/80">
                    Usage Snippet
                  </p>
                  <button
                    type="button"
                    class="rounded-md border border-white/30 px-3 py-1 text-xs font-medium text-white hover:bg-white/10"
                    @click="copySnippet('firstUsage', setupSnippets.firstUsage)"
                  >
                    {{ copiedKey === 'firstUsage' ? 'Copied' : 'Copy' }}
                  </button>
                </div>
                <pre class="overflow-x-auto text-sm text-white"><code>{{ setupSnippets.firstUsage }}</code></pre>
              </div>
            </div>

            <div class="mt-4 rounded-xl border ui-border-strong bg-black/92 p-4">
              <div class="mb-2 flex items-center justify-between gap-3">
                <p class="text-xs font-semibold uppercase tracking-wide text-white/80">
                  Verification Commands
                </p>
                <button
                  type="button"
                  class="rounded-md border border-white/30 px-3 py-1 text-xs font-medium text-white hover:bg-white/10"
                  @click="copySnippet('verify', setupSnippets.verify)"
                >
                  {{ copiedKey === 'verify' ? 'Copied' : 'Copy' }}
                </button>
              </div>
              <pre class="overflow-x-auto text-sm text-white"><code>{{ setupSnippets.verify }}</code></pre>
            </div>
          </section>

          <section
            id="deployment"
            class="rounded-2xl border ui-border-strong ui-surface p-6"
          >
            <p class="text-xs font-semibold uppercase tracking-[0.16em] ui-text-muted">
              Deploy
            </p>
            <h2 class="mt-2 text-2xl font-bold">
              Vercel deployment output
            </h2>
            <p class="mt-2 text-sm ui-text-muted">
              This project is configured to build docs to <code class="font-mono">dist-docs</code> with <code class="font-mono">npm run build:docs</code>.
            </p>

            <div class="mt-4 rounded-xl border ui-border-strong bg-black/92 p-4">
              <div class="mb-2 flex items-center justify-between gap-3">
                <p class="text-xs font-semibold uppercase tracking-wide text-white/80">
                  Deploy Commands
                </p>
                <button
                  type="button"
                  class="rounded-md border border-white/30 px-3 py-1 text-xs font-medium text-white hover:bg-white/10"
                  @click="copySnippet('deploy', setupSnippets.deploy)"
                >
                  {{ copiedKey === 'deploy' ? 'Copied' : 'Copy' }}
                </button>
              </div>
              <pre class="overflow-x-auto text-sm text-white"><code>{{ setupSnippets.deploy }}</code></pre>
            </div>
          </section>

          <section
            id="component-reference"
            class="rounded-2xl border ui-border-strong ui-surface p-6"
          >
            <div class="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.16em] ui-text-muted">
                  Components
                </p>
                <h2 class="mt-2 text-2xl font-bold">
                  Full component reference
                </h2>
                <p class="mt-1 text-sm ui-text-muted">
                  Showing {{ filteredComponentsCount }} of {{ allExportedComponents.length }} exported components.
                </p>
              </div>
              <div class="w-full max-w-xs">
                <Input
                  v-model="componentSearch"
                  placeholder="Filter by component name"
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

              <article
                v-if="filteredUncategorized.length > 0"
                class="rounded-xl border ui-border-strong ui-surface-soft p-4"
              >
                <h3 class="text-lg font-semibold">
                  Uncategorized
                </h3>
                <p class="mt-1 text-sm ui-text-muted">
                  Components not yet grouped.
                </p>

                <div class="mt-3 flex flex-wrap gap-2">
                  <span
                    v-for="name in filteredUncategorized"
                    :key="name"
                    class="rounded-full border ui-border-strong px-2.5 py-1 text-xs font-medium"
                  >
                    {{ name }}
                  </span>
                </div>
              </article>
            </div>
          </section>
        </div>

        <aside class="hidden xl:block xl:sticky xl:top-24 xl:h-fit">
          <div class="rounded-2xl border ui-border-strong ui-surface p-4">
            <p class="text-xs font-semibold uppercase tracking-[0.16em] ui-text-muted">
              On this page
            </p>
            <div class="mt-3 space-y-1">
              <button
                v-for="link in sectionLinks"
                :key="`right-${link.id}`"
                type="button"
                class="block w-full rounded-md px-2 py-1.5 text-left text-xs font-medium hover:bg-(--ui-surface-soft)"
                @click="scrollToSection(link.id)"
              >
                {{ link.label }}
              </button>
            </div>
          </div>
        </aside>
      </div>
    </main>
  </div>
</template>

<style scoped>
.docs-brand-chip {
  background: linear-gradient(135deg, #156df9 0%, #00a7ff 100%);
}

.docs-shell {
  background:
    radial-gradient(circle at 8% -4%, color-mix(in oklab, var(--ui-primary), transparent 88%) 0%, transparent 45%),
    radial-gradient(circle at 100% 0%, color-mix(in oklab, var(--ui-accent), transparent 92%) 0%, transparent 40%),
    var(--ui-bg);
}

.docs-hero {
  background:
    linear-gradient(
      135deg,
      color-mix(in oklab, var(--ui-surface), transparent 0%) 0%,
      color-mix(in oklab, var(--ui-primary-soft), transparent 65%) 100%
    );
}

summary::-webkit-details-marker {
  display: none;
}
</style>
