// tutorial2.js
var CommentList = React.createClass({
  render: function() {
    return (
      <div className="commentList">
        Hello, world! I am a CommentList.
      </div>
    );
  }
});

var CommentForm = React.createClass({
  render: function() {
    return (
      <div className="commentForm">
        Hello, world! I am a CommentForm.
      </div>
    );
  }
});


// tutorial1.js
var CommentBox = React.createClass({
  render: function() {
    return (
 				<div className="commentBox">
	        <h1>Comments</h1>
	        <CommentList />
	        <CommentForm />
      	</div>    
      	);
  }
});
React.render(
  <CommentBox />,
  document.getElementById('react')
);


