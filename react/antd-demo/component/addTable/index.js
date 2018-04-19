import React,{Component} from 'react';
import { Icon, Form, Input, Row, Col, Button,Select } from 'antd';
import axios from 'axios'
import './addTable.css';
import store from '../../public/store/store'
const Option = Select.Option
function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}
let uuid = 0;
class AddTable extends React.Component{
    remove = (k,i) => {
        const {form} = this.props;
        const keys = form.getFieldValue('keys');
        if(keys.length === 1) {
            return;
        }
        form.setFieldsValue({
            keys:keys.filter(key => key !== k),
        });
        let co = this.state.columns;
        co.splice(i,1)
        this.setState({
            columns:co
        })
    }
    add = () => {
        const {form} = this.props;
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(uuid);
        uuid++;
        let co = this.state.columns;
        co.push({name:'',type:'int',length:''})
        this.setState({
            columns:co
        })
        form.setFieldsValue({
            keys:nextKeys,
        })
    }
    constructor(props) {
        super(props);
        this.state = {
            columns:[],
            user:[]
        }
        store.subscribe(() => {
            this.setState({
                user:store.getState().setUserMsg.userMsg ? store.getState().setUserMsg.userMsg : []
            })
        })
    }
    componentDidMount() {
        this.props.form.validateFields();        
    }
    //组件将被卸载  
    componentWillUnmount() {
        //重写组件的setState方法，直接返回空
        this.setState = (state, callback) => {
            return;
        };
    }
    handleSubmit = (e) => {
        e.preventDefault();
        console.log(this.state.columns)
        this.props.form.validateFields((err,values) => {
            console.log(values)
            if(!err) {
                console.log(this.state.user)
                let tables = this.state.user.tables == null ? values.tableName : this.state.user.tables + ',' + values.tableName
                console.log(tables)
                let data = {
                    tableName:values.tableName,
                    columns:this.state.columns,
                    userName:this.state.user.userName,
                    tables:tables
                }
                axios.post('//localhost:3002/table/create',data).then((re) => {
                    console.log(re)
                }).catch(e => {
                    console.log(e)
                })
                console.log(data)
            } else {
                console.log(err)
            }
        })
    }
    handleChange = (e,i,type) => {
        let co = this.state.columns;
        if(type == 'type') {
            co[i][type] = e ;            
        } else {
            co[i][type] = e.target.value ;            
        }
        this.setState({
            columns:co
        })
    }
    render() {
        const {getFieldDecorator,getFieldValue,getFieldsError,getFieldError,isFieldTouched} = this.props.form;
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
        const formItemLayoutWithOutLabel = {
            wrapperCol: {
              xs: { span: 24, offset: 0 },
              sm: { span: 20, offset: 4 },
            },
        };
        
        const tableNameError = isFieldTouched('tableName') && getFieldError('tableName')
        getFieldDecorator('keys',{initialValue:[]});
        const keys = getFieldValue('keys');
        const formItems = keys.map((k,index) => {
            return (
                <span key = {k}>
                    <Form.Item
                        {...(index === 0 ? formItemLayout :formItemLayoutWithOutLabel)}
                        label = {index === 0 ? 'columns' : ''}
                        required = {false}                        
                        onSubmit={this.handleSubmit}
                    >
                        {getFieldDecorator(`names[${k}]`,{
                            validateTrigger:['onChange','onBlur'],
                            rules:[{
                                required:true,
                                whitespace:true,
                                message:"Please input column's name or delete this field."
                            }],
                        })(
                            <span>
                                <Input placeholder="column name" 
                                    value={this.state.columns[index].name} 
                                    onChange={(e) => this.handleChange(e,index,'name')}
                                    style={{width:240,marginRight:8}}/>
                                <Select value={this.state.columns[index].type}
                                    style={{ width: 120,marginRight:8 }}
                                    onChange={(e) => this.handleChange(e,index,'type')}
                                >
                                    <Option value="int">int</Option>
                                    <Option value="varchar">varchar</Option>
                                    <Option value="dateTime">dateTime</Option>
                                    <Option value="boolean">boolean</Option>
                                    <Option value="text">text</Option>
                                </Select>
                                <Input placeholder="length" 
                                    value={this.state.columns[index].length} 
                                    onChange={(e) => this.handleChange(e,index,'length')}
                                    style={{width:120,marginRight:8}}/>
                            </span>                        
                        )}
                        {keys.length > 1 ? (
                            <Icon
                                className = 'dynamic-delete-button'
                                type = 'minus-circle-o'
                                disabled={keys.length === 1}
                                onClick={() => this.remove(k,index)}
                            />
                        ) : null}
                    </Form.Item>
                </span>           
            )
        })
        return(
            <div className="Outter">
                <Form onSubmit={this.handleSubmit}>
                    <Form.Item {...formItemLayout} label="tableName"
                        validateStatus={tableNameError ? 'error' : ''}
                        help={tableNameError || ''}
                    >
                        {getFieldDecorator('tableName',{
                            rules:[{required:true,message:'please input your tableName!'}],
                        })(
                            <Input placeholder="wirte your tableName here" />
                        )}
                    </Form.Item>
                    {formItems}
                    <Form.Item {...formItemLayoutWithOutLabel}>
                        <Button type="dashed" onClick={this.add} style={{width:'60%'}}>
                            <Icon type="plus"/> Add column
                        </Button>
                    </Form.Item>
                    <Form.Item {...formItemLayoutWithOutLabel}>
                        <Button type="primary" htmlType="submit" 
                            style={{marginRight:'10px'}}
                            // disabled={hasErrors(getFieldsError())}
                        >Save</Button>    
                        <Button htmlType="button" onClick={() => this.changePage('Friend')}>Cancel</Button> 
                    </Form.Item> 
                </Form>
            </div>
        )
    }
}
AddTable = Form.create()(AddTable)
export default AddTable;