import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { socketConnect } from 'socket.io-react';
import { Editor as MCE } from '@tinymce/tinymce-react';
import { setData, clearData, clearAllData } from '../../../redux/actions/editor';

const E_DATA = 'data';
const E_STATUS = 'check-status';
const E_COMMAND = 'command';

const C_CLEAR = 'clear';
const C_CLEAR_ALL = 'clear-all';

class Editor extends Component {
  constructor(props) {
    super(props);
    const { name } = props.userData;
    const opponent = name === 'teacher' ? 'student' : 'teacher';
    this.me = name;
    this.opponent = opponent;
    this.state = {
      oppOnline: false
    };
  }

  componentWillMount() {
    const { socket } = this.props;
    socket.on(E_DATA, this.onDataEvent);
    socket.on(E_STATUS, this.onStatusEvent);
    socket.on(E_COMMAND, this.onCommandEvent);
    socket.emit(E_STATUS, { name: this.opponent });
  }

  componentWillUnmount() {
    const { socket } = this.props;
    socket.removeListener(E_DATA, this.onDataEvent);
    socket.removeListener(E_STATUS, this.onStatusEvent);
    socket.removeListener(E_COMMAND, this.onCommandEvent);
  }

  onCommandEvent = ({ command, payload }) => {
    if (command === C_CLEAR) {
      const { name } = payload || {};
      this.props.clearData(name);
    }
    if (command === C_CLEAR_ALL) {
      this.props.clearAllData();
    }
  };

  onDataEvent = ({ name, data }) => {
    if (name !== this.me) {
      this.props.setData(name, data);
    }
  };

  onStatusEvent = ({ name, online }) => {
    if (name !== this.me) {
      this.setState({ oppOnline: online });
    }
  };

  sendData = (data) => {
    if (data) {
      this.props.socket.emit(E_DATA, { name: this.me, data });
    }
  };

  changeData = (name, text) => {
    if (name === this.me) {
      this.sendData(text);
    }
    this.props.setData(name, text);
  };

  clearAll = () => {
    this.props.socket.emit(E_COMMAND, { command: C_CLEAR_ALL });
    this.props.clearAllData();
  };

  clearOne = (name) => {
    this.props.socket.emit(E_COMMAND, { command: C_CLEAR, payload: { name } });
    this.props.clearData(name);
  };

  render() {
    const { editorData } = this.props;
    const { oppOnline } = this.state;
    return (
      <div className='wrapper'>
        <div className='panel-top'>
          <p className='title'>Chat with: <span>{this.opponent}</span> ({oppOnline ? 'online' : 'offline'})</p>
          {this.me === 'teacher' && <div className='button clear-all' onClick={this.clearAll}>Clear All Data</div>}
        </div>
        <div className='editor-wrapper'>
          <div className="editor">
            <MCE
              apiKey={'uode0yv09fxhf0u6wi02uckblk762nsqyia9qj2412hm7hhk'}
              init={{
                plugins: 'autolink link lists print preview code',
                toolbar: 'undo redo | bold italic | alignleft aligncenter alignright code',
                min_height: 500,
                extended_valid_elements: 'span[class]'
              }}
              value={editorData[this.me]}
              onEditorChange={(content) => this.changeData(this.me, content)}
            />
            <div className='panel-bottom'>
              {this.me === 'teacher' && <div className='button clear-one' onClick={() => this.clearOne(this.me)}>Clear</div>}
            </div>
          </div>
        </div>
        <div className='editor-wrapper'>
          <div className="editor">
            <MCE
              apiKey={'uode0yv09fxhf0u6wi02uckblk762nsqyia9qj2412hm7hhk'}
              init={{
                plugins: 'autolink link lists print preview code',
                toolbar: 'undo redo | bold italic | alignleft aligncenter alignright code',
                min_height: 500,
                extended_valid_elements: 'span[class]'
              }}
              value={editorData[this.opponent]}
              onEditorChange={(content) => this.changeData(this.opponent, content)}
            />

            <div className='panel-bottom'>
              {this.me === 'teacher' && <div className='button clear-one' onClick={() => this.clearOne(this.opponent)}>Clear</div>}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Editor.propTypes = {
  socket: PropTypes.object.isRequired,
  userData: PropTypes.object.isRequired,
  editorData: PropTypes.object.isRequired,
  setData: PropTypes.func.isRequired,
  clearData: PropTypes.func.isRequired,
  clearAllData: PropTypes.func.isRequired
};

const props = state => ({
  userData: state.userData,
  editorData: state.editorData
});

const actions = dispatch => ({
  setData: (name, data) => dispatch(setData(name, data)),
  clearData: (name) => dispatch(clearData(name)),
  clearAllData: () => dispatch(clearAllData())
});

export default connect(props, actions)(socketConnect(Editor));
