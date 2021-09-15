import { createStore } from 'vuex';
import { shallowMount } from '@vue/test-utils'
import journal from '@/modules/daybook/store/journal'
import Swal from 'sweetalert2'
import EntryView from '@/modules/daybook/views/EntryView'
import { journalState } from '../../../mock-data/test-journal-state'

const createVuexStore = (initialState) => createStore({
    modules: {
        journal: {
            ...journal,
            state: { ...initialState }
        }
    }
})

jest.mock('sweetalert2', () => ({
    fire: jest.fn(),
    showLoading: jest.fn(),
    close: jest.fn()
}))

describe('EntryView', () => {
    const store = createVuexStore(journalState)
    store.dispatch = jest.fn()

    const mockRouter = {
        push: jest.fn()
    }

    let wrapper

    beforeEach(() => {
        jest.clearAllMocks()

        wrapper = shallowMount(EntryView, {
            props: {
                id: '-MiceyoT-TsPbU9NRtjC'
            },
            global: {
                mocks: {
                    $router: mockRouter
                },
                plugins: [store]
            }
        })
    })

    test('should reject the user because the id doesnt exist ', () => {
        const wrapper = shallowMount(EntryView, {
            props: {
                id: 'This ID doesn´t exist in Store'
            },
            global: {
                mocks: {
                    $router: mockRouter
                },
                plugins: [store],
            }
        })

        expect(mockRouter.push).toHaveBeenCalledWith({ name: 'no-entry' })
    });

    test('should show the entry correctly', () => {
        expect(wrapper.html()).toMatchSnapshot()
        expect(mockRouter.push).not.toHaveBeenCalled()
    });

    test('should delete the entry and redirect', (done) => {

        Swal.fire.mockReturnValueOnce(Promise.resolve({ isConfirmed: true }))

        wrapper.find('.btn-danger').trigger('click')

        expect(Swal.fire).toHaveBeenCalledWith({
            title: "¿Are you sure?",
            text: "Once deleted it cannot be recovered",
            showDenyButton: true,
            confirmButtonText: "Yes, i´m sure",
        })

        setTimeout(() => {
            expect(store.dispatch).toHaveBeenLastCalledWith("journal/deleteEntry", "-MiceyoT-TsPbU9NRtjC")
            expect(mockRouter.push).toHaveBeenCalled()
            done()
        }, 1);
    });
});