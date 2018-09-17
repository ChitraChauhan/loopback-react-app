import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

const defaultTodo = {
  title: "",
  finished: false
};

const FormContainer = ({ todo, onChange, onSubmit }) => (
  <form onSubmit={onSubmit}>
    <input type="text" name="title" value={todo.title} onChange={onChange} />
    {todo.id ? <button>update</button> : <button>Add</button>}
  </form>
);

const ListContainer = ({ todos, updateTodo, removeTodo }) => (
  <ul>
    {todos &&
      todos.map(todo => (
        <Item
          key={todo.id}
          todo={todo}
          updateTodo={() => updateTodo(todo)}
          removeTodo={() => removeTodo(todo.id)}
        />
      ))}
  </ul>
);

const Item = ({ todo, updateTodo, removeTodo }) => (
  <div>
    <li onClick={updateTodo} style={{ float: "left" }}>
      <input
        type="checkbox"
        defaultChecked={todo.finished}
        onChange={e => (todo.finished = !todo.finished)}
      />{" "}
      {todo.title}
    </li>
    <button style={{ float: "center" }} onClick={() => removeTodo(todo.id)}>
      Remove
    </button>
  </div>
);

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      todos: [],
      todo: { ...defaultTodo }
    };
  }

  componentDidMount() {
    fetch("http://localhost:3000/api/Todos")
      .then(response => response.text())
      .then(JSON.parse)
      .then(todos => this.setState({ todos }));
  }

  onChange(e) {
    const { todo } = this.state;
    todo[e.target.name] = e.target.value;
    this.setState({ todo });
  }

  unfinished() {
    const { todos } = this.state;
    return todos.filter(todo => !todo.finished).length;
  }

  findIndex(id) {
    const { todos } = this.state;
    return todos.findIndex(record => record.id === id);
  }

  updateTodo(record) {
    this.setState({ todo: record });
  }

  removeTodo(id) {
    const { todos } = this.state;
    const findTodoIndex = this.findIndex(id);
    fetch("http://localhost:3000/api/Todos/" + id, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(result => {
        todos.splice(findTodoIndex, 1);
        this.setState({ todos: [...todos] });
      });
  }

  onSubmit(e) {
    e.preventDefault();
    const { todo, todos } = this.state;
    // let ids = todos.map(todo => {
    //   return todo.id;
    // });
    // console.log("ids:", ids);
    // var largest = 0;
    // var taskId = 0;
    // if (ids) {
    //   for (var i = 0; i <= ids.length; i++) {
    //     if (ids[i] > largest) {
    //       largest = ids[i];
    //     }
    //     console.log("largest", largest);
    //   }
    //   taskId = ++largest;
    // }
    // console.log("id", taskId);
    if (todo.id) {
      // edit
      const { todos } = this.state;
      const findTodoIndex = this.findIndex(todo.id);
      todos[findTodoIndex] = todo;
      fetch("http://localhost:3000/api/Todos/" + todo.id, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(todos[findTodoIndex])
      })
        .then(res => res.json())
        .then(result => {
          this.setState({ todos: [...todos], todo: { ...defaultTodo } });
        });
    } else {
      // add
      fetch("http://localhost:3000/api/Todos", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: ++todo.id,
          title: todo.title,
          finished: false
        })
      })
        .then(res => res.json())
        .then(result => {
          console.log("todos", result);
          this.setState({
            todos: [result, ...todos],
            todo: { ...defaultTodo }
          });
        });
    }
  }

  render() {
    const { todos, todo } = this.state;
    return (
      <div>
        <header>
          <img src={logo} alt="logo" />
          <h1>Todo Tasks:</h1>
        </header>
        {/* <p>
          To get started, edit <code>src/App.js</code> and save to reload.
        </p> */}
        {/* <ul>
          {todos &&
            todos.map((todo) => (
              <li>
                <b>{todo.title}</b>

              </li>
            ))}
        </ul> */}
        <FormContainer
          todo={todo}
          onChange={e => this.onChange(e)}
          onSubmit={e => this.onSubmit(e)}
        />
        <ListContainer
          todos={todos}
          updateTodo={todo => this.updateTodo(todo)}
          removeTodo={id => this.removeTodo(id)}
        />
        <div>Pending tasks: {this.unfinished()}</div>
      </div>
    );
  }
}

export default App;
