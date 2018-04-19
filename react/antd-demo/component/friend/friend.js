import React,{Component} from 'react';
import store from '../../public/store/store';
import effect from '../../public/effect/effect'
import { Button,List, Avatar, Popconfirm, message } from 'antd';
import {Link,hashHistory} from 'react-router';
import axios from 'axios';
class Friend extends React.Component{
    componentDidMount() {
        if(store.getState().setUserMsg.userMsg)
            store.dispatch(effect.getFriend(store.getState().setUserMsg.userMsg.id))
        store.subscribe(() => {
            this.setState({
                friendList:store.getState().friend ? store.getState().friend : []
            })
        })
    }
    //组件将被卸载  
    componentWillUnmount(){ 
        //重写组件的setState方法，直接返回空
        this.setState = (state,callback)=>{
        return;
        };  
    }
    changePage = (page) => {
        store.dispatch({
            type:'SET_PAGE',
            payload:page
        })
    }
    constructor(props) {
        super(props);
        this.state = {
            friendList:[]
        }
    }
    confirm = (id,friends,name) => {
        let userMsg = store.getState().setUserMsg.userMsg
        let friend1 = this.getFriends(store.getState().setUserMsg.userMsg.friends,id);
        let friend2 = this.getFriends(friends,userMsg.id);
        this.delete(friend1,userMsg.userName,true);
        this.delete(friend2,name,false);
    }
    getFriends(friends,id) {
        let friend = friends.split(',');
        friend.map((e,i) => {
            if(e == id)
                friend.splice(i,1)
        })
        return friend.join(',')
    }
    delete(friends,userName,isUpdate) {
        let data = {
            friends,
            userName
        }
        axios.post('//localhost:3002/friend/update',data).then(res => {
            console.log(res)
            if(isUpdate){
                store.dispatch(effect.getFriend(store.getState().setUserMsg.userMsg.id));
                message.success('delete success!')
            }                
        }).catch(e => {
            console.log(e)
            message.error('delete fail!')
        })
    }
    cancel = () => {
        console.log('cancel')
    }
    render() {
        return (
            <div className="Outter">
                <List
                    itemLayout="horizontal"
                    // header={<div>Header</div>}
                    // footer={<div>Footer</div>}
                    bordered
                    dataSource={this.state.friendList}
                    renderItem={item => (
                        <List.Item actions={[
                            <Link to={'/Chat/'+item.userName} onClick={() => this.changePage('Chat/'+item.userName)}>chat</Link>,
                            <Link to={'/Mail/'+item.userName} onClick={() => this.changePage('Mail/'+item.userName)}>Mail</Link>,
                            <Popconfirm 
                                title="Are you sure delete this friend?"
                                okText="Yes" cancelText="No"
                                onConfirm={() => this.confirm(item.id,item.friends,item.userName)} onCancel={this.cancel}
                            >
                                <a>delete</a>
                            </Popconfirm>                            
                        ]}>
                            <List.Item.Meta
                            avatar={item.headerImg ?  
                                <Avatar src={item.headerImg} /> :
                                <Avatar style={{ backgroundColor: '#87d068' }} icon="user" />}
                            title={<a href="https://ant.design">{item.userName}</a>}
                            />
                        </List.Item>
                    )}
                />
            </div>
        )
    }
}

export default Friend;