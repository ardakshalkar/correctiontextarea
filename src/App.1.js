import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Editor, EditorState } from 'draft-js'

class App extends Component {
  constructor(){
    super();
    this.state = {
      editorState: EditorState.createEmpty(),
    };
  }
  render() {
    return (
      <div className="shopping-list">
        <h1>Shopping List for {this.props.name}</h1>
        <ul>
          <li>Instagram</li>
          <li>WhatsApp</li>
          <li>Oculus</li>
        </ul>
      </div>
    );
  }
}

export default App;
