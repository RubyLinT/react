import React,{Component} from 'react';
import {Table,Input,Button} from 'antd';
const EditableCell = ({editable,value,onChange}) => (
    <div>
        { editable ? <Input type="text" value={value} onChange={e => onChange(e.target.value)} /> :value}
    </div>
);
let row = {key:'',name:'',age:'',address:''}
let col = { title:'',dataIndex:'',key:'add',}
class UserTable extends React.Component{    
    constructor(props) {
        super(props);
        this.state = {
            dataSource:[{
                key:'1',
                name:'bob',
                age:11,
                address:'123'
            },{
                key:'2',
                name:'jack',
                age:10,
                address:'124'
            }
        ],
            columns:[{
                title:'userName',
                dataIndex:'name',
                key:'name',
            },{
                title:'userAge',
                dataIndex:'age',
                key:'age',
            },{
                title:'UserAddres',
                dataIndex:'address',
                key:'address',
            }]
        }
    }
    renderColumns = (text,record,column) => {
        return (
            <EditableCell
                editable={record.editable}
                value={text}
                onChange={value => this.handleChange(value,record.key,column)}
            ></EditableCell>
        )
    }
    edit = (key) => {
        const newData = [...this.state.dataSource];
        const target = newData.filter(item => key === item.key)[0];
        if(target) {
            target.editable = true;
            this.setState({data:newData})
        }
    }
    addRow = () => {
        let data = this.state.dataSource
        data.push(row);
        this.setState({
            dataSource:data
        })
    }
    addCol = () => {
        let column = this.state.columns
        column.push(col);
        this.setState({
            columns:column
        })
    }
    render() {
        return (
            <div className="Outter">
                <Button type="primary" htmlType="button" className="add" onClick={() => this.addRow()}>add row</Button>
                <Button type="primary" htmlType="button" className="add" onClick={() => this.addCol()}>add col</Button>
                <Table 
                    dataSource={this.state.dataSource} 
                    columns={this.state.columns}
                    bordered
                ></Table>
            </div>
        )
    }
}
export default UserTable;