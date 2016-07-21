import React from 'react';
import Router from 'react-router';
import Header from './Header';
import HeaderAfterLogin from './HeaderAfterLogin';
import Footer from './Footer';
var RouteHandler = Router.RouteHandler;
alert('toto');
class Container extends React.Component{
    render()
    {
        return (
            <div>
                <HeaderAfterLogin />
                <div className="container-fluid"><RouteHandler /></div>
                <Footer />
            </div>);
    }
}
export default Container;