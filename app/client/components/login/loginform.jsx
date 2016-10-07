var React = require('react');

module.exports = React.createClass({

  displayName : 'LoginForm',

  getInitialState:function(){
    return  {
      username : '',
      password : '',
    };
  },
  render() {
    var message = this.state.message;
  	return (
        <div className="login-page">
          <div className="form">
              <input type={"text"} name={"username"} value={this.state.username} onChange={this.handleUserNameChange}/>
              <input type={"password"} name={"password"} value={this.state.password} onChange={this.handlePasswordChange}/>
              <button onClick={this.handleClick}>Login</button>
          </div>
        </div>
      );
  },
 handleUserNameChange:function(event){
  this.setState({
    username:event.target.value
  });
 },
 handlePasswordChange:function(event){
  this.setState({
    password:event.target.value,
  });
 },
  handleClick:function() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://localhost:3013/login", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    
    var that=this;
    xhttp.onreadystatechange = function(data) {
      if (this.readyState == 4 && this.status == 200) {
        that.props.onLogin(this.responseText);
      }
    };
    xhttp.send("username="+this.state.username+"&password="+this.state.password);
  }
});
