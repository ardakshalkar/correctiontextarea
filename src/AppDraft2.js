import React, { Component } from 'react';
import Editor, { createEditorStateWithText } from 'draft-js-plugins-editor';
import editorStyles from './editorStyles.css';
import './editorStyles.css';
import { Modifier,EditorState,CompositeDecorator,ContentState } from 'draft-js';
import MultiDecorator from 'draft-js-plugins-editor/lib/Editor/MultiDecorator';

const createDecorator = (decor) =>{
  const decorators  = decor;
  console.log(decor);
  return new MultiDecorator([new CompositeDecorator(decorators)]);
}
function findLink(contentBlock, callback, contentState){
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === 'LINK'
      );
    },
    callback
  );
}
function findWithRegex(regex, contentBlock, callback) {
  const text = contentBlock.getText();
  let matchArr, start;
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index;
    callback(start, start + matchArr[0].length);
  }
}
function findHello(contentBlock,callback,contentState){
  findWithRegex(/#[\w]+/g, contentBlock, callback);
}

const text = "this is some text with data";
const LinkEntity = (props) => (<span style={{ background: 'red'}}>{props.children}</span>)
const HelloEntity = (props) => (<strong>{props.children}</strong>)

const decorators = createDecorator([
  {
    strategy: findLink,
    component: LinkEntity,
  },
  {
    strategy: findHello,
    component: HelloEntity,
  }
]);
export default class SimpleInlineToolbarEditor extends Component {
  
  constructor(props){
    super(props);

    let contentState = ContentState.createFromText("How are thou?");
    this.state = {
      editorState: EditorState.createWithContent(contentState,decorators),
      selectedText: "INITIAL"
    };
    this.focus = () => this.refs.editor.focus();
  }
  onChange = (editorState) => {

    /*this.setState({
      editorState,
    });*/
    var selectionState = editorState.getSelection();
    var anchorKey = selectionState.getAnchorKey();
    var currentContent = editorState.getCurrentContent();
    var currentContentBlock = currentContent.getBlockForKey(anchorKey);
    var start = selectionState.getStartOffset();
    var end = selectionState.getEndOffset();
    var selectedText = currentContentBlock.getText().slice(start, end);
    console.log(selectedText);
    /*this.setState({
      editorState: EditorState.set(editorState, {
        decorator:decorators
      },),
      selectedText: selectedText
    });*/
    console.log("state.selectedText (before): ON CHANGE");
    console.log(this.state.selectedText);
    this.setState({
      selectedText: selectedText,
      editorState:editorState,
    });
    console.log("END ON CHANGE");
/*
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
    //this.state.selectedText = selectedText;
    this.setState({
      selectedText: selectedText
    });*/
    //console.log(currentContentBlock.key);
  };

  handleTextCorrectionChange = (e) => {
    this.setState({selectedText:e.target.value});
  }

  correctText2 = (e) =>{
    console.log("state.selectedText (before): ");
    console.log(this.state.selectedText);
    this.setState({
      selectedText: "CORRECT TEXT"
    });
    console.log("state.selectedText (after:",this.state.selectedText);
  }
  correctText = (e) => {
    console.log();
    //console.log("Correct text function");
    console.log("CORRECT TEXT");
    var editorState = this.state.editorState;
    const text = this.state.selectedText;
    console.log(text);
    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();
    const contentStateWithEntity = contentState.createEntity(
      'LINK',
      'MUTABLE',
      { status: 'complete' }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    //const newContentState = Modifier.replaceText(editorState.getCurrentContent(),selectionState,text);

    const newContentState = Modifier.replaceText(contentState,
      selectionState,
      text,
      null,
      entityKey);
    console.log(newContentState.getPlainText());
    const newEditorState = EditorState.set(editorState, { currentContent: newContentState });
    //this.setState({ editorState: EditorState.set(newEditorState,{decorator:decorators}) });
    console.log(newEditorState.getCurrentContent().getPlainText());
    console.log(this.state.editorState.getCurrentContent().getPlainText());
    /*this.setState({
      editorState: EditorState.moveFocusToEnd(newEditorState, {
        decorator:decorators
      },),
      selectedText: ""
    });*/
    /*this.setState({
      editorState: newEditorState,
      selectedText: "CHANGED"
    });*/
    let editor = EditorState.push(newEditorState,newContentState);
    this.setState({
      editorState: editor,
      selectedText: "CHANGED"
    });
    console.log("state.selectedText");
    console.log(this.state.selectedText);
    console.log(this.state.editorState.getCurrentContent().getPlainText());
    console.log("END CORRECT TEXT");
  }
  fetch = () => {
    console.log("FETCH CHANGE");
  }
  render() {
    return (
        <div className="editor" onClick={this.focus}>
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange}
            placeholder="Enter some text..."
            ref="editor"
            />
            <input type="text" onClick={this.focusTextArea} value={this.state.selectedText} onChange={this.handleTextCorrectionChange}/>
            <button onClick={this.fetch}>Fetch</button>
            <button onClick={this.correctText2}>Correct</button>
        </div>
    );
  }
}