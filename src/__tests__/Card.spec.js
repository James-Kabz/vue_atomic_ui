import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Card from '../components/Card.vue'

describe('Card', () => {
  it('renders with default props', () => {
    const wrapper = mount(Card)
    expect(wrapper.classes()).toContain('bg-white')
    expect(wrapper.classes()).toContain('border-slate-200')
  })

  it('renders title and subtitle', () => {
    const wrapper = mount(Card, {
      props: { title: 'Test Title', subtitle: 'Test Subtitle' }
    })
    expect(wrapper.text()).toContain('Test Title')
    expect(wrapper.text()).toContain('Test Subtitle')
  })

  it('renders slots', () => {
    const wrapper = mount(Card, {
      slots: {
        header: 'Header Content',
        default: 'Body Content',
        footer: 'Footer Content'
      }
    })
    expect(wrapper.text()).toContain('Header Content')
    expect(wrapper.text()).toContain('Body Content')
    expect(wrapper.text()).toContain('Footer Content')
  })

  it('applies variant classes', () => {
    const wrapper = mount(Card, {
      props: { variant: 'elevated' }
    })
    expect(wrapper.classes()).toContain('shadow-lg')
  })

  it('applies padding classes', () => {
    const wrapper = mount(Card, {
      props: { padding: 'lg' }
    })
    expect(wrapper.classes()).toContain('p-6')
  })

  it('applies hoverable class', () => {
    const wrapper = mount(Card, {
      props: { hoverable: true }
    })
    expect(wrapper.classes()).toContain('hover:shadow-md')
  })

  it('applies clickable class', () => {
    const wrapper = mount(Card, {
      props: { clickable: true }
    })
    expect(wrapper.classes()).toContain('cursor-pointer')
  })

  it('emits click event when clickable', async () => {
    const wrapper = mount(Card, {
      props: { clickable: true }
    })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('applies loading state', () => {
    const wrapper = mount(Card, {
      props: { loading: true }
    })
    expect(wrapper.classes()).toContain('opacity-60')
    expect(wrapper.classes()).toContain('pointer-events-none')
  })

  it('renders image', () => {
    const wrapper = mount(Card, {
      props: { image: 'test.jpg', imageAlt: 'Test image' }
    })
    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('test.jpg')
    expect(img.attributes('alt')).toBe('Test image')
  })
})