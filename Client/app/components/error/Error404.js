
import React from 'react';
import Router from 'react-router';
var Link=Router.Link;

class Error404 extends React.Component
{

    render() {
        return (<div>
                <br />
                <br />
                <br />
                <br />
                <div className="row min-height">
                    <div className="col-md-3 col-xs-3"></div>
                    <div className="col-md-6 col-xs-6">
                        <img src="Server/data/image/404Error.png"></img>
                    </div>
                    <div className="col-md-3 col-xs-3"></div>
                    <br />
                </div>
                <a href="javascript:history.back()"><p className="goBack404">Go back</p></a>
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
            </div>);
    }
}
export default Error404;