<script setup lang="ts">
import { computed, ref } from 'vue'
import { toast } from '../../lib/toast'
import Typography from '../../components/Typography.vue'
import FormField from '../../components/FormField.vue'
import Input from '../../components/Input.vue'
import Checkbox from '../../components/Checkbox.vue'
import Button from '../../components/Button.vue'
import Link from '../../components/Link.vue'

const email = ref('')
const password = ref('')
const companyCode = ref('')
const rememberMe = ref(false)
const errors = ref<{ email?: string; password?: string; companyCode?: string }>({})
const isLoading = ref(false)

const onSubmit = async () => {
  errors.value = {} // reset
  isLoading.value = true

  if (!email.value) {
    errors.value.email = 'Email is required'
  }
  if (!password.value) {
    errors.value.password = 'Password is required'
  }
  if (!companyCode.value) {
    errors.value.companyCode = 'Company code is required'
  }

  if (Object.keys(errors.value).length === 0) {
    console.log('Form submitted:', {
      email: email.value,
      password: password.value,
      companyCode: companyCode.value,
      rememberMe: rememberMe.value
    })


    // simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    // toast message
    toast.success('Sign in successful!', {
      description: `Welcome back ${email.value}`,
    })
  }

  isLoading.value = false
}

const isFormValid = computed(() => {
  return Object.keys(errors.value).length === 0
})
</script>

<template>
  <!-- <AuthLayout
    company-initials="STL"
    company-name="SOFTWARE"
    variant="centered"
    app-name="eRisk & Compliance Management"
    app-version="1.0.0"
    secondary-logo-text="Risk & Compliance Management"
    :background-opacity="1"
  > -->
    <div class="text-center mb-4">
      <Typography class="text-h6 text-dark mb-2">Sign In</Typography>
      <Typography size="sm" color="muted">
        Provide your eRisk & Compliance Management authentication credentials
      </Typography>
    </div>

    <form @submit.prevent="onSubmit" class="space-y-6">
      <!-- Email -->
      <FormField label="Email" :error="errors.email" required>
        <template #default="{ fieldId, hasError, ariaDescribedBy }">
          <Input
            placeholder="Enter your email"
            :id="fieldId"
            v-model="email"
            type="email"
            :disabled="isLoading"
            :class="hasError ? 'border-red-500' : 'border-slate-300'"
            :aria-describedby="ariaDescribedBy"
          />
        </template>
      </FormField>

      <!-- Password -->
      <FormField label="Password" :error="errors.password" required>
        <template #default="{ fieldId, hasError, ariaDescribedBy }">
          <Input
            placeholder="Enter your password"
            :id="fieldId"
            v-model="password"
            type="password"
            :disabled="isLoading"
            :class="hasError ? 'border-red-500' : 'border-slate-300'"
            :aria-describedby="ariaDescribedBy"
          />
        </template>
      </FormField>

      <!-- Company Code -->
      <FormField label="Company Code" :error="errors.companyCode" required>
        <template #default="{ fieldId, hasError, ariaDescribedBy }">
          <Input
            placeholder="Enter your company code"
            :id="fieldId"
            v-model="companyCode"
            type="text"
            :disabled="isLoading"
            :class="hasError ? 'border-red-500' : 'border-slate-300'"
            :aria-describedby="ariaDescribedBy"
          />
        </template>
      </FormField>

      <!-- Remember me and forgot password -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Checkbox v-model="rememberMe" id="rememberMe" label="Remember me" :disabled="isLoading" />
        </div>

        <Typography class="text-sm font-medium">
          <Link href="/auth/forgot-password">Forgot password?</Link>
          <Link href="/table">Table Example</Link>
        </Typography>
      </div>

      <!-- Submit -->
      <Button
        type="submit"
        class="w-full rounded-md bg-blue-600 py-2 text-white font-medium hover:bg-blue-700 transition flex items-center justify-center"
        :disabled="isLoading"
        :loading="isLoading"
      >
        Sign In
      </Button>
    </form>
  <!-- </AuthLayout> -->
</template>
