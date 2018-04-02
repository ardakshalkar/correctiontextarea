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
      selectedText: ""
    };
    //EditorState.set(this.editorState,{decorator: decorators});
/*
    this.state = {
      editorState: EditorState.createEmpty(decorators)
    };*/

    this.focus = () => this.refs.editor.focus();
  }
  onChange = (editorState) => {
    var event = new Date();
    var selectionState = editorState.getSelection();
    var anchorKey = selectionState.getAnchorKey();
    var currentContent = editorState.getCurrentContent();
    var currentContentBlock = currentContent.getBlockForKey(anchorKey);
    var start = selectionState.getStartOffset();
    var end = selectionState.getEndOffset();
    var selectedText = currentContentBlock.getText().slice(start, end);
    selectedText = "HIHI";
    this.setState({
      editorState: EditorState.set(editorState, {
        decorator:decorators
      },),
      selectedText: selectedText
    });
  };

  handleTextCorrectionChange = (e) => {
    this.setState({selectedText:e.target.value});
  }
  correctText2 = (e) =>{

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
            <button onClick={this.fetchSelectedText}>Fetch</button>
            <button onClick={this.correctText2}>Correct</button>
        </div>
    );
  }
}