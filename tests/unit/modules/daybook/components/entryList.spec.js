import { createStore } from 'vuex';
import { shallowMount } from '@vue/test-utils'
import journal from '@/modules/daybook/store/journal'
import EntryList from '@/modules/daybook/components/EntryList'
import { journalState } from '../../../mock-data/test-journal-state'

const createVuexStore = (initialState) => createStore({
    modules: {
        journal: {
            ...journal,
            state: { ...initialState }
        }
    }
})

describe('EntryList', () => {

    const store = createVuexStore(journalState)

    const mockRouter = {
        push: jest.fn()
    }

    let wrapper

    beforeEach(() => {
        jest.clearAllMocks()

        wrapper = shallowMount(EntryList, {
            global: {
                mocks: {
                    $router: mockRouter
                },
                plugins: [store]
            }
        })
    })

    test('should call getEntriesByTerm and show an entry', () => {
        expect(wrapper.findAll('entry-stub').length).toBe(1)
    });

    test('should call getEntriesByTerm and filter the entries', async () => {
        const input = wrapper.find('input')
        await input.setValue('world')
        expect(wrapper.findAll('entry-stub').length).toBe(1)
    });

    test('the "new" button must redirect to /new', () => {
        wrapper.find('button').trigger('click')
        expect(mockRouter.push).toHaveBeenCalledWith({ name: 'entry', params: { id: 'new' } })
    });
});