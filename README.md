# Vue UI Component Library

A comprehensive Vue.js component library built with Tailwind CSS, featuring 60+ components for building modern web applications.

<!-- <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" /> --> add the link in the index.html
## Installation

```bash
npm install @stlhorizon/vue-ui
```

## Setup

1. Install the required peer dependencies:

```bash
npm install vue@^3.5.18
```

2. Import the base styles in your main CSS file:

```css
@import '@stlhorizon/vue-ui/dist/vue-ui.css';
```

3. Configure your `tailwind.config.js` to include the library's content:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./node_modules/@stlhorizon/vue-ui/**/*.{vue,js,ts,jsx,tsx}"
  ],
  // ... rest of your config
}
```

4. **Important: Vue Template Compiler Configuration**

If you encounter the error: *"Component provided template option but runtime compilation is not supported in this build of Vue"*, you need to configure your bundler to use the full Vue build that includes the template compiler.

### For Vite users:

Add this to your `vite.config.js`:

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      'vue': 'vue/dist/vue.esm-bundler.js'
    }
  }
})
```

### For Webpack users:

Add this to your `webpack.config.js`:

```js
module.exports = {
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm-bundler.js'
    }
  }
}
```

### For Nuxt 3 users:

Add this to your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  alias: {
    'vue': 'vue/dist/vue.esm-bundler.js'
  }
})
```

## Usage

### Global Registration (Recommended)

```js
// main.js
import { createApp } from 'vue'
import VueUI from '@stlhorizon/vue-ui'
import '@stlhorizon/vue-ui/dist/vue-ui.css'
import App from './App.vue'

const app = createApp(App)
app.use(VueUI) // Auto-registers all components globally
app.mount('#app')
```

### Individual Component Import

```vue
<template>
  <div>
    <Button variant="default" size="lg">Click me</Button>
    <Input placeholder="Enter text..." />
    <DataTable :data="tableData" :columns="columns" />
  </div>
</template>

<script setup>
import { Button, Input, DataTable } from '@stlhorizon/vue-ui'
</script>
```

## Available Components

### Basic UI Components
- **Avatar** - User profile pictures with fallbacks
- **Badge** - Status indicators and labels
- **Button** - Interactive buttons with variants
- **Checkbox** - Form checkboxes with states
- **Divider** - Visual content separators
- **Icon** - Lucide icon wrapper
- **Image** - Enhanced image component
- **Input** - Form input fields
- **Label** - Form field labels
- **Link** - Styled navigation links
- **Logo** - Brand logo component
- **Option** - Select option items
- **ProgressBar** - Progress indicators
- **Radio** - Radio button inputs
- **Select** - Dropdown select menus
- **Spinner** - Loading indicators
- **Switch** - Toggle switches
- **Text** - Typography component
- **Textarea** - Multi-line text inputs
- **Tooltip** - Hover information
- **Typography** - Text styling utilities

### Layout Components
- **Alert** - Notification messages
- **Breadcrumb** - Navigation breadcrumbs
- **ButtonGroup** - Grouped button sets
- **Card** - Content containers
- **CardHeader** - Card header sections
- **CardBody** - Card content areas
- **CardFooter** - Card footer sections

### Form Components
- **DatePicker** - Date selection inputs
- **Dropdown** - Dropdown menus
- **DropdownItem** - Dropdown menu items
- **FileUpload** - File upload interface
- **FormField** - Form field wrapper
- **InputGroup** - Grouped input elements

### Navigation Components
- **ListItem** - List item elements
- **MenuItem** - Menu item components
- **Pagination** - Page navigation
- **SearchBox** - Search input interface

### Modal & Overlay Components
- **Modal** - Dialog overlays
- **ModalHeader** - Modal header sections
- **ModalBody** - Modal content areas
- **ModalFooter** - Modal footer sections
- **Notification** - System notifications
- **Toast** - Temporary messages

### Interactive Components
- **Slider** - Range input sliders
- **Stepper** - Step-by-step navigation
- **StepperItem** - Individual step items
- **Tab** - Tab navigation
- **TabPanel** - Tab content panels

### Complex Components
- **Accordion** - Collapsible content sections
- **AccordionItem** - Individual accordion items
- **Calendar** - Date picker calendar
- **Carousel** - Image/content carousels
- **CarouselSlide** - Individual carousel slides
- **DataTable** - Advanced data tables
- **DataTableHeader** - Table header component
- **DataTableRow** - Table row component
- **DataTableCell** - Table cell component
- **DataTablePagination** - Table pagination
- **DataTableFilters** - Table filtering
- **DataTableToolBar** - Table toolbar

### Layout Templates
- **Footer** - Page footer sections
- **Header** - Page header sections
- **Hero** - Hero banner sections
- **MainNavigation** - Primary navigation
- **MobileNavigation** - Mobile-responsive navigation
- **SidebarNavigation** - Sidebar navigation
- **Sidebar** - Sidebar layout component
- **Timeline** - Event timeline display
- **TimelineItem** - Individual timeline items

### Form Templates
- **LoginForm** - Complete login form
- **RegistrationForm** - Complete registration form

### Pre-built Layouts
- **DefaultLayout** - Standard app layout
- **ErrorLayout** - Error page layout
- **AuthLayout** - Authentication page layout

## Component Examples

### Button Variants
```vue
<Button variant="default">Default</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
```

### DataTable Usage
```vue
<template>
  <DataTable 
    :data="users" 
    :columns="columns"
    :filterable="true"
    :sortable="true"
    :paginated="true"
  />
</template>

<script setup>
const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
]

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true }
]
</script>
```

### Layout Usage
```vue
<template>
  <DefaultLayout>
    <template #header>
      <Header title="My App" />
    </template>
    
    <template #sidebar>
      <Sidebar :items="navItems" />
    </template>
    
    <template #default>
      <Card>
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
        </CardHeader>
        <CardBody>
          <Text>Your content here</Text>
        </CardBody>
      </Card>
    </template>
  </DefaultLayout>
</template>
```

## Troubleshooting

### Common Issues

1. **Template compilation error**: Make sure you've configured the Vue alias as described in the setup section above.

2. **Styles not loading**: Ensure you're importing the CSS file: `@import '@stlhorizon/vue-ui/dist/vue-ui.css';`

3. **Components not found**: Make sure you've either registered components globally or imported them individually.

4. **Tailwind classes not working**: Verify that your `tailwind.config.js` includes the library's content path.

## Publishing to NPM

1. **Update package details in `package.json`:**
   - Change package name if needed
   - Update repository URL, author, and description
   - Set the correct version number

2. **Build the library:**
   ```bash
   npm run build
   ```

3. **Login to npm:**
   ```bash
   npm login
   ```

4. **Publish:**
   ```bash
   npm publish --access public
   ```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build library
npm run build

# Lint code
npm run lint
```

## Requirements

- Node.js: `^20.19.0 || >=22.12.0`
- Vue.js: `^3.5.18`

## License

MIT

toast usage example in app.vue

<!-- Example App.vue setup -->
<template>
  <div id="app">
    <!-- Your application content -->
    <div class="p-8 space-y-6">
      <h1 class="text-3xl font-bold">Toast Examples - Sonner Style</h1>
      
      <!-- Basic Usage -->
      <section class="space-y-4">
        <h2 class="text-xl font-semibold">Basic Usage</h2>
        <div class="flex flex-wrap gap-2">
          <button 
            @click="showBasicToast"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Basic Toast
          </button>
          
          <button 
            @click="showSuccessToast"
            class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Success
          </button>
          
          <button 
            @click="showErrorToast"
            class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Error
          </button>
          
          <button 
            @click="showWarningToast"
            class="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Warning
          </button>
        </div>
      </section>

      <!-- With Titles and Descriptions -->
      <section class="space-y-4">
        <h2 class="text-xl font-semibold">With Titles & Descriptions</h2>
        <div class="flex flex-wrap gap-2">
          <button 
            @click="showRichToast"
            class="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Rich Toast
          </button>
          
          <button 
            @click="showActionToast"
            class="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
          >
            With Action
          </button>
        </div>
      </section>

      <!-- Promise Examples -->
      <section class="space-y-4">
        <h2 class="text-xl font-semibold">Promise Toasts</h2>
        <div class="flex flex-wrap gap-2">
          <button 
            @click="simulateSuccess"
            class="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600"
          >
            Promise Success
          </button>
          
          <button 
            @click="simulateError"
            class="px-4 py-2 bg-rose-500 text-white rounded hover:bg-rose-600"
          >
            Promise Error
          </button>
          
          <button 
            @click="simulateUpload"
            class="px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600"
          >
            File Upload
          </button>
        </div>
      </section>

      <!-- Advanced -->
      <section class="space-y-4">
        <h2 class="text-xl font-semibold">Advanced</h2>
        <div class="flex flex-wrap gap-2">
          <button 
            @click="showPersistent"
            class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Persistent
          </button>
          
          <button 
            @click="showCustomDuration"
            class="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            10s Duration
          </button>
          
          <button 
            @click="toast.dismissAll"
            class="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
          >
            Clear All
          </button>
        </div>
      </section>

      <!-- Real-world Examples -->
      <section class="space-y-4">
        <h2 class="text-xl font-semibold">Real-world Examples</h2>
        <div class="space-y-2">
          <button 
            @click="handleFormSubmit"
            class="block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Submit Form
          </button>
          
          <button 
            @click="handleFileUpload"
            class="block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Upload File
          </button>
          
          <button 
            @click="handleDeleteItem"
            class="block px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete Item
          </button>
        </div>
      </section>
    </div>

    <!-- Toaster component - add once in your root -->
    <Toaster 
      position="bottom-center" 
      :rich-colors="true" 
      :close-button="true" 
    />
  </div>
</template>

<script setup>
import { toast } from './lib/toast.js'
import Toaster from './components/Toast.vue'

// Basic examples
const showBasicToast = () => {
  toast("Hello World!")
}

const showSuccessToast = () => {
  toast.success("Operation completed successfully!")
}

const showErrorToast = () => {
  toast.error("Something went wrong!")
}

const showWarningToast = () => {
  toast.warning("Please check your input")
}

// Rich content
const showRichToast = () => {
  toast.success("Profile updated", {
    title: "Success",
    description: "Your profile has been updated successfully.",
    duration: 6000
  })
}

const showActionToast = () => {
  toast("Event has been created", {
    action: {
      label: "Undo",
      onClick: () => toast.info("Undo clicked!")
    }
  })
}

// Promise examples
const simulateSuccess = () => {
  const promise = new Promise((resolve) => {
    setTimeout(() => resolve({ name: "John Doe" }), 2000)
  })

  toast.promise(promise, {
    loading: "Loading user data...",
    success: (data) => `Welcome ${data.name}!`,
    error: "Failed to load user"
  })
}

const simulateError = () => {
  const promise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error("Network timeout")), 2000)
  })

  toast.promise(promise, {
    loading: "Connecting...",
    success: "Connected successfully!",
    error: (err) => `Connection failed: ${err.message}`
  })
}

const simulateUpload = () => {
  const promise = new Promise((resolve) => {
    setTimeout(() => resolve(), 3000)
  })

  toast.promise(promise, {
    loading: "Uploading file...",
    success: "File uploaded successfully!",
    error: "Upload failed"
  })
}

// Advanced
const showPersistent = () => {
  toast.info("This stays until dismissed", {
    duration: 0,
    title: "Persistent Notification"
  })
}

const showCustomDuration = () => {
  toast.warning("This will stay for 10 seconds", {
    duration: 10000
  })
}

// Real-world examples matching your use case
const handleFormSubmit = () => {
  // Simulate validation
  const validationInfo = { isValid: Math.random() > 0.3 }
  
  if (!validationInfo.isValid) {
    toast.error("Please select a vehicle that can accommodate your passenger and luggage requirements.")
    return
  }
  
  // Simulate form submission
  const submitPromise = new Promise((resolve) => {
    setTimeout(() => resolve(), 2000)
  })
  
  toast.promise(submitPromise, {
    loading: "Submitting form...",
    success: "Form submitted successfully!",
    error: "Failed to submit form"
  })
}

const handleFileUpload = () => {
  const uploadPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.5) {
        resolve({ filename: "document.pdf", size: "2.3MB" })
      } else {
        reject(new Error("File too large"))
      }
    }, 1500)
  })

  toast.promise(uploadPromise, {
    loading: "Uploading file...",
    success: (data) => `${data.filename} (${data.size}) uploaded successfully!`,
    error: (err) => `Upload failed: ${err.message}`
  })
}

const handleDeleteItem = () => {
  toast.error("Item will be deleted permanently", {
    title: "Are you sure?",
    action: {
      label: "Delete",
      onClick: () => {
        toast.success("Item deleted successfully")
      }
    }
  })
}
</script>

