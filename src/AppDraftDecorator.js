import React, { Component } from 'react';
import Editor, { createEditorStateWithText } from 'draft-js-plugins-editor';
import createInlineToolbarPlugin from 'draft-js-inline-toolbar-plugin';
import editorStyles from './editorStyles.css';
import './editorStyles.css';
import { Modifier,EditorState,CompositeDecorator, ContentState } from 'draft-js';
import MultiDecorator from 'draft-js-plugins-editor/lib/Editor/MultiDecorator';


const createDecorator = (decor) =>{
  const decorators  = decor;
  return new MultiDecorator([new CompositeDecorator([
    {
      strategy: handleStrategy,
      component: HandleSpan,
    },
    {
      strategy: hashtagStrategy,
      component: HashtagSpan,
    },
  ])]);
}

const text = 'In this editor a toolbar shows up once you select part of the text …';


export default class SimpleInlineToolbarEditor extends Component {

  constructor(props){
    super(props);

    const compositeDecorator = new CompositeDecorator([
      {
        strategy: handleStrategy,
        component: HandleSpan,
      },
      {
        strategy: hashtagStrategy,
        component: HashtagSpan,
      },
    ]);
    let contentState = ContentState.createFromText("How are thou?");
    /*this.state = {
      editorState: EditorState.createEmpty(decorators),
      selectedText: ""
    };*/
    this.state = {
      editorState: EditorState.createEmpty(createDecorator()),
      selectedText: ""
    };
    this.onChange = (editorState) => this.setState({editorState});
  }
  render() {
    return (
        <div className="editor" onClick={this.focus}>
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange}
            ref={(element) => { this.editor = element; }}
          />
        </div>
    );
  }
}
const HANDLE_REGEX = /\@[\w]+/g;
const HASHTAG_REGEX = /\#[\w\u0590-\u05ff]+/g;

function handleStrategy(contentBlock, callback, contentState) {
  findWithRegex(HANDLE_REGEX, contentBlock, callback);
}

function hashtagStrategy(contentBlock, callback, contentState) {
  findWithRegex(HASHTAG_REGEX, contentBlock, callback);
}

function findWithRegex(regex, contentBlock, callback) {
  const text = contentBlock.getText();
  let matchArr, start;
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index;
    callback(start, start + matchArr[0].length);
  }
}

const HandleSpan = (props) => {
  return (
    <span
      style={styles.handle}
      data-offset-key={props.offsetKey}
      >
      {props.children}
    </span>
  );
};

const HashtagSpan = (props) => {
  return (
    <span
      style={styles.hashtag}
      data-offset-key={props.offsetKey}
      >
      {props.children}
    </span>
  );
};

const styles = {
  root: {
    fontFamily: '\'Helvetica\', sans-serif',
    padding: 20,
    width: 600,
  },
  editor: {
    border: '1px solid #ddd',
    cursor: 'text',
    fontSize: 16,
    minHeight: 40,
    padding: 10,
  },
  button: {
    marginTop: 10,
    textAlign: 'center',
  },
  handle: {
    color: 'rgba(98, 177, 254, 1.0)',
    direction: 'ltr',
    unicodeBidi: 'bidi-override',
  },
  hashtag: {
    color: 'rgba(95, 184, 138, 1.0)',
  },
};