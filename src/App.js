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
    /*var selectionState = editorState.getSelection();
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
    });*/
    //console.log(currentContentBlock.key);
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
  handleTextCorrectionChange = (e) => {
    this.setState({selectedText:e.target.value});
  }
  fetchSelectedText = (e) => {
/*    var editorState = this.editor.getEditorState();
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
    console.log(currentContentBlock);*/
    //console.log(this.editor.editorState.getSelection());
  }

  correctText = (e) => {
    console.log("Correct text function");

    //const { start, end, text } = getFullWordWithCoordinates(editorState);
    var editorState = this.editor.getEditorState();
    const start = 5; const end = 15; const text = "hello";
    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();
    const contentStateWithEntity = contentState.createEntity(
      'LINK',
      'MUTABLE',
      { status: 'complete' }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    /*const newContentState = Modifier.replaceText(contentState,
      selectionState.merge({ anchorOffset: start, focusOffset: end }),
      `:HELLO:`,
      null,
      entityKey);*/
    const newContentState = Modifier.replaceText(editorState.getCurrentContent(),selectionState,"Hello");
    const newEditorState = EditorState.set(editorState, { currentContent: newContentState });
    this.setState({ editorState: EditorState.moveFocusToEnd(newEditorState) });

    /*var editorState = this.editor.getEditorState();
    let contentState = editorState.getCurrentContent();
    var selectionState = editorState.getSelection();
    console.log(selectionState);
    contentState = Modifier.replaceText(editorState.getCurrentContent(),selectionState,"HELLO");
    const newEditorState = EditorState.push(
      editorState,contentState,
    )
    this.onChange(newEditorState);*/
    /*let targetValue = e.target.value;
    var editorState = this.editor.getEditorState();
    var selectionState = editorState.getSelection();
    var anchorKey = selectionState.getAnchorKey();
    var currentContent = editorState.getCurrentContent();
    var currentContentBlock = currentContent.getBlockForKey(anchorKey);
    console.log("--------");
    console.log(currentContentBlock.key);

    let contentState = editorState.getCurrentContent();
    contentState = Modifier.replaceText(contentState,selectionState,"HELLO");
    this.setState({
      editorState: EditorState.push(editorState,contentState)
    });*/
    //const { start, end } = getInsertRange(autocompleteState, editorState);
    //const { start, end } = {0,1};


/*     const start = 0; const end = 5;
    var editorState = this.editor.getEditorState();
    const currentSelectionState = editorState.getSelection();
    
    const selection = currentSelectionState.merge({
      anchorOffset: start,
      focusOffset: end,
    });
    
    const contentState = editorState.getCurrentContent();
    //let hashtag = e.target.value; 
    let hashtag = "Hello";
    const contentStateWithEntity = contentState.createEntity(
      'HASHTAG',
      'IMMUTABLE',
      {
        hashtag,
      },
    );
    
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    console.log(entityKey);
    let newContentState = Modifier.replaceText(
      contentStateWithEntity,
      selection,
      `#${hashtag}`,
      null,
      entityKey,
    );
    
    const newEditorState = EditorState.push(
      editorState,
      newContentState,
      `insert-hashtag`,
    );
    console.log("new text added");
    return EditorState.forceSelection(
      newEditorState,
      newContentState.getSelectionAfter(),
    ); */
  }
  render() {
    return (
        <div className="editor" onClick={this.focus}>
          <Editor
            customStyleMap={styleMap}
            editorState={this.state.editorState}
            onChange={this.onChange}
            plugins={plugins}
            ref={(element) => { this.editor = element; }}
          />
          <InlineToolbar onMouseOver={this.onMouseOverToolbar} onClick={this.clickOnToolbar} />
          <input type="text" onClick={this.focusTextArea} value={this.state.selectedText} onChange={this.handleTextCorrectionChange}/>
          <button onClick={this.fetchSelectedText}>Fetch</button>
          <button onClick={this.correctText}>Correct</button>
        </div>
    );
  }
}