import React,{Component} from 'react';
import {hashHistory} from 'react-router'
import  { Col,Form, Input, Button, Row,message,Divider } from 'antd';
import axios from 'axios';
import store from '../../public/store/store';
import { relative } from 'path';
import './game.css'
const { TextArea } = Input;

class Game extends React.Component {    
    constructor(props) {
        super(props); 
        this.state = {
            content:'',
            chatList:[],
            room:'',
            index:0,
        }
        this.ws = new WebSocket("ws://127.0.0.1:3333/");
        this.ws.onopen = function() {
            console.log("Opened");            
        };
        let that = this
        this.ws.onmessage = function(e) {
            let list = that.state.chatList;
            var obj = eval('(' + e.data + ')');  
            list.push(obj);
            console.log(obj)
            that.setState({
                chatList:list
            })
            if(obj.type == 'inRoom') {
                that.setState({
                    index:obj.index
                })
            } 
        };
        this.ws.onclose = function() {
            console.log("Closed");
        };
        this.ws.onerror = function(err) {
            console.log("Error: " + err);
        };
    }
    componentDidMount() {
        this.props.form.validateFields();
    }
    getRoom = () => {
        console.log(this.state.content)
        var type = 'getRoom';  
        let name = store.getState().setUserMsg.userMsg.userName;
        var str = "{type:'" + type + "',name:'"+name + "',msg:'"+this.state.content+"'}";  
        this.ws.send(str);   
    }
    send = (type) => {
        console.log(this.state.content)
        var type = type;  
        let name = store.getState().setUserMsg.userMsg.userName;      
        if(type == 'inRoom') {
            this.setState({
                room:this.state.content
            })
        }      
        let sp = this.state.index;    
        console.log(sp)
        var str = "{type:'" + type + "',sp:'"+sp +"',name:'"+name + "',vote:'"+this.state.room + "',msg:'"+this.state.content+"'}";  
        this.ws.send(str);   
    }
    handleChange = (e) => {
        this.setState({
            content:e.target.value
        })
    }
    render() {
        let content = this.state.content
        return (
            <div style={{ width:'100%',display:'flex',flexDirection:'column' }}>   
                <div style={{padding: '10px',flex:'2'}}>
                    {this.state.chatList.map((e,index)=>{
                        return (
                            <Row key={index}>
                                <Col>{e.msg}</Col>
                            </Row>
                        )
                    })}       
                </div>                
                <div style={{flex:'1',borderTop:'1px solid #ccc'}}>
                   <TextArea className="textarea" autosize={{ minRows: 5, maxRows: 5}} value={content} onChange={this.handleChange}></TextArea>
                   <Button type="primary" style={{float:'right',marginRight:'10px'}} onClick={() => this.getRoom()}>get room</Button>
                   <Button type="primary" style={{float:'right',marginRight:'10px'}} onClick={() => this.send('inRoom')}>in room</Button>
                   <Button type="primary" style={{float:'right',marginRight:'10px'}} onClick={() => this.send('vote')}>vote</Button>
                </div>
            </div>
        )
    }
}
Game = Form.create()(Game)
export default Game;