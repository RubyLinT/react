import React, { Component } from 'react';
import { Link, hashHistory } from 'react-router';
import { Row, Col, Form, Input, Button, Icon, Alert,message } from 'antd';
import axios from 'axios';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import store from '../../public/store/store';
import './login.css'
const FormItem = Form.Item;
function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}
class Login extends React.Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    componentDidMount() {
        this.props.form.validateFields();
    } 
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                let data = {
                    name: values.userName,
                    pwd: values.passWord
                }
                axios.post('http://localhost:3002/login', data).then((res) => {
                    console.log(res)
                    if (res.data.isSuccess) {          
                        message.success('Log in success!')              
                        const { cookies } = this.props;
                        cookies.set('userName', res.data.data[0].userName, { path: '/' }); 
                        cookies.set('token', res.data.data[0].token, { path: '/' });                        
                        hashHistory.push('/')
                    }
                    else {
                        message.error(res.data.message)
                    }
                }).catch(e => {
                    message.error('Log in fail!')
                    console.log(e)
                })
            }
        });
    }
    constructor(props) {
        super(props);
    }
    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        const userNameError = isFieldTouched('userName') && getFieldError('userName');
        const passWordError = isFieldTouched('passWord') && getFieldError('passWord');
        return (
            <Row className="loginBox" type="flex">
                <Col offset={6} span={12} type="flex" className="loginInner">
                    <Form layout="horizontal" onSubmit={this.handleSubmit}>
                        <h2>Log in</h2>
                        <FormItem
                            validateStatus={userNameError ? 'error' : ''}
                            help={userNameError || ''}
                        >
                            {getFieldDecorator('userName', {
                                rules: [{ required: true, message: 'Please input your userName!' }]
                            })(
                                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,0.25)' }}></Icon>} placeholder="userName" />
                            )}
                        </FormItem>
                        <FormItem
                            validateStatus={passWordError ? 'error' : ''}
                            help={passWordError || ''}
                        >
                            {getFieldDecorator('passWord', {
                                rules: [{ required: true, message: 'Please input your passWord!' }]
                            })(
                                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,0.25)' }}></Icon>} type="password" placeholder="password" />
                            )}
                        </FormItem>
                        <FormItem>
                            <Button
                                type="primary"
                                htmlType="submit"
                                disabled={hasErrors(getFieldsError())}
                            >Log in</Button>
                            <Button
                                type="primary"
                                htmlType="button"
                                style={{marginLeft:'10px'}}
                            >
                                <Link to="/Regist">Regist</Link>
                            </Button>
                            <Button
                                type="primary"
                                htmlType="button"
                                style={{marginLeft:'10px'}}
                            >
                                <Link to="/ForgetPwd">ForgetPwd</Link>
                            </Button>
                        </FormItem>
                    </Form>
                </Col>
            </Row>
        )
    }
}
Login = Form.create()(Login);
export default withCookies(Login);