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
    title: '序号',
    dataIndex: 'indexNum',
    key:'indexNum',
    width: 100,
  },
  {
    title: 'productId',
    dataIndex: 'product_id',
    key:'product_id',
    width: 100,
    render(text) {
      return <a href={"http://item.jd.com/"+ text + ".html"} target="_blank">{text}</a>;
    },
  },
  {
    title: 'nickname',
    dataIndex: 'nickname',
    key:'nickname',
    width: 100,
  },
  {
    title: 'content',
    dataIndex: 'content',
    key:'content',
    width: 500,
  },
  {
    title: 'referenceTime',
    dataIndex: 'referenceTime',
    key:'referenceTime',
    width: 100,
  },
  {
    title: 'referenceName',
    dataIndex: 'referenceName',
    key:'referenceName',
    width: 300,
  },
  {
    title: 'productColor',
    dataIndex: 'productColor',
    key:'productColor',
    width: 100,
  },
  {
    title: 'isMobile',
    dataIndex: 'isMobile',
    key:'isMobile',
    width: 100,
  },
  {
    title: 'userProvince',
    dataIndex: 'userProvince',
    key:'userProvince',
    width: 100,
  },
  {
    title: 'creationTime',
    dataIndex: 'creationTime',
    key:'creationTime',
    width: 100,
  },
  {
    title: 'userRegisterTime',
    dataIndex: 'userRegisterTime',
    key:'userRegisterTime',
    width: 100,
  },
  {
    title: 'replyCount',
    dataIndex: 'replyCount',
    key:'replyCount',
    width: 100,
  },
  {
    title: 'guid',
    dataIndex: 'guid',
    key:'guid',
    width: 100,
  },
  {
    title: 'score',
    dataIndex: 'score',
    key:'score',
    width: 100,
  },
  {
    title: 'days',
    dataIndex: 'days',
    key:'days',
    width: 100,
  },
  {
    title: 'isTop',
    dataIndex: 'isTop',
    key:'isTop',
    width: 100,
  },
  {
    title: 'firstCategory',
    dataIndex: 'firstCategory',
    key:'firstCategory',
    width: 100,
  },
  {
    title: 'usefulVoteCount',
    dataIndex: 'usefulVoteCount',
    key:'usefulVoteCount',
    width: 100,
  },
  {
    title: 'userClient',
    dataIndex: 'userClient',
    key:'userClient',
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

const TableComments = React.createClass({
  getInitialState: function(){
    var product_Id = location.href.toString();
    product_Id = product_Id.split("/")[4];

    return{
      data: [],
      loading: false,
      productId:product_Id
    };
  },
  componentDidMount: function() {
    this.loadInfoFromServer();
  },
  loadInfoFromServer: function() {
    this.setState({loading: true})
    $.ajax({
      url:"http://127.0.0.1:3000/productComments/"+ this.state.productId,
      dataType: 'json',
      cache: false,
      success: function (data) {
        dataLength = data.length;
        this.setState({data: data});
        this.setState({loading: false});
        console.log("http://127.0.0.1:3000/productComments/"+ this.state.productId);
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
        loading={this.state.loading}
        pagination={pagination}
        bordered
        rowKey={record => record.indexNum}
        scroll={{x:true, y: pagination.pageSize  * 20}}
      />
    </div>

  }
});

export default TableComments;
