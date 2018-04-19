import React, { Component } from 'react';
import { Row, Col, Form, Input, Button, Icon, Alert, message, Upload } from 'antd';
import store from '../../public/store/store';
import actions from '../../public/action/action';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import axios from 'axios';
import effect from '../../public/effect/effect'
function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

class Setting extends React.Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    }
    componentDidMount() {
        store.subscribe(() => {
            this.setState({
                userName:store.getState().setUserMsg.userMsg ? store.getState().setUserMsg.userMsg.userName : '',
                headerImg:store.getState().setUserMsg.userMsg ? store.getState().setUserMsg.userMsg.headerImg : '',
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
        const { cookies } = this.props;
        this.state = {
            alertMsg: '',
            loading: false,
            formData: {},
            userName:'',
            headerImg:''
        }
        let imageUrl = '';
        this.handleChange = (info) => {
            console.log(info)
            if (info.file.status === 'uploading') {
                this.setState({ loading: true });
                return;
            }
            if (info.file.status === 'done') {
                this.setState({
                    imageUrl,
                    loading: false,
                });
            }
        }
        this.beforeUpload = (file, fileList) => {
            // const isJPG = file.type === 'image/jpeg';
            // if (!isJPG) {
            //   message.error('You can only upload JPG file!');
            // }   
            getBase64(file, ImageUrl => {
                imageUrl = ImageUrl
                let files = JSON.stringify([{ 
                    name: file.name, 
                    url: imageUrl, 
                    type: file.type.split('/')[0], 
                    num:0, 
                }])
                this.setState({
                    formData: {
                        username: this.state.userName,
                        files: files
                    }
                });
            });
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                message.error('Image must smaller than 2MB!');
            }
            // return isJPG && isLt2M;
            return isLt2M;
        }
        this.handleSubmit = () => {
            axios.post('http://localhost:3002/files/uploadImg', this.state.formData).then((res) => {
                console.log(res)
                if(res.data.isSuccess) {
                    this.setState({
                        loading: false,
                        imageUrl:JSON.parse(this.state.formData.files)[0].url
                    })
                    const { cookies } = this.props;
                    store.dispatch(effect.setUserMsg(cookies.get('token')));   
                    message.success('submit success!')
                } else {
                    message.error(res.data.message)
                }        
            }).catch(e => {
                message.error('submit fail!')
            });
        }
    }
    render() {
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        )
        const imageUrl = this.state.imageUrl;
        return (
            <Row type="flex" className="Outter">
                <Col offset={6} span={12} type="flex" className="loginInner">
                    <Form layout="inline" onSubmit={this.handleSubmit}>
                        <h2>Setting</h2>
                        <Form.Item>
                            <Upload
                                name="avatar"
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                // action="//localhost:3002/files/uploadImg"
                                beforeUpload={this.beforeUpload}
                                onChange={this.handleChange}
                                // data={this.state.formData}
                                customRequest={this.handleSubmit}
                            >
                                {imageUrl ? <img src={imageUrl} style={{maxWidth:'112px'}} /> : uploadButton}
                            </Upload>
                        </Form.Item>
                    </Form>
                </Col>
                <div className="alertBox">
                    {this.state.alertMsg != '' &&
                        <Alert
                            className="alert"
                            message="Error"
                            description={this.state.alertMsg}
                            type="error"
                        ></Alert>}
                </div>
            </Row>
        )
    }
}

export default withCookies(Setting);