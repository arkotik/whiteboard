import React from 'react';
import { matchPath } from 'react-router-dom';
import { flatPaths } from './RoutesConfig';

export default function({ location }) {
  const matches = flatPaths.find(path => matchPath(location.pathname, path));
  return !matches ? <div>
    <h3>
      No match for <code>{location.pathname}</code>
    </h3>
  </div> : null;
}
