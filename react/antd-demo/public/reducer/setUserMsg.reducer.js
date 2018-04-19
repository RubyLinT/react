import axios from 'axios';
import util from '../util/service';
const defaultState = {};
const setUserMsg = (state = defaultState, action) => {
    switch (action.type) {
        case 'SET_USER_MSG':
            state.userMsg = action.payload;
            return state;
        // case 'SET_NOTICE':
        //     state.notice = action.payload;
        //     return state;
        default:
            return state;
    }
}
export default setUserMsg;