const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');

//adding keys files
const keys = require('./server/config/keys');

//adding model files
require('./server/models/messages');

//creating an express server
const app = express();
//bodyParser is middleware for express and for use that middleware we need to use in that express app.
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended: false}))

//Cookie session is middleware which is used to maintain cookies in the system
app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: [keys.cookieKey]
    })
);

//Passport is middleware which is used to authenticate user with strategy that are used. For e.g., google-Oauth
app.use(passport.initialize());
app.use(passport.session());

//Socket connection for chat application
var http = require('http').Server(app);
var io = require('socket.io')(http);
io.on('connection', () =>{
    console.log('a user is connected');
});

require('./server/routes/messages')(app, io);

//Code run on the heroku environment only for handling the client side code
if (process.env.NODE_ENV === 'production') {
    //express will serve up production assets like our main.js file  or main.css file
    app.use(express.static('client/build'));

    //express will server up index.html if it is not recognize the routes
    app.get('*', (req, res) => {
       res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
} else {
    app.use(express.static(path.resolve(__dirname, 'client')));
}

//connecting with mongo db
mongoose.connect(keys.mongoURI, { useUnifiedTopology: true, useNewUrlParser: true }, (err) => { 
    console.log('mongodb connected', err);
});

const PORT = process.env.PORT || 5000; //env variable is not defined when we are using on localhost 
app.listen(PORT, () => {
    console.log('Server is running on - ', PORT)
});