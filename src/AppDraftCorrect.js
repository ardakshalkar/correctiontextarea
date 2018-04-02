import React, { Component } from 'react';
import Editor, { createEditorStateWithText } from 'draft-js-plugins-editor';
import createInlineToolbarPlugin from 'draft-js-inline-toolbar-plugin';
import editorStyles from './editorStyles.css';
import './editorStyles.css';
import { Modifier,EditorState,CompositeDecorator, ContentState } from 'draft-js';
import MultiDecorator from 'draft-js-plugins-editor/lib/Editor/MultiDecorator';
const styleMap = {
  'STRIKETROUGH':{
    textDecoration:'line-through',
  }
}

const createDecorator = (decor) =>{
  const decorators  = decor;
  return new MultiDecorator([new CompositeDecorator(decorators)]);
}

const text = 'In this editor a toolbar shows up once you select part of the text …';

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
const HelloEntity = (props) => (<strong>{props.children}</strong>)
const LinkEntity = (props) => (<span style={{ background: 'red'}}>{props.children}</span>)
export default class SimpleInlineToolbarEditor extends Component {
  constructor(props){
    super(props);
    let contentState = ContentState.createFromText("How are thou?");
    this.state = {
      editorState: EditorState.createWithContent(contentState,decorators),
      selectedText: ""
    };
    //this.focus = () => this.refs.editor.focus();
  }
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
    });
    console.log(currentContent);
    console.log(currentContent.getBlockMap().toJSON());
    console.log(currentContent.getEntityMap());*/
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