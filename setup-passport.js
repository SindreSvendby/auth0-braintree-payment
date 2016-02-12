var passport = require('passport');
var Auth0Strategy = require('passport-auth0');

const superagent = require('superagent');
require('superagent-auth-bearer')(superagent);


var strategy = new Auth0Strategy({
    domain:       process.env.AUTH0_DOMAIN,
    clientID:     'oSzCAueEIVyp70QUqXobsgOHdGnPQ6eR',
    clientSecret: 'ZuEd6Q6i12WOJ2OQNzetfnpvxZmTFvW5nlZOzpLHYmz6XvVM57vKKTZxACDb8AgQ',
    'callbackURL': 'http://localhost:3000/login/callback'
  },
  function(accessToken, refreshToken, extraParams, profile, done) {
    superagent
      .get('https://' + process.env.AUTH0_DOMAIN + '/userinfo/')
      .authBearer(accessToken)
      .end(function(err, authRes) {
        if(err) {
          console.log('Did not get userinfo...')
          return done(null, profile)
        }
        console.log('authRes' + JSON.stringify(authRes.app_metadata));
        return done(null, profile);
        })
  });

passport.use(strategy);

// This is not a best practice, but we want to keep things simple for now
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

module.exports = strategy;
