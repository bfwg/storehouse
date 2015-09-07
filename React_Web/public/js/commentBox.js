var CommentBox = React.createClass({
  render: function() {
    return (
      <div className="commentBox">
        Hello, world! I am a CommentBox M.
      </div>
    );
  }
});
React.render(
  <CommentBox />,
  document.getElementById('content')
);
