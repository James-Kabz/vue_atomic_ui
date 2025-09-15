<script setup>
import Button from './components/Button.vue';

</script>

<template>
  <Button
          type="submit"
          :disabled="!isFormValid"
          :loading="isLoading"
          loading-text="Sending..."
          variant="default"
          size="default"
          class="w-full"
        >
          Send Reset Link
        </Button>
</template>

<style scoped></style>
