import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      notes: []
    };
  }

  componentWillMount() {
    fetch("http://localhost:3000/api/notes")
      .then(response => response.text())
      .then(JSON.parse)
      .then(notes => this.setState({ notes }));
  }

  render() {
    const { notes } = this.state;
    console.log("notes", notes);
    return (
      <div>
        <header>
          <img src={logo} alt="logo" />
          <h1>Welcome to React</h1>
        </header>
        <p>
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <ul>
          {notes &&
            notes.map(({ id, title, text }) => (
              <li>
                <b>{title}</b> - {text}
              </li>
            ))}
        </ul>
      </div>
    );
  }
}

export default App;
