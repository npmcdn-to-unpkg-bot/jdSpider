/**
 *
 * Created by yh on 5/11/16.
 */

import React from 'react'
import { Table } from 'antd';
import { Form, Input, Button, Checkbox } from 'antd';
import './Table.less';
import {Link} from 'react-router'
var cacheData = require('../common/config')
var dataLength = 0;
const FormItem = Form.Item;
const columns = [
  {
    title: '序号',
    dataIndex: 'indexNum',
    key:'indexNum',
    // fixed: 'left',
    width: 100,
    sorter: (a, b) => b.indexNum - a.indexNum
  },
  {
    title: 'productId',
    dataIndex: 'product_id',
    key:'productId',
    // fixed: 'left',
    width: 100,
    render(text) {
      return <a href={"http://item.jd.com/"+ text + ".html"} target="_blank">{text}</a>;
    },
  },
  {
    title: '电脑端价格',
    dataIndex: 'pc_price',
    key:'pc_price',
    // fixed: 'left',
    width: 100,
    sorter: (a, b) => a.pc_price - b.pc_price
  },
  {
    title: '手机端价格',
    dataIndex: 'm_price',
    key:'m_price',
    // fixed: 'left',
    width: 100,
  },
  {
    title: '名称',
    dataIndex: 'product_name',
    key:'product_name',
    // fixed: 'left',
    width: 300,
  },
  {
    title: '评论',
    dataIndex: 'comments',
    key:'comments',
    // fixed: 'right',
    // fixed: 'left',
    width: 100,
    render(text, record) {
      return <Link to={`/comments/${record.product_id}`}>{text}</Link>;
    },
  },

  {
    title: '平台',
    dataIndex: '平台',
    key:'平台',
    width: 200,
  },
  {
    title: '操作系统',
    dataIndex: '操作系统',
    key:'操作系统',
    width: 200,
  },
  {
    title: 'CPU类型',
    dataIndex: 'CPU类型',
    key:'CPU类型',
    width: 300,
  },
  {
    title: 'CPU速度',
    dataIndex: 'CPU速度',
    key:'CPU速度',
    width: 200,
  },
  {
    title: '二级缓存',
    dataIndex: '二级缓存',
    key:'二级缓存',
    width: 200,
  },
  {
    title: 'CPU核心',
    dataIndex: '核心',
    key:'核心',
    width: 200,
  },
  {
    title: '内存容量',
    dataIndex: '内存容量',
    key:'内存容量',
    width: 200,
  },
  {
    title: '硬盘容量',
    dataIndex: '硬盘容量',
    key:'硬盘容量',
    width: 200,
  },
  {
    title: '转速',
    dataIndex: '转速',
    key:'转速',
    width: 200,
  },
  {
    title: '接口类型',
    dataIndex: '接口类型',
    key:'接口类型',
    width: 200,
  },
  {
    title: '固态硬盘',
    dataIndex: '固态硬盘',
    key:'固态硬盘',
    width: 200,
  },
  {
    title: '显卡类型',
    dataIndex: '类型',
    key:'类型',
    width: 200,
  },
  {
    title: '显示芯片',
    dataIndex: '显示芯片',
    key:'显示芯片',
    width: 200,
  },
  {
    title: '显存容量',
    dataIndex: '显存容量',
    key:'显存容量',
    width: 200,
  },
  {
    title: '光驱类型',
    dataIndex: '光驱类型',
    key:'光驱类型',
    width: 200,
  },
  {
    title: '屏幕规格',
    dataIndex: '屏幕规格',
    key:'屏幕规格',
    width: 200,
  },

  {
    title: '显示比例',
    dataIndex: '显示比例',
    key:'显示比例',
    width: 200,
  },
  {
    title: '物理分辨率',
    dataIndex: '物理分辨率',
    key:'物理分辨率',
    width: 200,
    // fixed: 'right',

  },

];

const pagination = {
  showSizeChanger: true,
  total:dataLength,
  onShowSizeChange(current, pageSize) {
    console.log('Current: ', current, '; PageSize: ', pageSize);
  },
  onChange(current) {
    console.log('Current: ', current);
    cacheData.setCurrentPage(current);
  },
  defaultCurrent:cacheData.getCurrentPage(),
  showTotal(total){
    console.log(dataLength)
    return `共 ${total} 条`
  }
};

let SearchBar = React.createClass({
  handleChange() {
    // e.preventDefault();
    console.log('收到表单值：', this.props.form.getFieldsValue().userName);
    // console.log(this.refs.filterTextInput.value);
    this.props.onUserInput(
      this.props.form.getFieldsValue().userIndex,
      this.props.form.getFieldsValue().userName
    );
  },

  render() {
    const { getFieldProps } = this.props.form;
    return (
      <Form inline onChange={this.handleChange} className="SearchBox">
        <FormItem
          label="ID搜索：">
          <Input placeholder="请输入商品ID"
                 value={this.props.filterIndex}
            {...getFieldProps('userIndex')}
          />
        </FormItem>
        <FormItem
          label="名称搜索：">
          <Input placeholder="请输入商品名称"
                 value={this.props.filterName}
            {...getFieldProps('userName')}
          />
        </FormItem>
      </Form>
    );
  },
});

SearchBar = Form.create()(SearchBar);

const TableTest = React.createClass({
  getInitialState: function(){
    return{
      data: [],
      loading: false,
    };
  },
  componentDidMount: function() {
    if (cacheData.getData() == null){
      this.loadInfoFromServer();
    }else{
      this.setState({data: cacheData.getData()});
    }
  },
  loadInfoFromServer: function() {
    this.setState({loading: true})
    $.ajax({
      url: "http://127.0.0.1:3000/productInfo",
      dataType: 'json',
      cache: false,
      success: function (data) {
        cacheData.setData(data);
        dataLength = data.length;
        console.log(data.length);
        this.setState({data: data});
        this.setState({loading: false})
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render() {
    console.log("render");
    // dataLength = this.state.data.length;
    var rows = []
    this.state.data.forEach(function(product) {

      if(product.product_id.indexOf(this.props.filterIndex) === -1 && this.props.filterIndex) {
        return;
      }
      if(this.props.filterName){
        let productName = product.product_name.toString();
        if(productName.indexOf(this.props.filterName.toString()) === -1 ) {
          return;
        }
      }

      rows.push(product);
    }.bind(this));
    pagination.total = rows.length;
    pagination.defaultCurrent = cacheData.getCurrentPage();
    pagination.pageSize = 40;
    return<div className="table_test">
      <Table
        columns={columns}
        dataSource={rows}
        loading={this.state.loading}
        pagination={pagination}
        bordered
        rowKey={record => record.product_id}
        useFixedHeader
        scroll={{x:true, y: pagination.pageSize  * 20}}
      />
    </div>

  }
});



var productInfo = React.createClass({
  getInitialState: function() {
    return {
      filterIndex: '',
      filterName: ''
    }
  },
  handleUserInput: function(filterIndex, filterName) {
    this.setState({
      filterIndex: filterIndex,
      filterName: filterName
    });
  },
  render: function(){
    return (
      <div>
        <SearchBar
          filterIndex={this.state.filterIndex}
          filterName={this.state.filterName}
          onUserInput={this.handleUserInput}

        />
        <TableTest
          filterIndex={this.state.filterIndex}
          filterName={this.state.filterName}
        />
      </div>
    )
  }
});
export default productInfo;
