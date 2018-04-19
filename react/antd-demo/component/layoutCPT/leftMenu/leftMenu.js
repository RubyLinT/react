import React, { Component } from 'react';
import { Menu, Icon,Popconfirm,message,Badge } from 'antd';
import { Link, hashHistory } from 'react-router'
import './leftMenu.css'
import store from '../../../public/store/store';
import util from '../../../public/util/service';
import effect from '../../../public/effect/effect'
import axios from 'axios'
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
class LeftMenu extends React.Component {
    constructor(props) {
        super(props);
        this.changePage = (page) => {
            store.dispatch({
                type: 'SET_PAGE',
                payload: page
            })
        }
        let path = hashHistory.getCurrentLocation().pathname.substr(1) ? hashHistory.getCurrentLocation().pathname.substr(1) : 'Home';
        this.state = {
            friendList: [],
            tableList:[],
            addCount:0,
        }

    }
    componentDidMount() {
        store.subscribe(() => {
            this.setState({
                friendList: store.getState().friend ? store.getState().friend : [],
                addCount:store.getState().notice.add ? store.getState().notice.add : 0,
                tableList:store.getState().setUserMsg.userMsg ? (store.getState().setUserMsg.userMsg.tables == null ? [] : store.getState().setUserMsg.userMsg.tables.split(',')) : []
            })
        })
    }
    //组件将被卸载  
    componentWillUnmount() {
        //重写组件的setState方法，直接返回空
        this.setState = (state, callback) => {
            return;
        };
    }
    confirm = (e,id,friends,name) => {
        e.stopPropagation();
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
        axios.post('//localhost:3002/friend/delete',data).then(res => {
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
    cancel = (e) => {
        e.stopPropagation();
    }
    jump = (e,type,userName) => {
        if(type != 'FriendDetail')
            e.stopPropagation();
        store.dispatch(effect.getDetail(userName))
        this.changePage(type+'/'+userName)
        hashHistory.push('/'+type+'/'+userName)
    }
    render() {
        return (
            <Menu
                defaultSelectedKeys={['h1']}
                defaultOpenKeys={['s1','s2']}
                mode="inline"
            >
                <Menu.Item key="h1">
                    <Link to='/' onClick={() => this.changePage('Home')}>Home</Link>
                </Menu.Item>
                <SubMenu key="s1" title="friend">
                    <Menu.Item key="f1">                        
                        <Link to='/AddFriend' onClick={() => this.changePage('AddFriend')}>                            
                            AddFriend<span className="right"><Badge dot={this.state.addCount > 0}><Icon type="plus-circle-o" /></Badge></span>
                        </Link>                        
                    </Menu.Item>
                    <Menu.Item key="f2">
                        <Link to='/Game' onClick={() => this.changePage('Game')}>
                            Game
                            {/* <span className="right"><Icon type="delete" /></span> */}
                        </Link>
                    </Menu.Item>
                    {this.state.friendList.map((e, i) => {
                        return (
                            <Menu.Item key={"f" + (i+3)}>
                                <span onClick={(ev) => this.jump(ev,'FriendDetail',e.userName)}>
                                    {e.userName}
                                    <span className="right">
                                        <Icon type="message" onClick={(ev) => this.jump(ev,'Chat',e.userName)}/>
                                        <Icon type="mail" onClick={(ev) => this.jump(ev,'Mail',e.userName)}/>
                                        <Popconfirm 
                                            title="Are you sure delete this friend?"
                                            okText="Yes" cancelText="No"
                                            onConfirm={(ev) => this.confirm(ev,e.id,e.friends,e.userName)} onCancel={(ev) => this.cancel(ev)}
                                        >
                                            <Icon type="delete" onClick={(ev) => ev.stopPropagation()} />
                                        </Popconfirm> 
                                    </span> 
                                </span>                                 
                            </Menu.Item>
                        )
                    })}
                </SubMenu>
                <SubMenu key="s2" title="userTable">
                    <Menu.Item key="t1">
                        <Link to='/AddTable' onClick={() => this.changePage('AddTable')}>
                            AddTable<span className="right"><Icon type="plus-circle-o" /></span>
                        </Link>
                    </Menu.Item>
                    {this.state.tableList.map((e,i) => {
                        return (
                            <Menu.Item key={"t" + (i + 2)}>
                                <Link to='/Table' onClick={() => this.changePage('Table')}>
                                    {e}<span className="right"><Icon type="delete" /></span>
                                </Link>
                            </Menu.Item>
                        )
                    })}                    
                </SubMenu>
            </Menu>
        )
    }
}

export default LeftMenu;