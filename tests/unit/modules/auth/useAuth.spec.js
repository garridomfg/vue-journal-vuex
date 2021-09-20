import useAuth from '@/modules/auth/composables/useAuth'

const mockStore = {
    dispatch: jest.fn(),
    commit: jest.fn(),
    getters: {
        'auth/currentState': 'authenticated',
        'auth/username': 'Mariano'
    }
}

jest.mock('vuex', () => ({ useStore: () => mockStore }))

describe('useAuth tests', () => {

    beforeEach(() => jest.clearAllMocks())

    test('createUser succesfully', async () => {

        const { createUser } = useAuth()

        const newUser = { name: 'Mariano', email: 'mariano@test.com' }
        mockStore.dispatch.mockReturnValue({ ok: true })

        const resp = await createUser(newUser)
        expect(mockStore.dispatch).toHaveBeenCalledWith("auth/createUser", { "email": "mariano@test.com", "name": "Mariano" })
        expect(resp).toEqual({ ok: true })

    });

    test('createUser failure, because the user exists', async () => {

        const { createUser } = useAuth()

        const newUser = { name: 'Mariano', email: 'mariano@test.com' }
        mockStore.dispatch.mockReturnValue({ ok: false, message: 'EMAIL_EXISTS' })

        const resp = await createUser(newUser)
        expect(mockStore.dispatch).toHaveBeenCalledWith("auth/createUser", newUser)

        expect(resp).toEqual({ ok: false, message: 'EMAIL_EXISTS' })

    });

    test('login succesfully', async () => {

        const { loginUser } = useAuth()

        const loginForm = { email: 'test@test.com', password: '123456' }
        mockStore.dispatch.mockReturnValue({ ok: true })

        const resp = await loginUser(loginForm)
        expect(mockStore.dispatch).toHaveBeenCalledWith("auth/signInUser", loginForm)

        expect(resp).toEqual({ ok: true })

    });

    test('login failure', async () => {

        const { loginUser } = useAuth()

        const loginForm = { email: 'test@test.com', password: '123456' }
        mockStore.dispatch.mockReturnValue({ ok: false, message: 'EMAIL/PASSWORD DO NOT EXISTS' })

        const resp = await loginUser(loginForm)
        expect(mockStore.dispatch).toHaveBeenCalledWith("auth/signInUser", loginForm)

        expect(resp).toEqual({ ok: false, message: 'EMAIL/PASSWORD DO NOT EXISTS' })

    });

    test('checkAuthentication', async () => {

        const { checkAuthentication } = useAuth()

        mockStore.dispatch.mockReturnValue({ ok: true })

        const resp = await checkAuthentication()
        expect(mockStore.dispatch).toHaveBeenCalledWith("auth/checkAuthentication")

        expect(resp).toEqual({ ok: true })

    });

    test('logout', () => {
        const { logout } = useAuth()
        logout()
        expect(mockStore.commit).toHaveBeenCalledWith("auth/logout")
        expect(mockStore.commit).toHaveBeenCalledWith("journal/clearEntries")
    });

    test('authStatus, username', () => {
        const { authStatus, username } = useAuth()

        expect(authStatus.value).toBe('authenticated')
        expect(username.value).toBe('Mariano')
    });
});