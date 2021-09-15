import { shallowMount } from '@vue/test-utils'
import About from '@/views/About'

describe('About view test', () => {

    test('should render the component correctly', () => {
        const wrapper = shallowMount(About)
        expect(wrapper.html()).toMatchSnapshot()
    });
});