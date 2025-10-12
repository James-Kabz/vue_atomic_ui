<template>
  <component
    :is="tag"
    :href="tag === 'a' ? href : undefined"
    :to="tag === 'router-link' ? to : undefined"
    :target="external ? '_blank' : target"
    :rel="external ? 'noopener noreferrer' : rel"
    :class="cn(linkVariants({ variant, size, underline, block, disabled }), $attrs.class)"
    @click="handleClick"
  >
    <Icon
      v-if="icon && iconPosition === 'left'"
      :name="icon"
      :class="iconClass"
    />
    <slot />
    <Icon
      v-if="icon && iconPosition === 'right'"
      :name="icon"
      :class="iconClass"
    />
    <Icon
      v-if="external && showExternalIcon"
      name="external-link"
      class="w-3 h-3 ml-1 inline-block"
    />
  </component>
</template>

<script setup>
import { cva } from "class-variance-authority"
import { cn } from "../utils/cn.js"
import Icon from "./Icon.vue"
import { computed } from "vue"

const props = defineProps({
  href: { type: String, default: null },
  to: { type: [String, Object], default: null },
  external: { type: Boolean, default: false },
  target: { type: String, default: null },
  rel: { type: String, default: null },
  variant: {
    type: String,
    default: "primary",
    validator: (v) => ["primary", "secondary", "muted", "danger", "success"].includes(v),
  },
  size: {
    type: String,
    default: "md",
    validator: (v) => ["xs", "sm", "md", "lg", "xl"].includes(v),
  },
  underline: {
    type: String,
    default: "hover",
    validator: (v) => ["always", "hover", "never"].includes(v),
  },
  disabled: { type: Boolean, default: false },
  icon: { type: String, default: null },
  iconPosition: {
    type: String,
    default: "left",
    validator: (v) => ["left", "right"].includes(v),
  },
  showExternalIcon: { type: Boolean, default: true },
  block: { type: Boolean, default: false },
})

const tag = computed(() => {
  if (props.to && !props.href) return "router-link"
  if (props.href || props.external) return "a"
  return "button"
})

const iconClass = computed(() => {
  const spacing = props.iconPosition === "left" ? "mr-2" : "ml-2"
  return `w-4 h-4 ${spacing}`
})

const linkVariants = cva(
  "transition-colors duration-200 inline-flex items-center",
  {
    variants: {
      variant: {
        primary: "text-blue-800 hover:text-blue-800 dark:text-blue-500 dark:hover:text-blue-400",
        secondary: "text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300",
        muted: "text-gray-500 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-400",
        danger: "text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300",
        success: "text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300",
      },
      size: {
        xs: "text-xs",
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
        xl: "text-xl",
      },
      underline: {
        always: "underline",
        hover: "hover:underline",
        never: "no-underline",
      },
      block: {
        true: "block w-full",
        false: "inline-flex items-center",
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed pointer-events-none",
        false: "cursor-pointer",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      underline: "hover",
      block: false,
      disabled: false,
    },
  }
)

const handleClick = (event) => {
  if (props.disabled) {
    event.preventDefault()
    return
  }
  // emit to parent
  emit("click", event)
}

const emit = defineEmits(["click"])
</script>
