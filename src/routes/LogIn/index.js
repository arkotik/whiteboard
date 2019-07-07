import { connect } from 'react-redux';
import { socketConnect } from 'socket.io-react';
import Form from './Form';

const props = state => {
  return {
    isLoggedIn: state.userData.isLoggedIn
  }
};

export default connect(props, null)(socketConnect(Form));
