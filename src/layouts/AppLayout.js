import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { RoutesSwitch, routes } from '../components/RoutesConfig';
import { logoutUser } from '../redux/actions/user';

class AppLayout extends Component {
  render() {
    const { userData, logout } = this.props;
    return (
      <div id='app-layout'>
        <Header logout={logout} isLoggedIn={userData.isLoggedIn} />
        <div id='main-content'>
          <div className={'content-wrapper'}>
            <RoutesSwitch routes={routes} userData={userData} />
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

AppLayout.propTypes = {
  userData: PropTypes.object
};

const props = (state) => ({
  userData: state.userData
});

const actions = dispatch => ({
  logout: () => dispatch(logoutUser())
});

export default connect(props, actions)(AppLayout);
