import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { socketConnect } from 'socket.io-react';
import { addMessage } from '../../../redux/actions/chat';
import { Stage, Layer, /*Star, Text,*/ Line, Circle, Rect } from 'react-konva';

const E_CHAT = 'chat';
const E_SHAPE = 'shape';

class Drawer extends Component {
  constructor(props) {
    super(props);
    const { name } = props.userData;
    const opponent = name === 'teacher' ? 'student' : 'teacher';
    this.state = {
      opponent,
      renderCanvas: false,
      drawer: 'line',
      canvasProps: {},
      me: name,
      shapesList: [],
      tempShape: {}
    };
  }

  componentWillMount() {
    const { socket } = this.props;
    socket.on(E_CHAT, this.onChatEvent);
    socket.on(E_SHAPE, this.onShapeEvent);
  }

  componentWillUnmount() {
    const { socket } = this.props;
    socket.removeListener(E_CHAT, this.onChatEvent);
    socket.removeListener(E_SHAPE, this.onShapeEvent);
  }

  onChatEvent = ({ name, message }) => {
    const type = ['received', 'sent'][+(name === this.state.me)];
    this.props.addMessage({ message, type });
  };

  onShapeEvent = ({ name, shape }) => {
    const { me, shapesList } = this.state;
    if (shape && me !== name) {
      this.setState({ shapesList: [...shapesList, shape] });
    }
  };

  sendMessage = () => {
    const { me } = this.state;
    const message = this.messageRef.value;
    if (message && me === 'teacher') {
      this.props.socket.emit(E_CHAT, { name: me, message });
      this.messageRef.value = '';
      this.messageRef.focus();
    }
  };

  sendShape = (shape) => {
    const { me } = this.state;
    if (shape) {
      this.props.socket.emit(E_SHAPE, { name: me, shape });
    }
  };

  componentWillReceiveProps(nextProps, nextContext) {
    if (this.messagesList && this.props.messages.length !== nextProps.messages.length) {
      setTimeout(() => {
        this.messagesList.scrollTo(0, this.messagesList.scrollHeight);
      }, 50);
    }
  }

  componentDidMount() {
    if (this.CanvasRef) {
      const { width, height, x, y } = this.CanvasRef.getBoundingClientRect();
      this.setState({ renderCanvas: true, canvasProps: { width, height } });
      this.canvasOffset = { x, y };
    }
  }

  canvasMouseDown = e => {
    this.drawing = true;
    const { drawer } = this.state;
    const { x, y } = this.canvasOffset;
    const { clientX, clientY } = e;
    if (drawer === 'line') {
      this.pointA = [clientX - x, clientY - y];
      this.setState({ tempShape: { points: [...this.pointA] } })
    }
  };

  canvasMouseMove = e => {
    const { drawer } = this.state;
    const { x, y } = this.canvasOffset;
    const { clientX, clientY } = e;
    if (drawer === 'line' && this.drawing) {
      this.setState({ tempShape: { points: [...(this.state.tempShape.points || []), clientX - x, clientY - y] } })
    }

  };

  canvasMouseUp = e => {
    this.drawing = false;
    const { shapesList, drawer, tempShape } = this.state;
    const { x, y } = this.canvasOffset;
    const { clientX, clientY } = e;
    let newState = {};
    let shape = { drawer };
    if (drawer === 'line') {
      const pointB = [clientX - x, clientY - y];
      shape.props = {
        points: [...tempShape.points, ...pointB]
      };
      newState = { tempShape: {}, shapesList: [...shapesList, shape] };
    }
    this.setState(newState);
    this.sendShape(shape);
  };

  draw = ({ drawer, props }, i) => {
    if (drawer === 'line') {
      return <Line
        key={i}
        x={0}
        y={0}
        stroke={'red'}
        tension={1}
        {...props}
      />
    }
  };

  render() {
    const { opponent, renderCanvas, canvasProps, drawer, shapesList, tempShape } = this.state;
    const { messages } = this.props;
    const drawers = [
      {
        name: 'line',
        title: 'Line',
        component: Line
      },
      {
        name:  'rect',
        title: 'Rectangle',
        component: Rect
      },
      {
        name: 'circle',
        title: 'Circle',
        component: Circle
      },
    ];
    return (
      <div className='wrapper'>
        <div className='messenger'>
          <p>Chat with: <span>{opponent}</span></p>
          <div className="message-box" id="receive-box">
            <div className={'header'}>Messages:</div>
            <div className={'message-list'} ref={el => (this.messagesList = el)}>
              {(messages || []).map(({ message, type }, i) => <div key={i} className={'message-item'}>
                <div className={`message-body ${type}`}>{message}</div>
              </div>)}
            </div>
          </div>
          <div className="message-form">
            <label htmlFor="message">Enter a message:
              <input
                type="text"
                name="message"
                id="message"
                placeholder="Message text"
                inputMode="latin"
                maxLength={120}
                ref={el => (this.messageRef = el)}
              />
            </label>
            <button id="sendButton" name="sendButton" className="buttonright" onClick={this.sendMessage}>
              Send
            </button>
          </div>
        </div>
        <div className='board'>
          <div className="toolbox">
            {drawers.map(({ name, title }, i) => {
              return <div key={i} className="tool-butt" style={name === drawer ? { background: '#9bffca' } : {}} onClick={() => this.setState({ drawer: name })}>{title}</div>;
            })}
          </div>
          <div className="canvas" ref={el => (this.CanvasRef = el)} onMouseDown={this.canvasMouseDown} onMouseMove={this.canvasMouseMove} onMouseUp={this.canvasMouseUp}>
            {renderCanvas && <Stage {...canvasProps} >
              <Layer>
                {/*<Text text="Try to drag a star" />
                <Star
                  x={50}
                  y={150}
                  numPoints={5}
                  innerRadius={20}
                  outerRadius={40}
                  fill={'#89b717'}
                  draggable
                  shadowColor={'black'}
                  shadowBlur={10}
                  shadowOpacity={0.6}
                />*/}
                <Line
                  x={0}
                  y={0}
                  stroke={'red'}
                  tension={1}
                  {...tempShape}
                />
                {shapesList.map(this.draw)}
              </Layer>
            </Stage>}
          </div>
        </div>
      </div>
    );
  }
}

Drawer.propTypes = {
  socket: PropTypes.object.isRequired,
  addMessage: PropTypes.func.isRequired,
  messages: PropTypes.array.isRequired
};

const props = state => ({
  userData: state.userData,
  messages: state.chat
});

const actions = dispatch => ({
  addMessage: message => dispatch(addMessage(message))
});

export default connect(props, actions)(socketConnect(Drawer));
