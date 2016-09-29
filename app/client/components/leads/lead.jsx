var React = require('react');
var Sound = require('react-sound');
var Lead = require('./lead.jsx');
module.exports = React.createClass({
  displayName : 'Lead',
  getInitialState: function() {
    return {
      vehicle:this.props.vehicle,
    };
  },
  render() {
  	return (
        <div className="lead">
          <Sound url={'sounds/'+this.props.sound} playStatus={this.props.play==true?Sound.status.PLAYING:Sound.status.STOPPED}/>
          {this.state.vehicle}
        </div>
      );
  }
});
