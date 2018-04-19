import {combineReducers} from 'redux';
import setUserMsg from './setUserMsg.reducer';
import pageReducer from './page.reducer';
import notice from './notice.reducer';
import friend from './friend.reducer';
import detail from './detail.reducer'
const reducer = combineReducers({
  pageReducer,
  setUserMsg:setUserMsg,
  notice,
  friend,
  detail
})
export default reducer;