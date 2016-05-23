/**
 *
 * Created by yh on 5/11/16.
 */

import React from 'react'
import { Table } from 'antd';
import './Table.less';
import {Link} from 'react-router'
var cacheData = require('../common/config')

const columns = [
{
  title: '序号',
  dataIndex: 'indexNum',
  key:'indexNum',
  fixed: 'left',
  width: 36,
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
  title: '电脑端价格',
  dataIndex: 'pc_price',
  key:'pc_price',
  // fixed: 'left',
  width: 36,
  sorter: (a, b) => a.pc_price - b.pc_price
},
{
  title: '手机端价格',
  dataIndex: 'm_price',
  key:'m_price',
  // fixed: 'left',
  width: 36,
},
{
  title: '评论',
  dataIndex: 'comments',
  key:'comments',
  // fixed: 'left',
  width: 36,
  render(text, record) {
    return <Link to={`/comments/${record.product_id}`}>{text}</Link>;
  },
},
{
  title: '颜色',
  dataIndex: '颜色',
  key:'颜色',
  width: 30,
},
{
  title: '平台',
  dataIndex: '平台',
  key:'平台',
  width: 30,
},
{
  title: '操作系统',
  dataIndex: '操作系统',
  key:'操作系统',
  width: 30,
},
{
  title: 'CPU类型',
  dataIndex: 'CPU类型',
  key:'CPU类型',
  width: 30,
},
{
  title: 'CPU速度',
  dataIndex: 'CPU速度',
  key:'CPU速度',
  width: 30,
},
{
  title: '二级缓存',
  dataIndex: '二级缓存',
  key:'二级缓存',
  width: 30,
},
{
  title: 'CPU核心',
  dataIndex: '核心',
  key:'核心',
  width: 30,
},
{
  title: '内存容量',
  dataIndex: '内存容量',
  key:'内存容量',
  width: 30,
},
{
  title: '硬盘容量',
  dataIndex: '硬盘容量',
  key:'硬盘容量',
  width: 30,
},
{
  title: '转速',
  dataIndex: '转速',
  key:'转速',
  width: 30,
},
{
  title: '接口类型',
  dataIndex: '接口类型',
  key:'接口类型',
  width: 30,
},
{
  title: '固态硬盘',
  dataIndex: '固态硬盘',
  key:'固态硬盘',
  width: 30,
},
{
  title: '显卡类型',
  dataIndex: '类型',
  key:'类型',
  width: 30,
},
{
  title: '显示芯片',
  dataIndex: '显示芯片',
  key:'显示芯片',
  width: 30,
},
{
  title: '显存容量',
  dataIndex: '显存容量',
  key:'显存容量',
  width: 30,
},
{
  title: '光驱类型',
  dataIndex: '光驱类型',
  key:'光驱类型',
  width: 30,
},
{
  title: '屏幕规格',
  dataIndex: '屏幕规格',
  key:'屏幕规格',
  width: 30,
},
{
  title: '显示比例',
  dataIndex: '显示比例',
  key:'显示比例',
  width: 30,
},
{
  title: '物理分辨率',
  dataIndex: '物理分辨率',
  key:'物理分辨率',
  fixed: 'right',
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

const TableTest = React.createClass({
  getInitialState: function(){
   return{
      data: [],
      loading: false,
   };
  },
  componentDidMount: function() {
    console.log(cacheData.getData())
    if (cacheData.getData() == null){
      this.loadInfoFromServer();
    }else{
      this.setState({data: cacheData.getData()});
    }
  },
  loadInfoFromServer: function() {
    this.setState({loading: true})
    $.ajax({
      url: "http://0.0.0.0:3000/productInfo",
      dataType: 'json',
      cache: false,
      success: function (data) {
        this.setState({data: data});
        this.setState({loading: false})
        cacheData.setData(data);
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

             loading={this.state.loading}
             pagination={{pageSize: 60}}
             bordered
             rowKey={record => record.product_id}
             style={{ width: 3000 }}
             scroll={{x: 3000, y: 1000}}
           />
      </div>

  }
});

export default TableTest;
