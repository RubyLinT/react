import React,{Component} from 'react';
import store from '../../public/store/store';
import effect from '../../public/effect/effect'
import { Form, Button, List, Avatar, Popconfirm, message,Input,Divider } from 'antd';
import {Link,hashHistory} from 'react-router';
import axios from 'axios';
class AddFriend extends React.Component{
    componentDidMount() {
        this.props.form.validateFields();
        if(store.getState().setUserMsg.userMsg){
            store.dispatch(effect.getNotice(store.getState().setUserMsg.userMsg.userName))
        }            
        store.subscribe(() => {
            this.setState({
                friendList:store.getState().notice.notice ? store.getState().notice.notice : []
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
            friendList:[],
            searchList:[],
        }
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
    cancel = () => {
        console.log('cancel')
    }
    search = (value) => {
        console.log(value)
        axios.post('//localhost:3002/users/whereLike',{userName:value}).then((re) => {
            console.log(re)
            let data = []
            re.data.data.map(e => {
                if(e.friends != null) {
                    let len = 0;
                    e.friends.split(',').map(item => {
                        if(item == store.getState().setUserMsg.userMsg.id)
                            len ++;
                    })
                    if(len == 0)
                        data.push(e)
                } else {
                    data.push(e)
                }
            })
            this.setState({
                searchList:data
            })
        }).catch(e => {
            console.log(e)
        })
    }
    add = (name) => {
        let data = {
            userName:name,
            title:store.getState().setUserMsg.userMsg.friends,
            content:store.getState().setUserMsg.userMsg.headerImg,
            from:store.getState().setUserMsg.userMsg.userName,
            isFromAdd:store.getState().setUserMsg.userMsg.id
        }
        axios.post('http://localhost:3002/friend/chat',data).then(res => {
            console.log(res);
            message.success('submit success!')
        }).catch(e => {
            console.log(e)
            message.error('submit fail!')
        })
    }
    render() {
        const {getFieldDecorator,getFieldsError,getFieldError,isFieldTouched} = this.props.form;
        const userNameError = isFieldTouched('userName') && getFieldError('userName')
        return (
            <div className="Outter">
                <Form>
                    <Form.Item
                        validateStatus={userNameError ? 'error' : ''}
                        help={userNameError || ''}
                    >
                        {getFieldDecorator('userName',{
                            rules:[{required:true,message:'please input userName which you want to search!'}],
                        })(<Input.Search placeholder="userName" onSearch={(value) =>this.search(value)}  enterButton/>)}
                    </Form.Item>
                </Form>
                <Divider>search result</Divider>
                <List
                    itemLayout="horizontal"
                    // header={<div>Header</div>}
                    // footer={<div>Footer</div>}
                    bordered
                    dataSource={this.state.searchList}
                    renderItem={item => (
                        <List.Item actions={[
                            <Link to={'/FriendDetail/'+item.userName} onClick={() => this.changePage('FriendDetail/'+item.userName)}>detail</Link>,
                            <a onClick={() => this.add(item.userName)}>Add</a>,
                        ]}>
                            <List.Item.Meta
                            avatar={item.headerImg ?  
                                <Avatar src={item.headerImg} /> :
                                <Avatar style={{ backgroundColor: '#3298af' }} icon="user" />}
                            title={<span>{item.userName}</span>}
                            />
                        </List.Item>
                    )}
                />
                <Divider>add request</Divider>
                <List
                    itemLayout="horizontal"
                    bordered
                    dataSource={this.state.friendList.filter(e => e.isFromAdd != 0 && e.isRead != 1)}
                    renderItem={item =>  (
                        <List.Item actions={[
                            <Link to={'/FriendDetail/'+item.from} onClick={() => this.changePage('FriendDetail/'+item.from)}>detail</Link>,
                            <a onClick={() => this.agree(item.isFromAdd,item.title,item.from,item.id)}>agree</a>,
                            <Link to={'/Mail/'+item.from} onClick={() => this.changePage('Mail/'+item.from)}>reject</Link>,                          
                        ]}>
                            <List.Item.Meta
                            avatar={item.content ?  
                                <Avatar src={item.content} /> :
                                <Avatar style={{ backgroundColor: '#3298af' }} icon="user" />}
                            title={<span>{item.from}</span>}
                            />
                        </List.Item>
                    )}
                />
            </div>
        )
    }
}
AddFriend = Form.create()(AddFriend)
export default AddFriend;