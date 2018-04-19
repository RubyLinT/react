import React, { Component } from 'react';
import { Breadcrumb, Avatar, Row, Col, Popover,Badge } from 'antd';
import axios from 'axios';
import { Link,hashHistory } from 'react-router';
import { createStore } from 'redux';
import reducer from '../../../public/reducer/reducer';
import './topHeader.css';
import store from '../../../public/store/store';
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';
import effect from '../../../public/effect/effect';
import util from '../../../public/util/service';

function changePage(page) {
    store.dispatch({
        type:'SET_PAGE',
        payload:page
    })
}
class TopHeader extends React.Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    }
    content = (
        <div>
            <p><Link to='/Notice' onClick={() => changePage('Notice')}>Notice</Link></p>
            <p><Link to='/Setting' onClick={() => changePage('Setting')}>Setting</Link></p>
            <p><Link to="/Login" onClick={() => this.clearToken()}>Exit</Link></p>
        </div>
    )
    clearToken = () => {
        const { cookies } = this.props;
        cookies.set('token','',{ path: '/' })
    } 
    componentWillMount() {
        const { cookies } = this.props;
        if(!cookies.get('token')) 
            hashHistory.push('/Login')
    }
    componentDidMount() {
        const { cookies } = this.props;
        if(!cookies.get('token')) {
            hashHistory.push('/Login')
        } else {
            store.dispatch(effect.setUserMsg(cookies.get('token'))); 
            let page = hashHistory.getCurrentLocation().pathname.substr(1) ? hashHistory.getCurrentLocation().pathname.substr(1) : 'Home'
            store.dispatch({
                type:'SET_PAGE',
                payload:page
            })
        }        
    }
    //组件将被卸载  
    componentWillUnmount(){ 
        //重写组件的setState方法，直接返回空
        this.setState = (state,callback)=>{
            return;
        };  
    }
    constructor(props) {        
        super(props)           
        this.state = {
            token: '',
            userName: '',
            headerImg:'',
            store:'',
            noticeCount:0,
        };
        this.changePage = changePage;
        store.subscribe(() => {
            this.setState({
                noticeCount:store.getState().notice.unReaad ? store.getState().notice.unReaad : 0,
                store:decodeURI(store.getState().pageReducer.currentPage),
                userName:store.getState().setUserMsg.userMsg ? store.getState().setUserMsg.userMsg.userName : '',
                headerImg:store.getState().setUserMsg.userMsg ? store.getState().setUserMsg.userMsg.headerImg : '',
            })          
        })   
    }
    render() {
        return (
            <Row>
                <Col span={5}>
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item>
                        {this.state.store}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                <Col span={6} push={13} style={{cursor:'pointer',textAlign:'right'}}>
                    <Popover content={this.content} >
                        <Badge count={this.state.noticeCount}>
                            {this.state.headerImg ?  
                            <Avatar src={this.state.headerImg} /> :
                            <Avatar style={{ backgroundColor: '#3298af' }} icon="user" />}
                        </Badge>                        
                        <span className="username">{this.state.userName}</span>
                    </Popover>
                </Col>
            </Row>
        )
    }
}
export default withCookies(TopHeader)