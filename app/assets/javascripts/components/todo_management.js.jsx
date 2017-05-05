let TodoManagement = React.createClass({
    getInitialState: function () {
        return {data: []};
    },
    componentDidMount: function () {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            success: function (result) {
                this.setState({data: result.data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },

    addComment: function (data) {
        this.setState({data: this.state.data.concat([data])});
    },

    render: function () {
        return (
            <div className="todoManagement">
                <h1>ToDo</h1>
                <CommentList data={this.state.data}/>
                <CommentForm addComment={this.addComment}/>
            </div>
        );
    }
});

let CommentList = React.createClass({
    render: function () {
        let commentNodes = this.props.data.map(function (comment) {
            return (
                <Comment author={comment.author}>{comment.text}</Comment>
            );
        });
        return (
            <div className="commentList">
                {commentNodes}
            </div>
        );
    }
});

let CommentForm = React.createClass({

    handleSubmit: function (e) {
        e.preventDefault();
        let author = this.refs.author.value.trim();
        let text = this.refs.text.value.trim();
        if (!text || !author) {
            return;
        }
        this.props.addComment({author: author,text: text})
        this.refs.author.value = '';
        this.refs.text.value = '';
        return;
    },

    render: function () {
        return (
            <form className="commentForm" onSubmit={this.handleSubmit}>
                <input type="text" placeholder="Your name" ref="author"/>
                <input type="text" placeholder="Say something..." ref="text"/>
                <input type="submit" value="Post"/>
            </form>
        );
    }
});

var Comment = React.createClass({
    render: function () {
        let rawMarkup = marked(this.props.children.toString(), {sanitize: true});
        return (
            <div className="comment">
                <h2 className="commentAuthor">
                    {this.props.author}
                </h2>
                <span dangerouslySetInnerHTML={{__html: rawMarkup}}/>
            </div>
        );
    }
});