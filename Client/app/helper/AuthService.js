import request from 'reqwest';
import when from 'when';
import {LOGIN_URL, SIGNUP_URL} from '../constants/UserConstants';
import LoginActions from '../actions/LoginActions';
var hostName=window.location.hostname;
const BASE_URL = 'http://'+hostName+':3007/api/auth';
class AuthService {

  login(username, password) {
    return this.handleAuth(when(request({
      url: BASE_URL,
      method: 'POST',
      type: 'json',
      data: {
        username, password
      }
    })));
  }
  logout() {
    LoginActions.logoutUser();
  }


  handleAuth(loginPromise) {
    return loginPromise
      .then(function(response) {
        var jwt = response.id_token;
        console.log(jwt);
        LoginActions.loginUser(jwt);
        return true;
      });
  }
}

export default new AuthService()
