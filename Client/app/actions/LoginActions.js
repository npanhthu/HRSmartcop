import AppDispatcher from '../AppDispatcher.js';
import {LOGIN_USER, LOGOUT_USER} from '../constants/UserConstants.js';
import RouterContainer from '../helper/RouterContainer';
import LoginStore from '../stores/LoginStore';

export default {
  loginUser: (jwt) => {
    var savedJwt = localStorage.getItem('jwt');
    if (savedJwt !== jwt) {
      var nextPath =  '/';

      RouterContainer.get().transitionTo(nextPath);
      localStorage.setItem('jwt', jwt);
      
    }
      AppDispatcher.handleAction({
        type: LOGIN_USER,
        jwt: jwt
      });
    },
    logoutUser: () => {
      RouterContainer.get().transitionTo('/login');
      localStorage.removeItem('jwt');
      AppDispatcher.handleAction({
        type: LOGOUT_USER
      });
    }
  }
