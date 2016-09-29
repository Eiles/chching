var React = require('react');
var LeadList = require('./leads/leadlist.jsx');
var LogForm = require('./login/loginform.jsx');
var io = require('socket.io-client');

module.exports = React.createClass({
  displayName : 'App',
  getInitialState : function(){

    return {
      loggedin:false,
    };
  },
  _onLogin:function(data){
  	this.setState(
  		JSON.parse(data)
  	);
  },

  render() {
  	var element;
  	if(this.state.loggedin){
      let socket=io('http://localhost:3013');
  	 	element = <LeadList socket={socket} />;
  	}else{
  		element = <LogForm onLogin={this._onLogin}/>;
  	}

  	return element;
    
  }
});
