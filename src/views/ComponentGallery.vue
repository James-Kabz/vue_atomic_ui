<script setup>
import { ref } from 'vue'
import AccordionItem from '../components/AccordionItem.vue'
import AuthLayout from '../layouts/AuthLayout.vue'
import Avatar from '../components/Avatar.vue'
import Badge from '../components/Badge.vue'
import Breadcrumb from '../components/Breadcrumb.vue'
import Button from '../components/Button.vue'
import ButtonGroup from '../components/ButtonGroup.vue'
import Calendar from '../components/Calendar.vue'
import Card from '../components/Card.vue'
import CardHeader from '../components/CardHeader.vue'
import CardBody from '../components/CardBody.vue'
import CardFooter from '../components/CardFooter.vue'
import CardContent from '../components/CardContent.vue'
import CardTitle from '../components/CardTitle.vue'
import DataTableCell from '../components/DataTableCell.vue'
import DataTableHeader from '../components/DataTableHeader.vue'
import DataTablePagination from '../components/DataTablePagination.vue'
import DataTableRow from '../components/DataTableRow.vue'
import DatePicker from '../components/DatePicker.vue'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import Divider from '../components/Divider.vue'
import Dropdown from '../components/Dropdown.vue'
import DropdownItem from '../components/DropdownItem.vue'
import ErrorLayout from '../layouts/ErrorLayout.vue'
import EventsCalendar from '../components/EventsCalendar.vue'
import Footer from '../components/Footer.vue'
import FormField from '../components/FormField.vue'
import Header from '../components/Header.vue'
import Icon from '../components/Icon.vue'
import Image from '../components/Image.vue'
import Input from '../components/Input.vue'
import InputGroup from '../components/InputGroup.vue'
import Label from '../components/Label.vue'
import Link from '../components/Link.vue'
import ListItem from '../components/ListItem.vue'
import Logo from '../components/Logo.vue'
import MenuItem from '../components/MenuItem.vue'
import Modal from '../components/Modal.vue'
import ModalBody from '../components/ModalBody.vue'
import ModalFooter from '../components/ModalFooter.vue'
import ModalHeader from '../components/ModalHeader.vue'
import Notification from '../components/Notification.vue'
import Option from '../components/Option.vue'
import ProgressBar from '../components/ProgressBar.vue'
import ReminderConfig from '../components/ReminderConfig.vue'
import ReusableForm from '../components/ReusableForm.vue'
import ReusableFormModal from '../components/ReusableFormModal.vue'
import Search from '../components/Search.vue'
import Select from '../components/Select.vue'
import Sidebar from '../components/Sidebar.vue'
import Slider from '../components/Slider.vue'
import StackedBarChart from '../components/charts/StackedBarChart.vue'
import Stepper from '../components/Stepper.vue'
import StepperItem from '../components/StepperItem.vue'
import Switch from '../components/Switch.vue'
import Tab from '../components/Tab.vue'
import TabPanel from '../components/TabPanel.vue'
import Text from '../components/Text.vue'
import Timeline from '../components/Timeline.vue'
import TimelineItem from '../components/TimelineItem.vue'
import Tooltip from '../components/Tooltip.vue'
import Typography from '../components/Typography.vue'

const jumpSections = [
  { id: 'gallery-basics', label: 'Basics' },
  { id: 'gallery-navigation', label: 'Navigation' },
  { id: 'gallery-forms', label: 'Forms' },
  { id: 'gallery-data', label: 'Data Table' },
  { id: 'gallery-feedback', label: 'Feedback' },
  { id: 'gallery-timeline', label: 'Timeline' },
  { id: 'gallery-charts', label: 'Charts' },
  { id: 'gallery-modal', label: 'Modal' },
  { id: 'gallery-card', label: 'Cards' },
  { id: 'gallery-forms-advanced', label: 'Reusable Forms' },
  { id: 'gallery-reminders', label: 'Reminders' },
  { id: 'gallery-layouts', label: 'Layouts' }
]

const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const breadcrumbItems = ref([
  { label: 'Home', href: '/' },
  { label: 'Dashboard', href: '/templates/overview' },
  { label: 'Overview' }
])

const datePickerValue = ref('')
const searchValue = ref('')
const sliderValue = ref(40)
const switchValue = ref(true)
const progressBarValue = ref(62)

const formFieldValue = ref('')
const inputGroupValue = ref('')
const dateFilterValue = ref('')
const modalHeaderOpen = ref(false)
const reusableModalOpen = ref(false)

const demoColumns = ref([
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Role' }
])
const demoItem = ref({ id: 1, name: 'Ari Lopez', role: 'Admin' })
const demoPageSize = ref(5)
const demoCurrentPage = ref(1)
const demoTotal = ref(24)

const timelineItems = ref([
  { title: 'Review submitted', subtitle: '2 hours ago', body: 'Vendor review completed.' },
  { title: 'Policy approved', subtitle: 'Yesterday', body: 'Compliance sign-off received.' }
])

const stepperItems = ref([
  { step: 1, title: 'Draft', description: 'Start' },
  { step: 2, title: 'Review', description: 'In progress' },
  { step: 3, title: 'Publish', description: 'Complete' }
])

const events = ref([
  { id: 1, title: 'Board review', date: new Date().toISOString().slice(0, 10) }
])

const reminderModels = ref([
  {
    id: 1,
    name: 'Policies',
    expanded: true,
    reminders: [
      {
        id: 101,
        days: 7,
        recipients: [],
        sendTypes: ['email'],
        isDaily: false
      }
    ]
  }
])

const reminderRecipients = ref([
  { id: 1, label: 'Compliance Team' },
  { id: 2, label: 'Risk Owners' }
])

const reusableFormFields = ref([
  { name: 'name', label: 'Name', type: 'text', placeholder: 'Policy name', required: true },
  { name: 'owner', label: 'Owner', type: 'text', placeholder: 'Owner name' },
  { name: 'priority', label: 'Priority', type: 'select', options: ['Low', 'Medium', 'High'] }
])

const previewNavigation = ref([
  { type: 'section', label: 'Preview' },
  { type: 'link', name: 'overview', label: 'Overview', route: '/templates/overview', icon: 'home' },
  { type: 'link', name: 'analytics', label: 'Analytics', route: '/templates/analytics', icon: 'chart-bar' }
])

const previewUser = ref({
  name: 'Jordan Blake',
  email: 'jordan@company.com',
  roles: ['admin'],
  organisations: [{ id: 1, name: 'STL Horizon', role: 'Admin' }],
  currentOrganisation: { id: 1, name: 'STL Horizon', role: 'Admin' }
})

const previewProfileMenu = ref([
  { name: 'profile', label: 'Profile', route: '/profile', icon: 'user' },
  { name: 'settings', label: 'Settings', route: '/settings', icon: 'cog' }
])
</script>

<template>
  <div class="max-w-full mx-auto">
    <div class="mb-4 flex items-center gap-3">
      <router-link
        to="/templates/overview"
        class="px-3 py-1.5 rounded-md text-sm font-medium border ui-border-strong hover:bg-(--ui-surface)"
      >
        Dashboard
      </router-link>
      <router-link
        to="/components"
        class="px-3 py-1.5 rounded-md text-sm font-medium border ui-border-strong hover:bg-(--ui-surface)"
      >
        Component Showcase
      </router-link>
      <router-link
        to="/components/full-gallery"
        class="px-3 py-1.5 rounded-md text-sm font-medium border ui-border-strong hover:bg-(--ui-surface)"
      >
        Full Gallery
      </router-link>
    </div>

    <div class="sticky top-0 z-40 bg-[color:color-mix(in oklab, var(--ui-surface), transparent 5%)] backdrop-blur border ui-border-strong rounded-lg p-3">
      <div class="flex flex-wrap items-center gap-2">
        <button
          v-for="section in jumpSections"
          :key="section.id"
          class="px-3 py-1.5 text-xs font-medium rounded-full border ui-border-strong hover:bg-(--ui-surface)"
          @click="scrollToSection(section.id)"
        >
          {{ section.label }}
        </button>
      </div>
    </div>

    <div class="mt-6 grid grid-cols-1 gap-6">
      <Card
        id="gallery-basics"
        title="Basics"
        variant="outlined"
        padding="lg"
      >
        <div class="space-y-4">
          <div class="flex items-center gap-4">
            <Avatar
              initials="JB"
              size="md"
            />
            <Badge variant="success">
              Active
            </Badge>
            <Divider />
            <Text as="span">
              Text component
            </Text>
          </div>
          <Typography
            variant="body-sm"
            color="muted"
          >
            Typography for supporting copy.
          </Typography>
          <div class="flex items-center gap-4">
            <Label for="basic-input">Label</Label>
            <Input
              id="basic-input"
              v-model="formFieldValue"
              placeholder="Labeled input"
              class="max-w-xs"
            />
          </div>
          <div class="flex items-center gap-4">
            <Link
              href="https://vuejs.org"
              external
            >
              Link component
            </Link>
            <Logo
              text="STL Horizon"
              size="sm"
            />
          </div>
          <Image
            src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=240&fit=crop"
            alt="Preview"
            class="rounded-md"
          />
        </div>
      </Card>

      <Card
        id="gallery-navigation"
        title="Navigation & Menus"
        variant="outlined"
        padding="lg"
      >
        <div class="space-y-4">
          <Breadcrumb :items="breadcrumbItems" />
          <ButtonGroup>
            <Button size="sm">
              Day
            </Button>
            <Button
              size="sm"
              variant="outline"
            >
              Week
            </Button>
            <Button
              size="sm"
              variant="outline"
            >
              Month
            </Button>
          </ButtonGroup>
          <Dropdown
            trigger-text="Options"
            variant="outline"
          >
            <DropdownItem>Profile</DropdownItem>
            <DropdownItem>Settings</DropdownItem>
            <DropdownItem variant="danger">
              Logout
            </DropdownItem>
          </Dropdown>
          <AccordionItem>
            <template #header>
              AccordionItem Header
            </template>
            <template #content>
              AccordionItem content goes here.
            </template>
          </AccordionItem>
          <ul class="space-y-2">
            <ListItem
              title="List item"
              description="Supporting text"
              icon="check"
            />
            <MenuItem icon="gear">
              Menu item
            </MenuItem>
          </ul>
          <Tab>
            <TabPanel label="Summary">
              <p class="text-sm ui-text">
                Tab panel content
              </p>
            </TabPanel>
            <TabPanel label="Details">
              <p class="text-sm ui-text">
                Second panel content
              </p>
            </TabPanel>
          </Tab>
        </div>
      </Card>

      <Card
        id="gallery-forms"
        title="Forms & Inputs"
        variant="outlined"
        padding="lg"
      >
        <div class="space-y-4">
          <FormField label="FormField">
            <Input
              v-model="formFieldValue"
              placeholder="FormField input"
            />
          </FormField>
          <InputGroup>
            <template #prefix>
              <Icon
                icon="search"
                class="w-4 h-4 ui-text"
              />
            </template>
            <Input
              v-model="inputGroupValue"
              placeholder="InputGroup"
            />
            <template #suffix>
              <Badge size="sm">
                New
              </Badge>
            </template>
          </InputGroup>
          <Search
            v-model="searchValue"
            placeholder="Search component"
          />
          <div class="flex items-center gap-3">
            <Switch v-model="switchValue" />
            <span class="text-sm ui-text">Switch</span>
          </div>
          <Slider
            v-model="sliderValue"
            :min="0"
            :max="100"
          />
          <DatePicker v-model="datePickerValue" />
          <Select v-model="dateFilterValue">
            <Option
              value=""
              label="Select priority"
            />
            <Option
              value="low"
              label="Low"
            />
            <Option
              value="high"
              label="High"
            />
          </Select>
        </div>
      </Card>

      <Card
        id="gallery-data"
        title="Data Table Parts"
        variant="outlined"
        padding="lg"
      >
        <div class="space-y-4">
          <DataTableHeader
            title="Mini Table"
            description="Header component demo"
          />
          <table class="w-full border ui-border-strong rounded-md overflow-hidden">
            <tbody>
              <tr>
                <DataTableCell
                  :item="demoItem"
                  :column="demoColumns[0]"
                />
                <DataTableCell
                  :item="demoItem"
                  :column="demoColumns[1]"
                />
              </tr>
              <DataTableRow
                :item="demoItem"
                :columns="demoColumns"
                :index="0"
                striped
              />
            </tbody>
          </table>
          <DataTablePagination
            :total="demoTotal"
            :current-page="demoCurrentPage"
            :page-size="demoPageSize"
            :page-size-options="[5, 10, 20]"
            @update:current-page="(page) => (demoCurrentPage = page)"
            @update:page-size="(size) => (demoPageSize = size)"
          />
        </div>
      </Card>

      <Card
        id="gallery-feedback"
        title="Feedback & Status"
        variant="outlined"
        padding="lg"
      >
        <div class="space-y-4">
          <Tooltip content="Helpful tooltip">
            <Button
              size="sm"
              variant="outline"
            >
              Hover me
            </Button>
          </Tooltip>
          <Notification
            title="Update complete"
            message="All checks passed."
            variant="success"
          />
          <ProgressBar
            :value="progressBarValue"
            show-label
          />
        </div>
      </Card>

      <Card
        id="gallery-timeline"
        title="Timeline & Stepper"
        variant="outlined"
        padding="lg"
      >
        <div class="space-y-4">
          <Stepper>
            <StepperItem
              v-for="item in stepperItems"
              :key="item.step"
              :step="item.step"
              :title="item.title"
              :description="item.description"
              :active="item.step === 2"
              :completed="item.step < 2"
            />
          </Stepper>
          <Timeline>
            <TimelineItem
              v-for="item in timelineItems"
              :key="item.title"
              :title="item.title"
              :subtitle="item.subtitle"
            >
              {{ item.body }}
            </TimelineItem>
          </Timeline>
        </div>
      </Card>

      <Card
        id="gallery-charts"
        title="Charts & Calendars"
        variant="outlined"
        padding="lg"
      >
        <div class="space-y-4">
          <StackedBarChart
            :data="[12, 9, 14]"
            :labels="['Q1', 'Q2', 'Q3']"
            :width="320"
            :height="200"
          />
          <Calendar />
          <EventsCalendar :events="events" />
        </div>
      </Card>

      <Card
        id="gallery-modal"
        title="Modal Parts"
        variant="outlined"
        padding="lg"
      >
        <div class="space-y-3">
          <Button
            size="sm"
            variant="outline"
            @click="modalHeaderOpen = true"
          >
            Open Modal
          </Button>
          <Modal
            v-model="modalHeaderOpen"
            size="sm"
          >
            <ModalHeader>Modal Header</ModalHeader>
            <ModalBody>
              <p class="text-sm ui-text">
                Modal body content.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                size="sm"
                variant="outline"
                @click="modalHeaderOpen = false"
              >
                Close
              </Button>
            </ModalFooter>
          </Modal>
        </div>
      </Card>

      <Card
        id="gallery-card"
        title="Card Sections"
        variant="outlined"
        padding="lg"
      >
        <Card>
          <template #header>
            <CardHeader>
              <CardTitle>Card Header</CardTitle>
            </CardHeader>
          </template>
          <CardBody>
            <CardContent>Card body content</CardContent>
          </CardBody>
          <template #footer>
            <CardFooter>Footer text</CardFooter>
          </template>
        </Card>
      </Card>

      <Card
        id="gallery-forms-advanced"
        title="Reusable Forms"
        variant="outlined"
        padding="lg"
      >
        <div class="space-y-4">
          <ReusableForm :fields="reusableFormFields" />
          <Button
            size="sm"
            variant="outline"
            @click="reusableModalOpen = true"
          >
            Open Form Modal
          </Button>
          <ReusableFormModal
            v-model="reusableModalOpen"
            modal-type="create"
            entity-name="Item"
            :fields="reusableFormFields"
          />
        </div>
      </Card>

      <Card
        id="gallery-reminders"
        title="Reminders"
        variant="outlined"
        padding="lg"
      >
        <ReminderConfig
          v-model:models="reminderModels"
          :available-recipients="reminderRecipients"
        />
      </Card>

      <Card
        id="gallery-layouts"
        title="Layouts & Shells"
        variant="outlined"
        padding="lg"
      >
        <div class="space-y-6 layout-preview">
          <div class="rounded-md border ui-border-strong overflow-hidden">
            <Header
              :sidebar-width="130"
              current-section="Preview"
              current-page="Overview"
              :current-route="'/templates/overview'"
              :user="previewUser"
              :notifications="[]"
              :profile-menu-items="previewProfileMenu"
              :mobile-open="false"
              :current-organisation="previewUser.currentOrganisation"
              :organisations="previewUser.organisations"
            />
          </div>
          <div class="rounded-md border ui-border-strong overflow-hidden">
            <Sidebar
              :sidebar-width="130"
              :header="{ title: 'Preview' }"
              :navigation-items="previewNavigation"
              :management-settings="[]"
              :show-management-settings="false"
              :mobile-open="false"
              :current-path="'/templates/overview'"
            />
          </div>
          <div class="rounded-md border ui-border-strong overflow-hidden auth-preview">
            <AuthLayout
              title="Auth Layout"
              subtitle="Sign in to continue"
            >
              <div class="p-6 ui-bg rounded-lg shadow-sm">
                <p class="text-sm ui-text">
                  Auth slot content
                </p>
              </div>
            </AuthLayout>
          </div>
          <div class="rounded-md border ui-border-strong overflow-hidden default-preview">
            <DefaultLayout>
              <template #header-actions>
                <Button
                  size="sm"
                  variant="outline"
                >
                  Action
                </Button>
              </template>
              <div class="p-4 text-sm ui-text">
                Default layout content
              </div>
            </DefaultLayout>
          </div>
          <div class="rounded-md border ui-border-strong overflow-hidden error-preview">
            <ErrorLayout>
              <template #title>
                Something went wrong
              </template>
              <template #message>
                We could not load this page.
              </template>
            </ErrorLayout>
          </div>
          <Footer />
        </div>
      </Card>
    </div>
  </div>
</template>

<style scoped>
:deep(.layout-preview header) {
  position: static !important;
  width: 100% !important;
}

:deep(.layout-preview aside) {
  position: static !important;
  transform: none !important;
  height: auto !important;
  width: 100% !important;
}

:deep(.auth-preview .min-h-screen),
:deep(.default-preview .min-h-screen),
:deep(.error-preview .min-h-screen) {
  min-height: auto !important;
}

:deep(.auth-preview .absolute),
:deep(.error-preview .absolute) {
  position: static !important;
}
</style>
