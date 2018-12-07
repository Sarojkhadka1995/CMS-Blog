const express = require('express');
const path = require('path');
const expressValidator = require('express-validator');
const methodOverride = require('method-override');
var hbs = require('express-hbs');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport')
const user_routes = require('./router/user_routes');
const admin_routes = require('./router/admin_routes');


//Database connection
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/CMS',{useNewUrlParser:true},(err)=>{
    if(err){
        console.log(err);
        res.status(500).send("Error occured "+err);
    }
})

const app = express();
app.use(methodOverride('_method'));

//Passport js
require('./utils/passport')(passport);

app.set('views',path.join(__dirname,'views'))
app.engine('hbs',hbs.express4({defaultLayout:'views/layouts/mainLayout'}))
app.set('view engine','hbs')

app.use(express.static(path.join(__dirname,'public')))
app.use(session({
	cookie:{maxAge:999999},
	secret: 'secret',
	saveUninitialized: false,
  resave: false,
  // cookie: { secure: true }
}));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

app.use(passport.initialize());
app.use(passport.session());

//validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value){
      var namespace = param.split('.'),
      root = namespace.shift(),
      formParam = root;
      
      while(namespace.length){
        formParam += '[' + namespace.shift()+ ']';
      }
      return{
        param : formParam,
        msg : msg,
        value : value
      };
    }
  }));
  

app.use('/',user_routes);
app.use('/admin',admin_routes);








let port = 3000;
app.listen(port,()=>{
    console.log('listening on port '+port )
})
