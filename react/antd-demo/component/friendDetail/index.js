import React,{Component} from 'react';
import axios from 'axios';
import { Button, Avatar } from 'antd';
import store from '../../public/store/store';
import effect from '../../public/effect/effect'
import './index.css'
class FriendDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userMsg:'',
            isAdded:true
        }    
        if(store.getState().detail.length == 0)
            store.dispatch(effect.getDetail(this.props.params.name))
    }
    componentDidMount() {
        store.subscribe(() => {
            this.setState({
                userMsg:store.getState().detail ? store.getState().detail : ''
            })
            if(store.getState().detail.friends != null) {
                store.getState().detail.friends.split(',').map(e => {
                    if(e == store.getState().setUserMsg.userMsg.id) {
                        this.setState({
                            isAdded:false
                        })
                    }
                })
            }            
        })
    }
    //组件将被卸载  
    componentWillUnmount() {
        //重写组件的setState方法，直接返回空
        this.setState = (state, callback) => {
            return;
        };
    }
    agree = (id,friends,name,Id) => {
        let userMsg = store.getState().setUserMsg.userMsg
        let friend1 = this.getFriends(userMsg.friends,id);
        let friend2 = this.getFriends(friends,userMsg.id);
        this.delete(friend1,userMsg.userName,true,Id);
        this.delete(friend2,name,false);
    }
    getFriends(friends,id) {
        if(friends == null) {
            return id
        } else {
            let friend = friends.split(',');
            friend.push(id)
            return friend.join(',')
        }        
    }
    delete(friends,userName,isUpdate,id) {
        let data = {
            friends,
            userName
        }
        axios.post('//localhost:3002/friend/update',data).then(async res => {
            console.log(res)
            if(isUpdate){
                await axios.post('http://localhost:3002/notice/read',{id:id}).then((res) => {
                    console.log(res)
                    store.dispatch(effect.getFriend(store.getState().setUserMsg.userMsg.id));
                    store.dispatch(effect.getNotice(store.getState().setUserMsg.userMsg.userName))
                }).catch(e => {
                    console.log(e)
                })                
                message.success('add success!')
            }                
        }).catch(e => {
            console.log(e)
            message.error('add fail!')
        })
    }
    render() {
        return (
            <div className="Outter detailBox">
                {this.state.userMsg.headerImg ?  
                    <Avatar src={this.state.userMsg.headerImg} style={{width:100,height:100}} /> :
                    <Avatar style={{ backgroundColor: '#3298af',width:100,height:100,fontSize:100}}  icon="user" />}
                <p>{this.state.userMsg.userName}</p>
                {/* <Button
                    type="primary"
                    htmlType="button"
                    style={{width:100}}
                >chat</Button>
                {this.state.isAdded && 
                    <Button
                        type="primary"
                        htmlType="button"
                        style={{width:100}}
                    >add</Button>
                } */}
            </div>
        )
    }
}

export default FriendDetail