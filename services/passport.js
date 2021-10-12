const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const BasicStrategy = require('passport-http').BasicStrategy;
const mongoose = require('mongoose');
const {
  google: googleConfig,
  auth0: auth0Config,
  ownAuth: ownAuthConfig
} = require('../config/ds2g_data_platform_config').authKeys;
const bcrypt = require('bcrypt');
const axios = require('axios');
const Auth0Stragegy = require('passport-auth0');
const BearerStrategy = require('passport-http-bearer').Strategy
const Token = mongoose.model('tokens');

const { addTrackDBViewForNewUser } = require('./trackAnythingDB');
const { accountManagementServer } = require('../config/ds2g_data_platform_config');
const { initUserInSuperset, DEMO_CONTENT_TYPES } = require('./superset');

const accountManagementServerURI = `${accountManagementServer.protocol}://${accountManagementServer.host}:${accountManagementServer.port}`

// TODO: passport-local-mongoose

const User = mongoose.model('users');
const { sendVerificationMail } = require('./mail');
const { uid } = require('../routes/utils');
const EMailToken = mongoose.model('emailtokens');


async function createTrackingAccount(userId, plan) {
  const res= await axios.post(`${accountManagementServerURI}/createAccount`, {
    userId,
    plan
  });
  return res.data;
}


async function createSupersetAccount(accountKey, email) {
  await addTrackDBViewForNewUser(accountKey);
  await initUserInSuperset(accountKey, email);
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
      domain: auth0Config.domain,
      clientID: auth0Config.clientID,
      clientSecret: auth0Config.clientSecret,
      callbackURL: '/auth/auth0/callback'
    },
    async (accessToken, refreshToken, extraParams, profile, done) => {
      const existingUser = await User.findOne({ username: profile.username });

      if (existingUser) {
        return done(null, existingUser);
      }

      const user = await new User({ username: profile.username }).save();
      // const trackingAccount = await createTrackingAccount(user.id, null);
      // createSupersetAccount(trackingAccount.account, !!!!! email !!!!!);

      done(null, user);
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: googleConfig.clientID,
      clientSecret: googleConfig.clientSecret,
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
      createSupersetAccount(trackingAccount.account, 'test@test.com'); // TODO email

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
          // Incorrect password
          return done(null, false, { message: 'Falscher Benutzername oder falsches Passwort!' });
        }
        if (!existingUser.emailVerified) {
           // email not verified
           return done(null, false,  { message: 'Bitte verifizieren Sie zuerst Ihre e-Mail-Adresse!' });
        }
        // return user
        console.log('return user');
        return done(null, existingUser);
      }
      
      // user not found
      return done(null, false,  { message: 'Falscher Benutzername oder falsches Passwort!' }); 
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
  createSupersetAccount(trackingAccount.account, email);

  const token = await new EMailToken({
      value: uid(64),
      email,
      valid: true,
  }).save();

  sendVerificationMail(email, token.value);
  
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
    if (username !== ownAuthConfig.clientID || password !== ownAuthConfig.clientSecret) {
      return callback(null, false);
    }

    return callback(null, {client_id: ownAuthConfig.clientID, client_secret: ownAuthConfig.clientSecret}); // !!!!????
  }
));

