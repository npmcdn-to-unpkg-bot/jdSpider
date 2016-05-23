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

	// tutorial2.js

	var data = [{ id: 1, author: "Pete Hunt", text: "This is one comment" }, { id: 2, author: "Jordan Walke", text: "This is *another* comment" }];

	var CommentList = React.createClass({
	  displayName: "CommentList",

	  render: function () {
	    var commentNodes = this.props.data.map(function (comment) {
	      return React.createElement(
	        Comment,
	        { author: comment.author, key: comment.id },
	        comment.text
	      );
	    });
	    return React.createElement(
	      "div",
	      { className: "commentList" },
	      commentNodes
	    );
	  }
	});

	var CommentForm = React.createClass({
	  displayName: "CommentForm",

	  render: function () {
	    return React.createElement(
	      "div",
	      { className: "commentForm" },
	      "Hello, world! I am a CommentForm."
	    );
	  }
	});

	// tutorial3.js
	var CommentBox = React.createClass({
	  displayName: "CommentBox",

	  loadCommentsFromServer: function () {
	    $.ajax({
	      url: this.props.url,
	      dataType: 'json',
	      cache: false,
	      success: function (data) {
	        this.setState({ data: data });
	      }.bind(this),
	      error: function (xhr, status, err) {
	        this.setState({ data: comments });
	        console.error(this.props.url, status, err.toString());
	      }.bind(this)
	    });
	  },
	  handleCommentSubmit: function (comment) {
	    var comments = this.state.data;
	    comment.id = Date.now();
	    var newComments = comments.concat([comment]);
	    this.setState({ data: newComments });
	    $.ajax({
	      url: this.props.url,
	      datatype: 'json',
	      type: 'post',
	      data: comment,
	      success: function (data) {
	        this.setState({ data: data });
	      }.bind(this),
	      error: function (xhr, status, err) {
	        console.error(this.props.url, status, err.toString());
	      }.bind(this)
	    });
	  },
	  getInitialState: function () {
	    return { data: [] };
	  },

	  componentDidMount: function () {
	    this.loadCommentsFromServer();
	    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
	  },

	  render: function () {
	    return React.createElement(
	      "div",
	      { className: "commentBox" },
	      React.createElement(
	        "h1",
	        null,
	        "Comments"
	      ),
	      React.createElement(CommentList, { data: this.state.data }),
	      React.createElement(CommentForm, { onCommentSubmit: this.handleCommentSubmit })
	    );
	  }
	});

	var Comment = React.createClass({
	  displayName: "Comment",

	  rawMarkup: function () {
	    var rawMarkup = marked(this.props.children.toString(), { sanitize: true });
	    return { __html: rawMarkup };
	  },
	  render: function () {
	    return React.createElement(
	      "div",
	      { className: "comment" },
	      React.createElement(
	        "h2",
	        { className: "commentAuthor" },
	        this.props.author
	      ),
	      React.createElement("span", { dangerouslySetInnerHTML: this.rawMarkup() })
	    );
	  }
	});

	var CommentForm = React.createClass({
	  displayName: "CommentForm",

	  getInitialState: function () {
	    return { author: '', text: '' };
	  },
	  handleAuthorChange: function (e) {
	    this.setState({ author: e.target.value });
	  },
	  handleTextChange: function (e) {
	    this.setState({ text: e.target.value });
	  },
	  handleSubmit: function (e) {
	    e.preventDefault();
	    var author = this.state.author.trim();
	    var text = this.state.text.trim();
	    if (!text || !author) {
	      return;
	    }
	    this.props.onCommentSubmit({ author: author, text: text });
	    this.setState({ author: '', text: '' });
	  },
	  render: function () {
	    return React.createElement(
	      "form",
	      { className: "commentForm", onSubmit: this.handleSubmit },
	      React.createElement("input", { type: "text",
	        placeholder: "Your name",
	        value: this.state.author,
	        onChange: this.handleAuthorChange
	      }),
	      React.createElement("input", { type: "text",
	        placeholder: "Say something ..",
	        value: this.state.text,
	        onChange: this.handleTextChange
	      }),
	      React.createElement("input", { type: "submit", value: "Post" })
	    );
	  }
	});

	ReactDOM.render(React.createElement(CommentBox, { url: "/api/comments", pollInterval: 2000 }), document.getElementById('content'));

/***/ }
/******/ ]);