import React,{Component} from 'react';
import {hashHistory} from 'react-router'
import  { Col,Form, Input, Button, Row,message } from 'antd';
import axios from 'axios';
import store from '../../public/store/store';
const { TextArea } = Input;
function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}
class Mail extends React.Component {
    changePage = (page) => {
        store.dispatch({
            type:'SET_PAGE',
            payload:page
        })
        hashHistory.push('/Friend')
    }
    constructor(props) {
        super(props); 
    }
    componentDidMount() {
        this.props.form.validateFields();
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err,values) => {
            console.log(values,store.getState().setUserMsg.userMsg.userName)
            if(!err) {
                let data = {
                    userName:this.props.params.name,
                    title:values.title,
                    content:values.content,
                    from:store.getState().setUserMsg.userMsg.userName
                }
                axios.post('http://localhost:3002/friend/chat',data).then(res => {
                    console.log(res);
                    message.success('submit success!')
                }).catch(e => {
                    console.log(e)
                    message.error('submit fail!')
                })
            }
        })
    }
    render() {
        const {getFieldDecorator,getFieldsError,getFieldError,isFieldTouched} = this.props.form;
        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 4 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 16 },
            },
        };
        const titleError = isFieldTouched('title') && getFieldError('title');
        const contentError = isFieldTouched('content') && getFieldError('content');
        return (
            <Form className="Outter" style={{ padding: '10px' }} onSubmit={this.handleSubmit}>
                <Form.Item {...formItemLayout} label="to">                    
                    {this.props.params.name}
                </Form.Item>   
                <Form.Item {...formItemLayout} label="title"
                    validateStatus={titleError ? 'error' : ''}
                    help={titleError || ''}
                >     
                    {getFieldDecorator('title',{
                        rules:[{required:true,message:'please input your title!'}],
                    })(
                        <Input placeholder="wirte your title here" />
                    )}              
                   
                </Form.Item>   
                <Form.Item {...formItemLayout} label="content"
                    validateStatus={contentError ? 'error' : ''}
                    help={contentError || ''}
                >     
                    {getFieldDecorator('content',{
                        rules:[{required:true,message:'please input your content'}],
                    })(
                        <TextArea placeholder="wirte your content here" autosize={{ minRows: 10, maxRows: 10 }} />
                    )}               
                </Form.Item>   
                <Row>
                    <Col offset={4}>
                        <Button type="primary" htmlType="submit" 
                            style={{marginRight:'10px'}}
                            disabled={hasErrors(getFieldsError())}
                        >Submit</Button>    
                        <Button htmlType="button" onClick={() => this.changePage('Friend')}>Cancel</Button> 
                    </Col>                    
                </Row>                        
            </Form>
        )
    }
}
Mail = Form.create()(Mail)
export default Mail;