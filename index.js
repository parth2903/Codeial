//require('dotenv').config();
//const express = require('express');
const express=require('express');
const env = require('./config/environment');
const logger= require('morgan');

const cookieParser = require("cookie-parser");
const app = express();
require('./config/view-helpers')(app);
const port = 7000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle= require('./config/passport-google-oauth2-strategy');
const MongoStore = require('connect-mongo');
//const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const customMware = require('./config/middleware');
const cors = require('cors');
app.use(cors());
//setup the chatserever to be used with socket.io
const chatServer = require('http').createServer(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000,function(){
    console.log("chat server is listening on port",5000);
});
const path = require('path');

// app.use(sassMiddleware({
//     src: './assets/scss',
//     dest: './assets/css',
//     debug: true,
//     outputStyle: 'extended',
//     prefix: '/css'
// }));
app.use(express.urlencoded());
app.use(cookieParser());
//console.log(env.asset_path);
app.use(express.static(env.asset_path));
//make the upload path available to the browser
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(logger(env.morgan.mode, env.morgan.options));

app.use(expressLayouts);

// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);


//setup the view engine
app.set('view engine','ejs');
app.set('views','./views');

//mongo session is used to store the session cokkie in the db
app.use(session({
    name: 'codeial',
    // TODO change the secret before deployment in production mode
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: MongoStore.create(
        {
            mongoUrl:'mongodb://127.0.0.1/codeial_development',
            autoRemove: 'disabled'
        
        },
        function(err){
            console.log(err ||  'connect-mongodb setup ok');
        }
    )
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);

//use express router
app.use('/', require('./routes'));

app.listen(port, function(err){
    if(err){
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`my express server is running on port: ${port}`);
});
