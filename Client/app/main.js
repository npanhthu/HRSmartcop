"use strict";

import $ from 'jquery';
import React from 'react';
import Router from 'react-router';
import Routes from './Routes';
import RouterContainer from './helper/RouterContainer';
import LoginActions from './actions/LoginActions';



//TODO: See another way than [0]
const rootElement = $('#root')[0];
var router = Router.create({Routes});
RouterContainer.set(router);

let jwt = localStorage.getItem('jwt');
if (jwt) {
	LoginActions.loginUser(jwt);

}
Router.run(Routes, Router.HashLocation, (Root) => {
	React.render(<Root/>, rootElement);
});