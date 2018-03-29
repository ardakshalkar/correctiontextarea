import React, { Component } from 'react';
import Editor, { createEditorStateWithText } from 'draft-js-plugins-editor';
import editorStyles from './editorStyles.css';
import './editorStyles.css';
import { Modifier,EditorState,CompositeDecorator } from 'draft-js';

const styleMap = {
  'STRIKETROUGH':{
    textDecoration:'line-through',
  }
}


const text = 'In this editor a toolbar shows up once you select part of the text …';

function getEntityStrategy(type) {
  return function(contentBlock, callback, contentState) {
      contentBlock.findEntityRanges(
          (character) => {
              const entityKey = character.getEntity();
              if (entityKey === null) {
                  return false;
              }
              return contentState.getEntity(entityKey).getType() === type;
          },
          callback
      );
  };
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
const LinkComponent = (props) => (<span style={{ background: 'red'}}>{props.children}</span>)
export default class SimpleInlineToolbarEditor extends Component {

  /*decorator = new CompositeDecorator([{
    strategy: findLink,
    component: LinkComponent
  }]);
  state = {
    editorState: createEditorStateWithText(text),
    selectedText: "Hello Gorilla"
  };*/
  /*state = {
    editorState: EditorState.createEmpty(this.decorator)
  }*/
  constructor(props){
    super(props);
    const compositeDecorator = new CompositeDecorator([
      { strategy: findLink, component: LinkComponent },
    ]);
    this.state = {
      editorState: EditorState.createEmpty(compositeDecorator)
    }
  }
  onChange = (editorState) => {
    this.setState({editorState});
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
    //const newContentState = Modifier.replaceText(editorState.getCurrentContent(),selectionState,text);
    /*const newContentState = Modifier.replaceText(contentState,
      selectionState.merge({ anchorOffset: start, focusOffset: end }),
      `:${text}:`,
      null,
      entityKey);*/
    const newContentState = Modifier.replaceText(contentState,
      selectionState,
      text,
      null,
      entityKey);
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