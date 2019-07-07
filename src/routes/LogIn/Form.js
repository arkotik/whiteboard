import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirectToReferrer: false
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const { isLoggedIn } = this.props;
    if (!isLoggedIn && nextProps.isLoggedIn) {
      this.setState({ redirectToReferrer: true });
    }
  }

  login = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const name = fd.get('name');
    const pass = fd.get('password');
    this.props.socket.emit('authorise', { name, pass });
  };

  render() {
    const { from } = this.props.location.state || { from: { pathname: "/" } };
    const { redirectToReferrer } = this.state;
    const { isLoggedIn } = this.props;
    if (isLoggedIn) {
      return <Redirect to={{ pathname: "/" }} />
    }
    if (redirectToReferrer) {
      return <Redirect to={from} />
    }
    return <form action='#' onSubmit={this.login}>
      <span>Name</span>
      <input type='name' name={'name'} />
      <span>Pass</span>
      <input type='password' name={'password'} />
      <button type={'submit'}>Log In</button>
    </form>;
  }
}

Form.propTypes = {
  socket: PropTypes.object.isRequired,
  isLoggedIn: PropTypes.bool
};

export default Form;
