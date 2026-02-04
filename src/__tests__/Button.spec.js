import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from '../components/Button.vue'

describe('Button', () => {
  it('renders with default props', () => {
    const wrapper = mount(Button)
    expect(wrapper.classes()).toContain('ui-glossy-button-strong') // default variant class
  })

  it('applies variant class', () => {
    const wrapper = mount(Button, {
      props: { variant: 'primaryOutline' }
    })
    expect(wrapper.classes()).toContain('border-(--ui-primary)')
  })

  it('emits click event', async () => {
    const wrapper = mount(Button)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('displays slot content', () => {
    const wrapper = mount(Button, {
      slots: {
        default: 'Click me'
      }
    })
    expect(wrapper.text()).toBe('Click me')
  })
})
