<script setup>
import Toast from './components/Toast.vue';
import Button from './components/Button.vue';
import Input from './components/Input.vue';
import Card from './components/Card.vue';
import Modal from './components/Modal.vue';
import Alert from './components/Alert.vue';
import Select from './components/Select.vue';
import Checkbox from './components/Checkbox.vue';
import Radio from './components/Radio.vue';
import Textarea from './components/Textarea.vue';
import FileUpload from './components/FileUpload.vue';
import Accordion from './components/Accordion.vue';
import Progress from './components/Progress.vue';
import Spinner from './components/Spinner.vue';
import Loader from './components/Loader.vue';
import Icon from './components/Icon.vue';
import { ref, computed } from 'vue';
import { toast } from './lib/toast.js';
import HeatMap from './components/HeatMap.vue'
import Graph from './components/Graph.vue'
import BarChart from './components/BarChart.vue'
import LineChart from './components/LineChart.vue'
import PieChart from './components/PieChart.vue'
import GraphFilters from './components/GraphFilters.vue'
import DataTableTest from './views/DataTableTest.vue';

// Reactive data for examples
const buttonLoading = ref(false);
const inputValue = ref('');
const modalOpen = ref(false);
const selectValue = ref('');
const chartType = ref('bar')
const selectedDataSource = ref('')
const dateFrom = ref('')
const dateTo = ref('')

// Chart data
const barData = ref([120, 150, 180, 90, 200, 160])
const barLabels = ref(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'])

const lineData = ref([100, 120, 140, 110, 160, 180, 200])
const lineLabels = ref(['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7'])

const heatMapData = ref([
  [10, 20, 30, 40, 50, 60, 70],
  [15, 25, 35, 45, 55, 65, 75],
  [20, 30, 40, 50, 60, 70, 80],
  [25, 35, 45, 55, 65, 75, 85],
  [30, 40, 50, 60, 70, 80, 90],
  [35, 45, 55, 65, 75, 85, 95]
])

const heatMapBubbles = ref([
  { px: 100, py: 50, radius: 15, color: '#ff6b6b', tooltip: 'High Risk Area' },
  { px: 250, py: 120, radius: 10, color: '#4ecdc4', tooltip: 'Low Risk Zone' },
  { px: 350, py: 200, radius: 20, color: '#45b7d1', tooltip: 'Critical Point' }
])
const pieData = ref([35, 25, 20, 15, 5])
const pieLabels = ref(['Product A', 'Product B', 'Product C', 'Product D', 'Others'])

// Data sources for filters
const dataSources = ref([
  { value: 'sales', label: 'Sales Data' },
  { value: 'marketing', label: 'Marketing Data' },
  { value: 'finance', label: 'Financial Data' }
])
const checkboxValue = ref(false);
const radioValue = ref('');
const textareaValue = ref('');
const progressValue = ref(0);
const loading = ref(false);
const currentSection = ref('buttons');

// Accordion items
const accordionItems = ref([
  {
    id: 'item1',
    title: 'Getting Started',
    content: 'Welcome to our component library! This accordion shows how to organize content in collapsible sections.'
  },
  {
    id: 'item2',
    title: 'Installation',
    content: 'To install our components, simply run npm install and import the components you need.'
  },
  {
    id: 'item3',
    title: 'Usage',
    content: 'Each component comes with comprehensive documentation and examples to help you get started quickly.'
  }
]);

// Sidebar navigation - Updated for hash navigation
const navigationItems = ref([
  { label: 'Buttons', icon: 'hand-pointer', route: '#buttons', type: 'link' },
  { label: 'Forms', icon: 'clipboard-list', route: '#forms', type: 'link' },
  { label: 'Data', icon: 'table-cells', route: '#data', type: 'link' },
  { label: 'Feedback', icon: 'comment-dots', route: '#feedback', type: 'link' },
  { label: 'Layout', icon: 'th-large', route: '#layout', type: 'link' },
  { label: 'Graphs', icon: 'chart-bar', route: '#graphs', type: 'link' },
  { label: 'Loaders', icon: 'spinner', route: '#loaders', type: 'link' },
]);

const handleButtonClick = () => {
  buttonLoading.value = true;
  setTimeout(() => {
    buttonLoading.value = false;
    toast.success('Button clicked!');
  }, 2000);
};

const showToast = () => {
  toast.info('This is a toast notification!');
};

const startProgress = () => {
  progressValue.value = 0;
  const interval = setInterval(() => {
    progressValue.value += 10;
    if (progressValue.value >= 100) {
      clearInterval(interval);
    }
  }, 200);
};

const handleDataSourceChange = (value) => {
  selectedDataSource.value = value
  console.log('Data source changed:', value)
  // Here you would typically fetch new data based on the source
}

const handleCellHover = (data) => {
}

const handleChartTypeChange = (value) => {
  chartType.value = value
  console.log('Chart type changed:', value)
}

const refreshChartData = () => {
  console.log('Refreshing chart data...')
  // Here you would refresh the chart data
}

const handleBarHover = (data) => {
  console.log('Bar hovered:', data)
}

const handlePointHover = (data) => {
  console.log('Point hovered:', data)
}

const handleSliceHover = (data) => {
  console.log('Slice hovered:', data)
}

const toggleLoading = () => {
  loading.value = !loading.value;
};

const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
  currentSection.value = sectionId;
};

const handleSidebarNavigate = (item) => {
  // Extract section id from route (remove the # symbol)
  const sectionId = item.route.substring(1);
  scrollToSection(sectionId);
};

const handleFilesSelected = (files) => {
  console.log('Files selected:', files);
  toast.success(`${files.length} file(s) selected`);
};

// Compute current path based on current section
const currentPath = computed(() => `#${currentSection.value}`);
</script>

<template>
  <div class="max-w-full mx-auto bg-gray-50">
    <!-- Simplified Sidebar Navigation - No router-link, just buttons -->
    <aside class="fixed left-0 top-0 z-40 h-screen w-52 border-r bg-white border-gray-200 overflow-y-auto">
      <nav class="p-4">
        <div class="space-y-2">
          <button v-for="item in navigationItems" :key="item.label" :class="[
            'w-full flex flex-col items-center justify-center rounded-xl transition-all duration-200 group relative py-4 px-3',
            currentPath === item.route
              ? 'bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 shadow-sm'
              : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 border border-transparent'
          ]" @click="handleSidebarNavigate(item)">
            <!-- Icon Container -->
            <div :class="[
              'flex items-center justify-center rounded-lg transition-colors mb-2 w-12 h-12',
              currentPath === item.route
                ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md'
                : 'text-gray-500 group-hover:text-gray-900 bg-gray-100 group-hover:bg-gray-200'
            ]">
              <Icon :icon="item.icon" class="w-6 h-6" />
            </div>

            <!-- Label -->
            <span :class="[
              'text-xs font-medium text-center',
              currentPath === item.route
                ? 'text-blue-700 font-semibold'
                : 'text-gray-500 group-hover:text-gray-900'
            ]">
              {{ item.label }}
            </span>
          </button>
        </div>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="ml-52 min-h-screen">
      <div class="p-8">
        <div class="w-full space-y-12">
          <div class="text-center mb-12">
            <h1 class="text-4xl font-bold mb-4">Component Showcase</h1>
            <p class="text-lg text-gray-600">Explore our comprehensive component library with interactive examples</p>
          </div>

          <!-- Buttons Section -->
          <section id="buttons" class="space-y-8">
            <h2 class="text-3xl font-bold border-b pb-4">Button Components</h2>

            <div class="space-y-6">
              <div>
                <h3 class="text-xl font-semibold mb-4">Variants</h3>
                <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  <Button variant="default">Default</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="success">Success</Button>
                  <Button variant="warning">Warning</Button>
                  <Button variant="info">Info</Button>
                  <Button variant="subtle">Subtle</Button>
                  <Button variant="dark">Dark</Button>
                  <Button variant="light">Light</Button>
                  <Button variant="primaryOutline">Primary Outline</Button>
                  <Button variant="destructiveOutline">Destructive Outline</Button>
                  <Button variant="successOutline">Success Outline</Button>
                  <Button variant="gradient">Gradient</Button>
                </div>
              </div>

              <div>
                <h3 class="text-xl font-semibold mb-4">Sizes</h3>
                <div class="flex flex-wrap gap-4 items-center">
                  <Button size="xs">Extra Small</Button>
                  <Button size="sm">Small</Button>
                  <Button size="default">Default Size</Button>
                  <Button size="lg">Large</Button>
                  <Button size="icon" @click="showToast">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </Button>
                </div>
              </div>

              <div>
                <h3 class="text-xl font-semibold mb-4">States</h3>
                <div class="flex flex-wrap gap-4 items-center">
                  <Button :loading="buttonLoading" @click="handleButtonClick">Loading Button</Button>
                  <Button disabled>Disabled</Button>
                </div>
              </div>
            </div>
          </section>

          <!-- Forms Section -->
          <section id="forms" class="space-y-8">
            <h2 class="text-3xl font-bold border-b pb-4">Form Components</h2>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <!-- Input Examples -->
              <div class="space-y-6">
                <h3 class="text-xl font-semibold">Input Component</h3>
                <div class="space-y-4">
                  <Input v-model="inputValue" placeholder="Basic input" />
                  <Input v-model="inputValue" placeholder="With clear button" clearable />
                  <Input v-model="inputValue" type="email" placeholder="Email input" />
                  <Input v-model="inputValue" type="password" placeholder="Password input" />
                  <Input v-model="inputValue" variant="error" placeholder="Error state"
                    error="This field is required" />
                  <Input v-model="inputValue" variant="success" placeholder="Success state" />
                  <Input v-model="inputValue" size="sm" placeholder="Small size" />
                  <Input v-model="inputValue" size="lg" placeholder="Large size" />
                </div>
              </div>

              <!-- Select, Checkbox, Radio -->
              <div class="space-y-6">
                <div>
                  <h4 class="text-lg font-semibold mb-3">Select Component</h4>
                  <Select v-model="selectValue">
                    <option value="">Choose an option</option>
                    <option value="option1">Option 1</option>
                    <option value="option2">Option 2</option>
                    <option value="option3">Option 3</option>
                  </Select>
                  <p class="text-sm text-gray-600 mt-2">Selected: {{ selectValue }}</p>
                </div>

                <div>
                  <h4 class="text-lg font-semibold mb-3">Checkbox Component</h4>
                  <div class="space-y-2">
                    <Checkbox v-model="checkboxValue" label="Basic checkbox" />
                    <Checkbox v-model="checkboxValue" label="Disabled checkbox" disabled />
                    <Checkbox v-model="checkboxValue" label="With description"
                      description="This is a description for the checkbox." />
                    <Checkbox v-model="checkboxValue" size="sm" label="Small checkbox" />
                    <Checkbox v-model="checkboxValue" size="lg" label="Large checkbox" />
                  </div>
                  <p class="text-sm text-gray-600 mt-2">Value: {{ checkboxValue }}</p>
                </div>

                <div>
                  <h4 class="text-lg font-semibold mb-3">Radio Component</h4>
                  <div class="space-y-2">
                    <Radio v-model="radioValue" value="option1" label="Option 1" />
                    <Radio v-model="radioValue" value="option2" label="Option 2" />
                    <Radio v-model="radioValue" value="option3" label="Option 3" />
                    <Radio v-model="radioValue" value="option1" label="Disabled option" disabled />
                  </div>
                  <p class="text-sm text-gray-600 mt-2">Selected: {{ radioValue }}</p>
                </div>
              </div>
            </div>

            <!-- Textarea -->
            <div class="space-y-4">
              <h3 class="text-xl font-semibold">Textarea Component</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Textarea v-model="textareaValue" placeholder="Basic textarea" />
                <Textarea v-model="textareaValue" placeholder="Textarea with auto-resize" auto-resize />
                <Textarea v-model="textareaValue" :rows="5" placeholder="Textarea with 5 rows" />
                <Textarea v-model="textareaValue" variant="error" placeholder="Error state textarea"
                  error="This field is required" />
                <Textarea v-model="textareaValue" variant="success" placeholder="Success state textarea" />
                <Textarea v-model="textareaValue" size="sm" placeholder="Small textarea" />
                <Textarea v-model="textareaValue" size="lg" placeholder="Large textarea" />
              </div>
            </div>
          </section>

          <!-- Data Section -->
          <section id="data" class="space-y-8">
            <h2 class="text-3xl font-bold border-b pb-4">Data Components</h2>

            <!-- DataTable -->
            <div class="space-y-4">
              <h3 class="text-xl font-semibold">DataTable Component</h3>
              <DataTableTest />
            </div>

            <!-- File Upload -->
            <div class="space-y-4">
              <h3 class="text-xl font-semibold">FileUpload Component</h3>
              <FileUpload multiple accept=".jpg,.png,.pdf" @files-selected="handleFilesSelected">
                <Icon icon="upload" class="h-8 w-8 text-muted-foreground mb-2" />
              </FileUpload>
            </div>
          </section>

          <!-- Feedback Section -->
          <section id="feedback" class="space-y-8">
            <h2 class="text-3xl font-bold border-b pb-4">Feedback Components</h2>

            <!-- Alert Examples -->
            <div class="space-y-4">
              <h3 class="text-xl font-semibold">Alert Component</h3>
              <div class="space-y-4">
                <Alert variant="info" title="Info Alert" message="This is an informational alert." />
                <Alert variant="success" title="Success Alert" message="Operation completed successfully!" />
                <Alert variant="warning" title="Warning Alert" message="Please be cautious with this action." />
                <Alert variant="error" title="Error Alert" message="Something went wrong. Please try again." />
                <Alert variant="destructive" title="Destructive Alert" message="This action cannot be undone."
                  dismissible />
              </div>
            </div>

            <!-- Toast Example -->
            <div class="space-y-4">
              <h3 class="text-xl font-semibold">Toast Component</h3>
              <div class="flex flex-wrap gap-4">
                <Button @click="toast.info('Info toast')">Info Toast</Button>
                <Button @click="toast.success('Success toast')">Success Toast</Button>
                <Button @click="toast.warning('Warning toast')">Warning Toast</Button>
                <Button @click="toast.error('Error toast')">Error Toast</Button>
              </div>
            </div>

            <!-- Progress -->
            <div class="space-y-4">
              <h3 class="text-xl font-semibold">Progress Component</h3>
              <div class="space-y-4">
                <div>
                  <Button @click="startProgress" class="mb-4">Start Progress</Button>
                  <Progress :value="progressValue" />
                  <p class="text-sm text-gray-600 mt-2">{{ progressValue }}% complete</p>
                </div>
                <div class="space-y-2">
                  <Progress :value="25" variant="success" />
                  <Progress :value="50" variant="warning" />
                  <Progress :value="75" variant="destructive" />
                </div>
              </div>
            </div>
          </section>

          <!-- Layout Section -->
          <section id="layout" class="space-y-8">
            <h2 class="text-3xl font-bold border-b pb-4">Layout Components</h2>

            <!-- Card Examples -->
            <div class="space-y-4">
              <h3 class="text-xl font-semibold">Card Component</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card title="Default Card" subtitle="This is a default card">
                  <p>This is the card content. Cards can contain any content you want.</p>
                </Card>
                <Card variant="outlined" title="Outlined Card">
                  <p>This card has an outlined variant.</p>
                </Card>
                <Card variant="elevated" title="Elevated Card" hoverable>
                  <p>This card has elevation and hover effects.</p>
                </Card>
                <Card variant="filled" title="Filled Card">
                  <p>This card has a filled background.</p>
                </Card>
                <Card title="Card with Actions" hoverable clickable>
                  <p>This card is clickable and has hover effects.</p>
                  <template #actions>
                    <Button size="sm" variant="outline">Action 1</Button>
                    <Button size="sm" variant="outline">Action 2</Button>
                  </template>
                </Card>
                <Card title="Card with Footer">
                  <p>Main content of the card.</p>
                  <template #footer>
                    <div class="flex justify-between items-center">
                      <span class="text-sm text-gray-500">Footer content</span>
                      <Button size="sm">Footer Action</Button>
                    </div>
                  </template>
                </Card>
              </div>
            </div>

            <!-- Accordion -->
            <div class="space-y-4">
              <h3 class="text-xl font-semibold">Accordion Component</h3>
              <div class="max-w-2xl">
                <Accordion :items="accordionItems" />
              </div>
            </div>

            <!-- Modal Example -->
            <div class="space-y-4">
              <h3 class="text-xl font-semibold">Modal Component</h3>
              <Button @click="modalOpen = true">Open Modal</Button>
              <Modal v-model="modalOpen" size="md">
                <div class="space-y-4">
                  <h3 class="text-lg font-semibold">Modal Title</h3>
                  <p>This is the modal content. You can put any content here.</p>
                  <div class="flex justify-end space-x-2">
                    <Button variant="outline" @click="modalOpen = false">Cancel</Button>
                    <Button @click="modalOpen = false">Confirm</Button>
                  </div>
                </div>
              </Modal>
            </div>
          </section>

          <!-- Loaders Section -->
          <section id="loaders" class="space-y-8">
            <h2 class="text-3xl font-bold border-b pb-4">Loading Components</h2>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <!--Loader -->
              <div class="space-y-4">
                <h3 class="text-xl font-semibold">Loader Component</h3>
                <div class="space-y-4">
                  <div class="flex items-center gap-4">
                    <Button @click="toggleLoading">Toggle Loading</Button>
                    <span class="text-sm text-gray-600">Status: {{ loading ? 'Loading' : 'Not Loading' }}</span>
                  </div>

                  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div class="flex flex-col items-center space-y-2">
                      <Loader :loading="loading" type="spin" size="small" />
                      <span class="text-xs">Spin</span>
                    </div>
                    <div class="flex flex-col items-center space-y-2">
                      <Loader :loading="loading" type="pulse" size="small" />
                      <span class="text-xs">Pulse</span>
                    </div>
                    <div class="flex flex-col items-center space-y-2">
                      <Loader :loading="loading" type="bounce" size="small" />
                      <span class="text-xs">Bounce</span>
                    </div>
                    <div class="flex flex-col items-center space-y-2">
                      <Loader :loading="loading" type="dots" size="small" />
                      <span class="text-xs">Dots</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Spinner -->
              <div class="space-y-4">
                <h3 class="text-xl font-semibold">Spinner Component</h3>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div class="flex flex-col items-center space-y-2">
                    <Spinner size="xs" />
                    <span class="text-xs">XS</span>
                  </div>
                  <div class="flex flex-col items-center space-y-2">
                    <Spinner size="sm" />
                    <span class="text-xs">SM</span>
                  </div>
                  <div class="flex flex-col items-center space-y-2">
                    <Spinner size="md" />
                    <span class="text-xs">MD</span>
                  </div>
                  <div class="flex flex-col items-center space-y-2">
                    <Spinner size="lg" />
                    <span class="text-xs">LG</span>
                  </div>
                  <div class="flex flex-col items-center space-y-2">
                    <Spinner size="xl" />
                    <span class="text-xs">XL</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Graphs Section -->
          <section id="graphs" class="space-y-8">
            <h2 class="text-3xl font-bold border-b pb-4">Graph Components</h2>

            <!-- Bar Chart Example -->
            <div class="space-y-4">
              <h3 class="text-xl font-semibold">Bar Chart with Filters</h3>
              <Graph title="Sales Overview" description="Monthly sales data">
                <template #filters>
                  <GraphFilters :data-sources="dataSources" @update:dataSource="handleDataSourceChange"
                    @refresh="refreshChartData" />
                </template>

                <BarChart :data="barData" :labels="barLabels"
                  :colors="['#3b82f6', '#ef4444', '#10b981', '#f59e0b']" :width="600" :height="400"
                  @bar-hover="handleBarHover" />

                <template #legend>
                  <div class="flex items-center gap-4 text-sm">
                    <div class="flex items-center gap-2">
                      <div class="w-3 h-3 bg-blue-500 rounded"></div>
                      <span>Sales</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <div class="w-3 h-3 bg-red-500 rounded"></div>
                      <span>Expenses</span>
                    </div>
                  </div>
                </template>
              </Graph>
            </div>

            <!-- Line Chart Example -->
            <div class="space-y-4">
              <h3 class="text-xl font-semibold">Line Chart with Date Filters</h3>
              <Graph title="Revenue Trend" variant="outlined">
                <template #filters>
                  <GraphFilters :show-chart-type-filter="false" :show-date-filter="true"
                    @update:dateFrom="dateFrom = $event" @update:dateTo="dateTo = $event" />
                </template>

                <LineChart :data="lineData" :labels="lineLabels" :fill-area="true" :colors="['#8b5cf6']"
                  :width="600" :height="300" @point-hover="handlePointHover" />
              </Graph>
            </div>

            <!-- Pie Chart Example -->
            <div class="space-y-4">
              <h3 class="text-xl font-semibold">Pie Chart with Legend</h3>
              <Graph title="Market Share" variant="elevated">
                <PieChart :data="pieData" :labels="pieLabels" :donut="true" :show-legend="true" :size="400"
                  @slice-hover="handleSliceHover" />

                <template #footer>
                  <div class="text-center text-sm text-gray-600">
                    Total market value: ${{pieData.reduce((a, b) => a + b, 0).toLocaleString()}}
                  </div>
                </template>
              </Graph>
            </div>

            <!-- Heat Map Example -->
            <div class="space-y-4">
              <h3 class="text-xl font-semibold">Heat Map with Bubbles</h3>
              <Graph title="Activity Heat Map" description="Weekly activity patterns with bubble overlay">
                <template #filters>
                  <GraphFilters :show-date-filter="true" @update:dateFrom="dateFrom = $event"
                    @update:dateTo="dateTo = $event" @refresh="refreshChartData" />
                </template>

                <HeatMap
                  :data="heatMapData"
                  :bubbles="heatMapBubbles"
                  :width="600"
                  :height="300"
                  :min-value="0"
                  :max-value="100"
                  @cell-hover="handleCellHover"
                />

                <template #legend>
                  <div class="text-sm text-gray-600">
                    <p><strong>Heat Map:</strong> Color intensity shows activity levels</p>
                    <p><strong>Bubbles:</strong> Size represents magnitude of activity</p>
                  </div>
                </template>
              </Graph>
            </div>
          </section>
        </div>
      </div>
    </div>

    <Toast />
  </div>
</template>
