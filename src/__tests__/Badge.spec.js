import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Badge from '../components/Badge.vue'

describe('Badge', () => {
  it('renders with default props', () => {
    const wrapper = mount(Badge)
    expect(wrapper.classes()).toContain('inline-flex')
    expect(wrapper.classes()).toContain('bg-blue-50')
  })

  it('displays slot content', () => {
    const wrapper = mount(Badge, {
      slots: {
        default: 'Test Badge'
      }
    })
    expect(wrapper.text()).toBe('Test Badge')
  })

  it('applies variant classes', () => {
    const wrapper = mount(Badge, {
      props: { variant: 'destructive' }
    })
    expect(wrapper.classes()).toContain('bg-red-50')
  })

  it('applies primary variant classes', () => {
    const wrapper = mount(Badge, {
      props: { variant: 'primary' }
    })
    expect(wrapper.classes()).toContain('bg-blue-50')
  })

  it('applies success variant classes', () => {
    const wrapper = mount(Badge, {
      props: { variant: 'success' }
    })
    expect(wrapper.classes()).toContain('bg-green-50')
  })

  it('applies warning variant classes', () => {
    const wrapper = mount(Badge, {
      props: { variant: 'warning' }
    })
    expect(wrapper.classes()).toContain('bg-yellow-50')
  })

  it('applies info variant classes', () => {
    const wrapper = mount(Badge, {
      props: { variant: 'info' }
    })
    expect(wrapper.classes()).toContain('bg-blue-50')
  })

  it('applies ghost variant classes', () => {
    const wrapper = mount(Badge, {
      props: { variant: 'ghost' }
    })
    expect(wrapper.classes()).toContain('bg-transparent')
  })

  it('applies link variant classes', () => {
    const wrapper = mount(Badge, {
      props: { variant: 'link' }
    })
    expect(wrapper.classes()).toContain('text-blue-600')
  })

  it('applies subtle variant classes', () => {
    const wrapper = mount(Badge, {
      props: { variant: 'subtle' }
    })
    expect(wrapper.classes()).toContain('bg-gray-100')
  })

  it('applies dark variant classes', () => {
    const wrapper = mount(Badge, {
      props: { variant: 'dark' }
    })
    expect(wrapper.classes()).toContain('bg-gray-900')
  })

  it('applies light variant classes', () => {
    const wrapper = mount(Badge, {
      props: { variant: 'light' }
    })
    expect(wrapper.classes()).toContain('bg-gray-50')
  })

  it('applies primaryOutline variant classes', () => {
    const wrapper = mount(Badge, {
      props: { variant: 'primaryOutline' }
    })
    expect(wrapper.classes()).toContain('border-blue-500')
  })

  it('applies destructiveOutline variant classes', () => {
    const wrapper = mount(Badge, {
      props: { variant: 'destructiveOutline' }
    })
    expect(wrapper.classes()).toContain('border-red-500')
  })

  it('applies successOutline variant classes', () => {
    const wrapper = mount(Badge, {
      props: { variant: 'successOutline' }
    })
    expect(wrapper.classes()).toContain('border-green-500')
  })

  it('applies gradient variant classes', () => {
    const wrapper = mount(Badge, {
      props: { variant: 'gradient' }
    })
    expect(wrapper.classes()).toContain('bg-gradient-to-r')
  })

  it('applies size classes', () => {
    const wrapper = mount(Badge, {
      props: { size: 'lg' }
    })
    expect(wrapper.classes()).toContain('px-3')
    expect(wrapper.classes()).toContain('py-1.5')
  })

  it('applies shape classes', () => {
    const wrapper = mount(Badge, {
      props: { shape: 'pill' }
    })
    expect(wrapper.classes()).toContain('rounded-full')
  })

  it('shows dismiss button when dismissible', () => {
    const wrapper = mount(Badge, {
      props: { dismissible: true }
    })
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('emits dismiss event on dismiss button click', async () => {
    const wrapper = mount(Badge, {
      props: { dismissible: true }
    })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('dismiss')).toHaveLength(1)
  })

  it('renders icon', () => {
    const wrapper = mount(Badge, {
      props: { icon: 'test-icon' }
    })
    // Icon is rendered via component tag, check if it exists
    expect(wrapper.html()).toContain('<test-icon')
  })

  it('applies custom class', () => {
    const wrapper = mount(Badge, {
      props: { class: 'custom-class' }
    })
    expect(wrapper.classes()).toContain('custom-class')
  })
})