const express = require('express');
const app = express();

const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))


import { gateway }  from './gateway.js';
import { strategy } from './setup-passport.js';

app.engine('ejs', require('ejs').renderFile);
app.use(cookieParser());
app.use(session({ secret: 'gwpionwoiegnwoin', resave: false,  saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

function requireLogin(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect('/login/failed');
  }
  next();
}

app.get('/login/failed', (req, res) => {
  res.end('You must login to view this page')
});

app.get('/user', requireLogin, (req, res) => {
  console.log('req.user._json.app_metadata.braintreeId');
  console.log(req.user._json.app_metadata.braintreeId);
  gateway.clientToken.generate({
    customerId: req.user._json.app_metadata.braintreeId
  }, (err, response) => {
    if(err) {
      return res.send(':( something wrong has happened. Try again later<br/><br/>Details:<br/>' + JSON.stringify(err));
    }
    res.render('user.ejs', {
      user: req.user.displayName,
      'clientToken': response.clientToken,
      'auth0domain': process.env.AUTH0_DOMAIN
    });
  });
});

app.get('/login/callback',
  passport.authenticate('auth0', { failureRedirect: '/login/failed' }),
    (req, res) => {
    if (!req.user) {
      return res.end('Unexpected error, try login in again');
    }
    res.redirect("/user");
    }
  );

app.get('/', (req, res) => {
    if(req.user) {
      return res.redirect("/user");
    }
    res.render('login.ejs', {
      'auth0domain': process.env.AUTH0_DOMAIN,
      'auth0clientId': process.env.AUTH0_CLIENT_ID,
    });
});

app.post("/checkout", (req, res) => {
  // NOTE: In sandbox mode this will be empty, replace it the line below;
  // const nonce = fake-valid-nonce
  const nonce = req.body.payment_method_nonce;

  gateway.transaction.sale({
    amount: '1.00',

    paymentMethodNonce: nonce
  }, (err, result) => {
    if(err) {
      return res.end('Transaction did not go trough, your card was not charged.' + JSON.stringify(result.errors.deepErrors()));
    }
    res.end('Transaction sucessed')
  });
});

app.listen(process.env.PORT || 3000);
console.log('Applicationen is running on  localhost:' + (process.env.PORT || 3000))
