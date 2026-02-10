<script setup>
import { ref } from 'vue'
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
const errors = ref({})
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
    toast.info('Sign in successful!', {
      description: `Welcome back ${email.value}`,
    })
  }

  isLoading.value = false
}
</script>

<template>
  <div class="text-center mb-4">
    <Typography class="text-h6 text-dark mb-2">
      Sign In
    </Typography>
    <Typography
      size="sm"
      color="muted"
    >
      Provide your eRisk & Compliance Management authentication credentials
    </Typography>
  </div>

  <form
    class="space-y-6"
    @submit.prevent="onSubmit"
  >
    <!-- Email -->
    <FormField
      label="Email"
      :error="errors.email"
      type="email"
      required
    >
      <template #default="{ fieldId, hasError, ariaDescribedBy }">
        <Input
          :id="fieldId"
          v-model="email"
          placeholder="Enter your email"
          type="email"
          :disabled="isLoading"
          :class="hasError ? 'border-(--ui-danger)' : 'ui-border-strong'"
          :aria-describedby="ariaDescribedBy"
        />
      </template>
    </FormField>

    <!-- Password with Toggle -->
    <FormField
      label="Password"
      :error="errors.password"
      type="password"
      required
    >
      <template #default="{ fieldId, hasError, ariaDescribedBy, showPassword }">
        <Input
          :id="fieldId"
          v-model="password"
          placeholder="Enter your password"
          :type="showPassword ? 'text' : 'password'"
          :disabled="isLoading"
          :class="[
            hasError ? 'border-(--ui-danger)' : 'ui-border-strong',
            'pr-10' // Add padding to accommodate the toggle button
          ]"
          :aria-describedby="ariaDescribedBy"
        />
      </template>
    </FormField>

    <!-- Company Code -->
    <FormField
      label="Company Code"
      :error="errors.companyCode"
      type="text"
      required
    >
      <template #default="{ fieldId, hasError, ariaDescribedBy }">
        <Input
          :id="fieldId"
          v-model="companyCode"
          placeholder="Enter your company code"
          type="text"
          :disabled="isLoading"
          :class="hasError ? 'border-(--ui-danger)' : 'ui-border-strong'"
          :aria-describedby="ariaDescribedBy"
        />
      </template>
    </FormField>

    <!-- Remember me and forgot password -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <Checkbox
          id="rememberMe"
          v-model="rememberMe"
          label="Remember me"
          :disabled="isLoading"
        />
      </div>

      <Typography class="text-sm font-medium">
        <Link href="/auth/forgot-password">
          Forgot password?
        </Link>
        <Link href="/table">
          Table Example
        </Link>
      </Typography>
    </div>

    <!-- Submit -->
    <Button
      type="submit"
      class="w-full rounded-md ui-primary-bg py-2 ui-text font-medium hover:bg-(--ui-primary-strong) transition flex items-center justify-center"
      :disabled="isLoading"
      :loading="isLoading"
    >
      Sign In
    </Button>
  </form>
</template>