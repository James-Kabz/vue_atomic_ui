<template>
  <div 
    :class="[
      'stl-loader',
      `stl-loader--${type}`,
      `stl-loader--${size}`
    ]"
    :style="{ '--loader-color': color }"
    v-if="loading"
  >
    <!-- Spin Loader -->
    <div 
      v-if="type === 'spin'" 
      class="stl-loader__spin"
    ></div>
    
    <!-- Pulse Loader -->
    <div 
      v-else-if="type === 'pulse'" 
      class="stl-loader__pulse"
    ></div>
    
    <!-- Bounce Loader -->
    <div v-else-if="type === 'bounce'" class="stl-loader__bounce">
      <div class="stl-loader__bounce-dot" v-for="i in 3" :key="i"></div>
    </div>
    
    <!-- Add other loader types... -->
  </div>
</template>

<script>
export default {
  name: 'STLLoader',
  props: {
    loading: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      default: 'spin',
      validator: (value) => [
        'spin', 'pulse', 'bounce', 'ripple', 
        'bars', 'dots', 'ring'
      ].includes(value)
    },
    size: {
      type: String,
      default: 'medium',
      validator: (value) => ['small', 'medium', 'large'].includes(value)
    },
    color: {
      type: String,
      default: '#3b82f6'
    }
  }
}
</script>

<style scoped>
.stl-loader {
  display: flex;
  justify-content: center;
  align-items: center;
}

.stl-loader--small { width: 1.5rem; height: 1.5rem; }
.stl-loader--medium { width: 2.5rem; height: 2.5rem; }
.stl-loader--large { width: 4rem; height: 4rem; }

.stl-loader__spin {
  width: 100%;
  height: 100%;
  border: 4px solid #e5e7eb;
  border-top: 4px solid var(--loader-color);
  border-radius: 50%;
  animation: stl-spin 1s linear infinite;
}

.stl-loader__pulse {
  width: 100%;
  height: 100%;
  background-color: var(--loader-color);
  border-radius: 50%;
  animation: stl-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes stl-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes stl-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>