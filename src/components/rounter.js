import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import SignIn from "./login/login";
import Product from "./products/product";
import User from "./users/user";

const PrivedRoute = ({ component: Component, path }) => {
  let token = '';
  if( sessionStorage.getItem('token') ){
    token = JSON.parse(sessionStorage.getItem('token'));
  }
  return (
    <Route path={path}>
      { token ? <Component token={token} /> : <Redirect to="/login" /> }
    </Route>
  );
}

export default function AppRoute() {
  return (
    <Router>
      <div>
        <Switch>
          <Route default path="/login">
            <SignIn />
          </Route>
          <PrivedRoute path="/users" component={User} />
          <PrivedRoute path="/products" component={Product} />
        </Switch>
      </div>
    </Router>
  );
}