const defaultState = {};
const notice = (state = defaultState, action) => {
    switch (action.type) {
        case 'SET_NOTICE':
            state = action.payload;
            return state;
        default:
            return state;
    }
}
export default notice;