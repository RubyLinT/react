import React , {Component} from 'react';
import { Input,Icon, Form, Row, Col,Button,message } from 'antd';
import {hashHistory} from 'react-router';
import axios from 'axios'
function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class ForgetPwd extends React.Component {
    componentDidMount() {
        this.props.form.validateFields();
    }
    constructor(props) {
        super(props);
        
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err,value) => {
            if(!err) {
                let data = {
                    userName: value.userName,
                    passWord: value.passWord
                }
                axios.post('http://localhost:3002/login/forget', data).then((res) => {
                    console.log(res)
                    if (res.data.isSuccess) {     
                        message.success('submit success!')
                        hashHistory.push('/Login')
                    }
                    else {
                        message.error(res.data.message)
                    }
                }).catch(e => {
                    message.error('submit fail!')
                    console.log(e)
                })
            }
        })
    }
    checkPwdLength = (rule,value,callback) => {
        if(value && value.length < 3) {
            callback('length of passWord must be 3 at less!')
        } else {
            callback()
        }
    }
    compareToFirstPassword = (rule, value, callback) => {
        console.log(rule,value)
        const form = this.props.form;
        if (value && value !== form.getFieldValue('passWord')) {
          callback('Two passwords that you enter is inconsistent!');
        } else {
          callback();
        }
      }
    render() {
        const {getFieldDecorator,getFieldError,getFieldsError,isFieldTouched} = this.props.form;
        const userNameError = isFieldTouched('userName') && getFieldError('userName');
        const passWordError = isFieldTouched('passWord') && getFieldError('passWord');
        const confirmError = isFieldTouched('confirm') && getFieldError('confirm');
        return (
            <Row className="loginBox" type="flex">
                <Col offset={6} span={12} type="flex" className="loginInner">
                    <Form onSubmit={this.handleSubmit}>
                        <h2>Forget PassWord</h2>
                        <Form.Item
                            validateStatus={userNameError ? 'error' : ''}
                            help={userNameError || ''}
                        >
                            {getFieldDecorator('userName',{
                                rules:[{required:true,message:'Please input your userName!'}],
                            })(
                                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }}/>}  placeholder="Username"/>
                            )}
                        </Form.Item>
                        <Form.Item
                            validateStatus={passWordError ? 'error' : ''}
                            help={passWordError || ''}
                        >
                            {getFieldDecorator('passWord',{
                                rules:[{required:true,message:'Please input your passWord!'},{
                                    validator:this.checkPwdLength
                                }],
                            })(
                                <Input type="password" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }}/>}  placeholder="passWord"/>
                            )}
                        </Form.Item>
                        <Form.Item
                            validateStatus={confirmError ? 'error' : ''}
                            help={confirmError || ''}
                        >
                            {getFieldDecorator('confirm',{
                                rules:[{required:true,message:'Please input your confirmPassWord!'}, {
                                    validator: this.compareToFirstPassword,
                                  }],
                            })(
                                <Input type="password" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }}/>}  placeholder="confirmPassWord"/>
                            )}
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                disabled={hasErrors(getFieldsError())}
                            >Submit</Button>
                            <Button
                                type="primary"
                                htmlType="button"
                                onClick={() => {hashHistory.push('/Login')}}
                                style={{marginLeft:'10px'}}
                            >Go to Log in</Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        )
    }
}
ForgetPwd = Form.create()(ForgetPwd)
export default ForgetPwd;