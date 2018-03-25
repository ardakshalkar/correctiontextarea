import React, { Component } from 'react';
import Editor, { createEditorStateWithText } from 'draft-js-plugins-editor';
import createInlineToolbarPlugin from 'draft-js-inline-toolbar-plugin';
import editorStyles from './editorStyles.css';
import './editorStyles.css';
import { Modifier,EditorState } from 'draft-js';

const styleMap = {
  'STRIKETROUGH':{
    textDecoration:'line-through',
  }
}


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
    //console.log(selectedText);
    this.state.selectedText = selectedText;
    this.setState({
      selectedText: selectedText
    });
    //console.log(currentContentBlock.key);
  };

  handleTextCorrectionChange = (e) => {
    this.setState({selectedText:e.target.value});
  }

  correctText = (e) => {
    console.log("Correct text function");
    var editorState = this.editor.getEditorState();
    const text = this.state.selectedText;
    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();
    const contentStateWithEntity = contentState.createEntity(
      'LINK',
      'MUTABLE',
      { status: 'complete' }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newContentState = Modifier.replaceText(editorState.getCurrentContent(),selectionState,text);
    const newEditorState = EditorState.set(editorState, { currentContent: newContentState });
    this.setState({ editorState: EditorState.moveFocusToEnd(newEditorState) });
  }
  render() {
    return (
        <div className="editor" onClick={this.focus}>
          <Editor
            customStyleMap={styleMap}
            editorState={this.state.editorState}
            onChange={this.onChange}
            ref={(element) => { this.editor = element; }}
          />
          <input type="text" onClick={this.focusTextArea} value={this.state.selectedText} onChange={this.handleTextCorrectionChange}/>
          <button onClick={this.fetchSelectedText}>Fetch</button>
          <button onClick={this.correctText}>Correct</button>
        </div>
    );
  }
}