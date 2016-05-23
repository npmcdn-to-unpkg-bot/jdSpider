import '../common/lib';
import App from '../component/App';
import TableTest from '../component/TableTest'
import TableComments from '../component/TableComments'
import ProductInfo from '../component/ProductInfo'
import ReactDOM from 'react-dom';
import React from 'react';
import { render } from 'react-dom'
import { Router, Route, Link , browserHistory} from 'react-router'
import Search from '../component/SearchForm'

const data = [];
for (let i = 0; i < 100; i++) {
  data.push({
    key: i,
    name: `李大嘴${i}`,
    age: 32,
    address: `西湖区湖底公园${i}号`
  });
}

render((
  <Router history={browserHistory}>
    <Route path="/" component={ProductInfo}></Route>
    <Route path="/comments/:productId" component={TableComments}> </Route>
  </Router>
), document.getElementById('react-table'));



// ReactDOM.render(<Search />  , document.getElementById("react-search"));
// ReactDOM.render(<fixTable />  , document.getElementById('react-table'));
