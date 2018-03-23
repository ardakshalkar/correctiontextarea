import React, { Component } from 'react';
import Editor, { createEditorStateWithText } from 'draft-js-plugins-editor';
import createInlineToolbarPlugin from 'draft-js-inline-toolbar-plugin';
import editorStyles from './editorStyles.css';
import './editorStyles.css';



class CorrectTextFieldPicker extends Component {
  componentDidMount() {
    console.log("Mount");
    setTimeout(() => { window.addEventListener('click', this.onWindowClick); });
  }

  componentWillUnmount() {
    console.log("Unmount");
    window.removeEventListener('click', this.onWindowClick);
  }

  /*onWindowClick = () =>
    // Call `onOverrideContent` again with `undefined`
    // so the toolbar can show its regular content again.
    this.props.onOverrideContent(undefined);*/

  render() {
    console.log("Render");
    return (
      <div>
      </div>
    );
  }
}


class CorrectTextField extends Component{
  //onClick = () => this.props.onOverrideContent(CorrectTextFieldPicker);
  onClick = (e) => {
    e.stopPropagation();
    console.log("Hello");
  }
  render() {
    return (
      <div className={editorStyles.headlineButtonWrapper}>
        <input type="text" onClick={this.onClick}/>
        <button onClick={this.onClick} className={editorStyles.headlineButton}>
          H
        </button>
      </div>
    );
  }
}


const inlineToolbarPlugin = createInlineToolbarPlugin({
  structure:[
    CorrectTextField
  ]
});
const { InlineToolbar } = inlineToolbarPlugin;
const plugins = [inlineToolbarPlugin];
const text = 'In this editor a toolbar shows up once you select part of the text …';

export default class SimpleInlineToolbarEditor extends Component {

  state = {
    editorState: createEditorStateWithText(text),
  };

  onChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  focus = () => {
    console.log("Focus");
    this.editor.focus();
  };

  onMouseOverEditor = () => {
    console.log("Mouse over editor");
  }

  onMouseOverToolbar = () => {
    console.log("Mouse over toolbar");
  }

  clickOnToolbar = () => {
    console.log("Click on Toolbar");
  }
  clickOnEditor  = () => {
    console.log("Click on Editor");
  }
  render() {
    return (
        <div className="editor" onClick={this.focus}>
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange}
            onClick={this.clickOnEditor}
            onMouseOver={this.onMouseOverEditor}
            plugins={plugins}
            ref={(element) => { this.editor = element; }}
          />
          <InlineToolbar onMouseOver={this.onMouseOverToolbar} onClick={this.clickOnToolbar} />
        </div>
    );
  }
}