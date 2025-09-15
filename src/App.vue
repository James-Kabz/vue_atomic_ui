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
      position="top-center" 
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
