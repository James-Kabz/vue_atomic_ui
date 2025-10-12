import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Select from '../components/Select.vue'

describe('Select', () => {
  it('renders with default props', () => {
    const wrapper = mount(Select)
    expect(wrapper.find('select').exists()).toBe(true)
  })

  it('accepts v-model', async () => {
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

  it('applies disabled state', () => {
    const wrapper = mount(Select, {
      props: { disabled: true }
    })
    expect(wrapper.find('select').attributes('disabled')).toBeDefined()
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

  it('renders slot content', () => {
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
})