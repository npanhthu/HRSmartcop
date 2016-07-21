import $ from 'jquery';
import Constants from '../constants/UserConstants';
import Dispatcher from '../AppDispatcher.js';
var hostName=window.location.hostname;
const BASE_URL = 'http://'+hostName+':3007/api/recoveryPass/';

const RecoveryPassApi = {

    forgetPass:function(email,success,showMsg){
        $.ajax({
            url: BASE_URL + 'forget/' + email,
            type:'GET',
            dataType:'json',
            success:function(data){
                success(data);
                showMsg();
            },
            error: function(err){
                console.log(err);
            }
        });
    },
    checkToken:function(token,success,showMsg){
        $.ajax({
            url: BASE_URL + 'reset/' + token,
            type:'GET',
            dataType:'json',
            success:function(data){
                success(data);
                showMsg();
            },
            error: function(err){
                console.log(err);
            }
        });
    },
    changePass:function(user,success,showMsg){
        $.ajax({
            url: BASE_URL + 'changepass',
            type:'PUT',
            dataType:'json',
            data: user,
            success:function(data){
                success(data);
                showMsg();
            },
            error: function(err){
                console.log(err);
            }
        });
    }
};

export default RecoveryPassApi;