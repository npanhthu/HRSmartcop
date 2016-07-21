/**
 * Created by ThuanLe on 7/22/2015.
 */
import React from 'react';
import Router from 'react-router';
var Link = Router.Link;
class Breadcumb extends React.Component
{
    constructor()
    {
        super();
        this.state={uri:[]};
    }
    componentDidMount()
    {
        this.setState({uri:this.props.dataUri});
    }
    render() {
       var _breadcumb=this.state.uri.map(function(data){
            return (<li><Link to={data.link}>{data.name}</Link></li>)
        });
        return (<div><ol id="breadcrumb" className = "breadcrumb">{_breadcumb}<li className="active">{this.props.activeName}</li></ol><hr style={{'width':'120%','marginLeft':'-10%','marginTop':'-20px'}} /></div>);
    }
}
export default Breadcumb;
