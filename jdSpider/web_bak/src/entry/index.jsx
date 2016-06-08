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
import TableMonitor from '../component/monitor'


render((
  <Router history={browserHistory}>
    <Route path="/" component={ProductInfo}></Route>
    <Route path="/comments/:poductId" component={TableComments}> </Route>
    <Route path="/scrapyMonitor" component={TableMonitor}> </Route>
  </Router>
), document.getElementById('react-table'));



// ReactDOM.render(<Search />  , document.getElementById("react-search"));
// ReactDOM.render(<fixTable />  , document.getElementById('react-table'));
