import { shallowMount } from '@vue/test-utils'
import Home from '@/views/Home'

describe('Home view test', () => {

    test('should render the component correctly', () => {
        const wrapper = shallowMount(Home)
        expect(wrapper.html()).toMatchSnapshot()
    });

    test('should redirect to no-entry on click', () => {
        const mockRouter = {
            push: jest.fn()
        }

        const wrapper = shallowMount(Home, {
            global: {
                mocks: {
                    $router: mockRouter
                }
            }
        })
        wrapper.find('button').trigger('click')
        expect(mockRouter.push).toHaveBeenCalled()
        expect(mockRouter.push).toHaveBeenCalledWith({name: 'no-entry'})
    });
});