import React,{Component} from 'react'
import {Link,hashHistory} from 'react-router'
import axios from 'axios';
import { Row, Col, Form, Input, Button, Icon, Alert,message} from 'antd';
const FormItem = Form.Item;
function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}
class Regist extends React.Component {
    componentDidMount() {
        this.props.form.validateFields();
    } 
    checkPwdLength = (rule,value,callback) => {
        if(value && value.length < 3) {
            callback('length of passWord must be 3 at less!')
        } else {
            callback()
        }
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let data = {
                    name: values.userName,
                    pwd: values.passWord
                }
                axios.post('http://localhost:3002/login/regist', data).then((res) => {
                    console.log(res)
                    if (res.data.isSuccess) {     
                        message.success('regist success!')
                        hashHistory.push('/Login')
                    }
                    else {
                        message.error(res.data.message)
                    }
                }).catch(e => {
                    message.error('regist fail!')
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
                        <h2>Regist</h2>
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
                                rules: [{ required: true, message: 'Please input your passWord!' },{
                                    validator:this.checkPwdLength
                                }]
                            })(
                                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,0.25)' }}></Icon>} type="password" placeholder="password" />
                            )}
                        </FormItem>
                        <FormItem>
                            <Button
                                type="primary"
                                htmlType="submit"
                                disabled={hasErrors(getFieldsError())}
                            >Regist</Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                onClick={() => {hashHistory.push('/Login')}}
                                style={{marginLeft:'10px'}}
                            >Go to Log in</Button>                            
                        </FormItem>
                    </Form>
                </Col>
            </Row>
        )
    }
}
Regist = Form.create()(Regist)
export default Regist;