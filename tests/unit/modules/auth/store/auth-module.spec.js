import axios from 'axios';
import createVuexStore from '../../../mock-data/mock-store'

describe('Vuex - Test on the auth-module', () => {

    test('InitState', () => {
        const store = createVuexStore({
            status: 'authenticating',
            user: null,
            idToken: null,
            refreshToken: null
        })

        const { status, user, idToken, refreshToken } = store.state.auth

        expect(status).toBe('authenticating')
        expect(user).toBe(null)
        expect(idToken).toBe(null)
        expect(refreshToken).toBe(null)
    });

    // Mutations
    test('Mutation: loginUser', () => {
        const store = createVuexStore({
            status: 'authenticating',
            user: null,
            idToken: null,
            refreshToken: null
        })

        const payload = {
            user: { name: 'Mariano', email: 'mariano@gmail.com' },
            idToken: 'ABC-123',
            refreshToken: 'XYZ-123'
        }

        store.commit('auth/loginUser', payload)

        const { status, user, idToken, refreshToken } = store.state.auth

        expect(status).toBe('authenticated')
        expect(user).toEqual({ name: 'Mariano', email: 'mariano@gmail.com' })
        expect(idToken).toBe('ABC-123')
        expect(refreshToken).toBe('XYZ-123')
    });

    test('Mutation: logout', () => {

        localStorage.setItem('idToken', 'ABC-123')
        localStorage.setItem('refreshToken', 'XYZ-123')

        const store = createVuexStore({
            status: 'authenticated',
            user: { name: 'Mariano', email: 'mariano@gmail.com' },
            idToken: 'ABC-123',
            refreshToken: 'XYZ-123'
        })

        store.commit('auth/logout')

        const { status, user, idToken, refreshToken } = store.state.auth

        expect(status).toBe('not-authenticated')
        expect(user).toBe(null)
        expect(idToken).toBe(null)
        expect(refreshToken).toBe(null)
        expect(localStorage.getItem('idToken')).toBe(null)
        expect(localStorage.getItem('refreshToken')).toBe(null)
    });

    // Getters
    test('Getters: username currentState', () => {
        const store = createVuexStore({
            status: 'authenticated',
            user: { name: 'Mariano', email: 'mariano@gmail.com' },
            idToken: 'ABC-123',
            refreshToken: 'XYZ-123'
        })

        expect(store.getters['auth/currentState']).toBe('authenticated')
        expect(store.getters['auth/username']).toBe('Mariano')
    });

    // Actions
    test('Actions: createUser - Error users already exists', async () => {
        const store = createVuexStore({
            status: 'not-authenticated',
            user: null,
            idToken: null,
            refreshToken: null
        })

        const newUser = {
            name: 'Test User',
            email: 'test@test.com',
            password: '123456'
        }

        const resp = await store.dispatch('auth/createUser', newUser)
        expect(resp).toEqual({ ok: false, message: 'EMAIL_EXISTS' })
    });

    test('Actions: createUser signInUser - Create user', async () => {
        const store = createVuexStore({
            status: 'not-authenticated',
            user: null,
            idToken: null,
            refreshToken: null
        })

        const newUser = {
            name: 'Test User',
            email: 'test2@test.com',
            password: '123456'
        }

        // SignIn
        await store.dispatch('auth/signInUser', newUser)
        const { idToken } = store.state.auth

        // Delete user
        await axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:delete?key=AIzaSyAG7bAip7gehYozcykoyZiMtqVlMf03BkQ`, { idToken })

        // Create user
        const resp = await store.dispatch('auth/createUser', newUser)
        expect(resp).toEqual({ ok: true })

        const { status, user, idToken: token, refreshToken } = store.state.auth

        expect(status).toBe('authenticated')
        expect(user).toMatchObject({ name: 'Test User', email: 'test2@test.com' })
        expect(typeof token).toBe('string')
        expect(typeof refreshToken).toBe('string')
    });

    test('Actions: checkAuthentication - Positive', async () => {
        const store = createVuexStore({
            status: 'not-authenticated',
            user: null,
            idToken: null,
            refreshToken: null
        })
        //SignIn
        await store.dispatch('auth/signInUser', { email: 'test@test.com', password: '123456' })
        const { idToken } = store.state.auth

        store.commit('auth/logout')

        localStorage.setItem('idToken', idToken)

        const checkResp = await store.dispatch('auth/checkAuthentication')

        expect(checkResp).toEqual({ ok: true })

        const { status, user, idToken: token } = store.state.auth

        expect(status).toBe('authenticated')
        expect(user).toMatchObject({ name: 'User Test', email: 'test@test.com' })
        expect(typeof token).toBe('string')


    });

    test('Actions: checkAuthentication - Negative', async () => {
        const store = createVuexStore({
            status: 'not-authenticated',
            user: null,
            idToken: null,
            refreshToken: null
        })

        localStorage.removeItem('idToken')

        const checkResp1 = await store.dispatch('auth/checkAuthentication')
        expect(checkResp1).toEqual({ ok: false, message: 'There is no token' })
        expect(store.state.auth.status).toBe('not-authenticated')

        localStorage.setItem('idToken', 'ABC-123')
        const checkResp2 = await store.dispatch('auth/checkAuthentication')

        expect(checkResp2).toEqual({ ok: false, message: 'INVALID_ID_TOKEN' })
        expect(store.state.auth.status).toBe('not-authenticated')

    });
});