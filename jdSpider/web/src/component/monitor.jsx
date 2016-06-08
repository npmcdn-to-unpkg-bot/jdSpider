/**
 *
 * Created by yh on 5/11/16.
 */

import React from 'react'
import { Table } from 'antd';
import './Table.less';
var dataLength = 0;
const columns = [
  {
    title: '商品id',
    dataIndex: 'product_id',
    key:'product_id',
    width: 100,
  },
  {
    title: '剩余页面数量',
    dataIndex: 'pageSum',
    key:'pageSum',
    width: 100,
  }
];


const pagination = {
  showSizeChanger: true,
  onShowSizeChange(current, pageSize) {
    console.log('Current: ', current, '; PageSize: ', pageSize);
  },
  onChange(current) {
    console.log('Current: ', current);
  },
  total:dataLength,
  showTotal(total){
    console.log(dataLength)
    return `共 ${total} 条`
  }
};

const TableMonitor = React.createClass({
  getInitialState: function(){
    var set_name = location.href.toString();
    set_name = set_name.split("/")[3];

    return{
      data: [],
      loading: false,
      set_name:set_name
    };
  },
  componentDidMount: function() {
    this.loadInfoFromServer();
    setInterval(this.loadInfoFromServer, 1000);
  },
  loadInfoFromServer: function() {
    this.setState({loading: true})
    $.ajax({
      url:"http://127.0.0.1:3000/scrapymonitor/yh",
      dataType: 'json',
      cache: false,
      success: function (data) {
        dataLength = data.length;
        this.setState({data: data});
        this.setState({loading: false});
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render() {
    pagination.total = dataLength;
    pagination.pageSize = 40;
    return<div >
      <Table
        columns={columns}
        dataSource={this.state.data}
        useFixedHeader
        //loading={this.state.loading}
        pagination={pagination}
        bordered
        rowKey={record => record.indexNum}
        scroll={{x:true, y: pagination.pageSize  * 20}}
      />
    </div>

  }
});

export default TableMonitor;
