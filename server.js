const app = require('express')(),
  server = require('http').Server(app),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  userRoute = require('./user/user.route'),
  chatRoute = require('./chat/chat.route');

// Chat controller auto run for make connection b/w socket with frontend and backend.
require('./chat/chat.controller');

// Global responder declare.
global.apiResponder = require('./global/apiResponder').apiResponder;

mongoose.Promise = global.Promise;
app.use(bodyParser.json({ limit: "50mb" }));
mongoose.connect("mongodb://localhost/socket");

/*Access-Control-Allow-Headers*/
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Credentials', true);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,authorization,accessToken," +
    "lat lng,app_version,platform,ios_version,countryISO,Authorization");
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,PUT,DELETE,OPTIONS');
  next();
})

app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));

// Global routing
app.use('/v1/users', userRoute);
app.use('/v1/chat', chatRoute);

server.listen(4000, () => {
  console.log("server is running on 4000")
});