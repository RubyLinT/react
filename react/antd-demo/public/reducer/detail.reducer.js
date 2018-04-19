const defaultState = []
const detail = (state = defaultState,action) => {
    switch(action.type) {
        case 'SET_DETAIL':
            state = action.payload;
            return state;
        default:
            return state;
    }
}
export default detail;