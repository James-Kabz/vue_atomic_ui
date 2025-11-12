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
import CircularProgress from './components/CircularProgress.vue';
import Spinner from './components/Spinner.vue';
import Loader from './components/Loader.vue';
import Icon from './components/Icon.vue';
import { ref, computed } from 'vue';
import { toast } from './lib/toast.js';
import Graph from './components/Graph.vue'
import BarChart from './components/BarChart.vue'
import LineChart from './components/LineChart.vue'
import GraphFilters from './components/GraphFilters.vue'
import DataTableTest from './views/DataTableTest.vue';
import Dashboard from './components/Dashboard.vue';
import DashboardPage from './views/DashboardPage.vue';

// Reactive data for examples
const buttonLoading = ref(false);
const inputValue = ref('');
const modalOpen = ref(false);
const selectValue = ref('');
const selectedDataSource = ref('')
const dateFrom = ref('')
const dateTo = ref('')

// Chart data
const barData = ref([120, 150, 180, 90, 200, 160])
const barLabels = ref(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'])

const lineData = ref([100, 120, 140, 110, 160, 180, 200])
const lineLabels = ref(['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7'])


// Data sources for filters
const dataSources = ref([
  { value: 'sales', label: 'Sales Data' },
  { value: 'marketing', label: 'Marketing Data' },
  { value: 'finance', label: 'Financial Data' }
])
const checkboxValue = ref(false);
const radioValue = ref('');
const textareaValue = ref('');
const progressValue = ref(75);
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
  <DashboardPage />
</template>
