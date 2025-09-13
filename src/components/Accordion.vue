<template>
  <div :class="accordionClasses">
    <div
      v-for="(item, index) in items"
      :key="item.id || index"
      :class="itemClasses"
    >
      <!-- Header -->
      <button
        :class="headerClasses(index)"
        :aria-expanded="isExpanded(index)"
        :aria-controls="`panel-${item.id || index}`"
        :id="`header-${item.id || index}`"
        @click="toggle(index)"
      >
        <div class="flex items-center flex-1 min-w-0">
          <component v-if="item.icon" :is="item.icon" :class="iconClasses" />

          <div class="flex-1 text-left">
            <h3 :class="titleClasses">{{ item.title }}</h3>
            <p v-if="item.subtitle" :class="subtitleClasses">{{ item.subtitle }}</p>
          </div>
        </div>

        <div :class="chevronClasses(index)">
          <ChevronDownIcon class="w-5 h-5 transition-transform duration-200" />
        </div>
      </button>

      <!-- Content -->
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 max-h-0"
        enter-to-class="opacity-100 max-h-96"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 max-h-96"
        leave-to-class="opacity-0 max-h-0"
      >
        <div
          v-if="isExpanded(index)"
          :class="contentClasses"
          :id="`panel-${item.id || index}`"
          :aria-labelledby="`header-${item.id || index}`"
          role="region"
        >
          <slot :name="item.slot || `item-${index}`" :item="item" :index="index">
            <div v-if="item.content" v-html="item.content" />
          </slot>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { cva } from 'class-variance-authority'
import { cn } from '../utils/cn.js'

// Inline icon component
const ChevronDownIcon = {
  template: `
    <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  `
}

const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  modelValue: {
    type: [Number, Array],
    default: null
  },
  multiple: Boolean,
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'bordered', 'filled', 'flush'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  disabled: Boolean
})

const emit = defineEmits(['update:modelValue', 'change'])

const expandedItems = ref(
  props.multiple
    ? (Array.isArray(props.modelValue) ? [...props.modelValue] : [])
    : (typeof props.modelValue === 'number' ? [props.modelValue] : [])
)

// ✅ Toggle logic
const toggle = (index) => {
  if (props.disabled || props.items[index]?.disabled) return

  if (props.multiple) {
    const currentIndex = expandedItems.value.indexOf(index)
    if (currentIndex > -1) {
      expandedItems.value.splice(currentIndex, 1)
    } else {
      expandedItems.value.push(index)
    }
    emit('update:modelValue', [...expandedItems.value])
  } else {
    const newValue = expandedItems.value.includes(index) ? null : index
    expandedItems.value = newValue !== null ? [newValue] : []
    emit('update:modelValue', newValue)
  }

  emit('change', { index, expanded: expandedItems.value.includes(index) })
}

const isExpanded = (index) => expandedItems.value.includes(index)

// --------------------
// Variants & Classes
// --------------------

const accordionVariants = cva('w-full', {
  variants: {
    variant: {
      default: 'divide-y divide-slate-200',
      bordered: 'space-y-2',
      filled: 'space-y-2',
      flush: 'divide-y divide-slate-200'
    }
  }
})

const itemVariants = cva('', {
  variants: {
    variant: {
      default: '',
      bordered: 'border border-slate-200 rounded-lg overflow-hidden',
      filled: 'bg-slate-50 border border-slate-200 rounded-lg overflow-hidden',
      flush: ''
    }
  }
})

const headerVariants = cva(
  'flex items-center w-full text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'hover:bg-slate-50',
        bordered: 'hover:bg-slate-50',
        filled: 'hover:bg-white/50',
        flush: 'hover:bg-slate-50'
      },
      size: {
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6'
      }
    }
  }
)

const titleVariants = cva('text-slate-900', {
  variants: {
    size: {
      sm: 'text-sm font-medium',
      md: 'text-base font-medium',
      lg: 'text-lg font-medium'
    }
  }
})

const subtitleVariants = cva('text-slate-500 mt-1', {
  variants: {
    size: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base'
    }
  }
})

const iconVariants = cva('mr-3 text-slate-400', {
  variants: {
    size: {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    }
  }
})

const chevronVariants = cva('ml-4 text-slate-400 transition-transform duration-200', {
  variants: {
    expanded: {
      true: 'rotate-180',
      false: ''
    }
  }
})

const contentVariants = cva('overflow-hidden text-slate-600 border-t border-slate-200', {
  variants: {
    size: {
      sm: 'p-3 text-sm',
      md: 'p-4 text-sm',
      lg: 'p-6 text-base'
    }
  }
})

// --------------------
// Computed Classes
// --------------------

const accordionClasses = computed(() =>
  cn(accordionVariants({ variant: props.variant }))
)

const itemClasses = computed(() =>
  cn(itemVariants({ variant: props.variant }))
)

const headerClasses = (index) =>
  cn(
    headerVariants({ variant: props.variant, size: props.size }),
    (props.variant === 'bordered' && isExpanded(index)) && 'bg-slate-50',
    (props.variant === 'filled' && isExpanded(index)) && 'bg-white',
    (props.disabled || props.items[index]?.disabled) && 'cursor-not-allowed opacity-50'
  )

const titleClasses = computed(() =>
  cn(titleVariants({ size: props.size }))
)

const subtitleClasses = computed(() =>
  cn(subtitleVariants({ size: props.size }))
)

const iconClasses = computed(() =>
  cn(iconVariants({ size: props.size }))
)

const chevronClasses = (index) =>
  cn(chevronVariants({ expanded: isExpanded(index) }))

const contentClasses = computed(() =>
  cn(contentVariants({ size: props.size }))
)

// --------------------
// Sync with modelValue
// --------------------

watch(
  () => props.modelValue,
  (newValue) => {
    if (props.multiple) {
      expandedItems.value = Array.isArray(newValue) ? [...newValue] : []
    } else {
      expandedItems.value = typeof newValue === 'number' ? [newValue] : []
    }
  }
)
</script>
