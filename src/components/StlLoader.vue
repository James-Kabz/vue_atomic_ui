<template>
  <div 
    v-if="loading"
    :class="[
      'stl-loader',
      `stl-loader--${type}`,
      `stl-loader--${size}`,
      overlay ? 'stl-loader--overlay' : '',
      fullscreen ? 'stl-loader--fullscreen' : ''
    ]"
    :style="{ 
      '--loader-color': color,
      '--loader-bg': backgroundColor 
    }"
  >
    <!-- Optional backdrop -->
    <div
      v-if="overlay"
      class="stl-loader__backdrop"
    />
    
    <!-- Loader container -->
    <div class="stl-loader__container">
      <!-- Text above loader -->
      <div
        v-if="text && textPosition === 'top'"
        class="stl-loader__text stl-loader__text--top"
      >
        {{ text }}
      </div>

      <!-- Spin Loader -->
      <div 
        v-if="type === 'spin'" 
        class="stl-loader__spin"
      />
      
      <!-- Pulse Loader -->
      <div 
        v-else-if="type === 'pulse'" 
        class="stl-loader__pulse"
      />
      
      <!-- Bounce Loader -->
      <div
        v-else-if="type === 'bounce'"
        class="stl-loader__bounce"
      >
        <div 
          v-for="i in 3" 
          :key="i" 
          class="stl-loader__bounce-dot"
          :style="{ animationDelay: `${(i - 1) * 0.1}s` }"
        />
      </div>
      
      <!-- Ripple Loader -->
      <div
        v-else-if="type === 'ripple'"
        class="stl-loader__ripple"
      >
        <div 
          v-for="i in 2" 
          :key="i" 
          class="stl-loader__ripple-ring"
          :style="{ animationDelay: `${(i - 1) * 0.5}s` }"
        />
      </div>
      
      <!-- Bars Loader -->
      <div
        v-else-if="type === 'bars'"
        class="stl-loader__bars"
      >
        <div 
          v-for="i in 5" 
          :key="i" 
          class="stl-loader__bar"
          :style="{ animationDelay: `${(i - 1) * 0.1}s` }"
        />
      </div>
      
      <!-- Dots Loader -->
      <div
        v-else-if="type === 'dots'"
        class="stl-loader__dots"
      >
        <div 
          v-for="i in 3" 
          :key="i" 
          class="stl-loader__dot"
          :style="{ animationDelay: `${(i - 1) * 0.16}s` }"
        />
      </div>
      
      <!-- Ring Loader -->
      <div
        v-else-if="type === 'ring'"
        class="stl-loader__ring"
      >
        <div class="stl-loader__ring-track" />
        <div class="stl-loader__ring-fill" />
      </div>

      <!-- Spinner with text -->
      <div
        v-else-if="type === 'spinner-text'"
        class="stl-loader__spinner-text"
      >
        <div class="stl-loader__spinner" />
      </div>

      <!-- Text below loader -->
      <div
        v-if="text && textPosition === 'bottom'"
        class="stl-loader__text stl-loader__text--bottom"
      >
        {{ text }}
      </div>
    </div>
  </div>
</template>

<script setup>
// Define component props
defineProps({
  loading: {
    type: Boolean,
    default: true
  },
  type: {
    type: String,
    default: 'spin',
    validator: (value) => [
      'spin', 'pulse', 'bounce', 'ripple', 
      'bars', 'dots', 'ring', 'spinner-text'
    ].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large', 'xl'].includes(value)
  },
  color: {
    type: String,
    default: '#3b82f6'
  },
  backgroundColor: {
    type: String,
    default: 'rgba(255, 255, 255, 0.9)'
  },
  text: {
    type: String,
    default: ''
  },
  textPosition: {
    type: String,
    default: 'bottom',
    validator: (value) => ['top', 'bottom'].includes(value)
  },
  overlay: {
    type: Boolean,
    default: false
  },
  fullscreen: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.stl-loader {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.stl-loader--overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background-color: var(--loader-bg);
}

.stl-loader--fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
}

.stl-loader__backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--loader-bg);
}

.stl-loader__container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  position: relative;
  z-index: 1;
}

.stl-loader__text {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
  text-align: center;
}

.stl-loader__text--top {
  margin-bottom: 8px;
}

.stl-loader__text--bottom {
  margin-top: 8px;
}

/* Size variants */
.stl-loader--small .stl-loader__container { gap: 8px; }
.stl-loader--medium .stl-loader__container { gap: 12px; }
.stl-loader--large .stl-loader__container { gap: 16px; }
.stl-loader--xl .stl-loader__container { gap: 20px; }

.stl-loader--small .stl-loader__text { font-size: 12px; }
.stl-loader--medium .stl-loader__text { font-size: 14px; }
.stl-loader--large .stl-loader__text { font-size: 16px; }
.stl-loader--xl .stl-loader__text { font-size: 18px; }

/* Spin Loader */
.stl-loader__spin {
  border: 4px solid #e5e7eb;
  border-top: 4px solid var(--loader-color);
  border-radius: 50%;
  animation: stl-spin 1s linear infinite;
}

.stl-loader--small .stl-loader__spin { width: 24px; height: 24px; border-width: 3px; }
.stl-loader--medium .stl-loader__spin { width: 40px; height: 40px; border-width: 4px; }
.stl-loader--large .stl-loader__spin { width: 56px; height: 56px; border-width: 5px; }
.stl-loader--xl .stl-loader__spin { width: 72px; height: 72px; border-width: 6px; }

/* Pulse Loader */
.stl-loader__pulse {
  background-color: var(--loader-color);
  border-radius: 50%;
  animation: stl-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.stl-loader--small .stl-loader__pulse { width: 24px; height: 24px; }
.stl-loader--medium .stl-loader__pulse { width: 40px; height: 40px; }
.stl-loader--large .stl-loader__pulse { width: 56px; height: 56px; }
.stl-loader--xl .stl-loader__pulse { width: 72px; height: 72px; }

/* Bounce Loader */
.stl-loader__bounce {
  display: flex;
  gap: 4px;
  align-items: flex-end;
}

.stl-loader__bounce-dot {
  background-color: var(--loader-color);
  border-radius: 50%;
  animation: stl-bounce 1.4s ease-in-out infinite both;
}

.stl-loader--small .stl-loader__bounce-dot { width: 8px; height: 8px; }
.stl-loader--medium .stl-loader__bounce-dot { width: 12px; height: 12px; }
.stl-loader--large .stl-loader__bounce-dot { width: 16px; height: 16px; }
.stl-loader--xl .stl-loader__bounce-dot { width: 20px; height: 20px; }

/* Ripple Loader */
.stl-loader__ripple {
  position: relative;
}

.stl-loader__ripple-ring {
  position: absolute;
  border: 4px solid var(--loader-color);
  border-radius: 50%;
  animation: stl-ripple 1s linear infinite;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.stl-loader--small .stl-loader__ripple { width: 40px; height: 40px; }
.stl-loader--medium .stl-loader__ripple { width: 60px; height: 60px; }
.stl-loader--large .stl-loader__ripple { width: 80px; height: 80px; }
.stl-loader--xl .stl-loader__ripple { width: 100px; height: 100px; }

.stl-loader--small .stl-loader__ripple-ring { width: 40px; height: 40px; border-width: 2px; }
.stl-loader--medium .stl-loader__ripple-ring { width: 60px; height: 60px; border-width: 3px; }
.stl-loader--large .stl-loader__ripple-ring { width: 80px; height: 80px; border-width: 4px; }
.stl-loader--xl .stl-loader__ripple-ring { width: 100px; height: 100px; border-width: 5px; }

/* Bars Loader */
.stl-loader__bars {
  display: flex;
  gap: 3px;
  align-items: flex-end;
}

.stl-loader__bar {
  background-color: var(--loader-color);
  border-radius: 2px;
  animation: stl-bar-scale 1s ease-in-out infinite;
}

.stl-loader--small .stl-loader__bar { width: 3px; height: 16px; }
.stl-loader--medium .stl-loader__bar { width: 4px; height: 24px; }
.stl-loader--large .stl-loader__bar { width: 5px; height: 32px; }
.stl-loader--xl .stl-loader__bar { width: 6px; height: 40px; }

/* Dots Loader */
.stl-loader__dots {
  display: flex;
  gap: 6px;
}

.stl-loader__dot {
  background-color: var(--loader-color);
  border-radius: 50%;
  animation: stl-dot-bounce 1.4s ease-in-out infinite both;
}

.stl-loader--small .stl-loader__dot { width: 8px; height: 8px; }
.stl-loader--medium .stl-loader__dot { width: 12px; height: 12px; }
.stl-loader--large .stl-loader__dot { width: 16px; height: 16px; }
.stl-loader--xl .stl-loader__dot { width: 20px; height: 20px; }

/* Ring Loader */
.stl-loader__ring {
  position: relative;
}

.stl-loader__ring-track {
  border: 4px solid #e5e7eb;
  border-radius: 50%;
}

.stl-loader__ring-fill {
  position: absolute;
  top: 0;
  left: 0;
  border: 4px solid transparent;
  border-top: 4px solid var(--loader-color);
  border-radius: 50%;
  animation: stl-spin 1s linear infinite;
}

.stl-loader--small .stl-loader__ring-track,
.stl-loader--small .stl-loader__ring-fill { width: 24px; height: 24px; border-width: 3px; }
.stl-loader--medium .stl-loader__ring-track,
.stl-loader--medium .stl-loader__ring-fill { width: 40px; height: 40px; border-width: 4px; }
.stl-loader--large .stl-loader__ring-track,
.stl-loader--large .stl-loader__ring-fill { width: 56px; height: 56px; border-width: 5px; }
.stl-loader--xl .stl-loader__ring-track,
.stl-loader--xl .stl-loader__ring-fill { width: 72px; height: 72px; border-width: 6px; }

/* Spinner with text */
.stl-loader__spinner-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.stl-loader__spinner {
  border: 3px solid #f3f4f6;
  border-top: 3px solid var(--loader-color);
  border-radius: 50%;
  animation: stl-spin 1s linear infinite;
}

.stl-loader--small .stl-loader__spinner { width: 20px; height: 20px; }
.stl-loader--medium .stl-loader__spinner { width: 32px; height: 32px; }
.stl-loader--large .stl-loader__spinner { width: 44px; height: 44px; }
.stl-loader--xl .stl-loader__spinner { width: 56px; height: 56px; }

/* Animations */
@keyframes stl-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes stl-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes stl-bounce {
  0%, 80%, 100% { 
    transform: scale(0);
    opacity: 0.5;
  } 
  40% { 
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes stl-ripple {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0;
  }
}

@keyframes stl-bar-scale {
  0%, 40%, 100% { 
    transform: scaleY(0.4); 
  }
  20% { 
    transform: scaleY(1); 
  }
}

@keyframes stl-dot-bounce {
  0%, 80%, 100% { 
    transform: scale(0);
  } 
  40% { 
    transform: scale(1);
  }
}
</style>