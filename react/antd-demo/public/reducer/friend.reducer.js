const defaultState = []
const friend = (state = defaultState,action) => {
    switch(action.type) {
        case 'GET_FRIEND':
            state = action.payload;
            return state;
        default:
        return state
    }        
}

export default friend