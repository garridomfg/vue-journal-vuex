import axios from 'axios'

const authApi = axios.create({
    baseURL: 'https://identitytoolkit.googleapis.com/v1/accounts',
    params: {
        key: 'AIzaSyAG7bAip7gehYozcykoyZiMtqVlMf03BkQ'
    }
})

export default authApi