import React, {useState, useEffect} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,

} from "react-router-dom";

import SignIn from "./login/login";
import Product from "./products/product";
import User from "./users/user";

export default function AppRoute() {

  useEffect(() => {
    const token = JSON.parse( sessionStorage.getItem('token') );
  });

  return (
    <Router>
      <div>
        <Switch>
          <Route default path="/login">
            <SignIn />
          </Route>
          <Route path="/users">
            <User />
          </Route>
          <Route path="/products">
            <Product />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}