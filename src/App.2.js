import React from 'react';
import ReactDOM from 'react-dom';
import {Editor, EditorState} from 'draft-js';
import createInlineToolbarPlugin from 'draft-js-inline-toolbar-plugin';
import { ItalicButton } from 'draft-js-buttons';

class CorrectTextField extends React.Component{
  render(){
    return (
      <div>
        <input type="text" value="Enter text"/>
      </div>
    );
  }
}

const inlineToolbarPlugin = createInlineToolbarPlugin({
  structure:[ItalicButton]
});
const { InlineToolbar } = inlineToolbarPlugin;
const plugins = [inlineToolbarPlugin];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {editorState: EditorState.createEmpty()};
    this.onChange = (editorState) => this.setState({editorState});
  }
  render() {
    return (
      <div>
        <Editor editorState={this.state.editorState} onChange={this.onChange} plugins={plugins} />
        <InlineToolbar />
      </div>
    );
  }
}

export default App;