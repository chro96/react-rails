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

    createTodo: function (data) {
        data['order'] = 999;
        data['status'] = 'todo'
        $.ajax({
            url: this.props.url,
            type: 'post',
            dataType: 'json',
            data: {
                todo: {
                    name: data.name,
                    order: data.order,
                    status: data.status
                }
            },

            success: function (result) {
                this.setState({data: result.data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.update_url, status, err.toString());
            }.bind(this)
        });
    },

    updateTodo: function (e, data) {
        if (e.key !== 'Enter') {
            return;
        }
        $.ajax({
            url: this.props.url + '/' + e.currentTarget.getAttribute('data-id'),
            type: 'patch',
            dataType: 'json',
            data: {
                todo: {
                    name: data.name,
                    order: data.order
                }
            },
            success: function (result) {
                this.setState({data: result.data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url + '/' + e.currentTarget.getAttribute('data-id'), status, err.toString());
            }.bind(this)
        });
    },

    updateStatus: function (e, data) {
        $.ajax({
            url: this.props.url + '/' + e.currentTarget.getAttribute('data-id') + '/update_status',
            type: 'patch',
            dataType: 'json',
            data: {
                todo: {
                    status: data.status,
                }
            },
            success: function (result) {
                this.setState({data: result.data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url + '/' + e.currentTarget.getAttribute('data-id') + '/update_status', status, err.toString());
            }.bind(this)
        });
    },

    deleteTodo: function (data) {
        $.ajax({
            url: this.props.url + '/' + e.currentTarget.getAttribute('data-id'),
            type: 'delete',
            dataType: 'json',
            success: function (result) {
                this.setState({data: result.data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url + '/' + e.currentTarget.getAttribute('data-id'), status, err.toString());
            }.bind(this)
        });
    },

    render: function () {
        return (
            <div className="container">
                <div className="page-header">
                    <h1>ToDo管理アプリ</h1>
                </div>
                <TodoList data={this.state.data} updateTodo={this.updateTodo} updateStatus={this.updateStatus}/>
                <TodoForm createTodo={this.createTodo}/>
            </div>
        );
    }
});

let TodoList = React.createClass({
    render: function () {
        let updateTodo = this.props.updateTodo;
        let updateStatus = this.props.updateStatus;
        let todoNodes = [];
        let doingNodes = [];
        let doneNodes = [];
        let data = this.props.data;
        for (var i in data) {
            if (data[i].status === 'todo') {
                todoNodes.push(<Todo id={data[i].id} name={data[i].name} updateTodo={updateTodo}
                                     updateStatus={updateStatus} key={data[i].id}
                                     order={data[i].order}>{data[i].status} </Todo>);
            } else if (data[i].status === 'doing') {
                doingNodes.push(<Todo id={data[i].id} name={data[i].name} updateTodo={updateTodo}
                                      updateStatus={updateStatus} key={data[i].id}
                                      order={data[i].order}>{data[i].status} </Todo>);
            } else {
                doneNodes.push(<Todo id={data[i].id} name={data[i].name} updateTodo={updateTodo}
                                     updateStatus={updateStatus} key={data[i].id}
                                     order={data[i].order}>{data[i].status} </Todo>);

            }
        }
        return (
            <div className="row">
                <div className="col-xs-4">
                    <h2>TODO</h2>
                    {todoNodes}
                </div>
                <div className="col-xs-4">
                    <h2>DOING</h2>
                    {doingNodes}
                </div>
                <div className="col-xs-4">
                    <h2>DONE</h2>
                    {doneNodes}
                </div>

            </div>
        );
    }
});

let TodoForm = React.createClass({

    handleSubmit: function (e) {
        e.preventDefault();
        let name = this.refs.name.value.trim();
        if (!name) {
            return;
        }
        this.props.createTodo({name: name})
        this.refs.name.value = '';
        return;
    },

    render: function () {
        return (
            <div className="row">
                <div className="col-xs-4">
                    <div className="well bs-component">
                        <form className="form-horizontal" onSubmit={this.handleSubmit}>
                            <fieldset>
                                新規作成
                                <div className="form-group is-empty col-md-12">
                                    <div class="input-group">
                                        <span class="input-group-addon">タイトル</span>
                                        <input className="form-control" id="name" type="text" placeholder="TODO TITLE"
                                               ref="name"/>
                                    </div>
                                    <input className="btn btn-primary btn-raised" type="submit" value="作成"/>
                                </div>
                            </fieldset>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
});

let Todo = React.createClass({
    updateTodoName(e) {
        this.props.updateTodo(e, {name: this.refs.name.value});
    },

    updateTodoOrder(e) {
        this.props.updateTodo(e, {order: this.refs.order.value});
    },

    updateTodoStatus(e) {
        this.props.updateStatus(e, {status: e.currentTarget.getAttribute('data-status')});
    },


    render: function () {
        return (
            <div className="panel panel-primary">
                <div className="panel-heading">
                    <form className="panel-title">
                        <input className="panel-input" type="text" ref='name'
                               defaultValue={this.props.name}
                               onKeyPress={this.updateTodoName} data-id={this.props.id}
                               style={{border: 'none'}}
                        />
                    </form>
                </div>
                <div className="panel-body">
                    <label className="label-floating">優先順位</label>
                    <form className="todoOrder">
                        <input type="text" ref='order'
                               defaultValue={this.props.order}
                               onKeyPress={this.updateTodoOrder} data-id={this.props.id}
                               style={{border: 'none'}}
                        />
                    </form>
                </div>
                <div className="btn-group btn-group-justified btn-group-raised">
                    <a data-status="todo" data-id={this.props.id} onClick={this.updateTodoStatus}
                       href="javascript:void(0)" className="btn">todo
                        <div className="ripple-container"></div>
                    </a>
                    <a data-status="doing" data-id={this.props.id} onClick={this.updateTodoStatus}
                       href="javascript:void(0)" className="btn">doing</a>
                    <a data-status="done" data-id={this.props.id} onClick={this.updateTodoStatus}
                       href="javascript:void(0)" className="btn">done</a>
                </div>
            </div>
        );
    }
});