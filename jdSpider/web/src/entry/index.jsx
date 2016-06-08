import '../common/lib';
import App from '../component/App';
import TableTest from '../component/TableTest'
import TableComments from '../component/TableComments'
import FixTable from '../component/fixTable'
import ReactDOM from 'react-dom';
import React from 'react';
import { render } from 'react-dom'
import { Router, Route, Link , browserHistory} from 'react-router'
import TableMonitor from '../component/monitor'
const data = [];
for (let i = 0; i < 100; i++) {
  data.push({
    key: i,
    name: `李大嘴${i}`,
    age: 32,
    address: `西湖区湖底公园${i}号`
  });
}

render(
<TableMonitor/>
, document.body);



// ReactDOM.render(<TableTest url="http://127.0.0.1:3000/productInfo"/>  , document.body);
// ReactDOM.render(<fixTable />  , document.getElementById('react-table'));
