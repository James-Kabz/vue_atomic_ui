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