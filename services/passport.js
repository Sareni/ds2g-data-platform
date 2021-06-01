const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const BasicStrategy = require('passport-http').BasicStrategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');
const bcrypt = require('bcrypt');
const axios = require('axios');
const Auth0Stragegy = require('passport-auth0');
const BearerStrategy = require('passport-http-bearer').Strategy
const Token = mongoose.model('tokens');

const { addTrackDBViewForNewUser } = require('./trackAnythingDB');
const { accountManagementServerURI } = require('../config/keys');
const { initUserInSuperset, DEMO_CONTENT_TYPES } = require('./superset');

// TODO: passport-local-mongoose

const User = mongoose.model('users');


async function createTrackingAccount(userId, plan) {
  const res= await axios.post(`${accountManagementServerURI}/createAccount`, {
    userId,
    plan
  });
  return res.data;
}


async function createSupersetAccount(accountKey) {
  await addTrackDBViewForNewUser(accountKey);
  await initUserInSuperset(accountKey, undefined, DEMO_CONTENT_TYPES.ADVANCED);
}

/* passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
}); */

passport.serializeUser((user, done) => {
  done(null, user); // TODO: secure to
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use(
  new Auth0Stragegy({
      domain: keys.AUTH0_DOMAIN,
      clientID: keys.AUTH0_CLIENT_ID,
      clientSecret: keys.AUTH0_CLIENT_SECRET,
      callbackURL: '/auth/auth0/callback'
    },
    async (accessToken, refreshToken, extraParams, profile, done) => {
      const existingUser = await User.findOne({ username: profile.username });

      if (existingUser) {
        return done(null, existingUser);
      }

      const user = await new User({ username: profile.username }).save();
      // const trackingAccount = await createTrackingAccount(user.id, null);
      // createSupersetAccount(trackingAccount.account);

      done(null, user);
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({ googleId: profile.id });

      if (existingUser) {
        return done(null, existingUser);
      }

      const user = await new User({ googleId: profile.id }).save();
      const trackingAccount = await createTrackingAccount(user.id, null);
      createSupersetAccount(trackingAccount.account);

      done(null, user);
    }
  )
);

passport.use(
  new LocalStrategy({
    usernameField: 'email',
    },
    async (email, password, done) => {
      const existingUser = await User.findOne({ username: email });

      //if (err) { return done(err); }
      // if (!user) { return done(null, false); }

      if (existingUser) {
        if (!bcrypt.compareSync(password, existingUser.passwordHash)) {
          // wrong password
          console.log('wrong password');
          return done(null, false);
        }
        // return user
        console.log('return user');
        return done(null, existingUser);
      }
      
      // user not found
      console.log('user not found');
      return done(null, false); 
    }
  )
);

passport.use('local-signup', new LocalStrategy({
  usernameField: 'email', // map username to custom field, we call it email in our form
  passwordField: 'password',
  passReqToCallback: true // lets you access other params in req.body
},
async (req, email, password, done) => {
  // Return false if user already exists - failureRedirect
  const existingUser = await User.findOne({ username: email });
  if (existingUser) { return done(null, false) }

  // Create new user and return the user - successRedirect
  const newUser = await User.create({
    username: email,
    passwordHash: bcrypt.hashSync(password, 10), // hash the password early
    //phone: req.body.phone
  });
  
  const trackingAccount = await createTrackingAccount(newUser.id, null);
  createSupersetAccount(trackingAccount.account);

  // save the user_id to the req.user property
  return done(null, newUser);
}
));

passport.use(new BearerStrategy(
  async function(accessToken, callback) {
    const token = await Token.findOne({value: accessToken });
    if (!token) {
      return callback(null, false);
    }
    return callback(null, {userId: token.userId}, { scope: '*' }); // TODO
  }
));

passport.use('client-basic', new BasicStrategy(
  function(username, password, callback) {
    if (username !== keys.client_id || password !== keys.client_secret) {
      return callback(null, false);
    }

    return callback(null, {client_id: keys.client_id, client_secret: keys.client_secret}); // !!!!????
  }
));

