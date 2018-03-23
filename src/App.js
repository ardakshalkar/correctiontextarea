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
    selectedText: "Hello Gorilla"
  };

  onChange = (editorState) => {

    this.setState({
      editorState,
    });
    var selectionState = editorState.getSelection();
    var anchorKey = selectionState.getAnchorKey();
    var currentContent = editorState.getCurrentContent();
    var currentContentBlock = currentContent.getBlockForKey(anchorKey);
    var start = selectionState.getStartOffset();
    var end = selectionState.getEndOffset();
    var selectedText = currentContentBlock.getText().slice(start, end);
    console.log(selectedText);
    this.state.selectedText = selectedText;
    this.setState({
      selectedText: selectedText
    });
  };

  focus = (e) => {
    console.log("Focus Editor");
    e.stopPropagation();
    this.editor.focus();
  };

  clickOnToolbar = () => {
    console.log("Click on Toolbar");
  }
  clickOnEditor  = () => {
    console.log("Click on Editor");
  }
  focusTextArea = (e) => {
    console.log("Focus Textarea");
    e.stopPropagation();
  }
  fetchSelectedText = (e) => {
    var editorState = this.editor.getEditorState();
    var selectionState = editorState.getSelection();
    var anchorKey = selectionState.getAnchorKey();
    var currentContent = editorState.getCurrentContent();
    var currentContentBlock = currentContent.getBlockForKey(anchorKey);
    var start = selectionState.getStartOffset();
    var end = selectionState.getEndOffset();
    var selectedText = currentContentBlock.getText().slice(start, end);
    console.log(selectedText);
    this.state.selectedText = selectedText;
    this.setState({
      selectedText: selectedText
    });
    //console.log(this.editor.editorState.getSelection());
  }
  render() {
    return (
        <div className="editor" onClick={this.focus}>
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange}
            plugins={plugins}
            ref={(element) => { this.editor = element; }}
          />
          <InlineToolbar onMouseOver={this.onMouseOverToolbar} onClick={this.clickOnToolbar} />
          <input type="text" onClick={this.focusTextArea} value={this.state.selectedText}/>
          <button onClick={this.fetchSelectedText}>Fetch</button>
          <button onClick={this.correctText}>Correct</button>
        </div>
    );
  }
}