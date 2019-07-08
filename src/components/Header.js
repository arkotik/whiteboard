import React from 'react';
import PropTypes from 'prop-types';
import { socketConnect } from 'socket.io-react';
import { routes } from './RoutesConfig';
import { NavLink } from 'react-router-dom';

const E_LOGOUT = 'logout';

const Header = (props) => {
  const { socket, logout, isLoggedIn, name } = props;
  const doLogout = () => {
    socket.emit(E_LOGOUT, { name });
    logout();
  };
  return <header>
    <div className='navigation'>
      {routes.map(({ url, title }, i) => <NavLink key={i} to={url}>{title}</NavLink>)}
    </div>
    {isLoggedIn && <div className={'logout-butt'}>
      <button onClick={doLogout}>Logout</button>
    </div>}
  </header>;
};

Header.propTypes = {
  socket: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired
};

export default socketConnect(Header);
