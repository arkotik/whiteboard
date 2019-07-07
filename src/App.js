import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { SocketProvider } from 'socket.io-react';
import io from 'socket.io-client';
import AppLayout from './layouts/AppLayout';
import { loginUser, logoutUser } from './redux/actions/user';

let socket = null;
const E_AUTHORISE = 'authorise';
const E_AUTHENTICATE = 'authenticate';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onSocketConnect = () => {
    socket.on(E_AUTHORISE, this.onAuthoriseEvent);
    socket.on(E_AUTHENTICATE, this.onAuthenticateEvent);
    const { isLoggedIn, token, name } = this.props.userData;
    if (isLoggedIn) {
      socket.emit('authenticate', { token, name });
    }
  };

  onAuthoriseEvent = ({ status, data }) => {
    if (status === 'ok') {
      this.props.login(data);
    } else {
      console.error(data);
    }
  };

  onAuthenticateEvent = ({ status }) => {
    if (status === 'ok') {
      console.log('User authenticated.');
    } else {
      this.props.logout();
      console.error('Authentication failed!');
    }
  };

  componentWillMount() {
    socket = io('http://localhost:3015', { transports: ['websocket'] });
    socket.on('connect', this.onSocketConnect);
  }

  componentWillUnmount() {
    socket.removeListener(E_AUTHORISE, this.onAuthoriseEvent);
    socket.removeListener(E_AUTHENTICATE, this.onAuthenticateEvent);
    socket.disconnect();
  }


  render() {
    return <SocketProvider socket={socket}>
      <Router>
        <AppLayout />
      </Router>
    </SocketProvider>;
  }
}

App.propTypes = {
  login: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  userData: PropTypes.object.isRequired
};

const props = (state) => ({
  userData: state.userData
});

const actions = (dispatch) => ({
  login: (data) => dispatch(loginUser(data)),
  logout: () => dispatch(logoutUser())
});

export default connect(props, actions)(App);
