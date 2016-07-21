import React, { PropTypes } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

var moment = require('moment');
var {Calendar, Month, Week, Day} = require('react-calendar');

require('react-calendar/less/bootstrap-theme.less');

export default class CalendarManager {

    shouldComponentUpdate = shouldPureComponentUpdate;

    render() {

        return (
            <div>
                <Calendar firstMonth={1}
                          date={moment("2014-01-01")}
                          weekNumbers={true}
                          size={12}>
                </Calendar>
            </div>

        );
    }
}






