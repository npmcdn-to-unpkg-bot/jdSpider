/**
 *
 * Created by yh on 5/11/16.
 */

import React from 'react'
import { Table } from 'antd';
import './Table.less';

const columns = [
  {
    title: '序号',
    dataIndex: 'indexNum',
    key:'indexNum',
    fixed: 'left',
    width: 35,
    sorter: (a, b) => b.indexNum - a.indexNum
  },
  {
    title: 'productId',
    dataIndex: 'product_id',
    key:'productId',
    fixed: 'left',
    width: 30,
    render(text) {
      return <a href={"http://item.jd.com/"+ text + ".html"} target="_blank">{text}</a>;
    },
  },
  {
    title: 'nickname',
    dataIndex: 'nickname',
    key:'nickname',
    fixed: 'left',
    width: 35,
  },
  {
    title: 'content',
    dataIndex: 'content',
    key:'content',
    fixed: 'left',
    width: 100,
  },
  {
    title: 'referenceTime',
    dataIndex: 'referenceTime',
    key:'referenceTime',
    fixed: 'left',
    width: 30,
  },
  {
    title: 'referenceName',
    dataIndex: 'referenceName',
    key:'referenceName',
    width: 80,
  },
  {
    title: 'productColor',
    dataIndex: 'productColor',
    key:'productColor',
    width: 30,
  },
  {
    title: 'isMobile',
    dataIndex: 'isMobile',
    key:'isMobile',
    width: 30,
  },
  {
    title: 'userProvince',
    dataIndex: 'userProvince',
    key:'userProvince',
    width: 30,
  },
  {
    title: 'creationTime',
    dataIndex: 'creationTime',
    key:'creationTime',
    width: 30,
  },
  {
    title: 'userRegisterTime',
    dataIndex: 'userRegisterTime',
    key:'userRegisterTime',
    width: 30,
  },
  {
    title: 'replyCount',
    dataIndex: 'replyCount',
    key:'replyCount',
    width: 30,
  },
  {
    title: 'guid',
    dataIndex: 'guid',
    key:'guid',
    width: 30,
  },
  {
    title: 'score',
    dataIndex: 'score',
    key:'score',
    width: 30,
  },
  {
    title: 'days',
    dataIndex: 'days',
    key:'days',
    width: 30,
  },
  {
    title: 'isTop',
    dataIndex: 'isTop',
    key:'isTop',
    width: 30,
  },
  {
    title: 'firstCategory',
    dataIndex: 'firstCategory',
    key:'firstCategory',
    width: 30,
  },
  {
    title: 'usefulVoteCount',
    dataIndex: 'usefulVoteCount',
    key:'usefulVoteCount',
    width: 30,
  },
  {
    title: 'userClient',
    dataIndex: 'userClient',
    key:'userClient',
    width: 30,
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
      url:"http://0.0.0.0:3000/productComments/"+ this.state.productId,
      dataType: 'json',
      cache: false,
      success: function (data) {
        this.setState({data: data});
        this.setState({loading: false})
        console.log("http://127.0.0.1:3000/productComments/"+ this.state.productId);
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render() {
    return<div className="table_test">
      <Table
        columns={columns}
        dataSource={this.state.data}
        scroll={{x : true, y:true}}
        useFixedHeader
        loading={this.state.loading}
        pagination={{pageSize: 200}}
        bordered
        style={{ width: 3000 }}
      />
    </div>

  }
});

export default TableComments;
