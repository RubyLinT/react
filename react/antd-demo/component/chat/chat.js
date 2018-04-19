import React,{Component} from 'react';
import {hashHistory} from 'react-router'
import  { Col,Form, Input, Button, Row,message,Divider } from 'antd';
import store from '../../public/store/store';
import { relative } from 'path';
import './chat.css'
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';
const { TextArea } = Input;
class Chat extends React.Component {    
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    }
    constructor(props) {
        super(props); 
        this.state = {
            content:'',
            chatList:[],
            room:'',
            index:0,
        }        
    }
    //组件将被卸载  
    componentWillUnmount(){ 
        this.ws.close();
        //重写组件的setState方法，直接返回空
        this.setState = (state,callback)=>{
        return;
        };  
    }
    componentDidMount() {
        this.props.form.validateFields();  
        let that = this
        this.ws = new WebSocket("ws://127.0.0.1:2222/");
        const { cookies } = this.props;
        this.ws.onopen = function() {
            var to = that.props.params.name;  
            let name;
            try{
                name = decodeURI(cookies.get('userName')); 
            }catch(e) {
                name = cookies.get('userName'); 
            }
            var str = "{type:'message',name:'"+name + "',to:'"+to + "',msg:'"+that.state.content+"'}"; 
            that.ws.send(str);          
        };        
        this.ws.onmessage = function(e) {
            let list = [];
            console.log(e.data,that.props.params.name)
            let obj =JSON.parse(e.data);            
            obj.map(ev => {
                if(ev.from == that.props.params.name)
                    list.push(ev); 
            }) 
            list.map( ev => {
                ev.msg = eval('(' + ev.msg + ')');
            })
            let chatList = that.state.chatList                    
            that.setState({
                chatList:chatList.concat(list)
            })
            console.log(list,chatList,that.state.chatList)
            var to = that.props.params.name;  
            let name;
            try{
                name = decodeURI(cookies.get('userName')); 
            }catch(err) {
                name = cookies.get('userName'); 
            }
            var str = "{type:'read',name:'"+name + "',to:'"+to + "',msg:'"+that.state.content+"'}";  
            that.ws.send(str);  
        };
        this.ws.onclose = function() {
            console.log("Closed");
        };
        this.ws.onerror = function(err) {
            console.log("Error: " + err);
        };      
    }
    send = () => {
        var to = this.props.params.name;  
        let name = store.getState().setUserMsg.userMsg.userName;     
        let content = JSON.stringify(this.state.content.split("\n"))
        var str = "{type:'message',name:'"+name + "',to:'"+to + "',msg:'"+content+"'}";   
        this.setState({
            content:'',
        })
        console.log(str)
        this.textInput.focus();
        this.ws.send(str);   
    }
    handleChange = (e) => {
        this.setState({
            content:e.target.value
        })
    }
    handleKeyUp = (e) => {
        if(e.keyCode == 13) {
            this.setState({
                content:e.target.value
            })
        }
    }
    render() {
        let content = this.state.content
        return (
            <div style={{ width:'100%',display:'flex',flexDirection:'column' }}>   
                <div className="messageBox" style={{padding: '10px',flex:'2'}}>
                    {this.state.chatList.map((e,index)=>{
                        return (
                            <Row key={index}>
                                <Col>{e.msg.map((event,i) => {
                                    let text = <p key={i}>{event}</p>
                                    return (text)
                                })}</Col>
                                {/* <Col>{e.msg.map((item,i) => {return item + '\t' })}</Col> */}
                            </Row>
                        )
                    })}       
                </div>                
                <div style={{flex:'1',borderTop:'1px solid #ccc'}}>
                   <TextArea 
                    ref={(input) => {this.textInput = input;}}
                    autoFocus={true}
                    className="textarea" autosize={{ minRows: 5, maxRows: 5}} value={content} onKeyUp={this.handleKeyUp} onChange={this.handleChange}></TextArea>
                   <Button type="primary" style={{float:'right',marginRight:'10px'}} onClick={() => this.send()}>send</Button>
                </div>
            </div>
        )
    }
}
Chat = Form.create()(Chat)
export default withCookies(Chat);