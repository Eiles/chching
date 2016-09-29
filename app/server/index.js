var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var schedule = require('node-schedule');
var cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var passportSocketIo = require("passport.socketio");
var LocalStrategy = require('passport-local').Strategy;

var argv = require('minimist')(process.argv.slice(2));


const dgram = require('dgram');
const udpserver = dgram.createSocket('udp4');



// Middleware.
app.use(require('morgan')('combined'));
app.use(require('compression')());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
    secret: 'secretkey1',
    store: new MongoStore({ url: 'mongodb://localhost/chingablingsession' })
}));

//Use passport for socket.io
io.use(passportSocketIo.authorize({
  cookieParser: cookieParser,
  key:          'connect.sid',
  secret:       'secretkey1', 
  store:        new MongoStore({ url: 'mongodb://localhost/chingablingsession' }),
}));

// Configure passport middleware
app.use(passport.initialize());
app.use(passport.session());



//Strategy for passport
var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// Routes.
app.use(require('./routes')(app));
app.use(express.static('./app/static'));

// Connect mongoose
mongoose.connect('mongodb://localhost/chching', function(err) {
  if (err) {
    console.log('Could not connect to mongodb on localhost. Ensure that you have mongodb running on localhost and mongodb accepts connections on standard ports!');
  }
});


//Chching props
var chching={
  launchDate:new Date(),
  getDate:function(){
    var date = this.launchDate
    return date.toLocaleDateString()+' '+date.toLocaleTimeString();
  },
  lastLeads:[],
  counter:0,
  todayCounter:0,
  addLead:function(lead){
    this.counter++;
    this.todayCounter++;
    this.lastLeads.push(lead);
    if(this.lastLeads.length>10){
      this.removeLead();
    }
  },
  removeLead:function(){
    this.lastLeads.shift();
  } 
}

//Reset the current day counter everyday at midnight
var j = schedule.scheduleJob({hour: 00, minute: 00}, function(){
    chching.todayCounter=0;
});

//User Registering function
function registerUser(username,password){
  console.log("Register "+username)
  Account.register(new Account({username: username}), password, function(err) {
        if (err) {
          console.log('error while user register!', err);
          return next(err);
        }
  });
}

//Socket.io events
io.on('connection', function (socket) {
	socket.on('init', function(){
      socket.emit('counters',{total:chching.counter,today:chching.todayCounter,launchDate:chching.getDate()});
   		socket.emit('init', chching.lastLeads);
  	});
});

//UDP Message events
udpserver.on('message', function(msg, rinfo){
  try{
    var data=JSON.parse(msg);
    data.date=new Date().getTime();
    chching.addLead(data);
    io.emit('lead',data);
  }catch(e){
    console.log(e);
  } 
});

//Register user if set
if(argv['username'] != undefined && argv['password'] != undefined){
  registerUser(argv['username'],argv['password']);
}
server.listen(3013);
udpserver.bind(41234);