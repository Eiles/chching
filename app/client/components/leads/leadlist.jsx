var React = require('react');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var Counter = require('react-counter');
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
      this.props.socket.on('init', this.handleInit);
  },

  addLead:function(lead){
    var leads = this.state.leads;
    var interval=10000;
    if(leads.length){
      interval=Math.round(this.getNewestLead().date-lead.date)/1000;
    }
    if(leads.length==25){
      var oldest=this.getOldestLeadId();
      var i;
      for(i=0;i<leads.length;i++){
        if(leads[i].id==oldest.id){
          leads[i]=lead;
          break;
        }
      }
    }else{
      leads.push(lead);
    }
    this.setState({
      leads:leads,
      counter:this.state.counter+1,
      todaycounter:this.state.todaycounter+1,
      interval:interval
    });
  },

  getOldestLeadId:function(){
    var leads=this.state.leads
    var oldest=leads[0];
    var i;
    for(i=0;i<leads.length;i++){
      if(leads[i].date<oldest.date)
        oldest=leads[i];
    }
    return oldest;
  },
  getNewestLead:function(){
    var leads=this.state.leads
    var newest=leads[0];
    var i;
    for(i=0;i<leads.length;i++){
      if(leads[i].date>newest.date)
        newest=leads[i];
    }
    return newest;
  },
  handleInit:function(data){
     this.setState({
      counter:data.total,
      todaycounter:data.today,
      launchDate:data.launchDate,
      leads:data.leads
    });
  },
  handleData :function(data){
    if(Array.isArray(data)){
      data.forEach(this.addLead);
    }
    else
      this.addLead(data);
  },

  updateCounters:function(data){//Unused ATM
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
    var leads=this.state.leads;
    var leadComponents = leads.map(function(lead,index){
                            return <Lead vehicle={lead.car} key={lead.id} sound={sound} play={index==0?true:false} />
                          });
  	return (
        <div className="leadlist">
        <div className="infos">
          <div className="visible">
            <ul>
              <li>{this.state.todaycounter} leads today</li>
              <li>{this.state.counter} leads since {this.state.launchDate}</li>
            </ul>
          </div>
        </div>
        <ReactCSSTransitionGroup component="div" className="leadcontainer"
          transitionName="lead" 
          transitionEnterTimeout={1000} 
          transitionLeaveTimeout={0}>
          {leadComponents}
        </ReactCSSTransitionGroup>
        </div>
    );
  }

});
