import React from 'react';
import PropTypes from 'prop-types';
import { routes } from './RoutesConfig';
// import Logo from './Logo';
import { NavLink } from 'react-router-dom';

const Header = (props) => {
  return <header>
    {/*<div className='logo-handler'><Logo /></div>*/}
    <div className='navigation'>
      {routes.map(({ url, title }, i) => <NavLink key={i} to={url}>{title}</NavLink>)}
    </div>
    {props.isLoggedIn && <div className={'logout-butt'}>
      <button onClick={props.logout}>Logout</button>
    </div>}
  </header>;
};

Header.propTypes = {
  logout: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
};

export default Header;
