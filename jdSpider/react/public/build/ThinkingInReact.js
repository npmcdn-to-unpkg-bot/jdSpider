/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	/**
	 * Created by yh on 5/4/16.
	 */

	var ProductCategoryRow = React.createClass({
	  displayName: "ProductCategoryRow",

	  render: function () {
	    return React.createElement(
	      "tr",
	      null,
	      React.createElement(
	        "th",
	        { colSpan: "2" },
	        this.props.category
	      )
	    );
	  }
	});

	var ProductRow = React.createClass({
	  displayName: "ProductRow",

	  render: function () {
	    var name = this.props.product.stocked ? this.props.product.name : React.createElement(
	      "span",
	      { style: { color: 'red' } },
	      this.props.product.name
	    );
	    return React.createElement(
	      "tr",
	      null,
	      React.createElement(
	        "td",
	        null,
	        name
	      ),
	      React.createElement(
	        "td",
	        null,
	        this.props.product.price
	      )
	    );
	  }
	});

	var SearchBar = React.createClass({
	  displayName: "SearchBar",

	  handleChange: function () {
	    this.props.onUserInput(this.refs.filterTextInput.value, this.refs.inStockOnlyInput.checked);
	  },
	  render: function () {
	    return React.createElement(
	      "form",
	      null,
	      React.createElement("input", { type: "text",
	        placeholder: "Search...",
	        value: this.props.filterText,
	        ref: "filterTextInput",
	        onChange: this.handleChange
	      }),
	      React.createElement(
	        "p",
	        null,
	        React.createElement("input", { type: "checkbox",
	          checked: this.props.inStockOnly,
	          ref: "inStockOnlyInput",
	          onChange: this.handleChange
	        }),
	        '',
	        "Only show products in stock"
	      )
	    );
	  }
	});

	var ProductTable = React.createClass({
	  displayName: "ProductTable",

	  render: function () {
	    var rows = [];
	    var lastCategory = null;
	    this.props.products.forEach(function (product) {
	      if (product.name.indexOf(this.props.filterText) === -1 || !product.stocked && this.props.inStockOnly) {
	        return;
	      }
	      if (product.category !== lastCategory) {
	        rows.push(React.createElement(ProductCategoryRow, { category: product.category, key: product.category }));
	      }
	      rows.push(React.createElement(ProductRow, { product: product, key: product.name }));
	      lastCategory = product.category;
	    }.bind(this));
	    return React.createElement(
	      "table",
	      null,
	      React.createElement(
	        "thead",
	        null,
	        React.createElement(
	          "tr",
	          null,
	          React.createElement(
	            "th",
	            null,
	            "Name"
	          ),
	          React.createElement(
	            "th",
	            null,
	            "Price"
	          )
	        )
	      ),
	      React.createElement(
	        "tbody",
	        null,
	        rows
	      )
	    );
	  }
	});

	var FileterableProductTable = React.createClass({
	  displayName: "FileterableProductTable",

	  getInitialState: function () {
	    return {
	      filterText: '',
	      inStockOnly: false
	    };
	  },
	  handleUserInput: function (filterText, inStockOnly) {
	    this.setState({
	      filterText: filterText,
	      inStockOnly: inStockOnly
	    });
	  },
	  render: function () {
	    return React.createElement(
	      "div",
	      null,
	      React.createElement(SearchBar, {
	        filterText: this.state.filterText,
	        inStockOnly: this.state.inStockOnly,
	        onUserInput: this.handleUserInput
	      }),
	      React.createElement(ProductTable, {
	        products: this.props.products,
	        filterText: this.state.filterText,
	        inStockOnly: this.state.inStockOnly
	      })
	    );
	  }
	});

	var PRODUCTS = [{ category: "Sporting Goods", price: "$49.99", stocked: true, name: "Football" }, { category: "Sporting Goods", price: "$9.99", stocked: true, name: "Baseball" }, { category: "Sporting Goods", price: "$29.99", stocked: false, name: "Basketball" }, { category: "Electronics", price: "$99.99", stocked: true, name: "iPod Touch" }, { category: "Electronics", price: "$399.99", stocked: false, name: "iPhone 5" }, { category: "Electronics", price: "$199.99", stocked: true, name: "Nexus 7" }];

	ReactDOM.render(React.createElement(FileterableProductTable, { products: PRODUCTS }), document.getElementById('content'));

/***/ }
/******/ ]);