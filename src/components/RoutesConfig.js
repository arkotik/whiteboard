import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import {
  Home,
  Login,
  Whiteboard
} from '../routes';
import NoMatch from './NoMatch';

const routesConfig = [
  {
    path: "/",
    url: "/",
    exact: true,
    title: 'Home',
    component: Home
  },
  {
    path: "/whiteboard",
    url: "/whiteboard",
    needAuth: true,
    title: 'Whiteboard',
    component: Whiteboard
  }
];

const cb = ({ routes, path, strict }) => {
  const route = { path, strict, exact: true };
  return routes ? [route, ...routes.flatMap(cb)] : route;
};
const flatPaths = routesConfig.flatMap(cb);

function RouteWithSubRoutes(route) {
  return (
    <Route
      path={route.path}
      exact={route.exact}
      strict={route.strict}
      render={props => {
        if (route.needAuth && !route.isLoggedIn) {
          return <Redirect to={{
            pathname: "/login",
            state: { from: props.location }
          }} />;
        }
        return <route.component {...props} routes={route.routes} />;
      }}
    />
  );
}

function RoutesSwitch({ routes, userData }) {
  const isLoggedIn = (userData || {}).isLoggedIn;
  return <Switch>
    {routes.map((route, i) => <RouteWithSubRoutes key={i} {...route} isLoggedIn={isLoggedIn} />)}
    <Route path={'/login'} render={props => <Login {...props} />} />
    <Route component={NoMatch} />
  </Switch>;
}

export {
  routesConfig as routes,
  flatPaths,
  RouteWithSubRoutes,
  RoutesSwitch
};
