var React = require('react');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var Lead = require('./lead.jsx');

module.exports = React.createClass({
  displayName : 'LeadList',
  getInitialState: function() {
    return {
      leads:[],
      counter:0,
      todaycounter:0,
      launchDate:'',
      interval:10000
    };
  },

  componentDidMount:function() {
      this.props.socket.emit('init','');
      this.props.socket.on('lead', this.handleData);
      this.props.socket.on('counters',this.updateCounters);
  },

  addLead:function(lead){
    var leads = this.state.leads;
    var interval=10000;
    if(leads.length){
      interval=Math.round(leads[leads.length-1].date-lead.date)/1000;
      console.log(leads[leads.length-1].date);
      console.log(lead.date);
      console.log(interval);
    }
    
    leads.push(lead);
    if(leads.length>10){
      leads.shift();
    }
    this.setState({
      leads:leads,
      counter:this.state.counter+1,
      todaycounter:this.state.todaycounter+1,
      interval:interval
    });
  },

  handleData :function(data){
    if(Array.isArray(data)){
      data.forEach(this.addLead);
    }
    else
      this.addLead(data);
  },

  updateCounters:function(data){
    this.setState({
      counter:data.total,
      today:data.today,
      launchDate:data.launchDate
    });
  },

  render() {
    var sound='money.mp3';
    if(this.state.interval<60){
      sound='combo.mp3';
    }
    var leads=this.state.leads.reverse();
    var leadComponents = leads.map(function(lead,index){
                            return <Lead vehicle={lead.car} key={lead.id} sound={sound} play={index==0?true:false} />
                          });
  	return (
        <div className="leadlist">
          Today: <strong>{this.state.todaycounter}</strong><br/>
          Since {this.state.launchDate} : <strong>{this.state.counter}</strong><br/>
            
            <ReactCSSTransitionGroup 
            transitionName="lead" 
            transitionEnterTimeout={1000} 
            transitionAppearTimeout={1000} 
            transitionLeaveTimeout={1000}>
            {leadComponents.reverse()}
          </ReactCSSTransitionGroup>
        </div>
    );
  }

});
