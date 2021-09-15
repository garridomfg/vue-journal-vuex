import { createStore } from 'vuex'
import journal from '@/modules/daybook/store/journal'
import { journalState } from '../../../../mock-data/test-journal-state'

const createVuexStore = (initialState) => createStore({
    modules: {
        journal: {
            ...journal,
            state: { ...initialState }
        }
    }
})

describe('Vuex - Tests on Journal module', () => {
    //Basics
    test('init state ', () => {
        const store = createVuexStore(journalState)
        const { isLoading, entries } = store.state.journal

        expect(isLoading).toBeFalsy()
        expect(entries).toEqual(journalState.entries)
    });

    // Mutations
    test('mutation: setEntries', () => {
        const store = createVuexStore({ isLoading: true, entries: [] })
        store.commit('journal/setEntries', journalState.entries)

        expect(store.state.journal.entries.length).toBe(1)
        expect(store.state.journal.isLoading).toBeFalsy()
    });

    test('mutation: updateEntry', () => {
        const store = createVuexStore(journalState)
        const updatedEntry = {
            id: '-MiceyoT-TsPbU9NRtjC',
            date: 1630622440800,
            text: "Hello world from tests"
        }

        store.commit('journal/updateEntry', updatedEntry)
        expect(store.state.journal.entries.length).toBe(1)
        expect(store.state.journal.entries.find(e => e.id === updatedEntry.id)).toEqual(updatedEntry)

    });

    test('mutation: addEntry deleteEntry', () => {
        const store = createVuexStore(journalState)
        store.commit('journal/addEntry', {
            id: 'ABC-123',
            text: 'Hello world'
        })

        expect(store.state.journal.entries.length).toBe(2)
        expect(store.state.journal.entries.find(e => e.id === 'ABC-123')).toBeTruthy()

        store.commit('journal/deleteEntry', 'ABC-123')
        expect(store.state.journal.entries.length).toBe(1)
        expect(store.state.journal.entries.find(e => e.id === 'ABC-123')).toBeFalsy()
    });

    //Getters
    test('getters: getEntriesByTerm getEntryById', () => {
        const store = createVuexStore(journalState)

        const [entry] = journalState.entries

        expect(store.getters['journal/getEntriesByTerm']('').length).toBe(1)
        expect(store.getters['journal/getEntriesByTerm']('Hello')).toEqual([entry])

        expect(store.getters['journal/getEntryById']('-MiceyoT-TsPbU9NRtjC')).toEqual(entry)

    });

    //Actions
    test('actions: loadEntries', async () => {
        const store = createVuexStore({ isLoading: true, entries: [] })

        await store.dispatch('journal/loadEntries')

        expect(store.state.journal.entries.length).toBe(1)
    });


    test('actions: updateEntry', async () => {
        const store = createVuexStore(journalState)

        const updatedEntry = {
            id: '-MiceyoT-TsPbU9NRtjC',
            date: 1630622440800,
            text: "Hello world from mock data",
            anotherField: 'Test1'
        }

        await store.dispatch('journal/updateEntry', updatedEntry)

        expect(store.state.journal.entries.length).toBe(1)
        expect(store.state.journal.entries.find(e => e.id === updatedEntry.id)).toEqual({
            id: '-MiceyoT-TsPbU9NRtjC',
            date: 1630622440800,
            text: "Hello world from mock data",
        })
    });

    test('actions: createEntry deleteEntry', async () => {
        const store = createVuexStore(journalState)

        const newEntry = {
            date: 1630622440800,
            text: "New entry from tests",
        }

        const id = await store.dispatch('journal/createEntry', newEntry)

        expect(store.state.journal.entries.length).toBe(2)
        expect(typeof id).toBe('string')

        expect(store.state.journal.entries.find(e => e.id === id)).toBeTruthy()

        await store.dispatch('journal/deleteEntry', id)

        expect(store.state.journal.entries.find(e => e.id === id)).toBeFalsy()

    });
});