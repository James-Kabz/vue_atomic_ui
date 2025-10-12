import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Badge from '../components/Badge.vue'

describe('Badge', () => {
  it('renders with default props', () => {
    const wrapper = mount(Badge)
    expect(wrapper.classes()).toContain('inline-flex')
    expect(wrapper.classes()).toContain('bg-primary')
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
    expect(wrapper.classes()).toContain('bg-destructive')
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