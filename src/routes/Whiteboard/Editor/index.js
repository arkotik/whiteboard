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
    this.emit = true;
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
    this.emit = false;
    const { type, text } = data || {};
    this.props.setData(type, text);
    // if (name !== this.me) {
    // }
  };

  onStatusEvent = ({ name, online }) => {
    if (name !== this.me) {
      this.setState({ oppOnline: online });
    }
  };

  sendData = (type, text) => {
    if (this.emit && type && text) {
      this.props.socket.emit(E_DATA, { name: this.me, data: { type, text } });
    }
  };

  changeData = (name, text) => {
    if ('teacher' === this.me && name === this.me) {
      this.sendData('teacher', text);
    } else {
      if (name === 'student') {
        this.sendData('student', text);
      }
    }
    // this.props.setData(name, text);
  };

  clearAll = () => {
    this.props.socket.emit(E_COMMAND, { command: C_CLEAR_ALL });
    this.props.clearAllData();
  };

  clearOne = (name) => {
    this.props.socket.emit(E_COMMAND, { command: C_CLEAR, payload: { name } });
    this.props.clearData(name);
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!this.emit) {
      this.emit = true;
    }
  }

  render() {
    const { editorData } = this.props;
    const { oppOnline } = this.state;
    const config = {
      plugins: 'autolink link lists print image preview code',
      toolbar: 'undo redo | bold italic | alignleft aligncenter alignright code | forecolor backcolor',
      min_height: 500,
      height: '100%',
      keep_styles: true,
      relative_urls: false,
      remove_script_host: false,
      extended_valid_elements: 'span[class|style]'
    };
    return (
      <div className='wrapper'>
        <div className='panel-top'>
          <p className='title'>Chat with: <span>{this.opponent}</span> ({oppOnline ? 'online' : 'offline'})</p>
          {this.me === 'teacher' && <div className='button clear-all' onClick={this.clearAll}>Clear All Data</div>}
        </div>
        <div className='editor-wrapper'>
          <div className="editor">
            {this.me === 'teacher' ? <MCE
              apiKey={'uode0yv09fxhf0u6wi02uckblk762nsqyia9qj2412hm7hhk'}
              init={config}
              value={editorData.teacher}
              onEditorChange={(content) => this.changeData('teacher', content)}
              disabled={this.me !== 'teacher'}
            /> : <div className='raw-html' dangerouslySetInnerHTML={{ __html: editorData.teacher }} />}
            <div className='panel-bottom'>
              {this.me === 'teacher' && <div className='button clear-one' onClick={() => this.clearOne(this.me)}>Clear</div>}
            </div>
          </div>
          <div className="editor common">
            <MCE
              apiKey={'uode0yv09fxhf0u6wi02uckblk762nsqyia9qj2412hm7hhk'}
              init={config}
              value={editorData.student}
              onEditorChange={(content) => this.changeData('student', content)}
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
