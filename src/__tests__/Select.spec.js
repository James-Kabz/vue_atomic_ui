import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Select from '../components/Select.vue'

describe('Select', () => {
  const mockOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' }
  ]

  it('renders native select when no options provided', () => {
    const wrapper = mount(Select)
    expect(wrapper.find('select').exists()).toBe(true)
  })

  it('renders searchable dropdown when options provided', () => {
    const wrapper = mount(Select, {
      props: { options: mockOptions }
    })
    expect(wrapper.find('select').exists()).toBe(false)
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('accepts v-model with native select', async () => {
    const wrapper = mount(Select, {
      props: { modelValue: 'option1' },
      slots: {
        default: '<option value="option1">Option 1</option><option value="option2">Option 2</option>'
      }
    })
    const select = wrapper.find('select')
    expect(select.element.value).toBe('option1')

    await select.setValue('option2')
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['option2'])
  })

  it('accepts v-model with searchable dropdown', async () => {
    const wrapper = mount(Select, {
      props: { modelValue: 'option1', options: mockOptions }
    })
    expect(wrapper.text()).toContain('Option 1')

    await wrapper.find('button').trigger('click')
    const options = wrapper.findAll('button')
    await options[1].trigger('click') // Click second option (Option 2)

    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['option2'])
  })

  it('applies disabled state to native select', () => {
    const wrapper = mount(Select, {
      props: { disabled: true }
    })
    expect(wrapper.find('select').attributes('disabled')).toBeDefined()
    expect(wrapper.classes()).toContain('cursor-not-allowed')
  })

  it('applies disabled state to searchable dropdown', () => {
    const wrapper = mount(Select, {
      props: { disabled: true, options: mockOptions }
    })
    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
    expect(wrapper.classes()).toContain('cursor-not-allowed')
  })

  it('applies required attribute', () => {
    const wrapper = mount(Select, {
      props: { required: true }
    })
    expect(wrapper.find('select').attributes('required')).toBeDefined()
  })

  it('accepts id and name', () => {
    const wrapper = mount(Select, {
      props: { id: 'test-select', name: 'testName' }
    })
    const select = wrapper.find('select')
    expect(select.attributes('id')).toBe('test-select')
    expect(select.attributes('name')).toBe('testName')
  })

  it('renders slot content for native select', () => {
    const wrapper = mount(Select, {
      slots: {
        default: '<option value="1">Option 1</option><option value="2">Option 2</option>'
      }
    })
    expect(wrapper.find('option').exists()).toBe(true)
    expect(wrapper.text()).toContain('Option 1')
  })

  it('applies custom class', () => {
    const wrapper = mount(Select, {
      props: { class: 'custom-class' }
    })
    expect(wrapper.classes()).toContain('custom-class')
  })

  it('shows placeholder when no option selected', () => {
    const wrapper = mount(Select, {
      props: { options: mockOptions, placeholder: 'Choose an option' }
    })
    expect(wrapper.text()).toContain('Choose an option')
  })

  it('filters options based on search query', async () => {
    const wrapper = mount(Select, {
      props: { options: mockOptions }
    })

    await wrapper.find('button').trigger('click')
    const searchInput = wrapper.find('input[type="text"]')
    await searchInput.setValue('Option 1')

    expect(wrapper.text()).toContain('Option 1')
    expect(wrapper.text()).not.toContain('Option 2')
  })

  it('closes dropdown on escape key', async () => {
    const wrapper = mount(Select, {
      props: { options: mockOptions }
    })

    await wrapper.find('button').trigger('click')
    expect(wrapper.find('.absolute').exists()).toBe(true)

    await wrapper.find('button').trigger('keydown', { key: 'Escape' })
    expect(wrapper.find('.absolute').exists()).toBe(false)
  })

  it('closes dropdown when clicking outside', async () => {
    const wrapper = mount(Select, {
      props: { options: mockOptions },
      attachTo: document.body
    })

    await wrapper.find('button').trigger('click')
    expect(wrapper.find('.absolute').exists()).toBe(true)

    // Simulate click outside
    document.body.click()
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.absolute').exists()).toBe(false)
  })
})