
import React from 'react';

import CalendarManager from '../components/CalendarManager.react.jsx';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import Router from 'react-router';
import Breadcumb from '../components/Breadcumb';
var Link = Router.Link;
export default AuthenticatedComponent( class CalendarPage {
	render()
	{
		return (
			<div>
        	<div className="container-fluid">
		          <div className="rows">
		          	 <Breadcumb dataUri={[{'link':'home','name':'Home'}]} activeName="Calendar" />
		          </div>
				  <CalendarManager />
			</div>
			</div>
			);
	}
});