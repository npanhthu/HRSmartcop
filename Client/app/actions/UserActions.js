import UserConstants from '../constants/UserConstants.js';
import AppDispatcher from '../AppDispatcher.js';
import UserStore from '../stores/UserStore.js';
import UsersApi from '../helper/UserAPI.js';
import RecoveryPassApi from '../helper/RecoveryPassAPI.js'
/* Actions here perform two purposes: to send the appropriate action on to the
 dispatcher (which routes in on to the store), and to interface with the Api */
const UserActions = {
  addUser: function(user,showmsg)
  {
    console.log("to action user");
    AppDispatcher.handleAction({
      type: UserConstants.ADD_USER,
      user: user
    });
    UsersApi.create(user,(data)=>{
      AppDispatcher.handleAction({
        type: UserConstants.ADD_USER_SUCCESS,
        data : data
      });
    },null,showmsg);
  },
  getUsers: function(getuser) {
    UsersApi.getAll((users) => {
      AppDispatcher.handleAction({
        type: UserConstants.GET_USERS,
        users: users
      });

    }, (error) => {
      AppDispatcher.handleAction({
        actionType: UserConstants.GET_USERS_FAIL,
        error: error
      });
    }, (getuser));

  },
    getUserId:function(user,loadUser){
      console.log("to action get user id "+ user);
      UsersApi.get(user,(data)=>{
        AppDispatcher.handleAction({
          type:UserConstants.GET_USER_ID,
          userData:data
        });
      },null,loadUser);
    }
    ,
  removeUser: function(username,resetcheckbox) {
    UsersApi.destroy(username, (user) => {
      AppDispatcher.handleAction({
        type: UserConstants.REMOVE_USER,
        user: user
      });
    }, (error) => {
      AppDispatcher.handleAction({
        actionType: UserConstants.REMOVE_USER_FAIL,
        error: error
      });
    },resetcheckbox);
  },
  disableUser:function(username,showmsg)
  {
      console.log('to action disable');
      console.log(username);
      UsersApi.disable(username,(user)=>{
        AppDispatcher.handleAction({
          type:UserConstants.DISABLE_USER,
          user:user
        });
      },null,showmsg)
  },
  editUser: function (user,showmsg) {
    console.log("to action edit user");
    UsersApi.update(user,(data)=>{
      AppDispatcher.handleAction({
        type: UserConstants.EDIT_USER,
        data : data
      });
    },null,showmsg);
  },
    getAUser: function(username,showMsg){
        console.log("den action");
        UsersApi.getAUser(username, (data)=>{
            AppDispatcher.handleAction({
                type:UserConstants.GET_A_USER,
                data: data
            });
        }, showMsg);
    },

    getUserName: function(employeeId, showMsg, getData){
        console.log("action: " + employeeId);
        UsersApi.getUserName(employeeId, (data)=>{
            AppDispatcher.handleAction({
                type : UserConstants.GET_USER_NAME,
                data: data
            });
        }, showMsg, getData);
    },forgetPass: function (mail, showMsg) {
        console.log('from action send mail')
        RecoveryPassApi.forgetPass(mail, (data) => {
            AppDispatcher.handleAction({
                type: UserConstants.SEND_MAIL,
                data: data
            });
        }, showMsg);
    },
    checkToken: function (token, showMsg) {
        RecoveryPassApi.checkToken(token, (data) => {
            AppDispatcher.handleAction({
                type: UserConstants.CHECK_TOKEN,
                data: data
            });
        }, showMsg);
    },
    changePass: function (user, showMsg) {
        console.log('change pass')
        RecoveryPassApi.changePass(user, (data) => {
            AppDispatcher.handleAction({
                type: UserConstants.CHANGE_PASS,
                data: data
            });
        }, showMsg);
    }
};

export default UserActions;
