import React, { Component } from 'react';
import { Collapse,Badge,Icon,message,Popconfirm } from 'antd';
import store from '../../public/store/store';
import axios from 'axios';
import effect from '../../public/effect/effect'
function callback(key) {
    axios.post('http://localhost:3002/notice/read',{id:key}).then((res) => {
        console.log(res)
        store.dispatch(effect.getNotice(store.getState().setUserMsg.userMsg.userName))
    }).catch(e => {
        console.log(e)
    })
}
class Notice extends React.Component {
    componentDidMount() {
        if(store.getState().setUserMsg.userMsg)
            store.dispatch(effect.getNotice(store.getState().setUserMsg.userMsg.userName))
        store.subscribe(() => {        
            this.setState({
                panelList: store.getState().notice.notice ? store.getState().notice.notice : []
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
    constructor(props) {
        super(props);       
        this.state = {
            panelList: []
        }
    }
    delete(id) {
        axios.post('//localhost:3002/notice/delete',{id:id}).then((data) => {
            console.log(data)
            store.dispatch(effect.getNotice(store.getState().setUserMsg.userMsg.userName))
            message.success('delete success!');
        }).catch(e => {
            message.error('delete fail!');
            console.log(e)
        })
    }
    render() {
        return (
            <div className="Outter" >
               {this.state.panelList.map((e, index) => {
                   if(e.isFromAdd == 0) {
                        return (                        
                            <Collapse onChange={() => callback(e.id)}  key={index}>                                
                                <Collapse.Panel header={<Badge dot={e.isRead == 0 ? true : false}>{e.title}</Badge>} key={index}>
                                    <p>{e.from} : {e.content}</p>
                                    <p style={{textAlign:'right'}}>
                                        <Popconfirm 
                                            title="Are you sure delete this notice?"
                                            okText="Yes" cancelText="No"
                                            onConfirm={() => this.delete(e.id)} onCancel={this.cancel}
                                        >
                                            <Icon className="linkStyle" type="delete" />
                                        </Popconfirm> 
                                    </p>
                                </Collapse.Panel>                                  
                            </Collapse>                                              
                        )
                   }                    
                })}
            </div>
        )
    }
}
export default Notice;