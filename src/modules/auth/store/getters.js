/* export const myGetter = ( state ) => {
    return state.something
} */

export const currentState = ( state ) => {
    return state.status
}

export const username = ( state ) => {
    return state.user?.name || ''
}
