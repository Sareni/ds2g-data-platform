const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const { connectionString } = require('./config/ds2g_data_platform_config').databases.mongodb;
const { key: cookiesKey } = require('./config/ds2g_data_platform_config').cookies;
const app = express();
const proxy = require('./routes/supersetProxy')();
//const timeout = require('connect-timeout');

const { initTrackDBConnections } = require('./services/trackAnythingDB');

require('./models/User');
require('./models/EMailToken');
require('./models/Token');
require('./models/Code');
require('./models/Survey');
require('./models/NewsArticle');
require('./services/passport');

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(
    cookieSession({ // TODO: express-session?
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: [cookiesKey]
    })
);

/* var sess = {
    secret: 'CHANGE THIS TO A RANDOM SECRET',
    cookie: {},
    resave: false,
    saveUninitialized: true
  }; */

// sess.cookie.secure = true; // production

app.use(passport.initialize());
app.use(passport.session()); // sess
app.use(flash());
//app.use(timeout('4s'));


/* const haltOnTimeout = (req, res, next) => {
    if(!req.timeout) {
        next();
    }
}
app.use(haltOnTimeout);*/

require('./routes/authRoutes')(app);
require('./routes/fileRoutes')(app);
require('./routes/messageRoutes')(app);
require('./routes/billingRoutes')(app);
require('./routes/accountRoutes')(app);
require('./routes/supersetRoutes')(app);
require('./routes/preferencesRoutes')(app);
require('./routes/supportRoutes')(app);

mongoose.connect(connectionString, { useNewUrlParser: true });
initTrackDBConnections();

//if(process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));

    const path = require('path');
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
       });
//}

const PORT = process.env.PORT || 5001; 
const server = app.listen(PORT);
server.on('upgrade', function (req, socket, head) {
    proxy.ws(req, socket, head);
  });
