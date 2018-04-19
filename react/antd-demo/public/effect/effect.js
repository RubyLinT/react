import axios from 'axios';
import util from '../util/service';
import store from '../store/store';
const effect = {
    setUserMsg: (token) => {
        return (dispatch, getState) => {
            let data = {
                token: token
            }
            axios.post('http://localhost:3002/users', data).then(async(res) => {
                // console.log(res.data.data[0].id)
                util.userMsg = res.data.data[0];
                dispatch({
                    type: 'SET_USER_MSG',
                    payload: res.data.data[0]
                })
                store.dispatch(effect.getNotice(res.data.data[0].userName))
                store.dispatch(effect.getFriend(res.data.data[0].id))
            }).catch(e => {
                console.log(e)
            })
        }
    },
    getNotice:(name) => {
        console.log(name)
        return (dispatch,getState) => {
            let data = {
                name:name
            }
            axios.post('http://localhost:3002/notice',data).then((res) => {
                // console.log(res.data.data)
                let len = 0;
                let lenA = 0;
                res.data.data.map(e => {
                    if(e.isRead == 0 && e.isFromAdd == 0) {
                        len ++;
                    } else {
                        if(e.isRead != 1)
                            lenA ++;
                    }
                })
                dispatch({
                    type: 'SET_NOTICE',
                    payload: {notice:res.data.data,unReaad:len,add:lenA}
                })
            }).catch(e => {
                console.log(e)
            })
        }
    },
    getFriend:(id) => {
        return (dispatch,getState) => {
            axios.post('http://localhost:3002/friend',{id:id}).then(res => {
                // console.log(res.data.data)
                dispatch({
                    type: 'GET_FRIEND',
                    payload: res.data.data
                })
            }).catch(e => {
                console.log(e)
            })
        }
    },
    getDetail:(userName) => {
        return (dispatch,getState) => {
            axios.post('//localhost:3002/users/getByName',{userName:userName}).then((re) => {
                console.log(re);
                dispatch({
                    type:'SET_DETAIL',
                    payload:re.data.data[0]
                })
            }).catch(e => {
                console.log(e)
            }) 
        }
    }
}
export default effect;