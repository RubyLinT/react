const defaultState = {
    currentPage:{}
};
const pageReducer = (state = defaultState, action) => {
    switch(action.type) {
        case 'SET_PAGE':
            state.currentPage = action.payload
            return state
        default:
            return state;
    }
}
export default pageReducer;