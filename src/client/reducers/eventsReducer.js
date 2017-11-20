export default (state=[], action) => {
    switch(action.type){
        case 'FETCH_EVENTS': {
            return action.payload
        }
        case 'ADD_EVENT': {
            return [
                action.payload,
                ...state
            ]
        }
        default:
            return state
    }
}