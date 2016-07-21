
import React from 'react';
import Router from 'react-router';

export function checkHeader(_roles,permissionId){
    var result = false;
    for(var j=0;j<_roles.length;j++){
        if(_roles[j]){
            if(_roles[j][0]){
                for(var i=0;i<_roles[j][0].permissions.length;i++){
                    if(_roles[j][0].permissions[i].permission_id == permissionId){
                        result = true;
                    }
                }
            }
        }
    }
    return result;
}

export function checkFunction(_roles,permissionId,rightId){
    console.log("roles " , _roles);
    var result = false;
    for(var j=0;j<_roles.length;j++){
        if(_roles[j]){
            if(_roles[j][0]){
                for(var i=0;i<_roles[j][0].permissions.length;i++){
                    if(_roles[j][0].permissions[i].permission_id == permissionId){
                        if(_roles[j][0].permissions[i].rights){
                            for(var k=0;k<_roles[j][0].permissions[i].rights.length;k++){
                                if(_roles[j][0].permissions[i].rights[k].right_id == rightId){
                                    result = true;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return result;
}

