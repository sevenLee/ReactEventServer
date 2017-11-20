// import axios from 'axios'

const mockEvents = [
    {id: 1, name: 'event01'},
    {id: 2, name: 'event02'},
]

const delay = (data) => {
    return new Promise((resolve) => setTimeout(() => {
        return resolve(data)
    },1000))
}

export const fetchHistoryEvents = () => async dispatch => {
    const res = await delay(mockEvents)
    console.log('##res:', res)

    dispatch({
        type: 'FETCH_EVENTS',
        payload: res
    })
}


export const addEvent = (data) => async dispatch => {
    dispatch({
        type: 'ADD_EVENT',
        payload: data
    })
}