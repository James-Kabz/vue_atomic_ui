<template>
  <div :class="accordionClasses">
    <div
      v-for="(item, index) in items"
      :key="item.id || index"
      :class="itemClasses"
    >
      <!-- Header -->
      <button
        :id="`header-${item.id || index}`"
        :class="headerClasses(index)"
        :aria-expanded="isExpanded(index)"
        :aria-controls="`panel-${item.id || index}`"
        @click="toggle(index)"
      >
        <div class="flex items-center flex-1 min-w-0">
          <slot
            :name="`header-${index}`"
            :item="item"
            :index="index"
            :is-expanded="isExpanded(index)"
          >
            <div
              v-if="item.title"
            >
              {{ item.title }}
            </div>
          </slot>
        </div>

        <div :class="chevronClasses(index)">
          <ChevronDownIcon class="w-5 h-5 transition-transform duration-200" />
        </div>
      </button>

      <!-- Content -->
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 max-h-0"
        enter-to-class="opacity-100 max-h-[600px]"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 max-h-[600px]"
        leave-to-class="opacity-0 max-h-0"
      >
        <div
          v-if="isExpanded(index)"
          :id="`panel-${item.id || index}`"
          :class="contentClasses"
          :aria-labelledby="`header-${item.id || index}`"
          role="region"
        >
          <slot
            :name="`content-${index}`"
            :item="item"
            :index="index"
          >
            <slot
              name="content"
              :item="item"
              :index="index"
            >
              <div
                v-if="item.content"
              >
                {{ item.content }}
              </div>
            </slot>
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

const accordionVariants = cva('w-full', {
  variants: {
    variant: {
      default: 'space-y-1',
      bordered: 'space-y-3',
      filled: 'space-y-3',
      flush: 'divide-y divide-slate-200'
    }
  }
})

const itemVariants = cva('transition-all duration-200', {
  variants: {
    variant: {
      default: 'bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md',
      bordered: 'border-2 border-slate-200 rounded-xl overflow-hidden hover:border-blue-300',
      filled: 'bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-xl overflow-hidden shadow-sm',
      flush: ''
    }
  }
})

const headerVariants = cva(
  'flex items-center justify-between w-full text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'hover:bg-slate-50',
        bordered: 'hover:bg-blue-50/50',
        filled: 'hover:bg-white/70',
        flush: 'hover:bg-slate-50'
      },
      size: {
        sm: 'px-4 py-3',
        md: 'px-5 py-4',
        lg: 'px-6 py-5'
      }
    }
  }
)

const chevronVariants = cva('ml-4 flex-shrink-0 text-slate-400 transition-all duration-200', {
  variants: {
    expanded: {
      true: 'rotate-180 text-blue-500',
      false: ''
    }
  }
})

const contentVariants = cva('overflow-hidden text-slate-600 bg-white', {
  variants: {
    size: {
      sm: 'px-4 py-3 text-sm',
      md: 'px-5 py-4 text-sm',
      lg: 'px-6 py-5 text-base'
    }
  }
})

const accordionClasses = computed(() =>
  cn(accordionVariants({ variant: props.variant }))
)

const itemClasses = computed(() =>
  cn(itemVariants({ variant: props.variant }))
)

const headerClasses = (index) =>
  cn(
    headerVariants({ variant: props.variant, size: props.size }),
    isExpanded(index) && props.variant === 'bordered' && 'bg-blue-50/30 border-blue-300',
    isExpanded(index) && props.variant === 'filled' && 'bg-white',
    isExpanded(index) && props.variant === 'default' && 'bg-slate-50',
    (props.disabled || props.items[index]?.disabled) && 'cursor-not-allowed opacity-50'
  )

const chevronClasses = (index) =>
  cn(chevronVariants({ expanded: isExpanded(index) }))

const contentClasses = computed(() =>
  cn(contentVariants({ size: props.size }))
)

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