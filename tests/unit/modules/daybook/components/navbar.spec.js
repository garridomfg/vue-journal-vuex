import { shallowMount } from '@vue/test-utils'
import NavBar from '@/modules/daybook/components/NavBar.vue'
import createVuexStore from '../../../mock-data/mock-store'

describe('NavBar component', () => {
    const store = createVuexStore({
        user: { name: 'Juan Carlos', email: 'juan@gmail.com' },
        status: 'authenticated',
        idToken: 'ABC',
        refreshToken: 'XYZ'
    })
    test('should show the component correctly', () => {
        const wrapper = shallowMount(NavBar, {
            global: {
                plugins: [store]
            }
        })
        expect(wrapper.html()).toMatchSnapshot()
    });
});