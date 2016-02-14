const passport = require('passport');
const Auth0Strategy = require('passport-auth0');

const superagent = require('superagent');
require('superagent-auth-bearer')(superagent);

import { gateway }  from './gateway';

const auth0MetaDataToken = process.env.AUTH0_META_TOKEN;

const auth0ApiUrl = `https://${process.env.AUTH0_DOMAIN}/api/v2`;

export const strategy = new Auth0Strategy({
    domain:       process.env.AUTH0_DOMAIN,
    clientID:     process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_SECRET_KEY,
    callbackURL: process.env.AUTH0_CALLBACK_URL
  },
  (accessToken, refreshToken, extraParams, profile, done) => {
    superagent
      .get(`https://${process.env.AUTH0_DOMAIN}/userinfo/`)
      .authBearer(accessToken)
      .end(function(err, authRes) {
        if(err) {
          console.log('Did not get userinfo...');
          return done(null, profile);
        }
        createBrainTreeUser(profile);
        return done(null, profile);
        })
  });

const createBrainTreeUser = profile => {
  if(!profile._json.app_metadata || !profile._json.app_metadata.braintreeId) {
      const appData = profile.app_metadata || {};
      gateway.customer.create({
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
        }, function (err, result) {
          if(result.success) {
            return updateAuth0WithCustomerId(profile.id, result.customer.id);
          }
          console.log('Failed creating braintree customer ');
          console.log(err);
        });
  } else {
    console.log('User has a braintreeId ')
  }
}

const updateAuth0WithCustomerId = (auth0UserId, customerId) => {
  superagent
    .patch(`${auth0ApiUrl}/users/${auth0UserId}`)
    .authBearer(auth0MetaDataToken)
    .send({"app_metadata":{"braintreeId": customerId}})
    .end(function(err, res) {
      if(err) {
        console.log('ERROR in creating braintreeId');
        return console.log(err);
      }
      console.log(`auth0 user ${auth0UserId} now is connected to braintree user ${customerId}`)
    });

}


passport.use(strategy);

// This is not a best practice, but we want to keep things simple for now
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});
